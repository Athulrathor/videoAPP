import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";
import { googleLogout } from "@react-oauth/google";

export const fetchRegisterUser = createAsyncThunk("register/userFetching", async (data, { rejectWithValue }) => {

  if (!data) return rejectWithValue("User crendencial not found!");

  try {

    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);
    
    if (data.avatar) formData.append("avatar", data.avatar);
    if (data.coverImage) formData.append("coverImage", data.coverImage);
    
    const register = await axiosInstance.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("User registered successfully!",register);
  } catch (error) {
    console.log(error)
    return rejectWithValue(error.response?.data?.message || error.message);
  }
})

export const fetchLoginUser = createAsyncThunk("login/userFetching", async ({ email, password }, { rejectWithValue }) => {

  if (!email || !password) {console.log("email :  ", email, "pass : ", password); rejectWithValue("User crendencial not found!")};

  try {
    const logging = await axiosInstance.post('/users/login', { email:email, password:password });
    sessionStorage.setItem("accessToken", logging?.data?.data?.accessToken);
    console.log(logging)
    return logging?.data?.data;
  } catch (error) {
    console.log(error)
    return rejectWithValue(error.response?.data?.message || error.message);
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
    const avatar = await axiosInstance.patch('users/avatar', data, {
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
    return avatar?.data?.data?.avatar;
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

    const coverImage = await axiosInstance.patch('users/cover-image',data , {
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
    return coverImage?.data?.data?.coverImage;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.message);
  }
})

export const updateAccountDetails = createAsyncThunk('changeAccount/userAccountDetails', async ({username,email,fullname}, { rejectWithValue }) => {

  try {
    const response = await axiosInstance.patch('users/update-account-detail', {username:username,email:email,fullname:fullname});
    console.log("User Account details change Successfull!");
    return response?.data?.data;
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
    console.log(response);
    return response.data;
  },
};

export const getWatchHistory = createAsyncThunk('fetching/userWatchHistory', async (_, { rejectWithValue }) => {
  try {
    const history = await axiosInstance.get('users/history');
    console.log("user History Fetched Successfully!");
    console.log(history?.data?.data?.watchHistory)
    return history?.data?.data?.watchHistory;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.message);
  }
})

export const addingToWatchHistory = createAsyncThunk('addingContent/userWatchHistory', async (videoId, { rejectWithValue }) => {
  if (!videoId) return rejectWithValue("videoId is missing! \n Please Provide Id");
  try {
    const added = await axiosInstance.post('users/add/history',{videoId:videoId});
    console.log("user History added Successfully!");
    return videoId;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.message);
  }
})

export const removingToWatchHistory = createAsyncThunk('removingContent/userWatchHistory', async (videoId, { rejectWithValue }) => {
  if (!videoId) return rejectWithValue("videoId is missing! \n Please Provide Id");
  try {
    await axiosInstance.post('users/remove/history', { videoId: videoId });
    console.log("user History removed Successfully!", videoId);
    return videoId;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.message);
  }
})

export const clearHistory = createAsyncThunk('clearingContent/userWatchHistory', async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post('users/clear/history');
    console.log("user History cleared Successfully!");
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.message);
  }
})

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (newPassword, { rejectWithValue }) => {
    try {
      await axiosInstance.post('users/update-password', { newPassword });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'user/verifyEmail',
  async (to, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('users/forget-password', { to });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyEmailVerification = createAsyncThunk(
  'emailValidCheck/verifyEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('users/verify-email', {email});
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const activeSessions = createAsyncThunk(
  'user/activeSessions',
  async (_, { rejectWithValue }) => {
    try {
      const activeUser = await axiosInstance.get("users/active-sessions");
      console.log(activeUser?.data.activeSessions);
      return activeUser?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginHistory = createAsyncThunk(
  'user/loginHistory',
  async ({page,limit}, { rejectWithValue }) => {
    try {
      const loginHistorys = await axiosInstance.get(`users/login-history`, { page: page, limit: limit });
      return loginHistorys?.data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutDevice = createAsyncThunk(
  'user/logoutDevice',
  async (deviceId, { rejectWithValue }) => {
    try {
      const logoutDevice = await axiosInstance.post(`users/logout-device/${deviceId}`);
      return logoutDevice?.data?.message;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyPassword = createAsyncThunk('verify/password', async (currentPassword, { rejectWithValue }) => {
  if (!currentPassword) return rejectWithValue('Current password is missing!');

  try {
    
    const response = await axiosInstance.get('user/password-check', currentPassword);
    console.log(response);
    return response?.data?.data;

  } catch (error) {
    console.error(error);
    return rejectWithValue(error.message);
  }
})

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    loading: false,
    error: null,
    token: "",
    loggedIn: false,

    deviceId: null,

    registering: false,
    registerError: null,
    registerSuccess:false,

    watchHistory:[],
    watchHistoryLoading: false,
    watchHistoryError: null,
    
    watchHistoryPaused: false,

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
    updateAccountError: null,
    
    otpLoading: false,
    isOtpVerified: false,
    otpError: null,

    emailVerified: null,
    emailVerificationLoading: false,
    emailVerificationError: null,

    activeSession: [],
    loginHistory: [],
    logoutDeviceMessage:null,
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
    },

    setWatchHistoryPaused: (state) => {
      state.watchHistoryPaused = !state.watchHistoryPaused;
    },

  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.registering = true;
        state.registerError = null;
      })
      .addCase(fetchRegisterUser.fulfilled, (state) => {
        state.registering = false;
        state.registerError = null;
        state.registerSuccess = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.registering = false;
        state.registerError = action.payload || "Registration failed";
        state.registerSuccess = false;
      });

    builder
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || {};
        state.deviceId = action.payload?.deviceInfo?.deviceId || null;
        state.loggedIn = true;
        state.token = action.payload?.accessToken || null;
        state.error = null;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.loggedIn = false;
        state.token = null;
        state.error = action.payload || "Login failed";
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
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.user.avatar = action.payload;
        state.updateAvatarStatus = "success";
        state.updateAvatarProgress = 100;
        state.updateAvatarError = null;
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
        state.user.coverImage = action.payload;
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
    
    builder.addCase(getWatchHistory.fulfilled, (state, action) => {
      state.watchHistory = Array.isArray(action.payload) ? action.payload : [];
      state.watchHistoryLoading = false;
      state.watchHistoryError = null;
    }).addCase(getWatchHistory.pending, (state) => {
      state.watchHistoryLoading = true;
      state.watchHistoryError = null;
    }).addCase(getWatchHistory.rejected, (state, action) => {
      state.watchHistoryError = action.payload;
      state.watchHistoryLoading = false;
      state.watchHistory = [];
    })

    builder.addCase(addingToWatchHistory.fulfilled, (state, action) => {
      state.watchHistory = [...state.watchHistory, action.payload];
      state.watchHistoryLoading = false;
      state.watchHistoryError = null;
    }).addCase(addingToWatchHistory.pending, (state) => {
      state.watchHistoryLoading = true;
      state.watchHistoryError = null;
    }).addCase(addingToWatchHistory.rejected, (state, action) => {
      state.watchHistoryError = action.payload;
      state.watchHistoryLoading = false;
    })

    builder.addCase(removingToWatchHistory.fulfilled, (state, action) => {
      state.watchHistory = state.watchHistory.filter(video => video._id !== action.payload);
      state.watchHistoryLoading = false;
      state.watchHistoryError = null;
    }).addCase(removingToWatchHistory.pending, (state) => {
      state.watchHistoryLoading = true;
      state.watchHistoryError = null;
    }).addCase(removingToWatchHistory.rejected, (state, action) => {
      state.watchHistoryError = action.payload;
      state.watchHistoryLoading = false;
    })

    builder.addCase(clearHistory.fulfilled, (state) => {
      state.watchHistory = [];
      state.watchHistoryLoading = false;
      state.watchHistoryError = null;
    }).addCase(clearHistory.pending, (state) => {
      state.watchHistoryLoading = true;
      state.watchHistoryError = null;
    }).addCase(clearHistory.rejected, (state, action) => {
      state.watchHistoryError = action.payload;
      state.watchHistoryLoading = false;
    })

    builder.addCase(verifyEmail.pending, (state) => {
        state.emailVerificationLoading = true;
        state.emailVerificationError = null;
      })
      .addCase(verifyEmail.fulfilled, (state,action) => {
        state.emailVerificationLoading = false;
        state.emailVerified = action.payload;
        state.emailVerificationError = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.emailVerificationLoading = false;
        state.emailVerificationError = action.payload;
      })
    
    builder.addCase(verifyEmailVerification.pending, (state) => {
      state.emailVerificationLoading = true;
      state.emailVerificationError = null;
    })
      .addCase(verifyEmailVerification.fulfilled, (state, action) => {
        state.emailVerificationLoading = false;
        state.emailVerified = action.payload;
        state.emailVerificationError = null;
      })
      .addCase(verifyEmailVerification.rejected, (state, action) => {
        state.emailVerificationLoading = false;
        state.emailVerificationError = action.payload;
      })

    builder.addCase(updatePassword.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpError = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload;
      });
    
    builder.addCase(activeSessions.pending, (state) => {
      state.activeSession = [];
    })
      .addCase(activeSessions.fulfilled, (state,action) => {
        state.activeSession = action.payload?.activeSessions || [];
      })
      .addCase(activeSessions.rejected, (state) => {
        state.activeSession = [];
      });
    
    builder.addCase(loginHistory.pending, (state) => {
      state.loginHistory = [];
    })
      .addCase(loginHistory.fulfilled, (state, action) => {
        state.loginHistory = action.payload || [];
      })
      .addCase(loginHistory.rejected, (state) => {
        state.loginHistory = [];
      });
    
    builder.addCase(logoutDevice.pending, (state) => {
      state.logoutDeviceMessage = null;
    })
      .addCase(logoutDevice.fulfilled, (state, action) => {
        state.logoutDeviceMessage = action.payload;
      })
      .addCase(logoutDevice.rejected, (state) => {
        state.logoutDeviceMessage = null;
      });
  },
});

export const { logOut, setSideActive, setSettingsActive, setUpdateAvatarProgress, setUpdateCoverImageProgress, setAuth, setWatchHistoryPaused } =
  userSlice.actions;
export default userSlice.reducer;
