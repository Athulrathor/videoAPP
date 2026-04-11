import api from "./axios";

export const getFeed = async ({ cursor = null, query = "", signal }) => {
    const res = await api.get("/videos/feed", {
        params: {
            cursor,
            limit: 10,
            query,
        },
        signal,
    });

    return res?.data;
};

export const getVideoSuggestions = async (query, signal) => {
    const q = String(query || "").trim();

    if (!q) return [];

    const res = await api.get("/videos/suggestions", {
        params: { query: q },
        signal,
    });

    return res.data?.data || [];
};

export const getVideoById = (id) =>
    api.get(`/videos/${id}`);

export const getUserVideos = (userId) =>
    api.get(`/videos/user/${userId}`);

export const createVideo = (data) =>
    api.post("/videos/video", data);

export const updateVideo = (videoId, data) =>
    api.patch(`/videos/${videoId}`, data);
