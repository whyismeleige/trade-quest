export interface TradeRequest {
  symbol: string;
  quantity: number;
}

export interface Trade {
  _id: string;
  userId: string;       // Added back
  portfolioId: string;  // Added back
  symbol: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  totalCost: number;
  executedAt: string;
}

export interface TradeResponse {
  success: boolean;
  data: {
    trade: Trade;
    newBalance: number;
  };
}

// Params for filtering
export interface TradeFilters {
  symbol?: string;
  type?: string;
  page?: number;
  limit?: number;
}

// Response structure for the list
export interface TradeHistoryResponse {
  success: boolean;
  count: number;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
  data: Trade[];
}