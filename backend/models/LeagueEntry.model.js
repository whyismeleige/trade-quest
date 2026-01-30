const mongoose = require("mongoose");

const LeagueEntrySchema = new mongoose.Schema({
  leagueId: { type: mongoose.Schema.Types.ObjectId, ref: "League", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startingValue: { type: Number, required: true }, // Value at entry time
  currentValue: { type: Number, required: true }, // Updated when viewing/trading
  rank: { type: Number, default: 0 }
}, { timestamps: true });

// Virtual field for Profit/Loss
LeagueEntrySchema.virtual('profitLoss').get(function() {
  return this.currentValue - this.startingValue;
});

// Ensure unique entry per user per league
LeagueEntrySchema.index({ leagueId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("LeagueEntry", LeagueEntrySchema);