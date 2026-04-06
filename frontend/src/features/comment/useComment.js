import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
    getComments,
    getReplies,
    addComment,
    addReplies,
    updateCommentOrReply,
    deleteComment,
} from "../../apis/comment.api";

export const useComments = (contentId, onModel = "Video") => {
    return useInfiniteQuery({
        queryKey: ["comments", onModel, contentId],
        queryFn: async ({ pageParam = null }) => {
            const params = {
                limit: 10,
                ...(pageParam || {}),
            };

            const res = await getComments(contentId, params);

            return res.data.data; // { data, nextCursor, hasNextPage }
        },
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
        enabled: !!contentId,
        initialPageParam: null,
    });
};

export const useReplies = (commentId) => {
    return useInfiniteQuery({
        queryKey: ["replies", commentId],
        queryFn: async ({ pageParam = null }) => {
            const params = {
                limit: 10,
                ...(pageParam || {}),
            };

            const res = await getReplies(commentId, params);

            return res.data.data; // { data, nextCursor, hasNextPage } OR adapt if backend returns plain array
        },
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
        enabled: !!commentId,
        initialPageParam: null,
    });
};

export const useAddComment = (contentId, onModel) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content) => addComment(contentId, content, onModel),

        onSuccess: (res) => {
            const newComment = res?.data?.data;
            if (!newComment) return;

            queryClient.setQueryData(["comments", onModel, contentId], (old) => {
                if (!old) {
                    return {
                        pages: [{ data: [newComment], nextCursor: null, hasNextPage: false }],
                        pageParams: [null],
                    };
                }

                return {
                    ...old,
                    pages: old.pages.map((page, index) =>
                        index === 0
                            ? { ...page, data: [newComment, ...(page.data || [])] }
                            : page
                    ),
                };
            });

            if (onModel === "Video") {
                queryClient.setQueryData(["video", contentId], (old) =>
                    old
                        ? { ...old, commentCount: (old.commentCount || 0) + 1 }
                        : old
                );
            }

            if (onModel === "Short") {
                queryClient.setQueryData(["short", contentId], (old) =>
                    old
                        ? { ...old, commentCount: (old.commentCount || 0) + 1 }
                        : old
                );
            }

            queryClient.invalidateQueries({
                queryKey: ["comments", onModel, contentId],
            });
        },
    });
};

export const useAddReplies = (contentId, onModel) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, content }) => addReplies(commentId, content),

        onSuccess: (res, variables) => {
            const newReply = res?.data?.data;
            if (!newReply) return;

            queryClient.setQueryData(["replies", variables.commentId], (old) => {
                if (!old) {
                    return {
                        pages: [{ data: [newReply], nextCursor: null, hasNextPage: false }],
                        pageParams: [null],
                    };
                }

                return {
                    ...old,
                    pages: old.pages.map((page, index) =>
                        index === 0
                            ? { ...page, data: [newReply, ...(page.data || [])] }
                            : page
                    ),
                };
            });

            queryClient.setQueryData(["comments", onModel, contentId], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: (page.data || []).map((comment) =>
                            comment._id === variables.commentId
                                ? {
                                    ...comment,
                                    replyCount: (comment.replyCount || 0) + 1,
                                }
                                : comment
                        ),
                    })),
                };
            });

            queryClient.invalidateQueries({
                queryKey: ["replies", variables.commentId],
            });
        },
    });
};

export const useUpdateComment = (defaultCommentId, contentId, onModel = "Video") => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => {
            if (typeof payload === "string") {
                return updateCommentOrReply(defaultCommentId, payload);
            }

            return updateCommentOrReply(payload.commentId, payload.content);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments", onModel, contentId],
            });

            queryClient.invalidateQueries({
                queryKey: ["replies"],
            });
        },
    });
};

export const useDeleteComment = (contentId, onModel = "Video") => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId }) => deleteComment(commentId),

        onSuccess: (_, variables) => {
            const { commentId, parentCommentId, isReply } = variables;

            if (isReply && parentCommentId) {
                queryClient.setQueryData(["replies", parentCommentId], (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            data: (page.data || []).filter((reply) => reply._id !== commentId),
                        })),
                    };
                });

                queryClient.setQueryData(["comments", onModel, contentId], (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            data: (page.data || []).map((comment) =>
                                comment._id === parentCommentId
                                    ? {
                                        ...comment,
                                        replyCount: Math.max(0, (comment.replyCount || 0) - 1),
                                    }
                                    : comment
                            ),
                        })),
                    };
                });
            } else {
                queryClient.setQueryData(["comments", onModel, contentId], (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            data: (page.data || []).filter((comment) => comment._id !== commentId),
                        })),
                    };
                });

                if (onModel === "Video") {
                    queryClient.setQueryData(["video", contentId], (old) =>
                        old
                            ? {
                                ...old,
                                commentCount: Math.max(0, (old.commentCount || 0) - 1),
                            }
                            : old
                    );
                }

                if (onModel === "Short") {
                    queryClient.setQueryData(["short", contentId], (old) =>
                        old
                            ? {
                                ...old,
                                commentCount: Math.max(0, (old.commentCount || 0) - 1),
                            }
                            : old
                    );
                }
            }

            queryClient.invalidateQueries({
                queryKey: ["comments", onModel, contentId],
            });
        },
    });
};