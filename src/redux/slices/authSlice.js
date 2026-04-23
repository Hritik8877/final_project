import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Stores { uid, email, displayName, role }
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearAuthUser: (state) => {
      state.user = null;
      state.loading = false;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAuthUser, clearAuthUser, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
