import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleCommentLike } from "../../apis/like.api";

export const useToggleCommentLike = (contentId, onModel = "Video") => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleCommentLike,

        onSuccess: (data, commentId) => {
            queryClient.setQueryData(["comments", onModel, contentId], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: (page.data || []).map((comment) =>
                            comment._id === commentId
                                ? {
                                    ...comment,
                                    likeCount: data.count,
                                    isLiked: data.isLiked,
                                }
                                : comment
                        ),
                    })),
                };
            });

            queryClient.setQueryData(["replies", commentId], (old) => old);

            queryClient.invalidateQueries({
                queryKey: ["comments", onModel, contentId],
            });
        },
    });
};