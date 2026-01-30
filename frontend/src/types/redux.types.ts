// frontend/src/types/redux.types.ts
import { User } from "./user.types";
import { StockQuote, StockDetail, PricePoint } from "./stock.types";

import { Trade, TradeFilters, TradeHistoryResponse } from "@/types/trade.types";
import {
  AchievementCategoryMap,
  AchievementStats,
  UserAchievement,
} from "./achievement.types";
import { League, LeaderboardEntry } from "./league.types";

// ==================== AUTH STATE ====================
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ==================== PORTFOLIO STATE ====================
export interface Holding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
}

export interface PortfolioState {
  cashBalance: number;
  totalValue: number;
  holdings: Holding[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null; // Timestamp for cache invalidation
}

interface TradingState {
  trades: Trade[]; // Now uses the full definition
  totalTrades: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  activeOrder: any | null;
}
// ==================== STOCKS STATE ====================

export interface StocksState {
  // Matches /api/stocks/search (uses StockQuote with _id and currentPrice)
  searchResults: StockQuote[];
  searchLoading: boolean;

  // Matches /api/stocks/:symbol (uses StockDetail with id and price)
  selectedStock: StockDetail | null;

  // Matches /api/stocks/:symbol/history (dictionary of price points)
  stockHistory: {
    [symbol: string]: {
      [range: string]: PricePoint[];
    };
  };

  watchlist: string[]; // Array of symbols
  loading: boolean;
  error: string | null;
}

// ==================== LEAGUES STATE ====================
export interface LeaguesState {
  activeLeagues: League[];
  currentLeague: League | null; // The tab currently selected (e.g., Daily)
  leaderboard: LeaderboardEntry[];
  userRank: number | null; // Current user's rank for quick access
  loading: boolean;
  error: string | null;
}

export interface AchievementState {
  // List of all achievements with user progress
  allAchievements: UserAchievement[];

  // Just the ones recently unlocked
  recentAchievements: UserAchievement[];

  // Achievements grouped by category
  byCategory: AchievementCategoryMap;

  // User specific stats (points, counts)
  stats: AchievementStats | null;

  // Loading states
  loading: {
    all: boolean;
    stats: boolean;
    recent: boolean;
  };

  error: string | null;
}

// ==================== ROOT STATE ====================
export interface RootState {
  auth: AuthState;
  portfolio: PortfolioState;
  trading: TradingState;
  stocks: StocksState;
  leagues: LeaguesState;
  achievements: AchievementState;
}
