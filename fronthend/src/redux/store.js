import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user.js';
import videoReducer from "./features/videos.js";
import shortReducer from "./features/shorts.js";
import subscriberReducer from "./features/subcriptionStore.js";
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
};

// const rootReducer = combineReducers({
//   user: userReducer,
// });

const rootReducer = combineReducers({
  user: userReducer,
  videos: videoReducer,
  short: shortReducer,
  subscriber: subscriberReducer,
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