const TradeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Trade must be linked to a user"],
      index: true,
    },
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: [true, "Trade must be linked to a portfolio"],
      index: true,
    },
    symbol: {
      type: String,
      required: [true, "Stock symbol is required"],
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Trade type (BUY/SELL) is required"],
      enum: {
        values: ["BUY", "SELL"],
        message: "{VALUE} is not a valid trade type",
      },
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Execution price is required"],
      min: [0, "Price cannot be negative"],
    },
    totalCost: { type: Number, required: true },
    executedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

TradeSchema.index({ userId: 1, executedAt: -1 });
TradeSchema.index({ symbol: 1 });

TradeSchema.pre("save", function (next) {
  this.totalCost = this.price * this.quantity;
  next();
});

module.exports = mongoose.model("Trade", TradeSchema);
