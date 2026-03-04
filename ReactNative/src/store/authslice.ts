import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  email?: string;
  name?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  first_log_in: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  isLoggedIn: false,
  first_log_in: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    removeFirstLogIn: (state) => {
      state.first_log_in = false;
    }
      ,
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      state.first_log_in = true;
    },
  },
});

export const { setAuth, clearAuth, removeFirstLogIn } = authSlice.actions;
export default authSlice.reducer;