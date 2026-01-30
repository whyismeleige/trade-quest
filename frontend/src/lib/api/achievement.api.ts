// frontend/src/lib/api/achievement.api.ts
import { apiClient } from "./api-client"; // Assuming your axios instance
import { UserAchievement, AchievementStats, AchievementCategoryMap } from "@/types/achievement.types";

export const achievementApi = {
  // Get all achievements with merged user progress
  getUserAchievements: () => 
    apiClient.get<{ success: boolean; count: number; data: UserAchievement[] }>("/api/achievements"),

  // Get summary stats
  getStats: () => 
    apiClient.get<{ success: boolean; data: AchievementStats }>("/api/achievements/stats"),

  // Get recent unlocks
  getRecent: (limit: number = 5) => 
    apiClient.get<{ success: boolean; count: number; data: Partial<UserAchievement>[] }>(`/api/achievements/recent?limit=${limit}`),

  // Get achievements grouped by category
  getByCategory: () => 
    apiClient.get<{ success: boolean; data: AchievementCategoryMap }>("/api/achievements/categories"),
    
  // Manual check trigger (useful for debugging or specific actions)
  checkAchievements: (type: string, data?: any) =>
    apiClient.post<{ success: boolean; count: number; data: UserAchievement[] }>("/api/achievements/check", { type, data }),
};