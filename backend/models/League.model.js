const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["DAILY", "WEEKLY", "MONTHLY"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("League", LeagueSchema);