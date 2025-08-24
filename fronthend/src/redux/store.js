import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user.js';
import videoReducer from "./features/videos.js";
import shortReducer from "./features/shorts.js";
import commentsReducer from './features/comment.js';
import likesReducer from "./features/likes.js"
import subscriberReducer from "./features/subcribers.js";
import playlistReducer from "./features/playList.js";
import uploadReducer from "./features/uploads.js";
import channelReducer from "./features/channel.js";
import { combineReducers } from '@reduxjs/toolkit';
import sessionStorage from "redux-persist/lib/storage/session";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage: sessionStorage,
  whitelist: ['user'],
};

// const rootReducer = combineReducers({
//   user: userReducer,
// });

const rootReducer = combineReducers({
  user: userReducer,
  videos: videoReducer,
  shorts: shortReducer,
  comments: commentsReducer,
  likes:likesReducer,
  subscriber: subscriberReducer,
  uploads: uploadReducer,
  Playlists: playlistReducer,
  channels:channelReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.MODE !== "production",
});


export const persistor = persistStore(store);
export default store;