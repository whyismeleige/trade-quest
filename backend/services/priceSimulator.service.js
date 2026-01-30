// services/priceSimulator.service.js - THE CORE ENGINE
const Stock = require("../models/Stock.model");

class PriceSimulator {
  constructor() {
    this.activeStocks = new Map(); // symbol -> current candle
    this.updateInterval = 5000; // Update every 5 seconds (fast for demo)
    this.candleInterval = 60000; // New candle every 1 minute
    this.isRunning = false;
  }

  /**
   * Realistic price movement using Geometric Brownian Motion
   */
  generateNextPrice(currentPrice, volatility = 0.02, drift = 0.0001) {
    // Geometric Brownian Motion: dS = μSdt + σSdW
    const dt = this.updateInterval / (1000 * 60 * 60 * 24); // Time step in days
    const randomShock = this.gaussianRandom(); // Random walk component
    
    const priceChange =
      drift * currentPrice * dt + // Drift (trend)
      volatility * currentPrice * Math.sqrt(dt) * randomShock; // Volatility

    return Math.max(currentPrice + priceChange, 0.01); // Prevent negative prices
  }

  /**
   * Generate random number from normal distribution (Box-Muller transform)
   */
  gaussianRandom() {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  /**
   * Initialize a new candle for a stock
   */
  initCandle(stock) {
    const now = new Date();
    return {
      symbol: stock.symbol,
      open: stock.currentPrice,
      high: stock.currentPrice,
      low: stock.currentPrice,
      close: stock.currentPrice,
      volume: 0,
      startTime: now,
      trades: 0,
    };
  }

  /**
   * Update current candle with new tick
   */
  updateCandle(candle, newPrice, volume = 0) {
    candle.close = newPrice;
    candle.high = Math.max(candle.high, newPrice);
    candle.low = Math.min(candle.low, newPrice);
    candle.volume += volume;
    candle.trades += 1;
  }

  /**
   * Start price simulation for all active stocks
   */
  async start(io) {
    if (this.isRunning) {
      console.log("⚠️  Price simulator already running");
      return;
    }

    console.log("🚀 Starting real-time price simulator...");
    this.isRunning = true;

    // Load all active stocks
    const stocks = await Stock.find({ isActive: true });
    
    // Initialize candles for each stock
    stocks.forEach((stock) => {
      this.activeStocks.set(stock.symbol, this.initCandle(stock));
    });

    // Price tick updates (every 5 seconds)
    this.tickInterval = setInterval(() => {
      this.updatePrices(io);
    }, this.updateInterval);

    // Candle finalization (every 1 minute)
    this.candleInterval = setInterval(() => {
      this.finalizeCandles(io);
    }, this.candleInterval);

    console.log(`✅ Simulator started for ${stocks.length} stocks`);
  }

  /**
   * Update prices and broadcast to clients
   */
  async updatePrices(io) {
    const updates = [];

    for (const [symbol, candle] of this.activeStocks) {
      try {
        const stock = await Stock.findOne({ symbol });
        if (!stock) continue;

        // Generate new price
        const newPrice = this.generateNextPrice(
          candle.close,
          stock.volatility,
          0.0001 // Slight upward drift for demo
        );

        // Simulate volume (random between 100-1000)
        const volume = Math.floor(Math.random() * 900) + 100;

        // Update candle
        this.updateCandle(candle, newPrice, volume);

        // Prepare broadcast data
        const priceChange = stock.getPriceChange();
        updates.push({
          symbol,
          price: parseFloat(newPrice.toFixed(2)),
          change: priceChange.change,
          changePercent: priceChange.changePercent,
          volume: candle.volume,
          high: candle.high,
          low: candle.low,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error(`Error updating ${symbol}:`, error.message);
      }
    }

    // Broadcast all updates via Socket.IO
    if (updates.length > 0) {
      io.emit("price-update", updates);
    }
  }

  /**
   * Finalize current candles and save to database
   */
  async finalizeCandles(io) {
    console.log("📊 Finalizing candles...");

    for (const [symbol, candle] of this.activeStocks) {
      try {
        const stock = await Stock.findOne({ symbol });
        if (!stock) continue;

        // Save completed candle
        stock.addCandle(
          {
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            volume: candle.volume,
            timestamp: candle.startTime,
          },
          true // isIntraday
        );

        await stock.save();

        // Start new candle
        this.activeStocks.set(symbol, this.initCandle(stock));

        // Broadcast candle completion
        io.emit("candle-complete", {
          symbol,
          candle: {
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            volume: candle.volume,
            timestamp: candle.startTime,
          },
        });
      } catch (error) {
        console.error(`Error finalizing candle for ${symbol}:`, error.message);
      }
    }
  }

  /**
   * Stop the simulator
   */
  stop() {
    if (!this.isRunning) return;

    clearInterval(this.tickInterval);
    clearInterval(this.candleInterval);
    this.isRunning = false;
    this.activeStocks.clear();
    console.log("🛑 Price simulator stopped");
  }

  /**
   * Add a new stock to simulation
   */
  async addStock(symbol) {
    const stock = await Stock.findOne({ symbol });
    if (stock && !this.activeStocks.has(symbol)) {
      this.activeStocks.set(symbol, this.initCandle(stock));
      console.log(`➕ Added ${symbol} to simulator`);
    }
  }

  /**
   * Remove stock from simulation
   */
  removeStock(symbol) {
    this.activeStocks.delete(symbol);
    console.log(`➖ Removed ${symbol} from simulator`);
  }
}

// Export singleton instance
module.exports = new PriceSimulator();