import { apiClient } from "./api-client";
import { TradeRequest, TradeResponse } from "@/types/trade.types";

export const tradeApi = {
  buy: (data: TradeRequest) => 
    apiClient.post<TradeResponse>("/api/trades/buy", data),

  sell: (data: TradeRequest) => 
    apiClient.post<TradeResponse>("/api/trades/sell", data),
};