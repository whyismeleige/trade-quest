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

// ==================== THUNKS (Unchanged & Verified) ====================

export const searchStocks = createAsyncThunk(
  "stocks/search",
  async (query: string, { rejectWithValue }) => {
    try {
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
      return await stocksApi.getDetails(symbol);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch details");
    }
  }
);

export const fetchStockHistory = createAsyncThunk(
  "stocks/history",
  async ({ symbol, range }: { symbol: string; range: string }, { rejectWithValue }) => {
    try {
      const response = await stocksApi.getHistory(symbol, range);
      return { symbol, range, points: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch history");
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
    
    // ⚡ CRITICAL: The Real-Time Engine
    // ⚡ STRICT LIVE UPDATE REDUCER
    updateLivePrices: (state, action: PayloadAction<LivePriceUpdate[]>) => {
      const updates = action.payload;

      updates.forEach((update) => {
        // 1. Update List View & Header Price (Global State)
        // We always update these so the price in the header is live
        const listItem = state.searchResults.find((s) => s.symbol === update.symbol);
        if (listItem) listItem.currentPrice = update.price;

        if (state.selectedStock && state.selectedStock.symbol === update.symbol) {
          state.selectedStock.price = update.price;
          // Calculate change for the header badge
          if (state.selectedStock.previousClose) {
            const diff = update.price - state.selectedStock.previousClose;
            state.selectedStock.change = diff;
            state.selectedStock.changePercent = (diff / state.selectedStock.previousClose) * 100;
          }
        }

        // 2. CHART DATA UPDATE - STRICTLY "1D" ONLY
        // We ONLY touch the "1D" array. We NEVER touch 1W, 1M, or 1Y.
        // This ensures historical charts remain static and don't get overwritten.
        if (state.stockHistory[update.symbol]) {
            const oneDayHistory = state.stockHistory[update.symbol]["1D"];
            
            // Only update if the 1D array actually exists
            if (Array.isArray(oneDayHistory)) {
                oneDayHistory.push({
                    price: update.price,
                    timestamp: update.timestamp || new Date().toISOString(),
                });

                // Prevent memory leaks / infinite growth
                if (oneDayHistory.length > 500) {
                    oneDayHistory.shift();
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
        // When user switches range, we replace the data entirely
        // This ensures a clean state before live updates resume
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