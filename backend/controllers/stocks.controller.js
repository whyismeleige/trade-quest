// controllers/market.controller.js
const db = require("../models/index");
const asyncHandler = require("../middleware/asyncHandler");
const { ValidationError, NotFoundError } = require("../utils/error.utils");

const Stock = db.stock;

/**
 * Search for stocks by symbol or company name
 * Endpoint: GET /api/stocks/search?q=AAPL
 */
exports.searchStocks = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    throw new ValidationError("Search query is required");
  }

  const stocks = await Stock.find({
    $or: [
      { symbol: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
    ],
    isActive: true,
  })
    .select("symbol name currentPrice previousClosePrice sector")
    .limit(10)
    .lean();

  const results = stocks.map((stock) => {
    const change = stock.currentPrice - stock.previousClosePrice;
    const changePercent = (change / stock.previousClosePrice) * 100;

    return {
      ...stock,
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
    };
  });

  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
});

/**
 * Get full details for a specific stock INCLUDING 1D HISTORY
 * Endpoint: GET /api/stocks/:symbol
 */
exports.getStockDetails = asyncHandler(async (req, res, next) => {
  const { symbol } = req.params;
  const upperSymbol = symbol.toUpperCase();

  // Define 24-hour window
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  // Use Aggregation to fetch details + filtered history in one go
  const pipeline = [
    { $match: { symbol: upperSymbol } },
    {
      $project: {
        symbol: 1,
        name: 1,
        sector: 1,
        currentPrice: 1,
        previousClosePrice: 1,
        lastUpdated: 1,
        // Filter history array to only show last 24h
        history: {
          $filter: {
            input: "$history",
            as: "point",
            cond: { $gte: ["$$point.timestamp", oneDayAgo] },
          },
        },
      },
    },
  ];

  const results = await Stock.aggregate(pipeline);

  if (!results || results.length === 0) {
    throw new NotFoundError(`Stock with symbol ${symbol} not found`);
  }

  const stock = results[0];

  // Calculate real-time stats
  const change = stock.currentPrice - stock.previousClosePrice;
  const changePercent = (change / stock.previousClosePrice) * 100;

  res.status(200).json({
    success: true,
    data: {
      id: stock._id,
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector,
      price: stock.currentPrice,
      previousClose: stock.previousClosePrice,
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      lastUpdated: stock.lastUpdated,
      // Include the 1D history here
      history: stock.history, 
    },
  });
});

/**
 * Get historical price data for charts
 * Endpoint: GET /api/stocks/:symbol/history?range=1D
 */
exports.getStockHistory = asyncHandler(async (req, res, next) => {
  const { symbol } = req.params;
  const { range } = req.query; // '1D', '1W', '1M', '1Y', 'ALL'

  // 1. Determine the start date filter based on range
  let startDate = new Date();

  switch (range) {
    case "1D":
      startDate.setHours(startDate.getHours() - 24);
      break;
    case "1W":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "1M":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "1Y":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case "ALL":
      startDate = new Date(0);
      break;
    default:
      startDate.setHours(startDate.getHours() - 24);
  }

  // 2. Fetch stock with filtered history
  const stock = await Stock.aggregate([
    { $match: { symbol: symbol.toUpperCase() } },
    {
      $project: {
        symbol: 1,
        history: {
          $filter: {
            input: "$history",
            as: "point",
            cond: { $gte: ["$$point.timestamp", startDate] },
          },
        },
      },
    },
  ]);

  if (!stock || stock.length === 0) {
    throw new NotFoundError(`Stock with symbol ${symbol} not found`);
  }

  const result = stock[0];

  res.status(200).json({
    success: true,
    symbol: result.symbol,
    range: range || "1D",
    count: result.history.length,
    data: result.history,
  });
});

