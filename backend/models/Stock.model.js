// models/Stock.js
const mongoose = require("mongoose");

// Sub-schema for a single data point on the graph
const pricePointSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
); // Disable _id for sub-docs to save space

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, "Stock symbol is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    sector: {
      type: String,
      default: "Technology",
    },
    currentPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    // Used to track how much the price changed since yesterday (for green/red indicators)
    previousClosePrice: {
      type: Number,
      default: 0,
    },
    history: [pricePointSchema],
    isActive: {
      type: Boolean,
      default: true, // Set to false to hide stock from search results
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Text index for search functionality (matches symbol OR name)
stockSchema.index({ symbol: "text", name: "text" });

/**
 * Helper method to add a new price point
 * Prevents the array from growing infinitely (Capping at ~1 year of hourly data)
 */
stockSchema.methods.addPriceToHistory = function (price) {
  this.currentPrice = price;

  this.history.push({
    price: price,
    timestamp: new Date(),
  });

  // Optional: Limit history to last 5000 points to prevent document from getting too big
  // If you update every hour: 24 * 365 = 8760 points per year.
  if (this.history.length > 10000) {
    this.history.shift(); // Remove the oldest point
  }
};

module.exports = mongoose.model("Stock", stockSchema);
