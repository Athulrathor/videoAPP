import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Globe,
    Link2,
    ListVideo,
    Lock,
    Plus,
    User,
    X,
} from "lucide-react";

import VideoList from "../components/video/VideoList";
import {
    useAddVideoToPlaylist,
    usePlaylist,
    useRemoveVideoFromPlaylist,
    useUserPlaylists,
} from "../features/playlist/usePlaylist";
import { useUpdateVideo, useUserVideos } from "../features/video/useVideo";
import { Button } from "../components/ui";

function PrivacyBadge({ privacy }) {
    const config = {
        public: {
            label: "Public",
            icon: Globe,
        },
        private: {
            label: "Private",
            icon: Lock,
        },
        unlisted: {
            label: "Unlisted",
            icon: Link2,
        },
    };

    const item = config[privacy] || config.public;
    const Icon = item.icon;

    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-(--surface2) px-3 py-1.5 text-xs font-medium text-(--muted) sm:text-sm">
            <Icon size={14} />
            {item.label}
        </span>
    );
}

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
                                                <span aria-hidden="true">•</span>
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

function AddVideosToPlaylistModal({ open, onClose, playlistId }) {
    const { user } = useSelector((state) => state.auth);
    const userId = user?._id || user?.id;
    const { data: videos = [], isLoading } = useUserVideos(userId);
    const { mutate, isPending } = useAddVideoToPlaylist();
    const [selectedVideoIds, setSelectedVideoIds] = useState([]);

    if (!open) return null;

    const closeModal = () => {
        setSelectedVideoIds([]);
        onClose?.();
    };

    const toggleVideoSelection = (videoId) => {
        setSelectedVideoIds((prev) =>
            prev.includes(videoId)
                ? prev.filter((id) => id !== videoId)
                : [...prev, videoId]
        );
    };

    const handleAddSelected = () => {
        if (!playlistId || !selectedVideoIds.length) return;

        mutate(
            { playlistId, arrayVideoId: selectedVideoIds },
            {
                onSuccess: () => closeModal(),
            }
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-videos-title"
        >
            <div className="flex min-h-dvh items-end justify-center p-0 sm:items-center sm:p-4">
                <div className="w-full max-w-3xl overflow-hidden rounded-t-3xl border border-(--border) bg-(--surface) shadow-2xl sm:rounded-3xl">
                    <div className="flex items-center justify-between border-b border-(--border) px-4 py-4 sm:px-6">
                        <div>
                            <h2 id="add-videos-title" className="text-base font-semibold sm:text-lg">
                                Add videos
                            </h2>
                            <p className="mt-1 text-xs text-(--muted) sm:text-sm">
                                Select videos for this playlist
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={closeModal}
                            className="h-10 w-10 rounded-full text-(--muted)"
                            aria-label="Close add videos modal"
                        >
                            <X size={18} />
                        </Button>
                    </div>

                    <div className="max-h-[75dvh] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                        {isLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="h-28 rounded-lg bg-(--surface2)" />
                                ))}
                            </div>
                        ) : (
                            <VideoList
                                videos={videos}
                                emptyTitle="No videos found"
                                emptyDescription="Upload a video first, then add it to this playlist."
                                linkEnabled={false}
                                selectable
                                selectedIds={selectedVideoIds}
                                onSelect={toggleVideoSelection}
                            />
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-(--border) px-4 py-4 sm:px-6">
                        <p className="text-sm text-(--muted)">
                            {selectedVideoIds.length} selected
                        </p>
                        <div className="flex gap-3">
                            <Button type="button" variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleAddSelected}
                                disabled={isPending || !selectedVideoIds.length}
                            >
                                {isPending ? "Adding..." : "Add selected"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function UpdateVideoModal({ open, onClose, video }) {
    const { mutate, isPending } = useUpdateVideo();
    const [form, setForm] = useState(() => ({
        title: video?.title || "",
        description: video?.description || "",
        isPublished: video?.isPublished ?? true,
    }));

    if (!open) return null;

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!video?._id || !form.title.trim()) return;

        mutate(
            {
                videoId: video._id,
                data: {
                    title: form.title.trim(),
                    description: form.description.trim(),
                    isPublished: form.isPublished,
                },
            },
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
            aria-labelledby="update-video-title"
        >
            <div className="flex min-h-dvh items-end justify-center p-0 sm:items-center sm:p-4">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-xl overflow-hidden rounded-t-3xl border border-(--border) bg-(--surface) shadow-2xl sm:rounded-3xl"
                >
                    <div className="flex items-center justify-between border-b border-(--border) px-4 py-4 sm:px-6">
                        <div>
                            <h2 id="update-video-title" className="text-base font-semibold sm:text-lg">
                                Update video
                            </h2>
                            <p className="mt-1 text-xs text-(--muted) sm:text-sm">
                                Edit this playlist video
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="h-10 w-10 rounded-full text-(--muted)"
                            aria-label="Close update video modal"
                        >
                            <X size={18} />
                        </Button>
                    </div>

                    <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
                        <div>
                            <label htmlFor="video-title" className="mb-2 block text-sm font-medium">
                                Title
                            </label>
                            <input
                                id="video-title"
                                value={form.title}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, title: event.target.value }))
                                }
                                className="w-full rounded-xl border border-(--border) bg-(--surface) px-3 py-2 text-sm outline-none focus:border-(--primary)"
                                placeholder="Video title"
                            />
                        </div>

                        <div>
                            <label htmlFor="video-description" className="mb-2 block text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                id="video-description"
                                value={form.description}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, description: event.target.value }))
                                }
                                className="min-h-28 w-full resize-none rounded-xl border border-(--border) bg-(--surface) px-3 py-2 text-sm outline-none focus:border-(--primary)"
                                placeholder="Video description"
                            />
                        </div>

                        <label className="flex items-center justify-between gap-3 rounded-xl border border-(--border) px-3 py-3 text-sm">
                            <span>Published</span>
                            <input
                                type="checkbox"
                                checked={form.isPublished}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, isPublished: event.target.checked }))
                                }
                            />
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-(--border) px-4 py-4 sm:px-6">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || !form.title.trim()}>
                            {isPending ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Playlist() {
    const { id } = useParams();
    const { data, isLoading } = usePlaylist(id);
    const { mutate: removeVideo, isPending: isRemovingVideo } = useRemoveVideoFromPlaylist();
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openAddVideosModal, setOpenAddVideosModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const closeSaveModal = () => {
        setOpenAddModal(false);
        setSelectedVideoId(null);
    };

    const handleRemoveVideo = (videoId) => {
        removeVideo({ playlistId: id, videoId });
    };

    const openUpdateVideoModal = (_, video) => {
        setSelectedVideo(video);
        setOpenUpdateModal(true);
    };

    const closeUpdateVideoModal = () => {
        setOpenUpdateModal(false);
        setSelectedVideo(null);
    };

    if (isLoading) {
        return (
            <div className="container py-6 sm:py-8">
                <div className="rounded-3xl border border-(--border) bg-(--surface) p-5 sm:p-6">
                    <div className="h-8 w-48 rounded-lg bg-(--surface2)" />
                    <div className="mt-3 h-4 w-full max-w-2xl rounded-lg bg-(--surface2)" />
                    <div className="mt-2 h-4 w-2/3 rounded-lg bg-(--surface2)" />
                    <div className="mt-5 flex flex-wrap gap-3">
                        <div className="h-8 w-24 rounded-full bg-(--surface2)" />
                        <div className="h-8 w-28 rounded-full bg-(--surface2)" />
                        <div className="h-8 w-32 rounded-full bg-(--surface2)" />
                    </div>
                </div>
            </div>
        );
    }

    const playlist = data?.playlist;
    const videos = data?.videos || [];

    return (
        <>
            <div className="container py-6 sm:py-8">
                <section className="mb-6 overflow-hidden rounded-3xl border border-(--border) bg-(--surface) sm:mb-8">
                    <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <PrivacyBadge privacy={playlist?.privacy} />
                                <span className="inline-flex items-center gap-2 rounded-full bg-(--surface2) px-3 py-1.5 text-xs font-medium text-(--muted) sm:text-sm">
                                    <ListVideo size={14} />
                                    {playlist?.videoCount || videos.length} videos
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full bg-(--surface2) px-3 py-1.5 text-xs font-medium text-(--muted) sm:text-sm">
                                    <User size={14} />
                                    {playlist?.owner?.username || "Unknown"}
                                </span>
                            </div>

                            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                                {playlist?.title}
                            </h1>

                            <p className="mt-3 max-w-3xl text-sm leading-6 text-(--muted) sm:text-base">
                                {playlist?.description || "No description"}
                            </p>
                        </div>

                        <div className="flex shrink-0 gap-3">
                            <button
                                type="button"
                                onClick={() => setOpenAddVideosModal(true)}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-(--primary) px-4 text-sm font-medium text-white"
                            >
                                <Plus size={18} />
                                Add videos
                            </button>
                        </div>
                    </div>
                </section>

                <VideoList
                    videos={videos}
                    emptyTitle="No videos in this playlist yet"
                    emptyDescription="Add videos to start building your playlist."
                    onRemove={handleRemoveVideo}
                    onUpdate={openUpdateVideoModal}
                    actionPending={isRemovingVideo}
                />
            </div>

            <AddToPlaylistModal
                open={openAddModal}
                onClose={closeSaveModal}
                videoId={selectedVideoId}
            />

            <AddVideosToPlaylistModal
                open={openAddVideosModal}
                onClose={() => setOpenAddVideosModal(false)}
                playlistId={id}
            />

            <UpdateVideoModal
                key={selectedVideo?._id || "update-video"}
                open={openUpdateModal}
                onClose={closeUpdateVideoModal}
                video={selectedVideo}
            />
        </>
    );
}

export default Playlist;
