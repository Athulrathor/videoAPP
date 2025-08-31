import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../libs/axios';
import { setAddNewShorts } from './shorts';
import { setAddNewVideos } from './videos';

export const uploadVideo = createAsyncThunk(
    'upload/videoUpload',
    async (formData, { rejectWithValue, dispatch }) => {
        if (!formData) {
            return rejectWithValue("Form data not found!");
        }

        try {
            dispatch(setUploadProgress(0));

            const response = await axiosInstance.post('videos/publish-video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent?.total && progressEvent.total > 0) {
                        const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        dispatch(setUploadProgress(pct));
                    }
                }
            });

            console.log("Video uploaded successfully!");
            dispatch(setUploadProgress(100));
            dispatch(setAddNewVideos(response?.data?.data));
            setTimeout(() => {
                dispatch(resetStatus());
            }, 2000);

            
            return response?.data?.data;

        } catch (error) {
            console.log(error);
            dispatch(setUploadProgress(0));
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const uploadShort = createAsyncThunk(
    'upload/ShortUpload',
    async (formData, { rejectWithValue, dispatch }) => {
        if (!formData) {
            return rejectWithValue("Form data not found!");
        }

        try {
            dispatch(setUploadProgress(0));

            const response = await axiosInstance.post("short/publish-short", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent?.total && progressEvent.total > 0) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        dispatch(setUploadProgress(percent));
                    }
                }
            });

            console.log("Short uploaded successfully!");
            dispatch(setUploadProgress(100));
            dispatch(setAddNewShorts(response?.data?.data));
            setTimeout(() => {
                dispatch(resetStatus());
            }, 2000);

            return response?.data?.data;

        } catch (error) {
            console.log(error.message);
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

const uploadSlice = createSlice({
    name: 'uploads',
    initialState: {
        progress: 0,
        status: 'idle',
        error: null,
    },
    reducers: {
        setUploadProgress: (state, { payload }) => {
            const num = Number(payload);
            if (Number.isFinite(num)) {
                state.progress = Math.max(0, Math.min(100, num));
            }
        },
        resetStatus: (state) => {
            state.status = 'idle';
            state.progress = 0;
            state.error = null;
        },
        setStatus: (state, { payload }) => {
            state.status = payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadVideo.pending, (state) => {
                state.status = 'loading';
                state.progress = 0;
                state.error = null;
            })
            .addCase(uploadVideo.fulfilled, (state) => {
                state.status = 'succeeded';
                state.progress = 100;
            })
            .addCase(uploadVideo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
                state.progress = 0;
            });
        builder
            .addCase(uploadShort.pending, (state) => {
                state.status = 'loading';
                state.progress = 0;
                state.error = null;
            })
            .addCase(uploadShort.fulfilled, (state) => {
                state.status = 'succeeded';
                state.progress = 100;
            })
            .addCase(uploadShort.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
                state.progress = 0;
            });
    },
});

export const { setUploadProgress, resetStatus, setStatus, clearError } = uploadSlice.actions;
export default uploadSlice.reducer;