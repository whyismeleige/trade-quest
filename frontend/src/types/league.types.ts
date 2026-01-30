import { ApiResponse } from "./api.types"; // Assuming you have a base response type

export type LeagueType = "DAILY" | "WEEKLY" | "MONTHLY";

export interface League {
  _id: string;
  name: string;
  type: LeagueType;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number; // This is the Profit/Loss
  rank: number;
  // Optional fields for UI richness (if you add them to backend later)
  avatar?: string;
  winRate?: number;
  trades?: number;
}

// What the Socket emits to us
export interface SocketLeagueUpdate {
  leagueId: string;
  userId: string;
  currentValue: number;
  startingValue: number;
}

// API Response Wrappers
export interface ActiveLeaguesResponse extends ApiResponse {
  data: League[];
}

export interface LeaderboardResponse extends ApiResponse {
  data: LeaderboardEntry[];
}