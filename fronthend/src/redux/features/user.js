import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    loading: false,
    error: false,
    token: null,
    loggedIn: false,
    sideActive: "home",
    settingsActive:"Accounts",
  },
  reducers: {
    setSideActive: (state, action) => {
      state.sideActive = action.payload;
    },
    setSettingsActive:(state, action) => {
      state.settingsActive = action.payload;
    },
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



export const { login, logout, setLoading, setError, setSideActive,setSettingsActive } =
  userSlice.actions;
export default userSlice.reducer;
