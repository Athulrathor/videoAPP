import { useQuery } from "@tanstack/react-query";
import { getChannelProfile } from "../../apis/user.api";

export const useChannel = (username) => {
    return useQuery({
        queryKey: ["channel", username],
        queryFn: () => getChannelProfile(username),
        enabled: !!username,
    });
};