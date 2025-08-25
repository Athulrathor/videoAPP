import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

export const fetchShortByOwner = createAsyncThunk(
  'shorts/fetchByOwner',
  async (userId, { rejectWithValue }) => {
    if (userId === null || userId === undefined) return rejectWithValue('Id not found');

    try {
      const response = await axiosInstance.get(`short/get-all-short-of-owner/${userId}`);
      return response.data?.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchShortDelete = createAsyncThunk('delete/fetchShortId', async (id, { rejectWithValue }) => {
  
  if (id === null || id === undefined) return rejectWithValue("id not found!");

  try {

    const deletingShortById = await axiosInstance.post(`short/delete-short/${id}`);
    fetchShortByOwner(id);
    console.log(deletingShortById);
    return deletingShortById?.data?.data;
    
  } catch (error) {
    return rejectWithValue(error.message);
  }

});

export const fetchShort = createAsyncThunk('getShort/ShortDetailList',async (shortParams,{rejectWithValue}) => {

  try {
    const shorts = await axiosInstance.get("/short/get-all-short", {params:shortParams});
    sessionStorage.setItem("shorts", JSON.stringify(shorts.data.data.data));
    return shorts.data.data.data;
  } catch (error) {
    console.log("Error :", error.message);
    return rejectWithValue(error.message);
  }
});

// export const fetchPublishVideo = async (formData) => {
//   const data = new FormData();
//   data.append("title", formData.title);
//   data.append("description", formData.description);
//   data.append("isPublished", formData.isPublished);

//   if (formData.shortFile) data.append("shortFile", formData.shortFile);

//   await axiosInstance
//     .post("short/publish-short", data, {
//       headers: { "Content-Type": "multipart/form-data" },
//     })
//     .then((response) => {
//       console.log(response);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

export const fetchUpdateShort = createAsyncThunk('update/fetchShort', async ({id, formData}, { rejectWithValue }) => {
  if (id === null || id === undefined) return rejectWithValue("id not found!");

  if (formData === null || formData === undefined) return rejectWithValue("form data not found!");

  const data = new FormData();

  data.append("title", formData.title);
  data.append("description", formData.description);
  data.append("isPublished", formData.isPublished);

  try {

    const updateShortById = await axiosInstance.post(`short/update-short/${id}`, data,
     );
    console.log(updateShortById);
    return updateShortById?.data?.data;

  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const shortSlice = createSlice({
  name: "shorts",
  initialState: {
    short: [],
    shortLoading: false,
    shortError: null,

    isShort: false,

    shortByOwner: [],
    shortByOwnerLoading: false,
    shortByOwnerError: null,
    
    shortDeleting: false,
    shortDeleted: null,

    shortUploading: false,
    shortUploadProgress: 0,
    shortUploadingError: false,

  },
  reducers: {
    setIsShort: (state, action) => {
      state.isShort = action.payload;
    },
    clearShortError: (state) => {
      state.shortError = null;
    },
    clearShortByOwnerError: (state) => {
      state.shortByOwnerError = null;
    },
    resetShortState: (state) => {
      state.short = [];
      state.shortError = null;
      state.shortLoading = false;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },

    setAddNewShorts: (state, action) => {
      state.short = [...state, action.payload];
      state.shortByOwner = [...state, action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShort.pending, (state) => {
        state.shortLoading = true;
        state.shortError = null;
      })
      .addCase(fetchShort.fulfilled, (state, action) => {
        state.shortLoading = false;
        state.short = action.payload;
        state.shortError = null;
      })
      .addCase(fetchShort.rejected, (state, action) => {
        state.shortLoading = false;
        state.shortError = action.payload || 'Failed to fetch shorts';
      });

      builder
        .addCase(fetchShortByOwner.pending, (state) => {
          state.shortByOwnerLoading = true;
          state.shortByOwnerError = null;
        })
        .addCase(fetchShortByOwner.fulfilled, (state, action) => {
          state.shortByOwnerLoading = false;
          state.shortByOwner = action.payload;
          state.shortByOwnerError = null;
        })
        .addCase(fetchShortByOwner.rejected, (state, action) => {
          state.shortByOwnerLoading = false;
          state.shortByOwnerError = action.payload || 'Failed to fetch shorts';
        });
    
    builder
      .addCase(fetchShortDelete.pending, (state) => {
        state.shortDeleting = true;
        state.error = null;
      })
      .addCase(fetchShortDelete.fulfilled, (state, action) => {
        state.shortDeleting = false;
        state.shortByOwner = state.shortByOwner.filter(
          short => short._id !== action.payload._id
        );
        state.short = state.short.filter(
          short => short._id !== action.payload._id
        );
        state.shortDeleted = action.payload;
      })
      .addCase(fetchShortDelete.rejected, (state, action) => {
        state.shortDeleting = false;
        state.shortError = action.payload;
      });
    
    builder
      .addCase(fetchUpdateShort.pending, (state) => {
        state.shortUploading = true;
        state.shortUploadingError = null;
      })
      .addCase(fetchUpdateShort.fulfilled, (state, action) => {
        state.shortUploading = false;
        if (action.payload?._id) {
          state.shortByOwner = state.shortByOwner.map(short =>
            short._id === action.payload?._id
              ? { ...short, ...action.payload }
              : short
          );

          state.short = state.short.map(short =>
            short._id === action.payload._id
              ? { ...short, ...action.payload }
              : short
          );
        }
        state.shortUploadingError = action.payload;
      })
      .addCase(fetchUpdateShort.rejected, (state, action) => {
        state.shortUploading = false;
        state.shortUploadingError = action.payload;
      });
    }
});

export const { setIsShort,clearShortError,clearShortByOwnerError,resetShortState,setUploadProgress,setAddNewShorts} = shortSlice.actions;
export default shortSlice.reducer;
