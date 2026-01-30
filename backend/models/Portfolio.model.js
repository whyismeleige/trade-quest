// models/Portfolio.js
const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One global portfolio per user
    },
    // The "Buying Power"
    cashBalance: {
      type: Number,
      default: 100000, 
      min: [0, "Insufficient funds"],
    },
    // The Stocks
    holdings: [
      {
        symbol: { type: String, required: true, uppercase: true },
        quantity: { type: Number, required: true, min: 0 },
        // "Average Buy Price" - Vital for calculating profit/loss per stock
        averagePrice: { type: Number, required: true }, 
      },
    ],
    // The Total Net Worth (Cash + (Stocks * CurrentPrice))
    // We cache this for fast leaderboard sorting
    totalValue: { 
      type: Number, 
      default: 100000 
    }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", PortfolioSchema);