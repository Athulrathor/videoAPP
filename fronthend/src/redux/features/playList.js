import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

export const createAPlayList = createAsyncThunk(
    'create/playlist',
    async ({ title, description, privacy = "Public" }, { rejectWithValue }) => {
        console.log(title,description,privacy)
        if (!title || !description) {
            return rejectWithValue("Name and description are required!");
        }

        try {
            const response = await axiosInstance.post(`playlist/create-playlist`, {
                title,
                description,
                privacy
            });
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const getUserPlayList = createAsyncThunk(
    'getByUser/playlist',
    async (userId, { rejectWithValue }) => {
        if (!userId) return rejectWithValue("User ID is required!");

        try {
            const response = await axiosInstance.get(`playlist/user-playlist/${userId}`);
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const getUserPlayListById = createAsyncThunk(
    'getById/playlist',
    async (playlistId, { rejectWithValue }) => {
        if (!playlistId) return rejectWithValue("Playlist ID is required!");

        try {
            const response = await axiosInstance.get(`playlist/get-playlist/${playlistId}`);
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const addAVideoToPlaylist = createAsyncThunk(
    'addingAVideo/playlist',
    async ({ playlistId, arrayVideoId }, { rejectWithValue }) => {
        if (!playlistId || !arrayVideoId) {
            return rejectWithValue("Playlist ID and Video ID are required!");
        }

        try {
            const response = await axiosInstance.post(
                `playlist/add-video-to-playlist`, { arrayVideoId: arrayVideoId, playlistId: playlistId }
            );
            console.log(response)
            return {
                playlistId,
                videoIdList: arrayVideoId,
                updatedPlaylist: response?.data?.data
            };
        } catch (error) {
            console.log(error)
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const removedVideoToPlaylist = createAsyncThunk(
    'removingAVideo/playlist',
    async ({ playlistId, VideoId }, { rejectWithValue }) => {
        if (!playlistId || !VideoId) {
            return rejectWithValue("Playlist ID and Video ID are required!");
        }

        try {
            const response = await axiosInstance.patch(
                `playlist/remove-video-to-playlist/${VideoId}/${playlistId}`
            );
            return {
                playlistId,
                videoId: VideoId,
                updatedPlaylist: response?.data?.data
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const deleteAPlaylist = createAsyncThunk(
    'delete/playlist',
    async (playlistId, { rejectWithValue }) => {
        if (!playlistId) return rejectWithValue("Playlist ID is required!");

        try {
            const response = await axiosInstance.delete(`playlist/delete-playlist/${playlistId}`);
            return {
                deletedPlaylistId: playlistId,
                message: response?.data?.message
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const updateAPlaylist = createAsyncThunk(
    'update/playlist',
    async ({ playlistId, name, description }, { rejectWithValue }) => {
        if (!playlistId) return rejectWithValue("Playlist ID is required!");
        if (!name) return rejectWithValue("Name is required!");
        if (!description) return rejectWithValue("Description is required!");

        try {
            const response = await axiosInstance.patch(
                `playlist/update-playlist/${playlistId}`,
                { name, description }
            );
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

const playListSlice = createSlice({
    name: 'Playlists',
    initialState: {
        playlist: [],
        loading: false,
        error: null,

        playlistById: null,
        playlistByIdLoading: false,
        playListByIdError: null,

        creating: false,
        createError: null,
        createdId: "",

        addingVideo: false,
        removingVideo: false,
        videoOperationError: null,

        updating: false,
        deleting: false,
        updateError: null,
        deleteError: null,
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.createError = null;
            state.playListByIdError = null;
            state.videoOperationError = null;
            state.updateError = null;
            state.deleteError = null;
        },
        clearPlaylistById: (state) => {
            state.playlistById = null;
            state.playListByIdError = null;
        },
        resetPlaylistState: (state) => {
            state.playlist = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAPlayList.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(createAPlayList.fulfilled, (state, action) => {
                state.creating = false;
                state.playlist.unshift(action.payload);
                state.createdId = action.payload._id;
                state.createError = null;
            })
            .addCase(createAPlayList.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload || "Failed to create playlist";
            });

        builder
            .addCase(getUserPlayList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserPlayList.fulfilled, (state, action) => {
                state.loading = false;
                state.playlist = action.payload;
                state.error = null;
            })
            .addCase(getUserPlayList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch playlists";
            });

        builder
            .addCase(getUserPlayListById.pending, (state) => {
                state.playlistByIdLoading = true;
                state.playListByIdError = null;
            })
            .addCase(getUserPlayListById.fulfilled, (state, action) => {
                state.playlistByIdLoading = false;
                state.playlistById = action.payload;
                state.playListByIdError = null;
            })
            .addCase(getUserPlayListById.rejected, (state, action) => {
                state.playlistByIdLoading = false;
                state.playListByIdError = action.payload || "Failed to fetch playlist";
            });

        builder
            .addCase(addAVideoToPlaylist.pending, (state) => {
                state.addingVideo = true;
                state.videoOperationError = null;
            })
            .addCase(addAVideoToPlaylist.fulfilled, (state, action) => {
                state.addingVideo = false;
                if (state.playlistById && state.playlistById._id === action.payload.playlistId) {
                    state.playlistById = action.payload.updatedPlaylist;
                }
                state.videoOperationError = null;
            })
            .addCase(addAVideoToPlaylist.rejected, (state, action) => {
                state.addingVideo = false;
                state.videoOperationError = action.payload || "Failed to add video to playlist";
            });

        builder
            .addCase(removedVideoToPlaylist.pending, (state) => {
                state.removingVideo = true;
                state.videoOperationError = null;
            })
            .addCase(removedVideoToPlaylist.fulfilled, (state, action) => {
                state.removingVideo = false;
                if (state.playlistById && state.playlistById._id === action.payload.playlistId) {
                    state.playlistById = action.payload.updatedPlaylist;
                }
                state.videoOperationError = null;
            })
            .addCase(removedVideoToPlaylist.rejected, (state, action) => {
                state.removingVideo = false;
                state.videoOperationError = action.payload || "Failed to remove video from playlist";
            });

        builder
            .addCase(deleteAPlaylist.pending, (state) => {
                state.deleting = true;
                state.deleteError = null;
            })
            .addCase(deleteAPlaylist.fulfilled, (state, action) => {
                state.deleting = false;
                state.playlist = state.playlist.filter(
                    playlist => playlist._id !== action.payload.deletedPlaylistId
                );
                if (state.playlistById?._id === action.payload.deletedPlaylistId) {
                    state.playlistById = null;
                }
                state.deleteError = null;
            })
            .addCase(deleteAPlaylist.rejected, (state, action) => {
                state.deleting = false;
                state.deleteError = action.payload || "Failed to delete playlist";
            });

        builder
            .addCase(updateAPlaylist.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateAPlaylist.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.playlist.findIndex(
                    playlist => playlist._id === action.payload._id
                );
                if (index !== -1) {
                    state.playlist[index] = action.payload;
                }
                if (state.playlistById?._id === action.payload._id) {
                    state.playlistById = action.payload;
                }
                state.updateError = null;
            })
            .addCase(updateAPlaylist.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload || "Failed to update playlist";
            });
    },
});

export const { clearErrors, clearPlaylistById, resetPlaylistState } = playListSlice.actions;
export default playListSlice.reducer;