import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";
import { Pen } from "lucide-react";

export const getChannelProfileOfUser = createAsyncThunk('get/userChannel', async (userName, { rejectWithValue }) => {
    if (!userName) return rejectWithValue("username not found!");

    try {
        
        const userChannel = await axiosInstance.get(`users/channel/${userName}`);
        return userChannel?.data?.data;

    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
    
});

export const userSlice = createSlice({
    name: "channels",
    initialState: {
        channel: {},
        loading: false,
        error:null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getChannelProfileOfUser.pending, (state) => {
            state.loading = true;
        }).addCase(getChannelProfileOfUser.fulfilled, (state,action) => {
            state.loading = false;
            state.channel = action.payload;
        }).addCase(getChannelProfileOfUser.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
    },
});



// export const {  } =
//     userSlice.actions;
export default userSlice.reducer;
