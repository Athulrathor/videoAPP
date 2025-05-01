import { createSlice } from "@reduxjs/toolkit";

export const shortSlice = createSlice({
  name: "short",
  initialState: {
    short: [],
    shortLoading: false,
    shortError: false,
    isShort: false,
  },
  reducers: {
    shorts: (state, action) => {
      state.short = action.payload;
      state.shortLoading = false;
      state.isShort = true;
    },
    noshort: (state) => {
      state.short = [];
      state.shortLoading = false;
      state.shortError = true;
      state.isShort = false;
    },
    shortLoading: (state, action) => {
      state.shortLoading = action.payload;
    },
    shortError: (state, action) => {
      state.shortError = action.payload;
    },
  },
});

export const { shorts, noshort, shortLoading, shortError } = shortSlice.actions;
export default shortSlice.reducer;
