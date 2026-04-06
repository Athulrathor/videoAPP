import api from "./axios";

export const toggleSubscribe = (channelId) =>
    api.post(`/subcriber/${channelId}`);

export const getSubscriptionStatus = (channelId) =>
    api.get(`/subcriber/${channelId}/status`);