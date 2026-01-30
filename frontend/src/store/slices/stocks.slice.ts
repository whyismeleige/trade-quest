import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stocksApi } from "@/lib/api/stocks.api";
import { StocksState } from "@/types/redux.types";
import { LivePriceUpdate } from "@/types/stock.types";

const initialState: StocksState = {
  searchResults: [],
  searchLoading: false,
  selectedStock: null,
  stockHistory: {},
  watchlist: [],
  loading: false,
  error: null,
};

// ==================== THUNKS ====================

export const searchStocks = createAsyncThunk(
  "stocks/search",
  async (query: string, { rejectWithValue }) => {
    try {
      // Returns SearchResponse
      return await stocksApi.search(query);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  }
);

export const fetchStockDetails = createAsyncThunk(
  "stocks/details",
  async (symbol: string, { rejectWithValue }) => {
    try {
      // Returns StockDetailResponse
      return await stocksApi.getDetails(symbol);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch details"
      );
    }
  }
);

export const fetchStockHistory = createAsyncThunk(
  "stocks/history",
  async (
    { symbol, range }: { symbol: string; range: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await stocksApi.getHistory(symbol, range);
      // response is HistoryResponse, we want to return the data array specifically
      return { symbol, range, points: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch history"
      );
    }
  }
);

// ==================== SLICE ====================

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<string>) => {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter((s) => s !== action.payload);
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    
    // ⚡ UPDATED: Handles bulk updates from Socket
    updateLivePrices: (state, action: PayloadAction<LivePriceUpdate[]>) => {
      const updates = action.payload;

      updates.forEach((update) => {
        // 1. Update Search Results / List View
        const listItem = state.searchResults.find((s) => s.symbol === update.symbol);
        if (listItem) {
          listItem.currentPrice = update.price;
          // Recalculate stats for the UI
          if (listItem.previousClosePrice) {
            const diff = update.price - listItem.previousClosePrice;
            listItem.change = diff;
            listItem.changePercent = (diff / listItem.previousClosePrice) * 100;
          }
        }

        // 2. Update Selected Stock (Detail View)
        if (state.selectedStock && state.selectedStock.symbol === update.symbol) {
          state.selectedStock.price = update.price;
          state.selectedStock.lastUpdated = new Date().toISOString();

          if (state.selectedStock.previousClose) {
            const diff = update.price - state.selectedStock.previousClose;
            state.selectedStock.change = diff;
            state.selectedStock.changePercent =
              (diff / state.selectedStock.previousClose) * 100;
          }

          // 3. Update History Graph (Adds real-time feel to chart)
          // We only update "1D" history live
          if (state.stockHistory[update.symbol]) {
            const historyArr = state.stockHistory[update.symbol]["1D"];
            if (historyArr) {
              historyArr.push({
                price: update.price,
                timestamp: new Date().toISOString(),
              });
              // Keep frontend array small to prevent memory leaks/performance issues
              if (historyArr.length > 500) historyArr.shift();
            }
          }
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(searchStocks.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchStocks.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchStocks.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload as string;
      })
      // Details
      .addCase(fetchStockDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStock = action.payload.data;
      })
      // History
      .addCase(fetchStockHistory.fulfilled, (state, action) => {
        const { symbol, range, points } = action.payload;
        if (!state.stockHistory[symbol]) {
          state.stockHistory[symbol] = {};
        }
        state.stockHistory[symbol][range] = points;
      });
  },
});

export const {
  addToWatchlist,
  removeFromWatchlist,
  clearSearchResults,
  updateLivePrices,
} = stocksSlice.actions;

export default stocksSlice.reducer;