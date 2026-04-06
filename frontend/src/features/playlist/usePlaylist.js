import { useQuery } from "@tanstack/react-query";
import { getPlaylistById } from "../../apis/playlist.api";

export const usePlaylist = (id) => {
    return useQuery({
        queryKey: ["playlist",id],
        queryFn: (id) => getPlaylistById(id),
    });
};