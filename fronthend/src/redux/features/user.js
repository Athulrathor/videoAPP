import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    loading: false,
    error: false,
    token: null,
    loggedIn: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.loggedIn = true;
      state.token = action.payload.data?.accessToken || null;
    },
    logout: (state) => {
      state.user = {};
      state.loggedIn = false;
      state.token = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});



export const { login, logout, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
