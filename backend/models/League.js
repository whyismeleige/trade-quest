const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "League name is required"],
      trim: true,
      minlength: [3, "League name must be at least 3 characters"],
      maxlength: [100, "League name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after the start date",
      },
    },
    startingBalance: {
      type: Number,
      default: 100000,
      min: [1000, "Starting balance must be at least 1,000"],
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    leaderboard: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        totalValue: { type: Number, default: 0 },
        rank: { type: Number },
        lastUpdated: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

LeagueSchema.index({ startDate: 1, endDate: 1 });
LeagueSchema.index({ isActive: 1 });

/* @returns {boolean} */
LeagueSchema.methods.isOngoing = function () {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate && this.isActive;
};

module.exports = mongoose.model("League", LeagueSchema);
