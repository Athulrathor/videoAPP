import api from "./axios";

// export const getShorts = () => api.get("/shorts");

export const getFeed = async ({ cursor }) => {
    const res = await api.get("/shorts/feed", {
        params: {
            cursor,
            limit: 10,
        },
    });

    return res.data;
};

export const createShort = (data) =>
    api.post("/shorts/short", data);

export const getUserShorts = (userId) =>
    api.get(`/shorts/user/${userId}`);
