import api from "./axios";

export const createPlaylist = (data) =>
    api.post("/playlist", data);

export const getUserPlaylists = (userId) =>
    api.get(`/playlist/user/${userId}`);

export const getPlaylistById = (id) =>
    api.get(`/playlist/${id}`);

export const addVideoToPlaylist = (playlistId, videoId) =>
    api.post(`/playlist/${playlistId}/videos`, { videoId });

export const removeVideoFromPlaylist = (playlistId, videoId) =>
    api.delete(`/playlist/${playlistId}/videos/${videoId}`);