const mongoose = require("mongoose");

/**
 * Achievement Schema
 * Defines all possible achievements in the system
 */
const achievementSchema = new mongoose.Schema({
  // Unique identifier for the achievement
  achievementId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  
  // Achievement details
  name: {
    type: String,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  },
  
  // Category for organization
  category: {
    type: String,
    enum: ['trading', 'profit', 'streak', 'portfolio', 'social', 'special'],
    required: true,
  },
  
  // Rarity affects points awarded
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common',
  },
  
  // Points awarded when unlocked
  pointsReward: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // Criteria for unlocking
  criteria: {
    type: {
      type: String,
      enum: [
        'TRADE_COUNT',           // Complete X trades
        'PROFIT_AMOUNT',         // Reach $X profit
        'WIN_STREAK',            // Win X trades in a row
        'PORTFOLIO_VALUE',       // Reach $X portfolio value
        'DIVERSIFICATION',       // Own X different stocks
        'HOLD_DURATION',         // Hold stock for X days
        'DAILY_TRADES',          // Trade X times in one day
        'LEAGUE_RANK',           // Reach rank X in a league
        'ACHIEVEMENT_COUNT',     // Unlock X achievements
        'LEVEL_REACHED',         // Reach level X
      ],
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
    // Additional context (e.g., specific stock symbol, timeframe)
    context: mongoose.Schema.Types.Mixed,
  },
  
  // Icon/badge emoji or URL
  icon: {
    type: String,
    default: '🏆',
  },
  
  // Whether this is a hidden/secret achievement
  isSecret: {
    type: Boolean,
    default: false,
  },
  
  // Whether this achievement is still active
  isActive: {
    type: Boolean,
    default: true,
  },
  
}, { timestamps: true });

/**
 * User Achievement Progress Schema
 * Tracks individual user progress toward achievements
 */
const userAchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  achievementId: {
    type: String,
    required: true,
    index: true,
  },
  
  // Progress toward completion
  progress: {
    current: {
      type: Number,
      default: 0,
    },
    required: {
      type: Number,
      required: true,
    },
  },
  
  // Whether the achievement is unlocked
  isUnlocked: {
    type: Boolean,
    default: false,
    index: true,
  },
  
  // When it was unlocked
  unlockedAt: {
    type: Date,
  },
  
  // Whether the user has been notified
  notified: {
    type: Boolean,
    default: false,
  },
  
}, { timestamps: true });

// Compound index for efficient queries
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
userAchievementSchema.index({ userId: 1, isUnlocked: 1 });

// Virtual to check completion percentage
userAchievementSchema.virtual('completionPercent').get(function() {
  return Math.min(100, (this.progress.current / this.progress.required) * 100);
});

/**
 * Method to unlock achievement
 */
userAchievementSchema.methods.unlock = async function() {
  if (!this.isUnlocked) {
    this.isUnlocked = true;
    this.unlockedAt = new Date();
    this.progress.current = this.progress.required;
    await this.save();
    return true;
  }
  return false;
};

const Achievement = mongoose.model('Achievement', achievementSchema);
const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);

module.exports = {
  Achievement,
  UserAchievement,
};