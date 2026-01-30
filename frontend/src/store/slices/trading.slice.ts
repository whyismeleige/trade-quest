import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tradeApi } from "@/lib/api/trade.api";
import { TradingState } from "@/types/redux.types";
import { fetchPortfolio } from "./portfolio.slice";

// ==================== INITIAL STATE ====================
const initialState: TradingState = {
  trades: [],
  loading: false,
  error: null,
  activeOrder: null,
};

// ==================== THUNKS ====================

interface BuyTradePayload {
  symbol: string;
  quantity: number;
}

export const executeBuyTrade = createAsyncThunk(
  "trading/buy",
  async (payload: BuyTradePayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await tradeApi.buy(payload);
      
      // After successful trade, refetch portfolio
      dispatch(fetchPortfolio());
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Trade execution failed");
    }
  }
);

export const executeSellTrade = createAsyncThunk(
  "trading/sell",
  async (payload: BuyTradePayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await tradeApi.sell(payload);
      
      // After successful trade, refetch portfolio
      dispatch(fetchPortfolio());
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Trade execution failed");
    }
  }
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
    addTradeToHistory: (state, action) => {
      state.trades.unshift(action.payload); // Add to beginning
    },
  },
  extraReducers: (builder) => {
    builder
      // Buy trade
      .addCase(executeBuyTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeBuyTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.trades.unshift(action.payload.data.trade);
        state.activeOrder = null;
        state.error = null;
      })
      .addCase(executeBuyTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sell trade
      .addCase(executeSellTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeSellTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.trades.unshift(action.payload.data.trade);
        state.activeOrder = null;
        state.error = null;
      })
      .addCase(executeSellTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActiveOrder, clearActiveOrder, addTradeToHistory } = tradingSlice.actions;
export default tradingSlice.reducer;