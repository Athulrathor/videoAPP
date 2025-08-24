import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

export const createAPlayList = createAsyncThunk('create/playlist', async ({name,description},{rejectWithValue}) => {
    if (!name && !description) return rejectWithValue("name and description not fond!");

    try {
        
        const playlist = await axiosInstance.post(`playlist/create-playlist`, { name: name, description: description });
        console.log(playlist);
        return playlist.data.data;

    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
});

export const getUserPlayList = createAsyncThunk('getByUser/playlist', async (userId, { rejectWithValue }) => {
    if (!userId) return rejectWithValue("id not fond!");

    try {

        const getPlaylist = await axiosInstance.get(`playlist/user-playlist/${userId}`);
        return getPlaylist?.data?.data;

    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
});

export const getUserPlayListById = createAsyncThunk('getById/playlist', async (playlistId, { rejectWithValue }) => {
    if (!playlistId) return rejectWithValue("id not fond!");

    try {
        const getPlaylistById = await axiosInstance.get(`playlist/get-playlist/${playlistId}`);
        console.log(getPlaylistById);
        return getPlaylistById.data.data;

    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
});

export const addAVideoToPlaylist = createAsyncThunk('addingAVideo/playlist', async ({playlistId,VideoId}, { rejectWithValue }) => {
    if (!playlistId && !VideoId) return rejectWithValue("id not fond!");

    try {
        const adddedVideoToPlaylist = await axiosInstance.patch(`playlist/add-video-to-playlist/${VideoId}/${playlistId}`);
        console.log(adddedVideoToPlaylist);
        return adddedVideoToPlaylist.data.data;

    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
});

export const removedVideoToPlaylist = createAsyncThunk('removingAVideo/playlist', async ({ playlistId, VideoId }, { rejectWithValue }) => {
    if (!playlistId && !VideoId) return rejectWithValue("id not fond!");

    try {
        const removedVideoToPlaylist = await axiosInstance.patch(`playlist/remove-video-to-playlist/${VideoId}/${playlistId}`);
        console.log(removedVideoToPlaylist);
        return removedVideoToPlaylist.data.data;

    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
});

export const deleteAPlaylist = createAsyncThunk('delete/playlist', async (playlistId, { rejectWithValue }) => {
    if (!playlistId) return rejectWithValue("id not fond!");

    try {
        const deletedPlaylist = await axiosInstance.get(`playlist/delete-playlist/${playlistId}`);
        console.log(deletedPlaylist);
        return deletedPlaylist.data.data;

    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
});

export const updateAPlaylist = createAsyncThunk('update/playlist', async ({playlistId,name,description}, { rejectWithValue }) => {
    if (!playlistId) return rejectWithValue("id not fond!");
    if (!name) return rejectWithValue("name not fond!");
    if (!description) return rejectWithValue("description not fond!");

    try {
        const updatedPlaylist = await axiosInstance.post(`playlist/update-playlist/${playlistId}`,{body:{name:name,description:description}});
        console.log(updatedPlaylist);
        return updatedPlaylist.data.data;

    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
});

const playListSlice = createSlice({
    name: 'Playlists',
    initialState: {
        playlist: [],
        loading: false,
        error: null,

        newloading: false,
        newerror: null,
        
        playlistById: null,
        playlistByIdLoading: false,
        playListByIdError:null,
    },
    reducers: {

    },
    extraReducers: (builder) => {      
        builder.addCase(createAPlayList.pending, (state) => {
            state.newloading = true;
        }).addCase(createAPlayList.fulfilled, (state, action) => {
            state.playlist = [...state,action.payload];
            state.newloading = false;
        }).addCase(createAPlayList.rejected, (state,action) => {
            state.newerror = action.payload;
            state.newloading = false;
        })
            .addCase(getUserPlayList.pending, (state) => {
                state.loading = true;
            }).addCase(getUserPlayList.fulfilled, (state, action) => {
                state.playlist = action.payload;
                state.loading = false;
            }).addCase(getUserPlayList.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
        
            .addCase(getUserPlayListById.pending, (state) => {
                state.playlistByIdLoading = true;
            }).addCase(getUserPlayListById.fulfilled, (state, action) => {
                state.playlistById = action.payload;
                state.playlistByIdLoading = false;
            }).addCase(getUserPlayListById.rejected, (state, action) => {
                state.playListByIdError = action.payload;
                state.playlistByIdLoading = false;
            })
        
            // .addCase(addAVideoToPlaylist.pending, (state) => {
            //     state.playlistByIdLoading = true;
            // }).addCase(addAVideoToPlaylist.fulfilled, (state, action) => {
            //     state.playlistById = action.payload;
            //     state.playlistByIdLoading = false;
            // }).addCase(addAVideoToPlaylist.rejected, (state, action) => {
            //     state.playListByIdError = action.payload;
            //     state.playlistByIdLoading = false;
        // })
        // .addCase(removeAVideoToPlaylist.pending, (state) => {
        //     state.playlistByIdLoading = true;
        // }).addCase(removeAVideoToPlaylist.fulfilled, (state, action) => {
        //     state.playlistById = action.payload;
        //     state.playlistByIdLoading = false;
        // }).addCase(removeAVideoToPlaylist.rejected, (state, action) => {
        //     state.playListByIdError = action.payload;
        //     state.playlistByIdLoading = false;
        // })

        .addCase(deleteAPlaylist.pending, (state) => {
            state.loading = true;
        }).addCase(deleteAPlaylist.fulfilled, (state, action) => {
            state.data = {
                ...state,
                playlist: state.playlist.filter(playlist => playlist.id !== action.payload.id)
            };
            state.loading = false;
        }).addCase(deleteAPlaylist.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

            .addCase(updateAPlaylist.pending, (state) => {
                state.loading = true;
            }).addCase(updateAPlaylist.fulfilled, (state, action) => {
                state.playlist = state.playlist.map(playlist =>
                    playlist.id === action.payload.id ? action.payload : playlist
                );
                state.loading = false;
            }).addCase(updateAPlaylist.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
    },
});

// export const {  } = uploadSlice.actions;
export default playListSlice.reducer;