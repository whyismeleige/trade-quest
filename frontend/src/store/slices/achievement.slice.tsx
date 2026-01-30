// frontend/src/lib/redux/slices/achievement.slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { achievementApi } from "@/lib/api/achievement.api";
import {
  UserAchievement,
  AchievementStats,
  AchievementCategoryMap,
} from "@/types/achievement.types";
import toast from "react-hot-toast";
import { celebrateAchievement } from "@/lib/confetti";

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

const showProgressToast = (achievement: UserAchievement) => {
  if (achievement.completionPercent >= 80 && !achievement.isUnlocked) {
    toast(`${achievement.icon} ${achievement.name} is ${Math.round(achievement.completionPercent)}% complete!`, {
      id: `progress-${achievement.achievementId}`, // Prevents duplicate toasts for the same achievement
      duration: 3000,
    });
  }
};

const showAchievementToast = (achievement: UserAchievement) => {
  toast.success(
    (t) => (
      <span onClick={() => toast.dismiss(t.id)} className="cursor-pointer">
        <b>Achievement Unlocked!</b>
        <div className="text-xs opacity-80">
          {achievement.icon} {achievement.name} (+{achievement.pointsReward} XP)
        </div>
      </span>
    ),
    {
      duration: 5000,
      icon: '🎉',
      style: {
        borderRadius: '8px',
        background: '#333',
        color: '#fff',
      },
    }
  );
};

// --- Thunks ---

export const fetchUserAchievements = createAsyncThunk(
  "achievements/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementApi.getUserAchievements();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch achievements",
      );
    }
  },
);

export const fetchAchievementStats = createAsyncThunk(
  "achievements/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementApi.getStats();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats",
      );
    }
  },
);

export const fetchRecentAchievements = createAsyncThunk(
  "achievements/fetchRecent",
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await achievementApi.getRecent(limit);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recent achievements",
      );
    }
  },
);

export const fetchAchievementsByCategory = createAsyncThunk(
  "achievements/fetchByCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementApi.getByCategory();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  },
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
    resetAchievements: () => initialState,
  },
  extraReducers: (builder) => {
    // 1. Fetch All
    builder
      .addCase(fetchUserAchievements.pending, (state) => {
        state.loading.all = true;
        state.error = null;
      })
      // In frontend/src/store/slices/achievement.slice.ts
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        const previousUnlockedCount = state.allAchievements.filter(
          (a) => a.isUnlocked,
        ).length;
        const previousAchievements = state.allAchievements; // Keep a ref for comparison

        state.loading.all = false;
        state.allAchievements = action.payload;

        const currentUnlocked = action.payload.filter(
          (a: UserAchievement) => a.isUnlocked,
        );

        // Check if new achievements were unlocked
        if (currentUnlocked.length > previousUnlockedCount) {
          const newAchievements = currentUnlocked.filter(
            (a: UserAchievement) =>
              !previousAchievements.find(
                (old) =>
                  old.achievementId === a.achievementId && old.isUnlocked,
              ),
          );

          newAchievements.forEach((achievement) => {
            showAchievementToast(achievement);

            // 🎉 TRIGGER CONFETTI HERE
            // Assuming your achievement type has a 'rarity' field (e.g., 'common', 'legendary')
            celebrateAchievement(achievement.rarity || "common");
          });
        }

        // Show progress toasts
        action.payload.forEach(showProgressToast);
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
    builder.addCase(fetchAchievementsByCategory.fulfilled, (state, action) => {
      state.byCategory = action.payload;
    });
  },
});

export const { clearAchievementError, resetAchievements } =
  achievementSlice.actions;
export default achievementSlice.reducer;
