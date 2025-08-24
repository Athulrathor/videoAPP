import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

export const fetchAddCommentReplies = createAsyncThunk('add/commentReplies', async ({ id, newComment }, { rejectWithValue }) => {
    console.log(id,newComment)
    if (id == null) return rejectWithValue("id not found!");

    if (newComment == null) return rejectWithValue("Comment not found!");

    try {
        const commentAdded = await axiosInstance.post(`comment/add-comment-to-comment/${id}`, { comment: newComment, });
        console.log(commentAdded.data.data)
        return commentAdded?.data?.data?.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchAddVideoComment = createAsyncThunk('add/VideoComment', async ({ id, newComment }, { rejectWithValue }) => {

    if (id == null) return rejectWithValue("id not found!");

    if (newComment == null) return rejectWithValue("Comment not found!");

    try {
        const videoCommentAdded = await axiosInstance.post(`comment/add-comment-to-video/${id}`, { comment: newComment });

        return videoCommentAdded.data.message;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchAddShortComment = createAsyncThunk('addComment/ShortComment', async ({ id, newComment },{rejectWithValue}) => {
    if (!id) return rejectWithValue("short id not found!");

    if (!newComment) return rejectWithValue("New comment not found!");

    try {
        await axiosInstance.post(`comment/add-comment-to-short/${id}`,{comment: newComment});
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.message);
    }
})

export const fetchCommentReplies = createAsyncThunk('getComment/commentReplies', async (id,{rejectWithValue}) => {
    if (id == null) return rejectWithValue("id not found!");

    try {
        
        const commentReplies = await axiosInstance.get(`comment//get-comment-to-comment/${id}`);
        console.log(commentReplies)
        return commentReplies?.data?.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchVideoComment = createAsyncThunk('getComment/VideoComment', async (id, { rejectWithValue }) => {
    if (id == null) return rejectWithValue("id not found!");

    try {
        const videoComment = await axiosInstance.get(`comment/get-video-comment/${id}`);
        console.log(videoComment?.data?.data?.data)
        return videoComment?.data?.data?.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchShortComment = createAsyncThunk('getComment/ShortComment', async (id, { rejectWithValue }) => {
    if (id == null) return rejectWithValue("id not found!");

    try {
        const shortComment = await axiosInstance.get(`comment/get-short-comment/${id}`);
        console.log(shortComment?.data?.data?.data)
        return shortComment?.data?.data?.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const commentSlice = createSlice({
  name: "comments",
  initialState: {
      videosComments: [],
      shortComments: [],
      repliesOnCommentVideos: [],
      replisOncommentShort: [],
      repliesOnComment: [],

      videosCommentsLoading: false,
      shortCommentLoading: false,
      repliesOnCommentVideosLoading: false,
      replisOncommentShortLoading: false,

      videosCommentsError: null,
      shortCommentsError: null,
      repliesOnCommentVideosError: null,
      replisOncommentShortError:null
  },
  reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideoComment.pending, (state) => {
                state.videosCommentsLoading = true;
                state.videosCommentsError = null;
            })
            .addCase(fetchVideoComment.fulfilled, (state, action) => {
                state.videosCommentsLoading = false;
                state.videosComments = action.payload;
                state.videosCommentsError = null;
            })
            .addCase(fetchVideoComment.rejected, (state, action) => {
                state.videosCommentsLoading = false;
                state.videosCommentsError = action.payload || 'Failed to fetch videos';
                state.videosComments = [];
            });

        builder.addCase(fetchCommentReplies.pending, (state) => {
            state.repliesOnCommentVideosLoading = true;
            state.repliesOnCommentVideosError = null;
        }).addCase(fetchCommentReplies.fulfilled, (state,action) => {
            state.repliesOnCommentVideosLoading = false;
            state.repliesOnComment = action.payload;
            state.repliesOnCommentVideosError = null;
        }).addCase(fetchCommentReplies.rejected, (state,action) => {
            state.repliesOnCommentVideosLoading = false;
            state.repliesOnCommentVideosError = action.payload || 'Failed to fetch videos';
            state.repliesOnComment = [];
        })

        
    },
});

export const { videosComments,shortComments,repliesOnComment } = commentSlice.actions;
export default commentSlice.reducer;
