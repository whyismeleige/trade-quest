import { ApiResponse } from "./api.types";

export interface StockQuote {
  _id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  previousClosePrice: number;
  sector: string;
  change: number;
  changePercent: number;
}

export interface PricePoint {
  price: number;
  timestamp: string;
}

export interface StockDetail {
  id: string; // Backend uses "id" here, but "_id" in search
  symbol: string;
  name: string;
  sector: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  history?: PricePoint[]; // Included in /api/stocks/:symbol
}

// Response Wrappers
export interface SearchResponse extends ApiResponse {
  success: boolean;
  count: number;
  data: StockQuote[];
}

export interface StockDetailResponse extends ApiResponse {
  success: boolean;
  data: StockDetail;
}

export interface HistoryResponse extends ApiResponse {
  success: boolean;
  symbol: string;
  range: string;
  count: number;
  data: PricePoint[];
}