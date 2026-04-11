import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserVideos, getVideoById, updateVideo } from "../../apis/video.api";

export const useVideo = (id) => {
    return useQuery({
        queryKey: ["video", id],
        queryFn: () => getVideoById(id),
        enabled: !!id,
    });
};

export const useUserVideos = (userId) => {
    return useQuery({
        queryKey: ["userVideos", userId],
        queryFn: () => getUserVideos(userId),
        enabled: !!userId,
        select: (res) => res.data?.data?.videos || [],
    });
};

export const useUpdateVideo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ videoId, data }) => updateVideo(videoId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["video", variables.videoId] });
            queryClient.invalidateQueries({ queryKey: ["playlist"] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
    });
};
