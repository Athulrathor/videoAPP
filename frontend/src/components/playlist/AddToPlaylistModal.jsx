import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ListVideo, X } from "lucide-react";

import {
    useAddVideoToPlaylist,
    useUserPlaylists,
} from "../../features/playlist/usePlaylist";
import { Button } from "../ui";

function AddToPlaylistModal({ open, onClose, videoId }) {
    const { user } = useSelector((state) => state.auth);
    const { data: playlists = [], isLoading } = useUserPlaylists(user?._id);
    const { mutate, isPending } = useAddVideoToPlaylist();

    const playlistItems = useMemo(() => playlists || [], [playlists]);

    if (!open) return null;

    const handleAdd = (playlistId) => {
        if (!videoId) return;

        mutate(
            { playlistId, arrayVideoId: [videoId] },
            {
                onSuccess: () => onClose?.(),
            }
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-to-playlist-title"
        >
            <div className="flex min-h-dvh items-end justify-center p-0 sm:items-center sm:p-4">
                <div className="w-full max-w-xl overflow-hidden rounded-t-3xl border border-(--border) bg-(--surface) shadow-2xl sm:rounded-3xl">
                    <div className="flex items-center justify-between border-b border-(--border) px-4 py-4 sm:px-6">
                        <div>
                            <h2
                                id="save-to-playlist-title"
                                className="text-base font-semibold sm:text-lg"
                            >
                                Save to playlist
                            </h2>
                            <p className="mt-1 text-xs text-(--muted) sm:text-sm">
                                Choose where you want this video saved
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="h-10 w-10 rounded-full text-(--muted)"
                            aria-label="Close save to playlist modal"
                        >
                            <X size={18} />
                        </Button>
                    </div>

                    <div className="max-h-[75dvh] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                        {!videoId ? (
                            <div className="rounded-3xl border border-dashed border-(--border) px-6 py-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface2)">
                                    <ListVideo size={22} className="text-(--muted)" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold">No video selected</h3>
                                <p className="mt-2 text-sm text-(--muted)">
                                    Open this modal from a video card or watch page to save that video.
                                </p>
                            </div>
                        ) : isLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-2xl border border-(--border) bg-(--surface) px-4 py-4"
                                    >
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 rounded bg-(--surface2)" />
                                            <div className="h-3 w-20 rounded bg-(--surface2)" />
                                        </div>
                                        <div className="h-8 w-16 rounded-xl bg-(--surface2)" />
                                    </div>
                                ))}
                            </div>
                        ) : !playlistItems.length ? (
                            <div className="rounded-3xl border border-dashed border-(--border) px-6 py-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface2)">
                                    <ListVideo size={22} className="text-(--muted)" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold">No playlists found</h3>
                                <p className="mt-2 text-sm text-(--muted)">
                                    Create a playlist first, then save this video into it.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {playlistItems.map((playlist) => (
                                    <button
                                        key={playlist._id}
                                        type="button"
                                        onClick={() => handleAdd(playlist._id)}
                                        disabled={isPending}
                                        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-(--border) bg-(--surface) px-4 py-4 text-left transition hover:bg-(--surface2) disabled:cursor-not-allowed disabled:opacity-60"
                                        aria-label={`Save to ${playlist.title}`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold sm:text-base">
                                                {playlist.title}
                                            </p>
                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-(--muted) sm:text-sm">
                                                <span>{playlist.videoCount || 0} videos</span>
                                                <span aria-hidden="true">.</span>
                                                <span className="capitalize">{playlist.privacy}</span>
                                            </div>
                                        </div>

                                        <span className="inline-flex h-9 min-w-21 items-center justify-center rounded-xl bg-(--surface2) px-3 text-xs font-medium text-(--text) sm:text-sm">
                                            {isPending ? "Saving..." : "Add"}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddToPlaylistModal;
