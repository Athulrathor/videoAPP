import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleShortLike } from "../../apis/like.api";

export const useToggleShortLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleShortLike,

        onMutate: async (shortId) => {
            await queryClient.cancelQueries({ queryKey: ["short", shortId] });

            const previousShort = queryClient.getQueryData(["short", shortId]);

            queryClient.setQueryData(["short", shortId], (old) => {
                const short = old?.data?.data;
                if (!short) return old;

                const nextLiked = !short.isLiked;
                const nextCount = Math.max(0, (short.likesCount || 0) + (nextLiked ? 1 : -1));

                return {
                    ...old,
                    data: {
                        ...old.data,
                        data: {
                            ...short,
                            isLiked: nextLiked,
                            likesCount: nextCount,
                        },
                    },
                };
            });

            return { previousShort };
        },

        onError: (_err, shortId, context) => {
            if (context?.previousShort) {
                queryClient.setQueryData(["short", shortId], context.previousShort);
            }
        },

        onSuccess: (res, shortId) => {
            const data = res?.data?.data;

            queryClient.setQueryData(["short", shortId], (old) => {
                const short = old?.data?.data;
                if (!short || !data) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        data: {
                            ...short,
                            isLiked: data.isLiked,
                            likesCount: data.count,
                        },
                    },
                };
            });
        },

        onSettled: (_data, _err, shortId) => {
            queryClient.invalidateQueries({ queryKey: ["short", shortId] });
        },
    });
};