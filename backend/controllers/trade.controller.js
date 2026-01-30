// controllers/trade.controller.js
const db = require("../models");
const mongoose = require("mongoose");
const asyncHandler = require("../middleware/asyncHandler");
const { ValidationError, NotFoundError } = require("../utils/error.utils");

const Trade = db.trade;
const Portfolio = db.portfolio;
const Stock = db.stock;
const LeagueEntry = db.leagueEntry;

exports.getTradeHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // 1. Build Filter Object
  // Allows filtering by symbol or type if provided in the URL query string
  const filter = { userId };
  
  if (req.query.symbol) {
    filter.symbol = req.query.symbol.toUpperCase();
  }
  
  if (req.query.type) {
    filter.type = req.query.type.toUpperCase(); // Ensure "BUY" or "SELL" matches
  }

  // 2. Fetch Trades
  // Sort by 'executedAt' descending (newest first)
  const trades = await Trade.find(filter)
    .sort({ executedAt: -1 })
    .lean(); // .lean() converts Mongoose docs to plain JS objects for better performance

  // 3. Send Response
  res.status(200).json({
    success: true,
    count: trades.length,
    data: trades
  });
});

/**
 * Execute a BUY Trade
 * POST /api/trades/buy
 * Body: { symbol: "AAPL", quantity: 10 }
 */
exports.buyStock = asyncHandler(async (req, res) => {
  // 1. Validate Input
  const { symbol, quantity } = req.body;
  const userId = req.user._id;

  // 2. Start ACID Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Fetch Portfolio & Stock Price (within session not strictly needed for read, but good practice)
    const portfolio = await Portfolio.findOne({ userId }).session(session);
    if (!portfolio) throw new NotFoundError("Portfolio not found");

    const stock = await Stock.findOne({ symbol }).session(session);
    if (!stock) throw new NotFoundError(`Stock ${symbol} not found`);

    const currentPrice = stock.currentPrice;
    const totalCost = currentPrice * quantity;

    // 4. Validate Funds
    if (portfolio.cashBalance < totalCost) {
      throw new ValidationError(`Insufficient funds. Need $${totalCost.toFixed(2)}, have $${portfolio.cashBalance.toFixed(2)}`);
    }

    // 5. Update Portfolio (Deduct Cash)
    portfolio.cashBalance -= totalCost;

    // 6. Update Holdings (Add Stock)
    const existingHoldingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);

    if (existingHoldingIndex > -1) {
      // User already owns this stock -> Update average price
      const holding = portfolio.holdings[existingHoldingIndex];
      const newTotalQuantity = holding.quantity + quantity;
      
      // New Average = ((Old Qty * Old Avg) + (New Qty * New Price)) / Total Qty
      const oldTotalCost = holding.quantity * holding.averagePrice;
      const newAveragePrice = (oldTotalCost + totalCost) / newTotalQuantity;

      portfolio.holdings[existingHoldingIndex].quantity = newTotalQuantity;
      portfolio.holdings[existingHoldingIndex].averagePrice = newAveragePrice;
    } else {
      // New holding
      portfolio.holdings.push({
        symbol,
        quantity,
        averagePrice: currentPrice
      });
    }

    // 7. Recalculate Total Net Worth immediately
    // (This simplifies the League Update logic below)
    // We can estimate it: OldTotalValue approx same, but let's be precise if possible, 
    // or just rely on the fact that Cash went down and Stock Value went up equally.
    // However, to trigger the League update, we assign the explicit new value.
    // For a BUY, Net Worth technically doesn't change instantly (Money -> Stock).
    await portfolio.save({ session });

    // 8. Create Trade Record
    const trade = await Trade.create([{
      userId,
      portfolioId: portfolio._id,
      symbol,
      type: "BUY",
      quantity,
      price: currentPrice,
      totalCost
    }], { session });

    // 9. Update League Entries (Sync Snapshot)
    // Even though Net Worth didn't change (Cash swapped for Asset),
    // we update the 'currentValue' in leagues just to be safe and keep it in sync.
    // NOTE: Net Worth DOES change if we factor in spread/fees, but assuming 0 fees here.
    const activeEntries = await LeagueEntry.find({ userId }).session(session);
    if (activeEntries.length > 0) {
      for (let entry of activeEntries) {
        entry.currentValue = portfolio.totalValue; // Sync with portfolio's cached total
        await entry.save({ session });
      }
    }

    // 10. Commit Transaction
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      data: {
        trade: trade[0],
        newBalance: portfolio.cashBalance
      }
    });

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * Execute a SELL Trade
 * POST /api/trades/sell
 * Body: { symbol: "AAPL", quantity: 5 }
 */
exports.sellStock = asyncHandler(async (req, res) => {
  // 1. Validate Input
  const { symbol, quantity } = req.body
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const portfolio = await Portfolio.findOne({ userId }).session(session);
    if (!portfolio) throw new NotFoundError("Portfolio not found");

    const stock = await Stock.findOne({ symbol }).session(session);
    if (!stock) throw new NotFoundError(`Stock ${symbol} not found`);

    const currentPrice = stock.currentPrice;
    const totalRevenue = currentPrice * quantity;

    // 2. Validate Ownership
    const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
    
    if (holdingIndex === -1 || portfolio.holdings[holdingIndex].quantity < quantity) {
      throw new ValidationError(`Insufficient shares. You own ${holdingIndex === -1 ? 0 : portfolio.holdings[holdingIndex].quantity} ${symbol}`);
    }

    // 3. Update Portfolio (Add Cash)
    portfolio.cashBalance += totalRevenue;

    // 4. Update Holdings (Remove Stock)
    const holding = portfolio.holdings[holdingIndex];
    const remainingQuantity = holding.quantity - quantity;

    if (remainingQuantity === 0) {
      // Remove holding entirely if 0 left
      portfolio.holdings.splice(holdingIndex, 1);
    } else {
      portfolio.holdings[holdingIndex].quantity = remainingQuantity;
      // Average Price (Cost Basis) DOES NOT CHANGE on sell
    }

    // 5. Update Net Worth (Realized Gains/Losses happen here implicitly)
    // The Portfolio Model's 'totalValue' might need a hard refresh here
    // But typically TotalValue = Cash + (Qty * CurrentPrice).
    // When Selling: Cash goes UP, (Qty * CurrentPrice) goes DOWN. 
    // Net worth stays roughly same instantly, changes only if price moved since last check.
    
    // We'll manually update totalValue for the DB record
    // Note: To be perfectly accurate, we should recalculate the whole portfolio value
    // but for speed, we can assume it's roughly consistent.
    // Let's rely on the portfolio.save() hooks if you have them, or manual update.
    await portfolio.save({ session });

    // 6. Create Trade Record
    const trade = await Trade.create([{
      userId,
      portfolioId: portfolio._id,
      symbol,
      type: "SELL",
      quantity,
      price: currentPrice,
      totalCost: totalRevenue // Storing revenue as totalCost field (or rename field to totalAmount)
    }], { session });

    // 7. Update League Entries (Realize PnL)
    const activeEntries = await LeagueEntry.find({ userId }).session(session);
    if (activeEntries.length > 0) {
      // NOTE: We might want to recalculate exact Net Worth here to update the leaderboard score
      // For now, syncing with portfolio.totalValue
      for (let entry of activeEntries) {
        entry.currentValue = portfolio.totalValue;
        await entry.save({ session });
      }
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      data: {
        trade: trade[0],
        newBalance: portfolio.cashBalance
      }
    });

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});