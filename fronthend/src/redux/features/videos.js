import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    videoLoading: false,
    videoError: false,
    isVideo:false
  },
  reducers: {
    videos: (state, action) => {
          state.videos = action.payload;
          state.videoLoading = false;
          state.isVideo = true;
      },
    noVideo: (state) => {
        state.videos = [];
        state.videoLoading = false;
        state.videoError = true;
        state.isVideo = false;  
      },
    videoLoading: (state, action) => {
          state.videoLoading = action.payload;
      },
    videoError: (state, action) => {
          state.videoError = action.payload;
      },
  },
});

export const { videos, noVideo, videoLoading, videoError } = videoSlice.actions;
export default videoSlice.reducer;
