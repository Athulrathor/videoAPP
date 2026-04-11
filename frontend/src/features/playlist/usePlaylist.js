import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createPlaylist,
    getPlaylistById,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist,
} from "../../apis/playlist.api";


export const useUserPlaylists = (userId, params = {}) => {
    return useQuery({
        queryKey: ["playlists", userId, params],
        queryFn: () => getUserPlaylists(userId, params),
        enabled: !!userId,
        select: (res) => res.data?.data || [],
    });
};

export const usePlaylist = (playlistId, params = {}) => {
    return useQuery({
        queryKey: ["playlist", playlistId, params],
        queryFn: () => getPlaylistById(playlistId, params),
        enabled: !!playlistId,
        select: (res) => res.data?.data,
    });
};

export const useCreatePlaylist = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createPlaylist,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["playlists"] });
        },
    });
};

export const useAddVideoToPlaylist = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ playlistId, arrayVideoId }) =>
            addVideoToPlaylist(playlistId, arrayVideoId),
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
            qc.invalidateQueries({ queryKey: ["playlists"] });
        },
    });
};

export const useRemoveVideoFromPlaylist = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ playlistId, videoId }) =>
            removeVideoFromPlaylist(playlistId, videoId),
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
            qc.invalidateQueries({ queryKey: ["playlists"] });
        },
    });
};

export const useUpdatePlaylist = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ playlistId, data }) => updatePlaylist(playlistId, data),
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
            qc.invalidateQueries({ queryKey: ["playlists"] });
        },
    });
};

export const useDeletePlaylist = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deletePlaylist,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["playlists"] });
        },
    });
};