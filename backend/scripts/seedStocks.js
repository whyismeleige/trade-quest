// scripts/seedStocks.js
require('dotenv').config(); // Ensure env vars are loaded first
const connectDB = require("../database/mongoDB");
const Stock = require('../models/Stock.model');

/**
 * Helper to generate fake price history
 * Generates ~365 data points (1 per day for last year)
 * plus ~24 extra points for the last day (hourly resolution for 1D graph)
 */
const generateMockHistory = (currentPrice) => {
  const history = [];
  const now = new Date();
  const volatility = 0.02; // 2% daily volatility
  
  let tempPrice = currentPrice;

  // 1. Generate Hourly Data for the last 24 hours (High resolution for 1D view)
  for (let i = 0; i < 24; i++) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);
    
    // Random walk
    const changePercent = 1 + (Math.random() * volatility * 0.5 - (volatility * 0.5 / 2));
    tempPrice = tempPrice * changePercent;
    
    history.push({
      price: parseFloat(tempPrice.toFixed(2)),
      timestamp: date
    });
  }

  // 2. Generate Daily Data for the last 365 days (Lower resolution for 1Y view)
  // We continue from where the hourly loop left off
  for (let i = 1; i <= 365; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk
    const changePercent = 1 + (Math.random() * volatility - (volatility / 2));
    tempPrice = tempPrice * changePercent;
    
    history.push({
      price: parseFloat(tempPrice.toFixed(2)),
      timestamp: date
    });
  }

  // Reverse so oldest is first (optional, but good for some chart libs)
  return history.reverse();
};

const rawStocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    currentPrice: 175.50,
    previousClosePrice: 173.25, 
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    currentPrice: 138.20,
    previousClosePrice: 139.50,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    currentPrice: 330.00,
    previousClosePrice: 325.80,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Automotive',
    currentPrice: 240.50,
    previousClosePrice: 245.00,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    sector: 'Consumer Cyclical',
    currentPrice: 128.00,
    previousClosePrice: 126.50,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    currentPrice: 460.00,
    previousClosePrice: 450.20,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    sector: 'Technology',
    currentPrice: 300.00,
    previousClosePrice: 295.10,
  },
  {
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    sector: 'Communication Services',
    currentPrice: 440.00,
    previousClosePrice: 435.00,
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices, Inc.',
    sector: 'Technology',
    currentPrice: 105.25,
    previousClosePrice: 102.80,
  },
  {
    symbol: 'INTC',
    name: 'Intel Corporation',
    sector: 'Technology',
    currentPrice: 35.50,
    previousClosePrice: 36.10,
  },
  {
    symbol: 'DIS',
    name: 'The Walt Disney Company',
    sector: 'Communication Services',
    currentPrice: 85.00,
    previousClosePrice: 86.50,
  },
  {
    symbol: 'KO',
    name: 'The Coca-Cola Company',
    sector: 'Consumer Defensive',
    currentPrice: 58.00,
    previousClosePrice: 57.80,
  },
];

const seedStocks = async () => {
  try {
    // 1. Connect (Await the connection)
    await connectDB();
    console.log('🔌 Connected to DB');

    // 2. Clear old data
    await Stock.deleteMany({});
    console.log('🧹 Cleared existing stocks');

    // 3. Attach history to each stock before inserting
    const stocksWithHistory = rawStocks.map(stock => {
      return {
        ...stock,
        history: generateMockHistory(stock.currentPrice)
      };
    });

    // 4. Insert
    console.log('🌱 Seeding new stocks with history...');
    const createdStocks = await Stock.insertMany(stocksWithHistory);
    
    console.log('------------------------------------------------');
    console.log(`🎉 SUCCESS: Created ${createdStocks.length} stocks with history data.`);
    console.log('------------------------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR FAILED TO SEED ❌');
    console.error(error);
    process.exit(1);
  }
};

seedStocks();