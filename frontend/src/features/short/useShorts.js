import { useQuery } from "@tanstack/react-query";
import { getShorts } from "../../apis/short.api";

export const useShorts = () => {
    return useQuery({
        queryKey: ["shorts"],
        queryFn: () => { return getShorts(); },
    });
};