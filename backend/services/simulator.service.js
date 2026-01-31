const db = require("../models"); // Adjust path to your models
const Stock = db.stock; 

class MarketSimulator {
  constructor(io) {
    this.io = io;
    this.isRunning = false;
    this.stocks = [];
    
    // ⚡ BUFFER: Store updates here instead of writing to DB immediately
    this.pendingUpdates = new Map(); 
  }

  async init() {
    if (global.marketInterval) {
      console.log("⚠️ Simulator already running.");
      return;
    }

    try {
      this.stocks = await Stock.find({ isActive: true });
      if (this.stocks.length === 0) {
        console.warn("⚠️ No active stocks found.");
        return;
      }
      console.log(`✅ Loaded ${this.stocks.length} stocks into memory.`);
      this.start();
    } catch (err) {
      console.error("❌ Simulator Init Error:", err);
    }
  }

  start() {
    this.isRunning = true;
    console.log("🚀 Market Simulator Engine Started");

    // Fast Loop (Socket Emission) - Every 2 seconds
    global.marketInterval = setInterval(() => this.tick(), 2000);

    // Slow Loop (DB Save) - Every 60 seconds
    setInterval(() => this.persistData(), 60000);
  }

  tick() {
    const updates = [];
    const now = Date.now();

    // --- 1. GLOBAL MARKET CYCLE (The Fix) ---
    // We use a Sine wave to simulate Bull/Bear cycles.
    // The cycle completes every 5 minutes (300,000ms).
    // result is between -1 (Bearish) and +1 (Bullish)
    const marketCycle = Math.sin(now / 40000); 
    
    // Add some "Chaos" so it's not a perfect predictable wave
    const chaosFactor = (Math.random() - 0.5) * 0.5;
    const globalTrend = marketCycle * 0.2 + chaosFactor; 

    this.stocks.forEach((stock) => {
      // --- 2. INDIVIDUAL STOCK VOLATILITY ---
      // Random walk between -1.5% and +1.5%
      // (Math.random() - 0.5) gives -0.5 to 0.5
      const randomWalk = (Math.random() - 0.5) * 0.03; 

      // --- 3. PRICE CORRECTION (Gravity) ---
      // If price is too high (e.g., doubled since start), force it down harder
      // If price is too low, push it up gently
      let gravity = 0;
      if (stock.currentPrice > 1000) gravity = -0.01; // Sell pressure at high prices
      if (stock.currentPrice < 10) gravity = 0.01;    // Buy pressure at low prices

      // Calculate Final Change %
      // Global Trend + Individual Randomness + Gravity
      const changePercent = globalTrend * 0.02 + randomWalk + gravity;

      let newPrice = stock.currentPrice * (1 + changePercent);
      
      // Safety: Price cannot go below $1.00 or it breaks the UI math
      if (newPrice < 1.00) newPrice = 1.00;

      // Update Memory
      stock.currentPrice = parseFloat(newPrice.toFixed(2));
      const previousClose = stock.previousClosePrice || stock.currentPrice;
      const changeValue = stock.currentPrice - previousClose;

      // Prepare Payload
      updates.push({
        _id: stock._id,
        symbol: stock.symbol,
        price: stock.currentPrice,
        change: changeValue, 
        timestamp: new Date().toISOString()
      });

      // Buffer for DB
      if (!this.pendingUpdates.has(stock._id)) {
        this.pendingUpdates.set(stock._id, []);
      }
      this.pendingUpdates.get(stock._id).push({
        price: stock.currentPrice,
        timestamp: new Date()
      });
    });

    this.io.to("market-data").emit("market-update", updates);
  }

  async persistData() {
    if (this.pendingUpdates.size === 0) return;

    // console.log("💾 Persisting market data...");
    const bulkOps = [];

    for (const [stockId, newHistoryPoints] of this.pendingUpdates.entries()) {
        const latestPrice = newHistoryPoints[newHistoryPoints.length - 1].price;

        bulkOps.push({
            updateOne: {
                filter: { _id: stockId },
                update: {
                    $set: { currentPrice: latestPrice },
                    $push: {
                        history: {
                            $each: newHistoryPoints,
                            $slice: -500 // Keep history manageable
                        }
                    }
                }
            }
        });
    }

    try {
        await Stock.bulkWrite(bulkOps, { ordered: false });
        this.pendingUpdates.clear(); 
    } catch (err) {
        console.error("❌ DB Save Error:", err.message);
    }
  }
}

module.exports = MarketSimulator;