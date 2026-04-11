import api from "./axios";

export const createPlaylist = (data) => api.post("/playlists/", data);

export const getUserPlaylists = (userId, params = {}) =>
    api.get(`/playlists/user/${userId}`, { params });

export const getPlaylistById = (playlistId, params = {}) =>
    api.get(`/playlists/${playlistId}`, { params });

// backend expects arrayVideoId in req.body right now
export const addVideoToPlaylist = (playlistId, arrayVideoId) =>
    api.post(`/playlists/${playlistId}/videos`, {
        playlistId,
        arrayVideoId,
    });

export const removeVideoFromPlaylist = (playlistId, videoId) =>
    api.delete(`/playlists/${playlistId}/videos/${videoId}`);

export const updatePlaylist = (playlistId, data) =>
    api.patch(`/playlists/${playlistId}`, data);

export const deletePlaylist = (playlistId) =>
    api.delete(`/playlists/${playlistId}`);
