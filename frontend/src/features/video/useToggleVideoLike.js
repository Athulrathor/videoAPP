import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVideoLike } from "../../apis/like.api";

export const useToggleVideoLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleVideoLike,

        onSuccess: (data, videoId) => {
            queryClient.setQueryData(["video", videoId], (old) =>
                old
                    ? {
                        ...old,
                        likeCount: data.count,
                        isLiked: data.isLiked,
                    }
                    : old
            );

            queryClient.invalidateQueries({
                queryKey: ["video", videoId],
            });
        },
    });
};