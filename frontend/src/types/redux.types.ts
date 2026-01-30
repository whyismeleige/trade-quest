// frontend/src/types/redux.types.ts
import { User } from "./user.types";
import { StockQuote, StockDetail, PricePoint } from "./stock.types";

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

import { Trade, TradeFilters, TradeHistoryResponse } from "@/types/trade.types";

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

export interface LeaguesState {
  activeLeagues: League[];
  selectedLeague: League | null;
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  loading: boolean;
  error: string | null;
}

// ==================== ROOT STATE ====================
export interface RootState {
  auth: AuthState;
  portfolio: PortfolioState;
  trading: TradingState;
  stocks: StocksState;
  leagues: LeaguesState;
}