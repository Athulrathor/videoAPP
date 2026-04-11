import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "../../apis/video.api";

// export const useFeed = () => {
//     return useInfiniteQuery({
//         queryKey: ["feed"],

//         queryFn: ({ pageParam = null }) =>
//             getFeed({ cursor: pageParam }),

//         getNextPageParam: (lastPage) => {
//             return lastPage.nextCursor || undefined;
//         },
//     });
// };

export const useFeed = () => {
    return useInfiniteQuery({
        queryKey: ["feed"],
        queryFn: ({ pageParam = null, signal }) =>
            getFeed({ cursor: pageParam, signal }),
        getNextPageParam: (lastPage) =>
            lastPage?.data?.hasNextPage ? lastPage.data.nextCursor : undefined,
        initialPageParam: null,
    });
};
