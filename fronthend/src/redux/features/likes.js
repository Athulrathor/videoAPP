import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

export const isCommentLiked = createAsyncThunk(
    'isLiked/likesComment',
    async (id, { rejectWithValue }) => {

        if (!id) return rejectWithValue("Id not found!");

        try {
            const isLiked = await axiosInstance.get(`like/is-liked-or-not-comment/${id}`);
            return {
                commentId: id,
                isLiked: isLiked?.data?.data
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const isVideoLiked = createAsyncThunk(
    'isLiked/likesVideos',
    async (id, { rejectWithValue }) => {

        if (!id) return rejectWithValue("Id not found!");

        try {

            const isLiked = await axiosInstance.get(`like/is-liked-or-not-video/${id}`);
            return {
                videoId: id,
                isLiked: isLiked?.data?.data
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const isShortLiked = createAsyncThunk(
    'isLiked/likesShorts',
    async (id, { rejectWithValue }) => {

        if (!id) return rejectWithValue("Id not found!");

        try {
            const IsLiked = await axiosInstance.get(`like/is-liked-or-not-short/${id}`);
            return {
                shortId: id,
                isLiked: IsLiked?.data?.data
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const fetchLikeToggleComment = createAsyncThunk(
    'toggle/likesComment',
    async (id, {getState, rejectWithValue }) => {

        if (!id) return rejectWithValue("Id not found!");

        try {

            const response = await axiosInstance.get(`like/toggle-like-to-comment/${id}`);

            // Get current like state and toggle it
            const currentState = getState().likes;
            const wasLiked = currentState.commentLiked;

            return {
                commentId: id,
                isLiked: !wasLiked,
                message: response?.data?.message || "Toggle successful"
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const fetchLikeToggleVideo = createAsyncThunk(
    'toggle/likesVideos',
    async (id, {getState, rejectWithValue }) => {

        if (!id) return rejectWithValue("Id not found!");

        try {
            const response = await axiosInstance.get(`like/toggle-like-to-video/${id}`);

            // Get current like state and toggle it
            const currentState = getState().likes;
            const wasLiked = currentState.videoLiked;

            return {
                videoId: id,
                isLiked: !wasLiked,
                message: response?.data?.message || "Toggle successful"
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const fetchLikeToggleShort = createAsyncThunk('like/likeToggleShort', async (id, {getState, rejectWithValue }) => {
    if (!id) return rejectWithValue("short id not found!");

    try {
        const response = await axiosInstance.get(`like/toggle-like-to-short/${id}`);

        // Get current like state and toggle it
        const currentState = getState().likes;
        const wasLiked = currentState.shortLiked;

        return {
            shortId: id,
            isLiked: !wasLiked,
            message: response?.data?.message || "Toggle successful"
        };
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error.message);
    }
});

export const getUserLikeVideos = createAsyncThunk('LIkedVideos/userLikedVideos', async (_,{rejectWithValue}) => {
    
    try {
        const likedVideos = await axiosInstance.get(`like/get-liked-video`);
        return likedVideos?.data?.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error.message);
    }
});

const uploadSlice = createSlice({
    name: 'likes',
    initialState: {
        videoLiked: null,
        videoLikedLoading: false,
        videoLikedError: null,

        shortLiked: null,
        shortLikedLoading: false,
        shortLikedError: null,

        commentLiked: null,
        commentLikedLoading: false,
        commentLikedError: null,

        userLikedVideos: [],
        userLikedVideosLoading: false,
        userLikedVideosError: null,

        togglingVideo: false,
        togglingShort: false,
        togglingComment: false,

        toggleVideoError: null,
        toggleShortError: null,
        toggleCommentError: null,
    },
    reducers: {
        clearVideoLikeError: (state) => {
            state.videoLikedError = null;
        },
        clearShortLikeError: (state) => {
            state.shortLikedError = null;
        },
        clearCommentLikeError: (state) => {
            state.commentLikedError = null;
        },
        resetLikeStates: (state) => {
            state.videoLiked = null;
            state.shortLiked = null;
            state.commentLiked = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(isVideoLiked.pending, (state) => {
                state.videoLikedLoading = true;
                state.videoLikedError = null;
            })
            .addCase(isVideoLiked.fulfilled, (state, action) => {
                state.videoLiked = action.payload.isLiked;
                state.videoLikedLoading = false;
                state.videoLikedError = null;
            })
            .addCase(isVideoLiked.rejected, (state, action) => {
                state.videoLikedLoading = false;
                state.videoLikedError = action.payload || "Failed to check video like status";
            });

        builder
            .addCase(isShortLiked.pending, (state) => {
                state.shortLikedLoading = true;
                state.shortLikedError = null;
            })
            .addCase(isShortLiked.fulfilled, (state, action) => {
                state.shortLiked = action.payload.isLiked;
                state.shortLikedLoading = false;
                state.shortLikedError = null;
            })
            .addCase(isShortLiked.rejected, (state, action) => {
                state.shortLikedLoading = false;
                state.shortLikedError = action.payload || "Failed to check short like status";
            });

        builder
            .addCase(isCommentLiked.pending, (state) => {
                state.commentLikedLoading = true;
                state.commentLikedError = null;
            })
            .addCase(isCommentLiked.fulfilled, (state, action) => {
                state.commentLiked = action.payload.isLiked;
                state.commentLikedLoading = false;
                state.commentLikedError = null;
            })
            .addCase(isCommentLiked.rejected, (state, action) => {
                state.commentLikedLoading = false;
                state.commentLikedError = action.payload || "Failed to check comment like status";
            });

        builder
            .addCase(fetchLikeToggleVideo.pending, (state) => {
                state.togglingVideo = true;
                state.toggleVideoError = null;
            })
            .addCase(fetchLikeToggleVideo.fulfilled, (state, action) => {
                state.togglingVideo = false;
                state.videoLiked = action.payload.isLiked;
                state.toggleVideoError = null;
            })
            .addCase(fetchLikeToggleVideo.rejected, (state, action) => {
                state.togglingVideo = false;
                state.toggleVideoError = action.payload || "Failed to toggle video like";
            });

        builder
            .addCase(fetchLikeToggleShort.pending, (state) => {
                state.togglingShort = true;
                state.toggleShortError = null;
            })
            .addCase(fetchLikeToggleShort.fulfilled, (state, action) => {
                state.togglingShort = false;
                state.shortLiked = action.payload.isLiked;
                state.toggleShortError = null;
            })
            .addCase(fetchLikeToggleShort.rejected, (state, action) => {
                state.togglingShort = false;
                state.toggleShortError = action.payload || "Failed to toggle short like";
            });

        builder
            .addCase(fetchLikeToggleComment.pending, (state) => {
                state.togglingComment = true;
                state.toggleCommentError = null;
            })
            .addCase(fetchLikeToggleComment.fulfilled, (state, action) => {
                state.togglingComment = false;
                state.commentLiked = action.payload.isLiked;
                state.toggleCommentError = null;
            })
            .addCase(fetchLikeToggleComment.rejected, (state, action) => {
                state.togglingComment = false;
                state.toggleCommentError = action.payload || "Failed to toggle comment like";
            });

        builder
            .addCase(getUserLikeVideos.pending, (state) => {
                state.userLikedVideosLoading = true;
                state.userLikedVideosError = null;
            })
            .addCase(getUserLikeVideos.fulfilled, (state, action) => {
                state.userLikedVideos = action.payload;
                state.userLikedVideosLoading = false;
                state.userLikedVideosError = null;
            })
            .addCase(getUserLikeVideos.rejected, (state, action) => {
                state.userLikedVideosLoading = false;
                state.userLikedVideosError = action.payload || "Failed to fetch liked videos";
            });
    },
});

export const {
    clearVideoLikeError,
    clearShortLikeError,
    clearCommentLikeError,
    resetLikeStates } = uploadSlice.actions;
export default uploadSlice.reducer;