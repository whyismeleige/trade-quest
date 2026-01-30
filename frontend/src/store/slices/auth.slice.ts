import { authApi } from "@/lib/api/auth.api";
import { AuthState } from "@/types/redux.types";
import { LoginCredentials, RegisterCredentials } from "@/types/user.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials) => {
    const response = await authApi.register(credentials);
    return response.data;
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authApi.logout();
});

export const fetchProfile = createAsyncThunk("auth/profile", async () => {
  const response = await authApi.getProfile();
  return response.data;
});

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;