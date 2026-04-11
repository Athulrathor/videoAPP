import axios from "axios";
import { store } from "../apps/store";
import { setCredentials, logout } from "../features/auth/authSlice";
import { API_V1_BASE_URL } from "../config/env";

const api = axios.create({
    baseURL: API_V1_BASE_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (originalRequest.url?.includes("/users/refreshtoken")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(
                    `${API_V1_BASE_URL}/users/refreshtoken`,
                    {},
                    { withCredentials: true }
                );

                const accessToken = response.data?.data?.accessToken;
                const currentUser = store.getState().auth.user;

                if (!accessToken) {
                    store.dispatch(logout());
                    return Promise.reject(error);
                }

                store.dispatch(
                    setCredentials({
                        user: currentUser,
                        accessToken,
                    })
                );

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                processQueue(null, accessToken);

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                store.dispatch(logout());
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
