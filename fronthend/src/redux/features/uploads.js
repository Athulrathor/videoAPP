import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../libs/axios';

// Async thunk for uploading video
export const uploadVideo = createAsyncThunk(
    'upload/videoUpload',
    async (formData, { rejectWithValue, dispatch }) => {
        
        if (formData === null || formData === undefined) return rejectWithValue("form data not found!");
        dispatch(setUploadProgress(0));

        try {

            const response = await axiosInstance.post('videos/publish-video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent && typeof progressEvent.total === 'number' && progressEvent.total > 0) {
                        const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        dispatch(setUploadProgress(pct));
                    }
                }
            });
            console.log("video uploadded successfully!");
            dispatch(setUploadProgress(100))
            return response?.data?.data._id; 
            
        } catch (error) {
            console.log(error.message);
            dispatch(setUploadProgress(100))
            return rejectWithValue(error.message);
        } finally {
            setTimeout(() => { return dispatch(resetStatus()) },2000)
        }
    }
);

export const uploadShort = createAsyncThunk(
    'upload/ShortUpload',
    async (formData, { rejectWithValue, dispatch }) => {

        dispatch(setUploadProgress(0))

        if (formData === null || formData === undefined) return rejectWithValue("form data not found!");

        try {

            const response = await axiosInstance.post("short/publish-short", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    dispatch(setUploadProgress(percent));
                }
            });
            dispatch(setUploadProgress(100))
            console.log("short Uploaded successfully!")
            return response?.data?.data._id;

        } catch (error) {
            console.log(error.message);
            dispatch(setUploadProgress(0))
            dispatch(setStatus("failed"))
            return rejectWithValue(error.message);
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
            state.progress = Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : state.progress;
        },
        resetStatus(state) {
            state.status = "idle";
            state.progress = 0;
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
                state.progress = setTimeout(() => {return 0},2000);
            })
            .addCase(uploadVideo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.progress = 0;
            })
        
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
            state.error = action.error.message;
            state.progress = 0;
        })
    },
});

export const { setUploadProgress,resetStatus,setStatus } = uploadSlice.actions;
export default uploadSlice.reducer;