import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

export const setApperances = createAsyncThunk('set/appearances', async (appearances, { rejectWithValue }) => {
    if (!appearances) return rejectWithValue("Appearances settings not found!");

    try {
        const setAppearance = await axiosInstance.post('appearance/setAppearance', {appearances});
        localStorage.setItem('appearanceSettings', JSON.stringify(appearances));
        console.log(setAppearance);
        return setAppearance.data.data;
    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
});

export const getApperances = createAsyncThunk('get/appearances', async (appearances, { rejectWithValue }) => {
    if (!appearances) return rejectWithValue("Appearances settings not found!");

    try {
        const getAppearance = await axiosInstance.get('appearance/getAppearance', appearances);

        console.log(getAppearance);
        return getAppearance.data.data;
    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
});

export const settingSlice = createSlice({
  name: "settings",
  initialState: {
      appearances: {},
      appearanceLoading: false,
      appearanceError: false,
      
      setApperancesState:false,
  },
  reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getApperances.pending, (state) => {
            state.appearanceLoading = true;
        }).addCase(getApperances.fulfilled, (state, action) => {
            state.appearanceLoading = false,
            state.appearances = action.payload;
        }).addCase(getApperances.rejected, (state, action) => {
            state.appearanceLoading = false,
            state.appearanceError = action.payload;
            state.appearances = {};
        })
        
        builder.addCase(setApperances.pending, (state) => {
            state.appearanceLoading = true;
        }).addCase(setApperances.fulfilled, (state) => {
            state.appearanceLoading = false;
            state.setApperances = true;
        }).addCase(setApperances.rejected, (state) => {
            state.appearanceLoading = false;
            state.setApperances = true;
            state.appearances = {};
        })
  },
});

// export const {} = settingSlice.actions;

export default settingSlice.reducer;