import api from "./axios";

export const getFeed = async ({ cursor }) => {
    const res = await api.get("/videos/feed", {
        params: {
            cursor,
            limit: 10,
        },
    });

    return res.data;
};

export const getVideoById = (id) =>
    api.get(`/videos/${id}`);

export const getUserVideos = (userId) =>
    api.get(`/videos/user/${userId}`);

export const createVideo = (data) =>
    api.post("/videos/video", data);