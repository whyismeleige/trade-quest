// controllers/achievement.controller.js
const asyncHandler = require("../middleware/asyncHandler");
const achievementService = require("../services/achievement.service");
const { Achievement, UserAchievement } = require("../models/Achievement.model");

/**
 * @route   GET /api/achievements
 * @desc    Get all achievements with current user's progress
 * @access  Private
 */
exports.getUserAchievements = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Fetch all static achievement definitions (Rules)
  const allAchievements = await Achievement.find({ isActive: true }).lean();

  // 2. Fetch user's specific progress records
  const userProgress = await UserAchievement.find({ userId }).lean();

  // 3. Create a map for fast lookup of user progress
  const progressMap = new Map();
  userProgress.forEach((up) => {
    progressMap.set(up.achievementId, up);
  });

  // 4. Merge Data: Combine static info with user status
  const data = allAchievements.map((ach) => {
    const userRecord = progressMap.get(ach.achievementId);

    return {
      achievementId: ach.achievementId,
      name: ach.name,
      description: ach.description,
      category: ach.category,
      rarity: ach.rarity,
      pointsReward: ach.pointsReward,
      icon: ach.icon,
      criteria: ach.criteria,
      // Dynamic User Data (Default to 0/False if no record exists yet)
      isUnlocked: userRecord ? userRecord.isUnlocked : false,
      unlockedAt: userRecord ? userRecord.unlockedAt : null,
      progress: userRecord
        ? userRecord.progress
        : { current: 0, required: ach.criteria.target },
      completionPercent: userRecord
        ? Math.min(100, (userRecord.progress.current / ach.criteria.target) * 100)
        : 0,
    };
  });

  res.status(200).json({
    success: true,
    count: data.length,
    data: data,
  });
});

/**
 * @route   GET /api/achievements/stats
 * @desc    Get summary statistics (Total points, Unlocked count)
 * @access  Private
 */
exports.getAchievementStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch only unlocked achievements for this user
  const unlockedUserAchievements = await UserAchievement.find({
    userId,
    isUnlocked: true,
  }).lean();

  // Get the static details for these specific unlocked items to sum points
  const unlockedIds = unlockedUserAchievements.map((ua) => ua.achievementId);
  const achievementDetails = await Achievement.find({
    achievementId: { $in: unlockedIds },
  }).lean();

  // Calculate Totals
  const totalAchievements = await Achievement.countDocuments({ isActive: true });
  const unlockedCount = unlockedUserAchievements.length;
  
  // Sum up points
  const totalPoints = achievementDetails.reduce((sum, ach) => sum + ach.pointsReward, 0);

  // Calculate Global Rank (Optional: simplistic version)
  // For a real app, this should be a cached value or a separate heavy query
  const rank = "N/A"; 

  res.status(200).json({
    success: true,
    data: {
      totalPoints,
      unlockedCount,
      totalAchievements,
      completionRate: totalAchievements ? ((unlockedCount / totalAchievements) * 100).toFixed(1) : 0,
      rank,
    },
  });
});

/**
 * @route   GET /api/achievements/recent
 * @desc    Get recently unlocked achievements (limit 5)
 * @access  Private
 */
exports.getRecentAchievements = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const limit = parseInt(req.query.limit) || 5;

  // 1. Get user's unlocked records, sorted by date
  const recentUnlocked = await UserAchievement.find({
    userId,
    isUnlocked: true,
  })
    .sort({ unlockedAt: -1 })
    .limit(limit)
    .lean();

  if (!recentUnlocked.length) {
    return res.status(200).json({ success: true, count: 0, data: [] });
  }

  // 2. Fetch the details for these achievements
  const achievementIds = recentUnlocked.map((ua) => ua.achievementId);
  const achievementDetails = await Achievement.find({
    achievementId: { $in: achievementIds },
  }).lean();

  // 3. Map details back to the recent records
  const detailsMap = new Map(achievementDetails.map((a) => [a.achievementId, a]));

  const enrichedData = recentUnlocked.map((ua) => {
    const details = detailsMap.get(ua.achievementId);
    return {
      achievementId: ua.achievementId,
      name: details?.name || "Unknown",
      icon: details?.icon,
      pointsReward: details?.pointsReward,
      unlockedAt: ua.unlockedAt,
    };
  });

  res.status(200).json({
    success: true,
    count: enrichedData.length,
    data: enrichedData,
  });
});

/**
 * @route   GET /api/achievements/categories
 * @desc    Get achievements grouped by category
 * @access  Private
 */
exports.getAchievementsByCategory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Reuse the logic from getUserAchievements to get full list
  // In production, you might refactor this into a helper function to avoid code duplication
  const allAchievements = await Achievement.find({ isActive: true }).lean();
  const userProgress = await UserAchievement.find({ userId }).lean();
  
  const progressMap = new Map(userProgress.map(up => [up.achievementId, up]));

  const categorized = allAchievements.reduce((acc, ach) => {
    const userRecord = progressMap.get(ach.achievementId);
    
    // Construct the object
    const obj = {
      ...ach, // static data
      isUnlocked: userRecord ? userRecord.isUnlocked : false,
      progress: userRecord ? userRecord.progress : { current: 0, required: ach.criteria.target }
    };

    // Grouping
    if (!acc[ach.category]) {
      acc[ach.category] = [];
    }
    acc[ach.category].push(obj);
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: categorized,
  });
});

/**
 * @route   POST /api/achievements/check
 * @desc    Manually trigger achievement check
 * (Useful for "Check Refresh" buttons or testing)
 * @access  Private
 */
exports.checkAchievements = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // We expect 'type' in body to know what to check (e.g., "TRADE_COUNT")
  const { type, data } = req.body; 

  if (!type) {
    return res.status(400).json({ success: false, message: "Type is required (e.g. TRADE_COUNT)" });
  }
  
  // Call the service we designed earlier
  const unlockedAchievements = await achievementService.checkAchievements(userId, type, data || {});
  
  res.status(200).json({
    success: true,
    count: unlockedAchievements.length,
    message: unlockedAchievements.length 
      ? `Unlocked ${unlockedAchievements.length} new achievement(s)!` 
      : "No new achievements unlocked.",
    data: unlockedAchievements,
  });
});