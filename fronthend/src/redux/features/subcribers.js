import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

export const fetchSubcribeToggle = createAsyncThunk(
  'toggle/subcriberUser',
  async (id, { rejectWithValue, getState }) => {
    if (!id) return rejectWithValue('User ID not found!');

    try {
      const response = await axiosInstance.get(`subcriber/toggle-subcriber/${id}`);

      const currentState = getState().subscriber;
      const wasSubscribed = currentState.isSubcribedStatus;

      return {
        userId: id,
        isSubscribed: !wasSubscribed,
        message: response?.data?.message || "Toggle successful"
      };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const isSubcribed = createAsyncThunk(
  'isSubcriibed/UserSubcribers',
  async (id, { rejectWithValue }) => {
    if (!id) return rejectWithValue("ID not found!");

    try {
      const response = await axiosInstance.get(`subcriber/is-subcribed/${id}`);
      return {
        userId: id,
        isSubscribed: response?.data?.data
      };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const fetchSubcriberList = createAsyncThunk(
  'subscribers/getSubscriberList',
  async (userId, { rejectWithValue }) => {
    if (!userId) return rejectWithValue("User ID not found!");

    try {
      const response = await axiosInstance.get(`subcriber/get-subcriber/${userId}`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const fetchSubcribedList = createAsyncThunk(
  'subscribers/getSubscribedList',
  async (userId, { rejectWithValue }) => {
    if (!userId) return rejectWithValue("User ID not found!");

    try {
      const response = await axiosInstance.get(`subcriber/get-subcribed/${userId}`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const userSubcribers = createAsyncThunk(
  'subcribers/userSubcribe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`subcriber/get-subcriber`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const subcribedUserContent = createAsyncThunk(
  'subcribedContentList/UserSubcribedContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`subcriber/get-subcribers-videos-and-short`);
      return response?.data?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const subcriberSlice = createSlice({
  name: "subscriber",
  initialState: {
    subcriber: [],
    subcriberLoading: false,
    subcriberError: null,

    isSubcribedStatus: false,
    checkingSubscription: false,
    subscriptionError: null,

    subcribedContent: [],
    subcribedContentLoading: false,
    subcribedContentError: null,

    togglingSubscription: false,
    toggleError: null,

    subscriberList: [],
    subscriberListLoading: false,
    subscriberListError: null,

    subscribedList: [],
    subscribedListLoading: false,
    subscribedListError: null,
  },
  reducers: {
    clearSubscriptionError: (state) => {
      state.subscriptionError = null;
    },
    clearToggleError: (state) => {
      state.toggleError = null;
    },
    resetSubscriptionState: (state) => {
      state.isSubcribedStatus = false;
      state.subscriptionError = null;
    },
    subcriber: (state, action) => {
      state.subcriber = action.payload;
      state.subcriberLoading = false;
      state.subcriberError = null;
    },
    nosubcriber: (state) => {
      state.subcriber = [];
      state.subcriberLoading = false;
      state.subcriberError = "No subscribers found";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(isSubcribed.pending, (state) => {
        state.checkingSubscription = true;
        state.subscriptionError = null;
      })
      .addCase(isSubcribed.fulfilled, (state, action) => {
        state.checkingSubscription = false;
        state.isSubcribedStatus = action.payload.isSubscribed;
        state.subscriptionError = null;
      })
      .addCase(isSubcribed.rejected, (state, action) => {
        state.checkingSubscription = false;
        state.subscriptionError = action.payload || "Failed to check subscription";
      });

    builder
      .addCase(fetchSubcribeToggle.pending, (state) => {
        state.togglingSubscription = true;
        state.toggleError = null;
      })
      .addCase(fetchSubcribeToggle.fulfilled, (state, action) => {
        state.togglingSubscription = false;
        state.isSubcribedStatus = action.payload.isSubscribed;
        state.toggleError = null;
      })
      .addCase(fetchSubcribeToggle.rejected, (state, action) => {
        state.togglingSubscription = false;
        state.toggleError = action.payload || "Failed to toggle subscription";
      });

    builder
      .addCase(userSubcribers.pending, (state) => {
        state.subcriberLoading = true;
        state.subcriberError = null;
      })
      .addCase(userSubcribers.fulfilled, (state, action) => {
        state.subcriber = action.payload;
        state.subcriberLoading = false;
        state.subcriberError = null;
      })
      .addCase(userSubcribers.rejected, (state, action) => {
        state.subcriberLoading = false;
        state.subcriberError = action.payload || "Failed to fetch subscribers";
      });

    builder
      .addCase(subcribedUserContent.pending, (state) => {
        state.subcribedContentLoading = true;
        state.subcribedContentError = null;
      })
      .addCase(subcribedUserContent.fulfilled, (state, action) => {
        state.subcribedContent = action.payload;
        state.subcribedContentLoading = false;
        state.subcribedContentError = null;
      })
      .addCase(subcribedUserContent.rejected, (state, action) => {
        state.subcribedContentLoading = false;
        state.subcribedContentError = action.payload || "Failed to fetch subscribed content";
      });

    builder
      .addCase(fetchSubcriberList.pending, (state) => {
        state.subscriberListLoading = true;
        state.subscriberListError = null;
      })
      .addCase(fetchSubcriberList.fulfilled, (state, action) => {
        state.subscriberList = action.payload;
        state.subscriberListLoading = false;
        state.subscriberListError = null;
      })
      .addCase(fetchSubcriberList.rejected, (state, action) => {
        state.subscriberListLoading = false;
        state.subscriberListError = action.payload || "Failed to fetch subscriber list";
      });

    builder
      .addCase(fetchSubcribedList.pending, (state) => {
        state.subscribedListLoading = true;
        state.subscribedListError = null;
      })
      .addCase(fetchSubcribedList.fulfilled, (state, action) => {
        state.subscribedList = action.payload;
        state.subscribedListLoading = false;
        state.subscribedListError = null;
      })
      .addCase(fetchSubcribedList.rejected, (state, action) => {
        state.subscribedListLoading = false;
        state.subscribedListError = action.payload || "Failed to fetch subscribed list";
      });
  },
});

export const {
  subcriber,
  nosubcriber,
  clearSubscriptionError,
  clearToggleError,
  resetSubscriptionState
} = subcriberSlice.actions;

export default subcriberSlice.reducer;