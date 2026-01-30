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
    
    // ✅ FINAL FIX: Properly handle socket updates without corrupting historical data
    updateLivePrices: (state, action: PayloadAction<LivePriceUpdate[]>) => {
      const updates = action.payload;

      updates.forEach((update) => {
        // 1. Update Search Results / List View
        const listItem = state.searchResults.find((s) => s.symbol === update.symbol);
        if (listItem) {
          listItem.currentPrice = update.price;
          
          // Use the change from socket data
          if (update.change !== undefined) {
            listItem.change = update.change;
            // Calculate percent from absolute change
            if (listItem.previousClosePrice && listItem.previousClosePrice !== 0) {
              listItem.changePercent = (update.change / listItem.previousClosePrice) * 100;
            }
          }
        }

        // 2. Update Selected Stock (Detail View) - CRITICAL FIX
        if (state.selectedStock && state.selectedStock.symbol === update.symbol) {
          // Store the old price for comparison
          const oldPrice = state.selectedStock.price;
          
          // Update the price
          state.selectedStock.price = update.price;
          state.selectedStock.lastUpdated = new Date().toISOString();

          // Calculate change metrics
          if (state.selectedStock.previousClose && state.selectedStock.previousClose !== 0) {
            const diff = update.price - state.selectedStock.previousClose;
            state.selectedStock.change = diff;
            state.selectedStock.changePercent = (diff / state.selectedStock.previousClose) * 100;
          } else if (update.change !== undefined) {
            // Fallback: use change from socket if previousClose is not available
            state.selectedStock.change = update.change;
            if (oldPrice !== 0) {
              state.selectedStock.changePercent = (update.change / oldPrice) * 100;
            }
          }
        }

        // 3. ✅ DO NOT MODIFY stockHistory HERE
        // Historical data remains untouched by live updates
        // The chart component will handle visualization of live prices
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
        state.error = null;
      })
      .addCase(fetchStockDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStock = action.payload.data;
      })
      .addCase(fetchStockDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // History - CRITICAL: This is the ONLY place where stockHistory is modified
      .addCase(fetchStockHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { symbol, range, points } = action.payload;
        
        // Initialize the nested object if needed
        if (!state.stockHistory[symbol]) {
          state.stockHistory[symbol] = {};
        }
        
        // ✅ CRITICAL: Completely replace the data for this symbol+range
        // This ensures fresh data every time, no stale data pollution
        state.stockHistory[symbol][range] = points;
      })
      .addCase(fetchStockHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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