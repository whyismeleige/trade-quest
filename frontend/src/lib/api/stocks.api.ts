import { apiClient } from "./api-client";
import { 
  SearchResponse, 
  StockDetailResponse, 
  HistoryResponse 
} from "@/types/stock.types";

export const stocksApi = {
  search: (query: string) => 
    apiClient.get<SearchResponse>(`/api/stocks/search`, { 
      params: { q: query } 
    }).then(res => res.data), // Extract data here for cleaner thunks

  getDetails: (symbol: string) => 
    apiClient.get<StockDetailResponse>(`/api/stocks/${symbol}`)
      .then(res => res.data),

  getHistory: (symbol: string, range: string) => 
    apiClient.get<HistoryResponse>(`/api/stocks/${symbol}/history`, { 
      params: { range } 
    }).then(res => res.data),
};