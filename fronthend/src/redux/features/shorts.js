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

export const fetchPublishVideo = async (formData) => {
  const data = new FormData();
  data.append("title", formData.title);
  data.append("description", formData.description);
  data.append("isPublished", formData.isPublished);

  if (formData.shortFile) data.append("shortFile", formData.shortFile);

  await axiosInstance
    .post("short/publish-short", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

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
    shortError: false,

    isShort: false,

    shortByOwner: [],
    shortByOwnerLoading: true,
    shortByOwnerError:false,
  },
  reducers: {
    
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
    }
});

export const {
  shortLoading,short
} = shortSlice.actions;
export default shortSlice.reducer;
