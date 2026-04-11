import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSubscribe } from "../../apis/subscribe.api";

export const useSubscribe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleSubscribe,

        onMutate: async (channelId) => {
            await queryClient.cancelQueries({ queryKey: ["channelProfile"] });
            await queryClient.cancelQueries({ queryKey: ["video"] });
            await queryClient.cancelQueries({ queryKey: ["shortFeed"] });
            await queryClient.cancelQueries({ queryKey: ["feed"] });

            const previousChannelProfiles = queryClient.getQueriesData({
                queryKey: ["channelProfile"],
            });

            const previousVideos = queryClient.getQueriesData({
                queryKey: ["video"],
            });

            const previousShortFeeds = queryClient.getQueriesData({
                queryKey: ["shortFeed"],
            });

            const previousFeeds = queryClient.getQueriesData({
                queryKey: ["feed"],
            });

            const updateOwner = (item) => {
                if (!item?.owner || item.owner._id !== channelId) return item;

                const nextSubscribed = !item.owner.isSubscribed;
                const nextCount = Math.max(
                    0,
                    (item.owner.subscriberCount || 0) + (nextSubscribed ? 1 : -1)
                );

                return {
                    ...item,
                    owner: {
                        ...item.owner,
                        isSubscribed: nextSubscribed,
                        subscriberCount: nextCount,
                    },
                };
            };

            // channel profile
            queryClient.setQueriesData({ queryKey: ["channelProfile"] }, (old) => {
                if (!old) return old;

                const channel = old?.data || old;
                if (!channel || channel._id !== channelId) return old;

                const nextSubscribed = !channel.isSubscribed;
                const nextCount = Math.max(
                    0,
                    (channel.subscriberCount || 0) + (nextSubscribed ? 1 : -1)
                );

                if (old.data) {
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            isSubscribed: nextSubscribed,
                            subscriberCount: nextCount,
                        },
                    };
                }

                return {
                    ...old,
                    isSubscribed: nextSubscribed,
                    subscriberCount: nextCount,
                };
            });

            // video detail
            queryClient.setQueriesData({ queryKey: ["video"] }, (old) => {
                if (!old?.data?.data) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        data: updateOwner(old.data.data),
                    },
                };
            });

            // shorts infinite query variants
            const patchInfiniteFeed = (old) => {
                if (!old?.pages) return old;

                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: {
                            ...page.data,
                            shorts: (page.data?.shorts || []).map((short) => updateOwner(short)),
                        },
                    })),
                };
            };

            queryClient.setQueriesData({ queryKey: ["shortFeed"] }, patchInfiniteFeed);
            queryClient.setQueriesData({ queryKey: ["feed"] }, patchInfiniteFeed);

            return {
                previousChannelProfiles,
                previousVideos,
                previousShortFeeds,
                previousFeeds,
            };
        },

        onError: (_error, _channelId, context) => {
            context?.previousChannelProfiles?.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });

            context?.previousVideos?.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });

            context?.previousShortFeeds?.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });

            context?.previousFeeds?.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });
        },

        onSuccess: (response, channelId) => {
            const payload = response?.data || response;
            const finalSubscribed = payload?.isSubscribed;
            const finalCount = payload?.subscriberCount;

            if (typeof finalSubscribed !== "boolean") return;

            const syncOwner = (item) => {
                if (!item?.owner || item.owner._id !== channelId) return item;

                return {
                    ...item,
                    owner: {
                        ...item.owner,
                        isSubscribed: finalSubscribed,
                        subscriberCount: finalCount,
                    },
                };
            };

            queryClient.setQueriesData({ queryKey: ["channelProfile"] }, (old) => {
                if (!old) return old;

                const channel = old?.data || old;
                if (!channel || channel._id !== channelId) return old;

                if (old.data) {
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            isSubscribed: finalSubscribed,
                            subscriberCount: finalCount,
                        },
                    };
                }

                return {
                    ...old,
                    isSubscribed: finalSubscribed,
                    subscriberCount: finalCount,
                };
            });

            queryClient.setQueriesData({ queryKey: ["video"] }, (old) => {
                if (!old?.data?.data) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        data: syncOwner(old.data.data),
                    },
                };
            });

            const patchInfiniteFeed = (old) => {
                if (!old?.pages) return old;

                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: {
                            ...page.data,
                            shorts: (page.data?.shorts || []).map((short) => syncOwner(short)),
                        },
                    })),
                };
            };

            queryClient.setQueriesData({ queryKey: ["shortFeed"] }, patchInfiniteFeed);
            queryClient.setQueriesData({ queryKey: ["feed"] }, patchInfiniteFeed);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["channelProfile"] });
            queryClient.invalidateQueries({ queryKey: ["video"] });
            queryClient.invalidateQueries({ queryKey: ["shortFeed"] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
    });
};