import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";
import { googleLogout } from "@react-oauth/google";


export const fetchLoginUser = createAsyncThunk("login/userFetching", async ({ email, password }, { rejectWithValue }) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  if (!email && !password) return rejectWithValue("User crendencial not found!");

  try {
    const logging = await axiosInstance.post('/users/login', { email, password });
    sessionStorage.setItem("accessToken", logging?.data?.data?.accessToken);
    clearTimeout(timeoutId);
    return logging?.data?.data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.log(error)
    return rejectWithValue(error.message);
  }
})

export const fetchLogoutUser = createAsyncThunk("logout/userFetching", async ({ rejectWithValue }) => {

  try {

    const loggingOut = await axiosInstance.post("/users/logout");
    googleLogout();
    sessionStorage.removeItem("accessToken");

    return loggingOut?.data?.message;

  } catch (error) {
    return rejectWithValue(error.message);
  }
})

export const updateAvatar = createAsyncThunk('changeAvatar/userAvatar', async (newAvatar, { rejectWithValue, dispatch }) => {
  
  if (!newAvatar) return rejectWithValue("avatar image is missing! \n Please Upload Avatar image");

  const data = new FormData();
  data.append('avatar', newAvatar);

  try {
    await axiosInstance.patch('users/avatar', data, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent && typeof progressEvent.total === 'number' && progressEvent.total > 0) {
          const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          dispatch(setUpdateAvatarProgress(pct));
        }
      }
    });
    console.log("Avatar image change Successfull!");
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.message);
  }
})

export const updateCoverImage = createAsyncThunk('changeCoverImage/userCoverImage', async (newCoverImage, { rejectWithValue, dispatch }) => {
  
  if (!newCoverImage) return rejectWithValue("Cover image is missing! \n Please Upload Cover image");

  try {

    const data = new FormData();
    data.append('coverImage', newCoverImage);

    await axiosInstance.patch('users/cover-image',data , {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent && typeof progressEvent.total === 'number' && progressEvent.total > 0) {
          const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          dispatch(setUpdateCoverImageProgress(pct));
        }
      }
    });
    console.log("Cover image change Successfull!");
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.message);
  }
})

export const updateAccountDetails = createAsyncThunk('changeAccount/userAccountDetails', async ({username,email,fullname}, { rejectWithValue }) => {

  try {
    await axiosInstance.patch('users/update-account-detail', {username:username,email:email,fullname:fullname});
    console.log("User Account details change Successfull!");
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.message);
  }
})

export const accountDeleted = createAsyncThunk('deleting/userAccount', async (UserId, { rejectWithValue }) => {

  try {
    await axiosInstance.patch(`users/delete-account/${UserId}`);
    console.log("User Account Deleted after 3 days Successfull!");
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.message);
  }
})

export const currentUpdatedUser = createAsyncThunk('current/userDetails', async () => {
  try {
    const currentUser = await axiosInstance.get("users/current-user");
    return currentUser?.data?.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const AuthService = {
  loginWithGoogle: async (googleAccessToken) => {
    const response = await axiosInstance.post('users/google', { googleAccessToken });
    console.log(response?.data);
    return response.data;
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    loading: false,
    error: null,
    token: null,
    loggedIn: false,
    sideActive: "home",
    settingsActive: "Accounts",

    updateAvatarProgress: 0,
    updateAvatarStatus: "idle",
    updateAvatarError:null,
    
    updateCoverImageProgress: 0,
    updateCoverImageStatus: "idle",
    updateCoverImageError:null,
    
    updateAccountStatus: "idle",
    updateAccountLoading: false,
    updateAccountError:null
  },
  reducers: {

    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.loggedIn = !!action.payload.user;
    },

    logOut: (state) => {
      state.user = {};
      state.token = null;
      state.loggedIn = false;
    },

    setSideActive: (state, action) => {
      state.sideActive = action.payload;
    },
    setSettingsActive: (state, action) => {
      state.settingsActive = action.payload;
    },

    setUpdateAvatarProgress: (state, action) => {
      state.updateAvatarProgress = action.payload;
    },

    setUpdateCoverImageProgress: (state, action) => {
      state.updateCoverImageProgress = action.payload;
    }

  },
  extraReducers: (builder) => {
      builder
        .addCase(fetchLoginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchLoginUser.fulfilled, (state, action) => {
          state.user = action.payload?.user;
          state.loggedIn = true;
          state.token = action.payload?.accessToken || null;
          state.loading = false;
          state.error = null
        })
        .addCase(fetchLoginUser.rejected, (state,action) => {
          state.loggedIn = false;
          state.token = null;
          state.error = action.payload;
          state.loading = false;
          state.user = {};
        });
    
    builder
      .addCase(fetchLogoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.user = {};
        state.loggedIn = false;
        state.token = null;
        state.loading = false;
        state.error = null;
      })
        .addCase(fetchLogoutUser.rejected, (state,action) => {
          state.loggedIn = false;
          state.loading = false;
          state.error = action.payload; // ✅ Show error
        })
    
    builder
      .addCase(updateAccountDetails.pending, (state) => {
        state.updateAccountLoading = true;
        state.updateAccountStatus = "loading";
        state.updateAccountError = null;
      })
      .addCase(updateAccountDetails.fulfilled, (state,action) => {
        state.updateAccountLoading = false;
        state.updateAccountStatus = 'success';
        if (action.payload) {
          state.user = {
            ...state.user,
            avatar: action.payload?.avatar,
            coverImage: action.payload?.coverImage,
            fullname: action.payload?.fullname,
            username: action.payload?.username,
            email: action.payload?.email
          };
        }
      })
      .addCase(updateAccountDetails.rejected, (state,action) => {
        state.updateAccountLoading = false;
        state.updateAccountStatus = "failed";
        state.updateAccountError = action.payload;
      })
    
    builder
      .addCase(updateAvatar.pending, (state) => {
        state.updateAvatarStatus = "loading";
        state.updateAvatarProgress = 0;
        state.updateAvatarError = null;
      })
      .addCase(updateAvatar.fulfilled, (state,action) => {
        state.updateAvatarStatus = "success";
        state.updateAvatarProgress = 100;
        state.updateAvatarError = null;
        if (action.payload?.avatar) {
          state.user.avatar = action.payload.avatar;
        }
      })
      .addCase(updateAvatar.rejected, (state,action) => {
        state.updateAvatarStatus = "failed";
        state.updateAvatarProgress = 0;
        state.updateAvatarError = action.payload;
      })
    
    builder
      .addCase(updateCoverImage.pending, (state) => {
        state.updateCoverImageProgress = 0;
        state.updateCoverImageStatus = "loading";
        state.updateCoverImageError = null;
      })
      .addCase(updateCoverImage.fulfilled, (state,action) => {
        state.updateCoverImageProgress = action.payload;
        state.updateCoverImageProgress = 100;
        state.updateCoverImageStatus = "success";
        if (action.payload?.coverImage) {
          state.user.coverImage = action.payload.coverImage;
        }

      })
      .addCase(updateCoverImage.rejected, (state,action) => {
        state.updateCoverImageProgress = 0;
        state.updateCoverImageStatus = "failed";
        state.updateCoverImageError = action.payload;
      })
    
    // builder.addCase(currentUpdatedUser.fulfilled, (state, action) => {
    //     state.user = action.payload;
    //   })
  },
});



export const { login, logOut, setLoading, setError, setSideActive,setSettingsActive,setUpdateAvatarProgress,setUpdateCoverImageProgress,setAuth } =
  userSlice.actions;
export default userSlice.reducer;
