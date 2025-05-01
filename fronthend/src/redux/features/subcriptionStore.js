import { createSlice } from "@reduxjs/toolkit";

export const subcriberSlice = createSlice({
  name: "subscriber",
  initialState: {
    subcriber: [],
    subcriberLoading: false,
    subcriberError: false,
    issubcriber: false,
  },
  reducers: {
    subcriber: (state, action) => {
      state.subcriber = action.payload;
      state.subcriberLoading = false;
      state.issubcriber = true;
    },
    nosubcriber: (state) => {
      state.subcriber = [];
      state.subcriberLoading = false;
      state.subcriberError = true;
      state.issubcriber = false;
    },
    subcriberLoading: (state, action) => {
      state.subcriberLoading = action.payload;
    },
    subcriberError: (state, action) => {
      state.subcriberError = action.payload;
    },
  },
});

export const { subcriber, nosubcriber, subcriberLoading, subcriberError } = subcriberSlice.actions;
export default subcriberSlice.reducer;
