import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSubscribe } from "../../apis/subscribe.api";

export const useSubscribe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleSubscribe,
        onSuccess: () => {
            queryClient.invalidateQueries(["channel"]);
        },
    });
};