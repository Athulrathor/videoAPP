import { useQuery } from "@tanstack/react-query";
import { getFeed } from "../../apis/video.api";

export const useVideos = () => {
    return useQuery({
        queryKey: ["videos"],
        queryFn: () => getFeed(),
    });
};