const stripTrailingSlash = (value) => String(value || "").replace(/\/+$/, "");

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || (
    import.meta.env.DEV ? "http://localhost:8081" : ""
);

if (!rawApiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is required in production");
}

export const API_BASE_URL = stripTrailingSlash(rawApiBaseUrl);

export const API_V1_BASE_URL = API_BASE_URL.endsWith("/api/v1")
    ? API_BASE_URL
    : `${API_BASE_URL}/api/v1`;
