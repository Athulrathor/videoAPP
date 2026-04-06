import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
// import storage from "redux-persist/lib/storage/index.js";
import authReducer from "../features/auth/authSlice";

const storage = {
    getItem: (key) => {
        return Promise.resolve(localStorage.getItem(key));
    },
    setItem: (key, value) => {
        localStorage.setItem(key, value);
        return Promise.resolve();
    },
    removeItem: (key) => {
        localStorage.removeItem(key);
        return Promise.resolve();
    },
};

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["user", "isAuthenticated", "accessToken"],
}; 

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // ✅ Required — these redux-persist actions carry non-serializable values
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// ✅ This is what actually writes/reads from localStorage
export const persistor = persistStore(store);