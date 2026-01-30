import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import sessionStorage from "redux-persist/lib/storage/session"; // sessionStorage
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/auth.slice";
import portfolioReducer from "./slices/portfolio.slice";
import tradingReducer from "./slices/trading.slice";
import stocksReducer from "./slices/stocks.slice";
import leaguesReducer from "./slices/leagues.slice";
import achievementReducer from "./slices/achievement.slice";

// ==================== PERSIST CONFIGURATIONS ====================

// Auth: Persist user and authentication status
const authPersistConfig = {
  key: "auth",
  storage, // localStorage (survives browser restart)
  whitelist: ["user", "isAuthenticated"], // Only persist these fields
  // DON'T persist: loading, error (should be reset on page load)
};

// Portfolio: Use sessionStorage (cleared on browser close)
const portfolioPersistConfig = {
  key: "portfolio",
  storage: sessionStorage, // sessionStorage (cleared on browser close)
  whitelist: ["cashBalance", "totalValue", "holdings"],
  // Cache for 5 minutes, then refetch
  // We'll implement cache invalidation in the slice
};

// Trading: DON'T persist (always fresh data)
// Trades should be fetched from API on mount

// Stocks: Persist watchlist only
const stocksPersistConfig = {
  key: "stocks",
  storage, // localStorage
  whitelist: ["watchlist"], // Only persist user's watchlist
  // DON'T persist: searchResults, selectedStock, stockHistory
};

// Leagues: DON'T persist (always fresh data)
// Leaderboard changes frequently, always fetch from API

// ==================== PERSISTED REDUCERS ====================

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedPortfolioReducer = persistReducer(
  portfolioPersistConfig,
  portfolioReducer,
);
const persistedStocksReducer = persistReducer(
  stocksPersistConfig,
  stocksReducer,
);

// ==================== ROOT REDUCER ====================

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  portfolio: persistedPortfolioReducer,
  trading: tradingReducer, // Not persisted
  stocks: persistedStocksReducer,
  leagues: leaguesReducer, // Not persisted
  achievements: achievementReducer,
});

// ==================== STORE CONFIGURATION ====================

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
