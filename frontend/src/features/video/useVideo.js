import { useQuery } from "@tanstack/react-query";
import { getVideoById } from "../../apis/video.api";

export const useVideo = (id) => {
    return useQuery({
        queryKey: ["video", id],
        queryFn: () => getVideoById(id),
        enabled: !!id,
    });
};