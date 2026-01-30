import { apiClient } from "./api-client";
import { TradeRequest, TradeResponse, TradeHistoryResponse, TradeFilters } from "@/types/trade.types";

export const tradeApi = {
  buy: (data: TradeRequest) => 
    apiClient.post<TradeResponse>("/api/trades/buy", data),

  sell: (data: TradeRequest) => 
    apiClient.post<TradeResponse>("/api/trades/sell", data),

  // Added getHistory to fetch the list
  getHistory: (filters?: TradeFilters) => {
    const params = new URLSearchParams();
    if (filters?.symbol) params.append("symbol", filters.symbol);
    if (filters?.type && filters.type !== "all") params.append("type", filters.type);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    return apiClient.get<TradeHistoryResponse>(`/api/trades?${params.toString()}`);
  }
};