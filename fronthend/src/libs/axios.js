import axios from "axios";

// console.log(import.meta.env.VITE_APIrs_URL)

export const axiosInstance = axios.create({
    baseURL: `http://localhost:8081/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            sessionStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);