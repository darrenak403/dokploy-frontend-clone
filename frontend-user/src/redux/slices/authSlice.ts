import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  data: {
    accessToken: string | null;
    refreshToken: string | null;
    user: {
      id: number | null;
      email: string | null;
      fullName: string | null;
      role: string | null;
      address: string | null;
      gender: string | undefined;
      dateOfBirth: string | null;
      phone: string | null;
      avatarUrl: string | null;
    } | null;
  } | null;
}

const initialState: AuthState = {
  data: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        id: number;
        email: string;
        fullName: string;
        role: string;
        address?: string | null;
        gender?: string | undefined;
        dateOfBirth?: string | null;
        phone?: string | null;
        avatarUrl?: string | null;
      }>
    ) => {
      state.data = {
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        user: {
          id: action.payload.id,
          email: action.payload.email,
          fullName: action.payload.fullName,
          role: action.payload.role,
          address: action.payload.address || null,
          gender: action.payload.gender || undefined,
          dateOfBirth: action.payload.dateOfBirth || null,
          phone: action.payload.phone || null,
          avatarUrl: action.payload.avatarUrl || null,
        },
      };
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.accessToken = action.payload;
      }
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.refreshToken = action.payload;
      }
    },
    setUserData: (
      state,
      action: PayloadAction<{
        id: number;
        email: string;
        fullName: string;
        role: string;
        address: string | null;
        gender: string | undefined;
        dateOfBirth: string | null;
        phone: string | null;
        avatarUrl: string | null;
      }>
    ) => {
      if (!state.data) {
        state.data = {
          accessToken: null,
          refreshToken: null,
          user: null,
        };
      }
      state.data.user = action.payload;
    },
    clearAuth: (state) => {
      state.data = null;
    },
  },
});

export const {
  setAuth,
  setAccessToken,
  setRefreshToken,
  clearAuth,
  setUserData,
} = authSlice.actions;
export default authSlice.reducer;
