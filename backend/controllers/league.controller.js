const db = require("../models");
const asyncHandler = require("../middleware/asyncHandler");

const League = db.league;
const LeagueEntry = db.leagueEntry;

// GET /api/leagues/active
exports.getActiveLeagues = asyncHandler(async (req, res) => {
  const now = new Date();
  const leagues = await League.find({
    isActive: true,
    endDate: { $gt: now },
  });
  res.status(200).json({ success: true, data: leagues });
});

// GET /api/leagues/:id/leaderboard
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch entries and populate usernames
  let entries = await LeagueEntry.find({ leagueId: id })
    .populate("userId") // Assuming User model has 'username'
  
  // Calculate dynamic P&L
  const leaderboard = entries.map((entry) => {
    // Note: In a real app, 'currentValue' should be updated by a background job
    // or by the portfolio controller whenever a user acts.
    // Here we use the stored currentValue.
    const pnl = entry.currentValue - entry.startingValue;

    return {
      username: entry.userId?.name ?? "User",
      score: pnl,
      rank: 0, // Will assign below
    };
  });

  // Sort by Score (High to Low)
  leaderboard.sort((a, b) => b.score - a.score);

  // Assign Ranks
  leaderboard.forEach((item, index) => (item.rank = index + 1));

  res.status(200).json({ success: true, data: leaderboard });
});
