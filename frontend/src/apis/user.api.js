import api from "./axios";

export const checkUsername = (username) =>
    api.get(`/users/check-username?username=${username}`);

export const getChannelProfile = async (username) => {
    const { data } = await api.get(`/users/channel/${username}`);
    return data?.data;
}

export const getCurrentUser = async () => {
    const { data } = await api.get(`/users/current-user`);
    return data?.data;
}

// export const getHistory = () => api.get("/users/history");
// export const clearHistory = () => api.post("/users/clear/history");

export const updateAvatar = async (req) => {
    const { data } = await api.patch(`/users/avatar`,req);
    return data;
}

export const updateCoverImage = async (req) => {
    const { data } = await api.patch(`/users/cover-image`,req);
    return data;
}

export const getWatchHistory = async () => {
    const { data } = await api.get("/users/watch-history");
    return data?.data;
};

export const addToWatchHistory = async ({ contentId, onModel }) => {
    const { data } = await api.post("/users/watch-history", { contentId, onModel });
    return data?.data;
};

export const removeFromWatchHistory = async ({ contentId, onModel }) => {
    const { data } = await api.delete("/users/watch-history", { data: { contentId, onModel } });
    return data?.data;
};

export const clearWatchHistory = async () => {
    const { data } = await api.delete("/users/watch-history/clear");
    return data?.data;
};
