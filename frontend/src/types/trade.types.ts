export interface TradeRequest {
  symbol: string;
  quantity: number;
}

export interface Trade {
  _id: string;
  userId: string;
  portfolioId: string;
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