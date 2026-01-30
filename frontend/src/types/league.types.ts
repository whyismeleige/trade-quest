import { ApiResponse } from "./api.types";

export interface League {
  _id: string;
  name: string;
  type: "DAILY" | "WEEKLY" | "MONTHLY";
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
}

// Helper types for API responses
export interface LeaguesResponse extends ApiResponse{
  data: League[];
}

export interface LeaderboardResponse extends ApiResponse{
  data: LeaderboardEntry[];
}