import { apiClient } from "./api-client";
import { LeaguesResponse, LeaderboardResponse } from "@/types/league.types";

export const leaguesApi = {
  getActiveLeagues: () => 
    apiClient.get<LeaguesResponse>("/api/leagues/active"),

  getLeaderboard: (leagueId: string) => 
    apiClient.get<LeaderboardResponse>(`/api/leagues/${leagueId}/leaderboard`),
};