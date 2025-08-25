import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

export const fetchAddCommentReplies = createAsyncThunk('add/commentReplies', async ({ id, newComment }, { rejectWithValue }) => {
    console.log(id,newComment)
    if (id == null) return rejectWithValue("id not found!");

    if (newComment == null) return rejectWithValue("Comment not found!");

    try {
        const commentAdded = await axiosInstance.post(`comment/add-comment-to-comment/${id}`, { comment: newComment, });
        console.log(commentAdded.data.data)
        return {
            parentId: id,
            comment: commentAdded?.data?.data?.data
        };
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error.message);
    }
});

export const fetchAddVideoComment = createAsyncThunk('add/VideoComment', async ({ id, newComment }, { rejectWithValue }) => {

    if (id == null) return rejectWithValue("id not found!");

    if (newComment == null) return rejectWithValue("Comment not found!");

    try {
        const videoCommentAdded = await axiosInstance.post(`comment/add-comment-to-video/${id}`, { comment: newComment });

        return {
            videoId: id,
            newComment: videoCommentAdded?.data?.data,
            message: videoCommentAdded?.data?.message
        };
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error.message);
    }
});

export const fetchAddShortComment = createAsyncThunk('addComment/ShortComment', async ({ id, newComment },{rejectWithValue}) => {
    if (!id) return rejectWithValue("short id not found!");

    if (!newComment) return rejectWithValue("New comment not found!");

    try {
        const shortComment = await axiosInstance.post(`comment/add-comment-to-short/${id}`, { comment: newComment });
        
        return {
            shortId: id,
            newComment: shortComment?.data?.data,
            message: shortComment?.data?.message
        };
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error.message);
    }
})

export const fetchCommentReplies = createAsyncThunk('getComment/commentReplies', async (id,{rejectWithValue}) => {
    if (id == null) return rejectWithValue("id not found!");

    try {
        
        const commentReplies = await axiosInstance.get(`comment//get-comment-to-comment/${id}`);
        console.log(commentReplies)
        return {
            commentId: id,
            replies: commentReplies?.data?.data
        };
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error.message);
    }
});

export const fetchVideoComment = createAsyncThunk('getComment/VideoComment', async (id, { rejectWithValue }) => {
    if (id == null) return rejectWithValue("id not found!");

    try {
        const videoComment = await axiosInstance.get(`comment/get-video-comment/${id}`);
        console.log(videoComment?.data?.data?.data)
        return videoComment?.data?.data?.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error.message);
    }
});

export const fetchShortComment = createAsyncThunk('getComment/ShortComment', async (id, { rejectWithValue }) => {
    if (id == null) return rejectWithValue("id not found!");

    try {
        const shortComment = await axiosInstance.get(`comment/get-short-comment/${id}`);
        console.log(shortComment?.data?.data?.data)
        return shortComment?.data?.data?.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error.message);
    }
});

export const commentSlice = createSlice({
  name: "comments",
  initialState: {
      videosComments: [],
      videosCommentsLoading: false,
      videosCommentsError: null,

      shortComments: [],
      shortCommentLoading: false,
      shortCommentsError: null,

      repliesOnComment: [],
      repliesOnCommentLoading: false,
      repliesOnCommentError: null,

      addingVideoComment: false,
      addingShortComment: false,
      addingReply: false,

      addVideoCommentError: null,
      addShortCommentError: null,
      addReplyError: null,
  },
  reducers: {
      clearVideoCommentsError: (state) => {
          state.videosCommentsError = null;
      },
      clearShortCommentsError: (state) => {
          state.shortCommentsError = null;
      },
      clearRepliesError: (state) => {
          state.repliesOnCommentError = null;
      },
      resetVideoComments: (state) => {
          state.videosComments = [];
          state.videosCommentsError = null;
      },
      resetShortComments: (state) => {
          state.shortComments = [];
          state.shortCommentsError = null;
      },
    },
    extraReducers: (builder) => {
        // ✅ Fetch Video Comments
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
                state.videosCommentsError = action.payload || 'Failed to fetch video comments';
                // Don't clear comments on error - keep previous data
            });

        // ✅ Fetch Short Comments
        builder
            .addCase(fetchShortComment.pending, (state) => {
                state.shortCommentLoading = true;
                state.shortCommentsError = null;
            })
            .addCase(fetchShortComment.fulfilled, (state, action) => {
                state.shortCommentLoading = false;
                state.shortComments = action.payload;
                state.shortCommentsError = null;
            })
            .addCase(fetchShortComment.rejected, (state, action) => {
                state.shortCommentLoading = false;
                state.shortCommentsError = action.payload || 'Failed to fetch short comments';
            });

        // ✅ Fetch Comment Replies
        builder
            .addCase(fetchCommentReplies.pending, (state) => {
                state.repliesOnCommentLoading = true;
                state.repliesOnCommentError = null;
            })
            .addCase(fetchCommentReplies.fulfilled, (state, action) => {
                state.repliesOnCommentLoading = false;
                state.repliesOnComment = action.payload.replies;
                state.repliesOnCommentError = null;
            })
            .addCase(fetchCommentReplies.rejected, (state, action) => {
                state.repliesOnCommentLoading = false;
                state.repliesOnCommentError = action.payload || 'Failed to fetch replies';
                state.repliesOnComment = [];
            });

        // ✅ Add Video Comment
        builder
            .addCase(fetchAddVideoComment.pending, (state) => {
                state.addingVideoComment = true;
                state.addVideoCommentError = null;
            })
            .addCase(fetchAddVideoComment.fulfilled, (state, action) => {
                state.addingVideoComment = false;
                // Add new comment to the beginning of the array
                if (action.payload.newComment) {
                    state.videosComments.unshift(action.payload.newComment);
                }
                state.addVideoCommentError = null;
            })
            .addCase(fetchAddVideoComment.rejected, (state, action) => {
                state.addingVideoComment = false;
                state.addVideoCommentError = action.payload || 'Failed to add comment';
            });

        // ✅ Add Short Comment
        builder
            .addCase(fetchAddShortComment.pending, (state) => {
                state.addingShortComment = true;
                state.addShortCommentError = null;
            })
            .addCase(fetchAddShortComment.fulfilled, (state, action) => {
                state.addingShortComment = false;
                // Add new comment to the beginning of the array
                if (action.payload.newComment) {
                    state.shortComments.unshift(action.payload.newComment);
                }
                state.addShortCommentError = null;
            })
            .addCase(fetchAddShortComment.rejected, (state, action) => {
                state.addingShortComment = false;
                state.addShortCommentError = action.payload || 'Failed to add comment';
            });

        // ✅ Add Comment Reply
        builder
            .addCase(fetchAddCommentReplies.pending, (state) => {
                state.addingReply = true;
                state.addReplyError = null;
            })
            .addCase(fetchAddCommentReplies.fulfilled, (state, action) => {
                state.addingReply = false;
                // Add new reply to the replies array
                if (action.payload.newReply) {
                    state.repliesOnComment.unshift(action.payload.newReply);
                }
                state.addReplyError = null;
            })
            .addCase(fetchAddCommentReplies.rejected, (state, action) => {
                state.addingReply = false;
                state.addReplyError = action.payload || 'Failed to add reply';
            });
    },
});

export const {
    clearVideoCommentsError,
    clearShortCommentsError,
    clearRepliesError,
    resetVideoComments,
    resetShortComments } = commentSlice.actions;
export default commentSlice.reducer;
