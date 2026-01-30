import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { portfolioApi } from "@/lib/api/portfolio.api";
import { PortfolioState } from "@/types/redux.types";

// ==================== INITIAL STATE ====================
const initialState: PortfolioState = {
  cashBalance: 0,
  totalValue: 0,
  holdings: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// ==================== THUNKS ====================

export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await portfolioApi.getPortfolio();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch portfolio");
    }
  }
);

// ==================== SLICE ====================

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    // Clear portfolio on logout
    clearPortfolio: (state) => {
      state.cashBalance = 0;
      state.totalValue = 0;
      state.holdings = [];
      state.lastUpdated = null;
      state.error = null;
    },
    
    // Update single holding price (from WebSocket)
    updateHoldingPrice: (state, action) => {
      const { symbol, currentPrice } = action.payload;
      const holding = state.holdings.find((h) => h.symbol === symbol);
      if (holding) {
        holding.currentPrice = currentPrice;
        holding.currentValue = holding.quantity * currentPrice;
        holding.profitLoss = holding.currentValue - (holding.quantity * holding.averagePrice);
      }
      // Recalculate total value
      const holdingsValue = state.holdings.reduce((sum, h) => sum + h.currentValue, 0);
      state.totalValue = state.cashBalance + holdingsValue;
    },
    
    // Update cash balance after trade
    updateCashBalance: (state, action) => {
      state.cashBalance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.cashBalance = action.payload.data.cashBalance;
        state.totalValue = action.payload.data.totalValue;
        state.holdings = action.payload.data.holdings;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPortfolio, updateHoldingPrice, updateCashBalance } = portfolioSlice.actions;
export default portfolioSlice.reducer;