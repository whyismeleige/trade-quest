// routes/achievement.routes.js
const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication to all routes
router.use(authenticateToken);

// @route   GET /api/achievements
// @desc    Get all achievements with the user's current progress
router.get('/', achievementController.getUserAchievements);

// @route   GET /api/achievements/stats
// @desc    Get summary stats (Total Points, Completion %, Rank)
router.get('/stats', achievementController.getAchievementStats);

// @route   GET /api/achievements/recent
// @desc    Get the 5 most recently unlocked achievements
router.get('/recent', achievementController.getRecentAchievements);

// @route   GET /api/achievements/categories
// @desc    Get all achievements grouped by category (Trading, Wealth, etc.)
router.get('/categories', achievementController.getAchievementsByCategory);

// @route   POST /api/achievements/check
// @desc    Manually trigger a check (Useful for testing or specific UI interactions)
router.post('/check', achievementController.checkAchievements);

module.exports = router;