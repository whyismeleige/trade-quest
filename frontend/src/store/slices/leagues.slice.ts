import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { leaguesApi } from "@/lib/api/leagues.api";
import { LeaguesState } from "@/types/redux.types";

// ==================== INITIAL STATE ====================
const initialState: LeaguesState = {
  activeLeagues: [],
  selectedLeague: null,
  leaderboard: [],
  userRank: null,
  loading: false,
  error: null,
};

// ==================== THUNKS ====================

export const fetchActiveLeagues = createAsyncThunk(
  "leagues/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaguesApi.getActiveLeagues();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch leagues");
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  "leagues/fetchLeaderboard",
  async (leagueId: string, { rejectWithValue }) => {
    try {
      const response = await leaguesApi.getLeaderboard(leagueId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch leaderboard");
    }
  }
);

// ==================== SLICE ====================

const leaguesSlice = createSlice({
  name: "leagues",
  initialState,
  reducers: {
    selectLeague: (state, action) => {
      state.selectedLeague = action.payload;
    },
    updateLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
    },
    updateUserRank: (state, action) => {
      state.userRank = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Active leagues
      .addCase(fetchActiveLeagues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.activeLeagues = action.payload.data;
      })
      .addCase(fetchActiveLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload.data;
        
        // Find user's rank
        const userEntry = action.payload.data.find(
          (entry: any) => entry.userId === state.userRank // Assuming we have userId
        );
        state.userRank = userEntry?.rank || null;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectLeague, updateLeaderboard, updateUserRank } = leaguesSlice.actions;
export default leaguesSlice.reducer;