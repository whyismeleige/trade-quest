import { ApiResponse } from "./api.types";

export interface Holding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
}

export interface PortfolioData {
  cashBalance: number;
  totalValue: number;
  holdings: Holding[];
}

export interface PortfolioResponse extends ApiResponse {
  data: PortfolioData;
}