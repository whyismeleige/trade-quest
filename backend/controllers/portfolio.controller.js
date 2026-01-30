const db = require("../models");
const asyncHandler = require("../middleware/asyncHandler");

const Portfolio = db.portfolio;
const Stock = db.stock;

// GET /api/portfolio
exports.getMyPortfolio = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Find or Create Portfolio
  let portfolio = await Portfolio.findOne({ userId });
  if (!portfolio) {
    portfolio = await Portfolio.create({ userId, cashBalance: 100000 });
  }

  // 2. Real-time Valuation Logic
  let totalHoldingsValue = 0;
  let richHoldings = [];

  if (portfolio.holdings.length > 0) {
    const symbols = portfolio.holdings.map(h => h.symbol);
    const stocks = await Stock.find({ symbol: { $in: symbols } });
    
    const priceMap = {};
    stocks.forEach(s => priceMap[s.symbol] = s.currentPrice);

    richHoldings = portfolio.holdings.map(h => {
      const currentPrice = priceMap[h.symbol] || h.averagePrice;
      const val = h.quantity * currentPrice;
      totalHoldingsValue += val;
      return {
        ...h.toObject(),
        currentPrice,
        currentValue: val,
        profitLoss: val - (h.quantity * h.averagePrice)
      };
    });
  }

  // 3. Update Total Value in DB if changed
  const newTotal = portfolio.cashBalance + totalHoldingsValue;
  if (Math.abs(portfolio.totalValue - newTotal) > 1) {
    portfolio.totalValue = newTotal;
    await portfolio.save();
  }

  res.status(200).json({
    success: true,
    data: {
      cashBalance: portfolio.cashBalance,
      totalValue: newTotal,
      holdings: richHoldings
    }
  });
});