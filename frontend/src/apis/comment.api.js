import api from "./axios";

// 🎥 ADD COMMENT
export const addComment = (contentId, content, onModel) =>
    api.post(`/comments/add-comment/${contentId}`, {
        content, onModel
    });

// 💬 ADD REPLY
export const addReplies = (commentId, content) =>
    api.post(`/comments/add-replies/${commentId}`, {
        content,
    });

//  UPDATE COMMENT OR REPLIES
export const updateCommentOrReply = (commentId, content) =>
    api.post(`/comments/update-comment/${commentId}`, {
        content,
    });

// DELETE COMMENT
export const deleteComment = (commentId) =>
    api.delete(`/comments/delete-comment/${commentId}`);

// 📥 GET COMMENTS
// export const getComments = (contentId) =>
//     api.get(`/comments/get-comment/${contentId}`);

export const getComments = (contentId, params = {}) =>
    api.get(`/comments/get-comment/${contentId}`, { params });

//  GET COMMENT OF COMMENT (MEAN REPLIES)
// export const getReplies = (commentId) =>
//     api.get(`/comments/get-replies/${commentId}`);

export const getReplies = (commentId, params = {}) =>
    api.get(`/comments/get-replies/${commentId}`, { params });