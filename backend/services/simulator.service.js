// services/simulator.service.js
const db = require("../models");
const Stock = db.stock;

class MarketSimulator {
  constructor(io) {
    this.io = io;
    this.isRunning = false;
    this.interval = null;
    // Cache stocks in memory to avoid hitting DB 1000 times/sec
    this.stocks = []; 
  }

  async init() {
    // Load all active stocks
    this.stocks = await Stock.find({ isActive: true });
    console.log(`✅ Simulator loaded ${this.stocks.length} stocks.`);
    this.start();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    // 🚀 THE LOOP: Runs every 2 seconds
    this.interval = setInterval(async () => {
      await this.tick();
    }, 2000);
  }

  async tick() {
    if (!this.stocks.length) return;

    const updates = [];
    const bulkOps = [];

    // Simulate "Market Sentiment" (Bull or Bear run)
    const marketMood = (Math.random() - 0.5) * 0.2; 

    this.stocks.forEach((stock) => {
      // Random Volatility
      const volatility = 0.015; // 1.5% max swing
      const change = (Math.random() - 0.5) * 2 * volatility + (marketMood * 0.1);
      
      let newPrice = stock.currentPrice * (1 + change);
      if (newPrice < 1) newPrice = 1; // Floor price

      // Update Memory
      stock.currentPrice = parseFloat(newPrice.toFixed(2));

      // Add to Updates Array (for Frontend)
      updates.push({
        _id: stock._id,
        symbol: stock.symbol,
        price: stock.currentPrice,
        change: change // useful for red/green arrow logic
      });

      // Prepare DB Update (Efficient)
      bulkOps.push({
        updateOne: {
          filter: { _id: stock._id },
          update: { 
            $set: { currentPrice: stock.currentPrice },
            $push: { 
               history: { 
                 $each: [{ price: stock.currentPrice, timestamp: new Date() }],
                 $slice: -100 // Keep DB small
               }
            }
          }
        }
      });
    });

    // 🔥 EMIT TO ROOM "market-data"
    this.io.to("market-data").emit("market-update", updates);

    // Save to DB (Fire and forget for speed, or await if safety needed)
    Stock.bulkWrite(bulkOps).catch(err => console.error("Sim DB Error", err.message));
  }
}

module.exports = MarketSimulator;