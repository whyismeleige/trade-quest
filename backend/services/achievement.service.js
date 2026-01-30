// services/achievement.service.js
const mongoose = require("mongoose");
const { Achievement, UserAchievement } = require("../models/Achievement.model");
const User = require("../models/User.model");
const Trade = require("../models/Trade.model"); // Assuming path

/**
 * Core Service to handle all Gamification Logic
 */
class AchievementService {
  /**
   * Main Entry Point: Checks relevant achievements for a user after an action.
   * @param {string} userId - The user ID
   * @param {string} type - The trigger type (e.g., 'TRADE_COUNT', 'PROFIT_AMOUNT')
   * @param {Object} data - Context data (e.g., { tradeValue: 500, symbol: 'AAPL' })
   * @returns {Promise<Array>} - List of newly unlocked achievements
   */
  async checkAchievements(userId, type, data = {}) {
    const unlockedNow = [];

    try {
      // 1. Fetch all active achievements matching this criteria type
      // We only want achievements the user hasn't unlocked yet (optimization)
      const potentialAchievements = await Achievement.find({
        "criteria.type": type,
        isActive: true,
      });

      if (!potentialAchievements.length) return [];

      // 2. Fetch or Create User Progress for these achievements
      for (const achievement of potentialAchievements) {
        // Skip if already unlocked
        const isAlreadyUnlocked = await UserAchievement.exists({
          userId,
          achievementId: achievement.achievementId,
          isUnlocked: true,
        });
        if (isAlreadyUnlocked) continue;

        // 3. Calculate New Progress based on the Type
        const newProgress = await this.calculateProgress(userId, achievement, data);

        // 4. Update UserAchievement Record
        const userAch = await UserAchievement.findOneAndUpdate(
          { userId, achievementId: achievement.achievementId },
          {
            $set: {
              "progress.current": newProgress,
              "progress.required": achievement.criteria.target,
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // 5. Check for Unlock
        if (userAch.progress.current >= userAch.progress.required && !userAch.isUnlocked) {
          const unlocked = await userAch.unlock(); // Uses the schema method
          if (unlocked) {
            unlockedNow.push(achievement);
            
            // Add XP/Points to User Profile
            await User.findByIdAndUpdate(userId, {
              $inc: { totalPoints: achievement.pointsReward }
            });
          }
        }
      }

      return unlockedNow;

    } catch (error) {
      console.error("[AchievementService] Error:", error);
      return []; // Fail silently so we don't block the trade response
    }
  }

  /**
   * Strategy Pattern: Routing to specific calculation logic
   */
  async calculateProgress(userId, achievement, data) {
    switch (achievement.criteria.type) {
      case 'TRADE_COUNT':
        return this.getTradeCount(userId);
        
      case 'PROFIT_AMOUNT':
        // Requires accumulation logic (assumed stored in UserStats or calculated)
        return this.getTotalProfit(userId);
        
      case 'WIN_STREAK':
        return this.getWinStreak(userId);
        
      case 'DIVERSIFICATION':
        return this.getUniqueStockCount(userId);
      
      case 'DAILY_TRADES':
        return this.getDailyTradeCount(userId);

      // Add other cases here...
      default:
        return 0;
    }
  }

  // --- Helper Calculation Methods ---

  async getTradeCount(userId) {
    return await Trade.countDocuments({ userId });
  }

  async getUniqueStockCount(userId) {
    const distinctStocks = await Trade.distinct("symbol", { userId });
    return distinctStocks.length;
  }

  async getDailyTradeCount(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    return await Trade.countDocuments({
      userId,
      executedAt: { $gte: startOfDay }
    });
  }

  async getWinStreak(userId) {
    // Determine streak by looking at recent SELL trades
    // This is complex: fetch recent sells, loop backwards until a loss is found
    const recentSells = await Trade.find({ userId, type: 'SELL' })
      .sort({ executedAt: -1 })
      .limit(50); // Optimization limit

    let streak = 0;
    for (const trade of recentSells) {
      // Logic assumes you store profit in trade or calculate it dynamically
      // Since your Trade model uses 'totalCost' (revenue for sells), 
      // you need to compare with avg cost. 
      // For this example, let's assume 'data.isProfit' was passed or calculated differently.
      
      // If your Trade model doesn't explicitly store "profit", this is hard to calculate purely from history 
      // without looking up the buy price history. 
      // Simplified: We rely on the Controller to pass the current streak count if it tracks it, 
      // or we simplify this to just "Consecutive Actions".
      
      // Placeholder for now
      streak++; 
    }
    return streak;
  }
  
  async getTotalProfit(userId) {
    // You likely need a "UserStats" model to track this efficiently.
    // Calculating sum of all trades on every check is expensive.
    // For now, return a placeholder or aggregate if volume is low.
    return 0; 
  }
}

module.exports = new AchievementService();