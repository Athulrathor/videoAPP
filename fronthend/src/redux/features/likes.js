import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

export const isCommentLiked = createAsyncThunk(
    'isLiked/likesComment',
    async (id, { rejectWithValue }) => {

        if (!id) return rejectWithValue("Id not found!");

        try {
            const isLiked = await axiosInstance.get(`like/is-liked-or-not-comment/${id}`);
            return isLiked?.data?.data;

        } catch (error) {
            console.log(error.message);
            return rejectWithValue(error.message);
        }
    }
);

export const isVideoLiked = createAsyncThunk(
    'isLiked/likesVideos',
    async (id, { rejectWithValue }) => {

        if (!id) return rejectWithValue("Id not found!");

        try {

            const isLiked = await axiosInstance.get(`like/is-liked-or-not-video/${id}`);
            return isLiked?.data?.data;

        } catch (error) {
            console.log(error.message);
            return rejectWithValue(error.message);
        }
    }
);

export const isShortLiked = createAsyncThunk(
    'isLiked/likesShorts',
    async (id, { rejectWithValue }) => {

        if (!id) return rejectWithValue("Id not found!");

        try {
            const IsLiked = await axiosInstance.get(`like/is-liked-or-not-short/${id}`);
            return IsLiked?.data?.data;

        } catch (error) {
            console.log(error.message);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLikeToggleComment = createAsyncThunk(
    'toggle/likesComment',
    async (id, { rejectWithValue }) => {

        if (!id) return rejectWithValue("Id not found!");

        try {

            await axiosInstance.get(`like/toggle-like-to-comment/${id}`);

            console.log("liked succesfully fetched!");

        } catch (error) {
            console.log(error.message);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLikeToggleVideo = createAsyncThunk(
    'toggle/likesVideos',
    async (id, { rejectWithValue }) => {

        if (!id) return rejectWithValue("Id not found!");

        try {

            await axiosInstance.get(`like/toggle-like-to-video/${id}`);

            console.log("liked succesfully fetched!");

        } catch (error) {
            console.log(error.message);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLikeToggleShort = createAsyncThunk('like/likeToggleShort', async (id, { rejectWithValue }) => {
    if (!id) return rejectWithValue("short id not found!");

    try {
        await axiosInstance.get(
            `like/toggle-like-to-short/${id}`
        );
        console.log("Like fetched successfully!");
    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
});

export const getUserLikeVideos = createAsyncThunk('LIkedVideos/userLikedVideos', async () => {
    
    try {
        const likedVideos = await axiosInstance.get(`like/get-liked-video`);
        return likedVideos?.data?.data;
    } catch (error) {
        console.error(error);
        return error.message;
    }
});

const uploadSlice = createSlice({
    name: 'likes',
    initialState: {
        videoLiked: null,
        videoLikedLoading: false,
        videoLikedError: false,
        
        shortLiked: false,
        shortLikedLoading: false,
        shortLikedError: false,

        userLikedVideos: [],
        userLikedVideosLoading: false,
        userLikedVideosError:null,
        
        commentLiked: null,
        commentLikedLoading: false,
        commentLikedError:false,
    },
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(isVideoLiked.pending, (state) => {
                state.videoLikedLoading = true;
                state.videoLikedError = false;
            })
            .addCase(isVideoLiked.fulfilled, (state,action) => {
                state.videoLiked = action.payload;
                state.videoLikedLoading = false;
                state.videoLikedError = false;
            })
            .addCase(isVideoLiked.rejected, (state) => {
                state.videoLikedLoading = false;
                state.videoLikedError = true;
            })
        
        builder
            .addCase(isShortLiked.pending, (state) => {
                state.shortLikedLoading = true;
                state.shortLikedError = false;
            })
            .addCase(isShortLiked.fulfilled, (state, action) => {
                state.shortLiked = action.payload;
                state.shortLikedLoading = false;
                state.shortLikedError = false;
            })
            .addCase(isShortLiked.rejected, (state) => {
                state.shortLikedLoading = false;
                state.shortLikedError = true;
            })

    builder.addCase(isCommentLiked.pending, (state) => {
            state.commentLikedLoading = true;
            state.commentLikedError = false;
        })
        .addCase(isCommentLiked.fulfilled, (state, action) => {
            state.commentLiked = action.payload;
            state.commentLikedLoading = false;
            state.commentLikedError = false;
        })
        .addCase(isCommentLiked.rejected, (state) => {
            state.commentLikedLoading = false;
            state.commentLikedError = true;
        })
        
    builder
        .addCase(getUserLikeVideos.pending, (state) => {
            state.userLikedVideosLoading = true;
        })
        .addCase(getUserLikeVideos.fulfilled, (state, action) => {
            state.userLikedVideos = action.payload;
            state.userLikedVideosLoading = false;
            state.userLikedVideosError = null;
        })
        .addCase(getUserLikeVideos.rejected, (state,action) => {
            state.userLikedVideosLoading = false;
            state.userLikedVideosError = action.payload;
        })
    },
});

// export const {  } = uploadSlice.actions;
export default uploadSlice.reducer;