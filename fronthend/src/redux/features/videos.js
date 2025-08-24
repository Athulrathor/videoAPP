import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

export const fetchVideoByOwner = createAsyncThunk(
  'videos/fetchByOwner',
  async (Id, { rejectWithValue }) => {
    if (Id === null || Id === undefined) return rejectWithValue('Id not found');

    try {
      const response = await axiosInstance.get(`videos/get-all-videos-of-owner/${Id}`);
      return response.data?.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVideos = createAsyncThunk('getVideo/videoDetailsList', async(videoParams,{rejectWithValue}) => {
  if (!videoParams) return rejectWithValue("Video params not found!");

      try {
        const videos = await axiosInstance.get("/videos/get-all-videos",{params: videoParams});
        sessionStorage.setItem("videos", JSON.stringify(videos?.data?.data?.data));
        console.log(videos)
        return videos?.data?.data?.data;
      } catch (error) {
        console.log("Error :", error?.message);
        return rejectWithValue(error.message);
      }
})

export const fetchVideosById = createAsyncThunk('getVideo/videoDetails', async (id, { rejectWithValue }) => {
  if (!id) return rejectWithValue("Video Id not found!");

  try {
    const videoById = await axiosInstance.post(`videos/get-video/${id}`);
    console.log(videoById?.data)
    return videoById?.data?.data[0];
  } catch (error) {
    console.log("Error :", error?.message);
    return rejectWithValue(error.message);
  }
})

export const fetchVideoDelete = createAsyncThunk('delete/fetchvideoId', async (id, { rejectWithValue }) => {
  
  if (id === null || id === undefined) return rejectWithValue("id not found!");

  try {

    const deletingVideoById = await axiosInstance.post(`videos/delete-video/${id}`);
    return deletingVideoById?.data?.data?._id;
    
  } catch (error) {
    return rejectWithValue(error.message);
  }

});

export const fetchUpdateVideo = createAsyncThunk(
  'update/fetchVideos',
  async ({ id, formData,newThumbnail }, { rejectWithValue }) => {

    if (id == null) return rejectWithValue("id not found!");

    if (formData == null) return rejectWithValue("form data not found!");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("isPublished", formData.isPublished);

    if (newThumbnail) data.append("newThumbnail", newThumbnail);

    try {
      const response = await axiosInstance.post(`videos/update-video/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
});

export const fetchViewCounter = createAsyncThunk('viewCounter/videosDetails', async (id,{rejectWithValue}) => {
  if (!id) return rejectWithValue('Video id not found!');

  try {

    await axiosInstance.get(`videos/view-counter/${id}`);

    console.log("View Counted successfullly!");
    
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchVideosSuggestion = createAsyncThunk('suggestion/videosSearchParams', async (param, { rejectWithValue }) => {

  try {

    const VideosSuggestion = await axiosInstance.get("videos/get-all-suggestion", {params:param});

    console.log(VideosSuggestion?.data?.data);
    return VideosSuggestion?.data?.data

  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const videoSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    videoLoading: false,
    videoError: false,

    targetVideo: [],
    targetVideoLoading: false,
    targetVideoError:false,

    videoByOwner: [],
    videoByOwnerLoading: true,
    videoByOwnerError: false,

    videoDeleted: null,

    videoUpdate: null,
    
    suggestionLoading:false,
    getsuggestion: "",
    suggestionError: null,
  },
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.videoLoading = true;
        state.videoError = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.videoLoading = false;
        state.videos = action.payload;
        state.videoError = null;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.videoLoading = false;
        state.videoError = action.payload || 'Failed to fetch videos';
        state.videos = [];
      });

    builder
      .addCase(fetchVideoByOwner.pending, (state) => {
        state.videoByOwnerLoading = true;
      })
      .addCase(fetchVideoByOwner.fulfilled, (state, action) => {
        state.videoByOwnerLoading = false;
        state.videoByOwner = action.payload;
      })
      .addCase(fetchVideoByOwner.rejected, (state, action) => {
        state.videoByOwnerLoading = false;
        state.videoByOwnerError = action.payload || 'Failed to fetch videos';
      });
    
    builder
      .addCase(fetchVideosById.pending, (state) => {
        state.targetVideoLoading = true;
        state.targetVideoError = null;
      })
      .addCase(fetchVideosById.fulfilled, (state, action) => {
        state.targetVideoLoading = false;
        state.targetVideo = action.payload;
        state.targetVideoError = null;
      })
      .addCase(fetchVideosById.rejected, (state, action) => {
        state.targetVideoLoading = false;
        state.targetVideoError = action.payload || 'Failed to fetch videos';
        state.targetVideo = [];
      });
    

    builder.addCase(fetchVideoDelete.fulfilled, (state, action) => {
      state.videoByOwner = state.videoByOwner.filter(
        video => video._id !== action.payload
      );
    }).addCase(fetchVideoDelete.rejected, (state, action) => {
      state.videoDeleted = action.payload;
    });

    builder
      .addCase(fetchVideosSuggestion.pending, (state) => {
        state.suggestionLoading = true;
      })
      .addCase(fetchVideosSuggestion.fulfilled, (state, action) => {
        state.suggestionLoading = false;
        state.getsuggestion = action.payload;
    }).addCase(fetchVideosSuggestion.rejected, (state, action) => {
      state.suggestionLoading = false;
      state.suggestionError = action.payload;
    });
  },
});

export const { setUploadProgress, videoLoading, targetVideo, videoError,videos } = videoSlice.actions;
export default videoSlice.reducer;
