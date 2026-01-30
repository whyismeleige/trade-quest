// frontend/src/types/achievement.types.ts

export type AchievementCategory = "trading" | "profit" | "streak" | "portfolio" | "social" | "special" | string;
export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface AchievementProgress {
  current: number;
  required: number;
}

// Matches the merged object returned by getUserAchievements controller
export interface UserAchievement {
  achievementId: string;
  name: string;        // Backend uses 'name', not 'title'
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  pointsReward: number; // Backend uses 'pointsReward', not 'points'
  icon: string;
  criteria: Record<string, any>;
  
  // Dynamic User Data (merged in controller)
  isUnlocked: boolean;
  unlockedAt: string | null; // ISO Date string
  progress: AchievementProgress; 
  completionPercent: number;
  
  // Optional flag from backend if it's a secret achievement
  isSecret?: boolean; 
}

export interface AchievementStats {
  totalPoints: number;
  unlockedCount: number;
  totalAchievements: number;
  completionRate: string | number; // Controller returns string "XX.X"
  rank: string;
}

export interface AchievementCategoryMap {
  [category: string]: UserAchievement[];
}