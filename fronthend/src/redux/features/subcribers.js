import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

export const fetchSubcribeToggle = createAsyncThunk('toggle/subcriberUser', async (id,{rejectWithValue}) => {
  if (!id) return rejectWithValue('User Id not found!');

  try {
    await axiosInstance.get(`subcriber/toggle-subcriber/${id}`);

    console.log("Subcribed Successfully!");
  } catch (error) {
    console.log(error)
    return rejectWithValue(error.message);
  }
});

export const isSubcribed = createAsyncThunk(
  'isSubcriibed/UserSubcribers',
  async (id, { rejectWithValue }) => {

    if (!id) return rejectWithValue("Id not found!");

    try {

      const isSubcribed = await axiosInstance.get(`subcriber/is-subcribed/${id}`);
      return isSubcribed?.data?.data;

    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubcriberList = async (userId) => {
  try {
    const subcribe = await axiosInstance.get(
      `subcriber/get-subcriber/${userId}`
    );

    console.log(subcribe);
  } catch (error) {
    console.error(error);
  }
};

export const fetchSubcribedList = async (userId) => {
  try {
    const subcribe = await axiosInstance.get(
      `subcriber/get-subcribed/${userId}`
    );

    console.log(subcribe);
  } catch (error) {
    console.error(error);
  }
};

export const userSubcribers = createAsyncThunk('subcribers/userSubcribe', async (rejectWithValue) => {
  try {
    const subcriber = await axiosInstance.get(`subcriber/get-subcriber`);
    console.log(subcriber?.data?.data)
    return subcriber?.data?.data;
  } catch (error) {
    console.error(error)
    return rejectWithValue(error.message);
  }
});

export const subcribedUserContent = createAsyncThunk('subcribedContentList/UserSubcribedContent', async ({ rejectWithValue }) => {
  
  try {
    const subcribedContent = await axiosInstance.get(`subcriber/get-subcribers-videos-and-short`);
    console.log(subcribedContent?.data?.data?.data)
    return subcribedContent?.data?.data?.data;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.message);
  }
});

export const subcriberSlice = createSlice({
  name: "subscriber",
  initialState: {
    subcriber: [],
    subcriberLoading: false,
    subcriberError: false,

    isSubcriber: false,
    isSubcribedStatus: false,

    subcribedContent: [],
    subcribedContentLoading: false,
    subcribedContentError: null
  },
  reducers: {
    subcriber: (state, action) => {
      state.subcriber = action.payload;
      state.subcriberLoading = false;
      state.isSubcriber = true;
    },
    nosubcriber: (state) => {
      state.subcriber = [];
      state.subcriberLoading = false;
      state.subcriberError = true;
      state.isSubcriber = false;
    },
    subcriberLoading: (state, action) => {
      state.subcriberLoading = action.payload;
    },
    subcriberError: (state, action) => {
      state.subcriberError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(isSubcribed.pending, () => {
      })
      .addCase(isSubcribed.fulfilled, (state, action) => {
        state.isSubcribedStatus = action.payload;
      })
      .addCase(isSubcribed.rejected, () => {
      })
    
    builder
      .addCase(userSubcribers.pending, (state) => {
        state.subcriberLoading = true;
      })
      .addCase(userSubcribers.fulfilled, (state, action) => {
        state.subcriber = action.payload;
        state.subcriberLoading = false;
      })
      .addCase(userSubcribers.rejected, (state, action) => {
        state.subcriberLoading = false;
        state.subcriberError = action.payload;
      })
    
    builder
      .addCase(subcribedUserContent.pending, (state) => {
        state.subcribedContentLoading = true;
      })
      .addCase(subcribedUserContent.fulfilled, (state, action) => {
        state.subcribedContent = action.payload;
        state.subcribedContentLoading = false;
      })
      .addCase(subcribedUserContent.rejected, (state, action) => {
        state.subcribedContentLoading = false;
        state.subcribedContentError = action.payload;
      })
  }
});

export const { subcriber, nosubcriber, subcriberLoading, subcriberError } = subcriberSlice.actions;
export default subcriberSlice.reducer;
