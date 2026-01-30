import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { leaguesApi } from "@/lib/api/leagues.api";
import { SocketLeagueUpdate, LeagueType } from "@/types/league.types";
import { LeaguesState } from "@/types/redux.types";


const initialState: LeaguesState = {
  activeLeagues: [],
  currentLeague: null,
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
      console.log("The response of active leagues is:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch leagues");
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  "leagues/fetchLeaderboard",
  async (leagueId: string, { rejectWithValue }) => {
    try {
      const response = await leaguesApi.getLeaderboard(leagueId);
      console.log("The leaderboard is:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch leaderboard");
    }
  }
);

// ==================== SLICE ====================

const leaguesSlice = createSlice({
  name: "leagues",
  initialState,
  reducers: {
    // Switch Tabs (e.g., User clicks "Weekly")
    selectLeagueByType: (state, action: PayloadAction<LeagueType>) => {
      const league = state.activeLeagues.find(l => l.type === action.payload);
      state.currentLeague = league || null;
      // Clear leaderboard while loading new one to avoid mismatch
      state.leaderboard = []; 
    },

    // ⚡ REAL-TIME UPDATE LOGIC
    handleLeagueSocketUpdate: (state, action: PayloadAction<SocketLeagueUpdate>) => {
      const { leagueId, userId, currentValue, startingValue } = action.payload;

      // 1. Only update if the event matches the currently viewed league
      if (state.currentLeague?._id !== leagueId) return;

      // 2. Calculate new score (Profit/Loss)
      const newScore = currentValue - startingValue;

      // 3. Find if user is already in leaderboard
      const existingEntryIndex = state.leaderboard.findIndex(e => e.userId === userId);

      if (existingEntryIndex !== -1) {
        // Update existing user
        state.leaderboard[existingEntryIndex].score = newScore;
      } else {
        // (Optional) Add new user if not found - 
        // Note: You might lack 'username' here if it's a new entry from socket. 
        // For Hackathon, simpler to just ignore new users until page refresh, 
        // or fetch leaderboard again.
      }

      // 4. RE-SORT Leaderboard (High to Low)
      state.leaderboard.sort((a, b) => b.score - a.score);

      // 5. RE-CALCULATE Ranks
      state.leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      // 6. Update current user's rank reference (assuming we know currentUserId via auth slice, 
      // but here we just update the list. The UI derives 'You' from the list)
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Active Leagues ---
      .addCase(fetchActiveLeagues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.activeLeagues = action.payload.data;
        
        // Auto-select "DAILY" if available on initial load
        if (!state.currentLeague) {
          state.currentLeague = action.payload.data.find(l => l.type === "DAILY") || action.payload.data[0] || null;
        }
      })
      .addCase(fetchActiveLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Leaderboard ---
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload.data;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectLeagueByType, handleLeagueSocketUpdate } = leaguesSlice.actions;

export default leaguesSlice.reducer;