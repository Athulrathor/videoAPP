import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    sessionId: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.sessionId = action.payload.sessionId;
            state.isAuthenticated = true;
        },

        updateAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
        },

        updateAvatarRedux: (state, action) => {
            state.user.avatar = action.payload; 
        },

        updateCoverImageRedux: (state, action) => {
            state.user.coverImage = action.payload;
        },

        // updateUserDetail: (state, action) => {
        //     state.user.username = action.payload.username;
        //     state.user.
        // },
        
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.sessionId = null;
            state.isAuthenticated = false;

            localStorage.removeItem("persist:root");
        },
    },
});

export const { setCredentials, updateAccessToken, logout, updateAvatarRedux, updateCoverImageRedux } =
    authSlice.actions;

export default authSlice.reducer;