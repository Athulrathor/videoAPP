import api from "./axios";

// 🎥 VIDEO
export const toggleVideoLike = async (videoId) => {
    const res = await api.post(`/likes/videos/${videoId}`);
    return res.data.data; // { isLiked, count }
};

export const toggleShortLike = async (shortId) => {
    const res = await api.post(`/likes/shorts/${shortId}`);
    return res.data.data; // { isLiked, count }
};

export const toggleCommentLike = async (commentId) => {
    const res = await api.post(`/likes/comments/${commentId}`);
    return res.data.data; // { isLiked, count }
};