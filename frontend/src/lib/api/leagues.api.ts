import {
  ActiveLeaguesResponse,
  LeaderboardResponse,
} from "@/types/league.types";
import { apiClient } from "./api-client";

export const leaguesApi = {
  // Get all active leagues (Daily, Weekly, Monthly)
  getActiveLeagues: () =>
    apiClient.get<ActiveLeaguesResponse>("/api/leagues/active"),

  // Get specific leaderboard data
  getLeaderboard: (leagueId: string) =>
    apiClient.get<LeaderboardResponse>(`/api/leagues/${leagueId}/leaderboard`),
};
