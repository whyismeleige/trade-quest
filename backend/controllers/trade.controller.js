// controllers/trade.controller.js
const db = require("../models");
const mongoose = require("mongoose");
const asyncHandler = require("../middleware/asyncHandler");
const { ValidationError, NotFoundError } = require("../utils/error.utils");
const achievementService = require("../services/achievement.service");

const Trade = db.trade;
const Portfolio = db.portfolio;
const Stock = db.stock;
const LeagueEntry = db.leagueEntry;
const League = db.league; // Need this to find active leagues

// ==========================================
// 🛠️ HELPER: Auto-Join & Update Leagues
// ==========================================
const updateUserLeagues = async (userId, userPortfolioValue, io) => {
  try {
    // 1. Find all leagues that are currently running
    const activeLeagues = await League.find({ isActive: true });

    if (!activeLeagues.length) return;

    // 2. Loop through each active league
    for (const league of activeLeagues) {
      // Try to find if user is already in this league
      let entry = await LeagueEntry.findOne({ leagueId: league._id, userId: userId });

      if (entry) {
        // SCENARIO A: User is already in -> Just Update Value
        entry.currentValue = userPortfolioValue;
        await entry.save();
      } else {
        // SCENARIO B: User is new -> Auto-Join (Lazy Enrollment)
        // We set startingValue = currentValue so they start at 0% change
        // This is fair: you don't get credit for gains made before joining
        entry = await LeagueEntry.create({
          leagueId: league._id,
          userId: userId,
          startingValue: userPortfolioValue,
          currentValue: userPortfolioValue,
          rank: 0 // Frontend/Background job will handle sorting
        });
      }

      // 3. ⚡ REAL-TIME SOCKET EMIT
      // Only emit if we have the IO instance
      if (io) {
        // We construct a payload that matches what the Frontend Redux needs
        const socketPayload = {
            leagueId: league._id,
            userId: userId,
            currentValue: entry.currentValue,
            startingValue: entry.startingValue,
            // If you have username available in req.user, pass it here, 
            // otherwise frontend might need to look it up or you fetch it
        };
        
        // Broadcast to everyone in the "leagues" room or globally
        io.emit("league_update", socketPayload);
      }
    }
  } catch (err) {
    // Non-blocking error logging (Don't fail the trade if leaderboard fails)
    console.error("⚠️ League Update Failed:", err.message);
  }
};


/**
 * Get Trade History
 * GET /api/trades
 */
exports.getTradeHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const filter = { userId };
  
  if (req.query.symbol) filter.symbol = req.query.symbol.toUpperCase();
  if (req.query.type) filter.type = req.query.type.toUpperCase();

  const trades = await Trade.find(filter).sort({ executedAt: -1 }).lean();

  res.status(200).json({ success: true, count: trades.length, data: trades });
});

/**
 * Execute a BUY Trade
 */
