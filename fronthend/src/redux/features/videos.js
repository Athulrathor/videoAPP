import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

const fetchVideos = async (dispatch, videoParams) => {
      dispatch(videoLoading(true));
  
      try {
        const response = await axiosInstance.get("/videos/get-all-videos", {
          params: videoParams,
        });
        dispatch(videos(response?.data?.data?.data));
        dispatch(videoLoading(false));
        sessionStorage.setItem("videos", JSON.stringify(response?.data?.data?.data));
      } catch (error) {
        dispatch(noVideo());
        dispatch(videoError(true));
        dispatch(videoLoading(false));
        console.log("Error :", error?.message);
      } finally {
        dispatch(videoLoading(false));
      }
}

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
export { fetchVideos };
export default videoSlice.reducer;
