const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Portfolio must be linked to a user"],
      index: true,
    },
    leagueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: [true, "Portfolio must be associated with a league"],
      index: true,
    },
    cashBalance: {
      type: Number,
      default: 100000,
      min: [0, "Cash balance cannot be negative"],
    },
    holdings: [
      {
        symbol: { type: String, required: true, uppercase: true, trim: true },
        quantity: {
          type: Number,
          required: true,
          min: [0, "Quantity cannot be negative"],
        },
        averagePrice: { type: Number, required: true },
        lastUpdatedPrice: { type: Number },
      },
    ],
    totalValue: { type: Number, required: true, default: 100000 },
  },
  { timestamps: true },
);

PortfolioSchema.methods.calculateTotalValue = function (currentPrices = {}) {
  let holdingsValue = 0;

  this.holdings.forEach((holding) => {
    const currentPrice = currentPrices[holding.symbol] || holding.averagePrice;
    holdingsValue += holding.quantity * currentPrice;
  });

  this.totalValue = this.cashBalance + holdingsValue;
  return this.totalValue;
};

module.exports = mongoose.model("Portfolio", PortfolioSchema);
