import api from "./axios";

export const getShorts = () => api.get("/short");

export const createShort = (data) =>
    api.post("/shorts/short", data);

export const getUserShorts = (userId) =>
    api.get(`/shorts/user/${userId}`);