exports.buyStock = asyncHandler(async (req, res) => {
  const { symbol, quantity } = req.body;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  let tradeResult = null;
  let portfolioResult = null;

  try {
    // --- FINANCIAL LOGIC START ---
    const portfolio = await Portfolio.findOne({ userId }).session(session);
    if (!portfolio) throw new NotFoundError("Portfolio not found");

    const stock = await Stock.findOne({ symbol }).session(session);
    if (!stock) throw new NotFoundError(`Stock ${symbol} not found`);

    const currentPrice = stock.currentPrice;
    const totalCost = currentPrice * quantity;

    if (portfolio.cashBalance < totalCost) {
      throw new ValidationError(`Insufficient funds. Need $${totalCost.toFixed(2)}, have $${portfolio.cashBalance.toFixed(2)}`);
    }

    // Update Cash & Holdings
    portfolio.cashBalance -= totalCost;
    const existingHoldingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);

    if (existingHoldingIndex > -1) {
      const holding = portfolio.holdings[existingHoldingIndex];
      const newTotalQuantity = holding.quantity + quantity;
      const oldTotalCost = holding.quantity * holding.averagePrice;
      const newAveragePrice = (oldTotalCost + totalCost) / newTotalQuantity;

      portfolio.holdings[existingHoldingIndex].quantity = newTotalQuantity;
      portfolio.holdings[existingHoldingIndex].averagePrice = newAveragePrice;
    } else {
      portfolio.holdings.push({ symbol, quantity, averagePrice: currentPrice });
    }

    await portfolio.save({ session });

    // Create Trade Record
    const trades = await Trade.create([{
      userId,
      portfolioId: portfolio._id,
      symbol,
      type: "BUY",
      quantity,
      price: currentPrice,
      totalCost
    }], { session });

    // --- FINANCIAL LOGIC END ---
    await session.commitTransaction();

    tradeResult = trades[0];
    portfolioResult = portfolio;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  // ============================================================
  // 🏆 LEAGUE & GAMIFICATION UPDATE (Post-Transaction)
  // ============================================================
  
  // 1. Update Leagues & Emit Socket Events
  // We pass req.app.get('io') assuming you initialized socket.io in app.js
  await updateUserLeagues(userId, portfolioResult.totalValue, req.app.get("io"));

  // 2. Check Achievements
  const unlockedAchievements = [];
  try {
    const results = await Promise.all([
      achievementService.checkAchievements(userId, 'TRADE_COUNT'),
      achievementService.checkAchievements(userId, 'DAILY_TRADES'),
      achievementService.checkAchievements(userId, 'DIVERSIFICATION')
    ]);
    results.flat().forEach(ach => unlockedAchievements.push(ach));
  } catch (gamificationError) {
    console.error("[Gamification Error]", gamificationError);
  }

  res.status(200).json({
    success: true,
    data: {
      trade: tradeResult,
      newBalance: portfolioResult.cashBalance,
      achievements: unlockedAchievements.length > 0 ? unlockedAchievements : undefined
    }
  });
});

/**
 * Execute a SELL Trade
 */
exports.sellStock = asyncHandler(async (req, res) => {
  const { symbol, quantity } = req.body;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  let tradeResult = null;
  let portfolioResult = null;

  try {
    // --- FINANCIAL LOGIC START ---
    const portfolio = await Portfolio.findOne({ userId }).session(session);
    if (!portfolio) throw new NotFoundError("Portfolio not found");

    const stock = await Stock.findOne({ symbol }).session(session);
    if (!stock) throw new NotFoundError(`Stock ${symbol} not found`);

    const currentPrice = stock.currentPrice;
    const totalRevenue = currentPrice * quantity;

    const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
    if (holdingIndex === -1 || portfolio.holdings[holdingIndex].quantity < quantity) {
      throw new ValidationError(`Insufficient shares.`);
    }

    portfolio.cashBalance += totalRevenue;
    const remainingQuantity = portfolio.holdings[holdingIndex].quantity - quantity;

    if (remainingQuantity === 0) {
      portfolio.holdings.splice(holdingIndex, 1);
    } else {
      portfolio.holdings[holdingIndex].quantity = remainingQuantity;
    }

    await portfolio.save({ session });

    const trades = await Trade.create([{
      userId,
      portfolioId: portfolio._id,
      symbol,
      type: "SELL",
      quantity,
      price: currentPrice,
      totalCost: totalRevenue 
    }], { session });

    // --- FINANCIAL LOGIC END ---
    await session.commitTransaction();

    tradeResult = trades[0];
    portfolioResult = portfolio;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  // ============================================================
  // 🏆 LEAGUE & GAMIFICATION UPDATE (Post-Transaction)
  // ============================================================

  // 1. Update Leagues & Emit Socket Events
  await updateUserLeagues(userId, portfolioResult.totalValue, req.app.get("io"));

  // 2. Check Achievements
  const unlockedAchievements = [];
  try {
    const results = await Promise.all([
      achievementService.checkAchievements(userId, 'TRADE_COUNT'),
      achievementService.checkAchievements(userId, 'DAILY_TRADES')
    ]);
    results.flat().forEach(ach => unlockedAchievements.push(ach));
  } catch (gamificationError) {
    console.error("[Gamification Error]", gamificationError);
  }

  res.status(200).json({
    success: true,
    data: {
      trade: tradeResult,
      newBalance: portfolioResult.cashBalance,
      achievements: unlockedAchievements.length > 0 ? unlockedAchievements : undefined
    }
  });
});