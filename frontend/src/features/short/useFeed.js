import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "../../apis/short.api";

export const useFeed = () => {
    return useInfiniteQuery({
        queryKey: ["Shortfeeds"],

        queryFn: ({ pageParam = null }) =>
            getFeed({ cursor: pageParam }),

        getNextPageParam: (lastPage) => {
            return lastPage.nextCursor || undefined;
        },
    });
};