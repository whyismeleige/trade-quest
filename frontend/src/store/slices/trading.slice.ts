import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tradeApi } from "@/lib/api/trade.api";
import { Trade, TradeFilters, TradeHistoryResponse } from "@/types/trade.types";
import { fetchPortfolio } from "./portfolio.slice"; // Ensure this path is correct
import toast from "react-hot-toast";

// ==================== STATE INTERFACE ====================

interface TradingState {
  trades: Trade[];
  // Pagination State
  totalTrades: number;
  currentPage: number;
  totalPages: number;

  // UI State
  loading: boolean;
  error: string | null;
  activeOrder: {
    symbol: string;
    type: "BUY" | "SELL";
    quantity: number;
    price: number;
  } | null;
}

// ==================== INITIAL STATE ====================

const initialState: TradingState = {
  trades: [],
  totalTrades: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  activeOrder: null,
};

// ==================== THUNKS ====================

export const fetchTradeHistory = createAsyncThunk(
  "trading/fetchHistory",
  async (filters: TradeFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await tradeApi.getHistory(filters);
      // FIXED: Return response.data to unwrap the Axios response
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch trade history");
    }
  },
);

interface TradePayload {
  symbol: string;
  quantity: number;
}

export const executeBuyTrade = createAsyncThunk(
  "trading/buy",
  async (payload: TradePayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await tradeApi.buy(payload);

      // Refresh portfolio balance and history after trade
      dispatch(fetchPortfolio());
      dispatch(fetchTradeHistory({ page: 1 }));

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Trade execution failed");
    }
  },
);

export const executeSellTrade = createAsyncThunk(
  "trading/sell",
  async (payload: TradePayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await tradeApi.sell(payload);

      dispatch(fetchPortfolio());
      dispatch(fetchTradeHistory({ page: 1 }));

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Trade execution failed");
    }
  },
);

// ==================== SLICE ====================

const tradingSlice = createSlice({
  name: "trading",
  initialState,
  reducers: {
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
    },
    clearActiveOrder: (state) => {
      state.activeOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch History ---
      .addCase(fetchTradeHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTradeHistory.fulfilled,
        (state, action: PayloadAction<TradeHistoryResponse>) => {
          state.loading = false;
          // Data is now correctly typed and accessible
          state.trades = action.payload.data;

          if (action.payload.pagination) {
            state.totalTrades = action.payload.pagination.total;
            state.currentPage = action.payload.pagination.page;
            state.totalPages = action.payload.pagination.pages;
          }
        },
      )
      .addCase(fetchTradeHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Buy Trade ---
      .addCase(executeBuyTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeBuyTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.activeOrder = null;
        state.error = null;
        toast.success(
          `Successfully bought ${action.meta.arg.quantity} shares!`,
          {
            icon: "🎉",
            duration: 4000,
          },
        );
      })
      .addCase(executeBuyTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Sell Trade ---
      .addCase(executeSellTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeSellTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.activeOrder = null;
        state.error = null;
        toast.success(
          `Successfully bought ${action.meta.arg.quantity} shares!`,
          {
            icon: "🎉",
            duration: 4000,
          },
        );
      })
      .addCase(executeSellTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActiveOrder, clearActiveOrder } = tradingSlice.actions;
export default tradingSlice.reducer;
