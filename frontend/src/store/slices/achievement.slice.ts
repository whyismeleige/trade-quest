// frontend/src/lib/redux/slices/achievement.slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { achievementApi } from "@/lib/api/achievement.api";
import { UserAchievement, AchievementStats, AchievementCategoryMap } from "@/types/achievement.types";

// --- Types for State ---
export interface AchievementState {
  allAchievements: UserAchievement[];
  recentAchievements: Partial<UserAchievement>[]; // Recent endpoint returns a subset of fields
  byCategory: AchievementCategoryMap;
  stats: AchievementStats | null;
  loading: {
    all: boolean;
    stats: boolean;
    recent: boolean;
  };
  error: string | null;
}

// --- Thunks ---

export const fetchUserAchievements = createAsyncThunk(
  "achievements/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementApi.getUserAchievements();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch achievements");
    }
  }
);

export const fetchAchievementStats = createAsyncThunk(
  "achievements/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementApi.getStats();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const fetchRecentAchievements = createAsyncThunk(
  "achievements/fetchRecent",
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await achievementApi.getRecent(limit);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch recent achievements");
    }
  }
);

export const fetchAchievementsByCategory = createAsyncThunk(
  "achievements/fetchByCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementApi.getByCategory();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
  }
);

// --- Initial State ---

const initialState: AchievementState = {
  allAchievements: [],
  recentAchievements: [],
  byCategory: {},
  stats: null,
  loading: {
    all: false,
    stats: false,
    recent: false,
  },
  error: null,
};

// --- Slice ---

const achievementSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    clearAchievementError: (state) => {
      state.error = null;
    },
    resetAchievements: () => initialState
  },
  extraReducers: (builder) => {
    // 1. Fetch All
    builder
      .addCase(fetchUserAchievements.pending, (state) => {
        state.loading.all = true;
        state.error = null;
      })
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.loading.all = false;
        state.allAchievements = action.payload;
      })
      .addCase(fetchUserAchievements.rejected, (state, action) => {
        state.loading.all = false;
        state.error = action.payload as string;
      });

    // 2. Fetch Stats
    builder
      .addCase(fetchAchievementStats.pending, (state) => {
        state.loading.stats = true;
      })
      .addCase(fetchAchievementStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchAchievementStats.rejected, (state) => {
        state.loading.stats = false;
      });

    // 3. Fetch Recent
    builder
      .addCase(fetchRecentAchievements.pending, (state) => {
        state.loading.recent = true;
      })
      .addCase(fetchRecentAchievements.fulfilled, (state, action) => {
        state.loading.recent = false;
        state.recentAchievements = action.payload;
      })
      .addCase(fetchRecentAchievements.rejected, (state) => {
        state.loading.recent = false;
      });

    // 4. Fetch By Category
    builder
      .addCase(fetchAchievementsByCategory.fulfilled, (state, action) => {
        state.byCategory = action.payload;
      });
  },
});

export const { clearAchievementError, resetAchievements } = achievementSlice.actions;
export default achievementSlice.reducer;