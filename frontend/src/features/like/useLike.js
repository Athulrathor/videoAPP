import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    toggleVideoLike,
    toggleShortLike,
    toggleCommentLike,
} from "../../apis/like.api";

function patchEntityShape(old, updater) {
    if (!old) return old;

    const entity = old?.data?.data ?? old;
    if (!entity) return old;

    const next = updater(entity);

    if (old?.data?.data) {
        return {
            ...old,
            data: {
                ...old.data,
                data: next,
            },
        };
    }

    return next;
}

export const useToggleVideoLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleVideoLike,

        onMutate: async (videoId) => {
            await queryClient.cancelQueries({ queryKey: ["video", videoId] });

            const previousVideo = queryClient.getQueryData(["video", videoId]);

            queryClient.setQueryData(["video", videoId], (old) =>
                patchEntityShape(old, (video) => {
                    const nextLiked = !video.isLiked;
                    const nextCount = Math.max(
                        0,
                        (video.likeCount || 0) + (nextLiked ? 1 : -1)
                    );

                    return {
                        ...video,
                        isLiked: nextLiked,
                        likeCount: nextCount,
                    };
                })
            );

            return { previousVideo };
        },

        onError: (_err, videoId, context) => {
            if (context?.previousVideo) {
                queryClient.setQueryData(["video", videoId], context.previousVideo);
            }
        },

        onSuccess: (data, videoId) => {
            queryClient.setQueryData(["video", videoId], (old) =>
                patchEntityShape(old, (video) => ({
                    ...video,
                    isLiked: data.isLiked,
                    likeCount: data.count,
                }))
            );
        },

        // Re-enable this only if your getVideoById endpoint returns
        // both isLiked and likeCount correctly.
        // onSettled: (_data, _err, videoId) => {
        //     queryClient.invalidateQueries({ queryKey: ["video", videoId] });
        // },
    });
};

export const useToggleShortLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleShortLike,

        onMutate: async (shortId) => {
            await queryClient.cancelQueries({ queryKey: ["short", shortId] });

            const previousShort = queryClient.getQueryData(["short", shortId]);

            queryClient.setQueryData(["short", shortId], (old) =>
                patchEntityShape(old, (short) => {
                    const nextLiked = !short.isLiked;
                    const nextCount = Math.max(
                        0,
                        (short.likeCount || 0) + (nextLiked ? 1 : -1)
                    );

                    return {
                        ...short,
                        isLiked: nextLiked,
                        likeCount: nextCount,
                    };
                })
            );

            return { previousShort };
        },

        onError: (_err, shortId, context) => {
            if (context?.previousShort) {
                queryClient.setQueryData(["short", shortId], context.previousShort);
            }
        },

        onSuccess: (data, shortId) => {
            queryClient.setQueryData(["short", shortId], (old) =>
                patchEntityShape(old, (short) => ({
                    ...short,
                    isLiked: data.isLiked,
                    likeCount: data.count,
                }))
            );
        },

        // Same note here.
        // onSettled: (_data, _err, shortId) => {
        //     queryClient.invalidateQueries({ queryKey: ["short", shortId] });
        // },
    });
};

export const useToggleCommentLike = (contentId, onModel = "Video") => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleCommentLike,

        onMutate: async (commentId) => {
            await queryClient.cancelQueries({
                queryKey: ["comments", onModel, contentId],
            });

            const previousComments = queryClient.getQueryData([
                "comments",
                onModel,
                contentId,
            ]);

            const previousReplies = queryClient.getQueriesData({
                queryKey: ["replies"],
            });

            const patchItem = (item) => {
                if (item._id !== commentId) return item;

                const nextLiked = !item.isLiked;
                const nextCount = Math.max(
                    0,
                    (item.likeCount || 0) + (nextLiked ? 1 : -1)
                );

                return {
                    ...item,
                    isLiked: nextLiked,
                    likeCount: nextCount,
                };
            };

            queryClient.setQueryData(["comments", onModel, contentId], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: (page.data || []).map(patchItem),
                    })),
                };
            });

            previousReplies.forEach(([queryKey, queryData]) => {
                if (!queryData) return;

                queryClient.setQueryData(queryKey, {
                    ...queryData,
                    pages: queryData.pages.map((page) => ({
                        ...page,
                        data: (page.data || []).map(patchItem),
                    })),
                });
            });

            return { previousComments, previousReplies };
        },

        onError: (_err, _commentId, context) => {
            if (context?.previousComments) {
                queryClient.setQueryData(
                    ["comments", onModel, contentId],
                    context.previousComments
                );
            }

            context?.previousReplies?.forEach(([queryKey, queryData]) => {
                queryClient.setQueryData(queryKey, queryData);
            });
        },

        onSuccess: (data, commentId) => {
            const patchItem = (item) =>
                item._id === commentId
                    ? {
                        ...item,
                        isLiked: data.isLiked,
                        likeCount: data.count,
                    }
                    : item;

            queryClient.setQueryData(["comments", onModel, contentId], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: (page.data || []).map(patchItem),
                    })),
                };
            });

            const replyQueries = queryClient.getQueriesData({
                queryKey: ["replies"],
            });

            replyQueries.forEach(([queryKey, queryData]) => {
                if (!queryData) return;

                queryClient.setQueryData(queryKey, {
                    ...queryData,
                    pages: queryData.pages.map((page) => ({
                        ...page,
                        data: (page.data || []).map(patchItem),
                    })),
                });
            });
        },

        // Re-enable only if refetched comments/replies include isLiked + likeCount correctly.
        // onSettled: () => {
        //     queryClient.invalidateQueries({
        //         queryKey: ["comments", onModel, contentId],
        //     });
        //     queryClient.invalidateQueries({
        //         queryKey: ["replies"],
        //     });
        // },
    });
};