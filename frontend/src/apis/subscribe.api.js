import api from "./axios";

export const toggleSubscribe = async (channelId) => {
    const res = await api.post(`/subscribers/${channelId}`);
    return res.data;
}

export const getSubscriptionStatus = (channelId) =>
    api.get(`/subscribers/${channelId}/status`);
