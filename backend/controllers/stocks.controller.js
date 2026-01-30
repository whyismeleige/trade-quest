// controllers/market.controller.js
const db = require("../models/index");
const asyncHandler = require("../middleware/asyncHandler");

const { ValidationError, NotFoundError } = require("../utils/error.utils");

const Stock = db.stock;

/**
 * Search for stocks by symbol or company name
 * Endpoint: GET /api/stocks/search?q=AAPL
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
exports.searchStocks = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    throw new ValidationError("Search query is required");
  }

  // Perform case-insensitive search on symbol OR name
  // Using regex for partial matching (e.g., "APP" matches "APPLE")
  const stocks = await Stock.find({
    $or: [
      { symbol: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
    ],
    isActive: true,
  })
    .select("symbol name currentPrice previousClosePrice sector") // Select only necessary fields
    .limit(10) // Limit results for performance
    .lean(); // Convert to plain JS objects for speed

  // Calculate percentage change for the UI
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
 * Get full details for a specific stock
 * Endpoint: GET /api/stocks/:symbol
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
exports.getStockDetails = asyncHandler(async (req, res, next) => {
  const { symbol } = req.params;

  const stock = await Stock.findOne({
    symbol: symbol.toUpperCase(),
  });

  if (!stock) {
    throw NotFoundError(`Stock with symbol ${symbol} not found`);
  }

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
    },
  });
});

/**
 * Get historical price data for charts
 * Endpoint: GET /api/stocks/:symbol/history?range=1D
 * Ranges: 1D (Day), 1W (Week), 1M (Month), 1Y (Year), ALL
 */
exports.getStockHistory = asyncHandler(async (req, res, next) => {
  const { symbol } = req.params;
  const { range } = req.query; // '1D', '1W', '1M', '1Y', 'ALL'

  // 1. Determine the start date filter based on range
  let startDate = new Date();
  
  switch (range) {
    case '1D':
      startDate.setHours(startDate.getHours() - 24); // Last 24 hours
      break;
    case '1W':
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
      break;
    case '1M':
      startDate.setMonth(startDate.getMonth() - 1); // Last 30 days
      break;
    case '1Y':
      startDate.setFullYear(startDate.getFullYear() - 1); // Last 1 year
      break;
    case 'ALL':
      startDate = new Date(0); // Beginning of time (1970)
      break;
    default:
      // Default to 1 Day if range is missing or invalid
      startDate.setHours(startDate.getHours() - 24);
  }

  // 2. Fetch stock with filtered history
  // Use aggregation to efficiently filter the embedded array
  const stock = await Stock.aggregate([
    { $match: { symbol: symbol.toUpperCase() } },
    {
      $project: {
        symbol: 1,
        // Filter the history array to only include points after startDate
        history: {
          $filter: {
            input: "$history",
            as: "point",
            cond: { $gte: ["$$point.timestamp", startDate] }
          }
        }
      }
    }
  ]);

  if (!stock || stock.length === 0) {
    throw new NotFoundError(`Stock with symbol ${symbol} not found`);
  }

  // Aggregate returns an array, pick the first item
  const result = stock[0];

  res.status(200).json({
    success: true,
    symbol: result.symbol,
    range: range || '1D',
    count: result.history.length,
    data: result.history // Returns array of { price, timestamp }
  });
});