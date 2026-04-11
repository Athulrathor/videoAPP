import { Link } from "react-router-dom";
import { ListVideo, Plus } from "lucide-react";
import { formatLastActive } from "../../utils/formatDate";

function normalizeVideo(item) {
    return item?.video || item;
}

function formatDuration(duration) {
    if (!duration && duration !== 0) return null;

    const totalSeconds = Math.round(Number(duration));
    if (!Number.isFinite(totalSeconds)) return null;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
}

function getMeta(video) {
    const items = [];

    if (video.views !== undefined && video.views !== null) {
        items.push(`${video.views} views`);
    }

    if (video.createdAt) {
        items.push(formatLastActive(video.createdAt));
    }

    const duration = formatDuration(video.duration);
    if (duration) {
        items.push(duration);
    }

    const owner = video.owner?.username || video.owner?.channelName;
    if (owner) {
        items.push(owner);
    }

    return items;
}

function VideoList({
    videos = [],
    title,
    emptyTitle = "No videos yet",
    emptyDescription = "Add videos to start building this list.",
    onAdd,
    onSave,
    onRemove,
    onUpdate,
    onSelect,
    actionPending = false,
    linkEnabled = true,
    selectable = false,
    selectedIds = [],
    showAdd = false,
    showSave = false,
}) {

    if (!videos.length) {
        return (
            <div className="rounded-3xl border border-dashed border-(--border) bg-(--surface) px-6 py-12 text-center sm:px-10 sm:py-16">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface2)">
                    <ListVideo size={22} className="text-(--muted)" />
                </div>
                <h2 className="mt-4 text-lg font-semibold sm:text-xl">
                    {emptyTitle}
                </h2>
                <p className="mt-2 text-sm text-(--muted) sm:text-base">
                    {emptyDescription}
                </p>
            </div>
        );
    }

    return (
        <section className="min-w-0">
            {title ? (
                <h2 className="mb-3 text-lg font-semibold sm:text-xl">{title}</h2>
            ) : null}

            <div className="space-y-3">
                {videos.map((item) => {
                    const video = normalizeVideo(item);
                    const key = item?._id || video?._id;
                    const meta = getMeta(video);
                    const isSelected = selectedIds.includes(video?._id);

                    if (!video?._id) return null;

                    const handleSelect = () => {
                        if (!selectable) return;
                        onSelect?.(video._id, video);
                    };

                    const handleAction = (event, action) => {
                        event.stopPropagation();
                        action?.(video._id, video);
                    };

                    return (
                        <article
                            key={key}
                            onClick={handleSelect}
                            className={`group flex min-w-0 gap-3 rounded-lg border p-2 transition sm:gap-4 ${selectable ? "cursor-pointer" : ""} ${isSelected
                                ? "border-(--primary) bg-(--surface2)"
                                : "border-transparent hover:bg-(--surface2)"
                                }`}
                        >
                            {linkEnabled ? (
                                <Link
                                    to={`/watch/${video._id}`}
                                    className="block w-36 shrink-0 sm:w-56 md:w-64"
                                >
                                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-(--surface2)">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </Link>
                            ) : (
                                <div className="block w-36 shrink-0 sm:w-56 md:w-64">
                                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-(--surface2)">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                                {linkEnabled ? (
                                    <Link to={`/watch/${video._id}`} className="min-w-0">
                                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-(--primary) sm:text-base">
                                            {video.title}
                                        </h3>

                                        {video.description ? (
                                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-(--muted) sm:text-sm">
                                                {video.description}
                                            </p>
                                        ) : null}

                                        {meta.length ? (
                                            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-(--muted)">
                                                {meta.map((item, index) => (
                                                    <span key={item} className="inline-flex items-center gap-1.5">
                                                        {index > 0 ? (
                                                            <span aria-hidden="true">.</span>
                                                        ) : null}
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                    </Link>
                                ) : (
                                    <div className="min-w-0">
                                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-(--primary) sm:text-base">
                                            {video.title}
                                        </h3>

                                        {video.description ? (
                                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-(--muted) sm:text-sm">
                                                {video.description}
                                            </p>
                                        ) : null}

                                        {meta.length ? (
                                            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-(--muted)">
                                                {meta.map((item, index) => (
                                                    <span key={item} className="inline-flex items-center gap-1.5">
                                                        {index > 0 ? (
                                                            <span aria-hidden="true">.</span>
                                                        ) : null}
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                )}

                                {selectable ? (
                                    <div className="flex justify-end">
                                        <span className="inline-flex h-8 items-center rounded-xl border border-(--border) bg-(--surface) px-3 text-xs font-medium text-(--text)">
                                            {isSelected ? "Selected" : "Select"}
                                        </span>
                                    </div>
                                ) : null}

                                {showAdd || showSave || onRemove || onUpdate ? (
                                    <div className="flex flex-wrap justify-end gap-2">

                                        {showAdd ? (
                                            <button
                                                type="button"
                                                onClick={(event) => handleAction(event, onAdd)}
                                                disabled={actionPending}
                                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-(--border) bg-(--surface) px-3 text-sm font-medium text-(--text) transition hover:bg-(--surface2) disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <Plus size={16} />
                                                Add
                                            </button>
                                        ) : null}

                                        {showSave ? (
                                            <button
                                                type="button"
                                                onClick={(event) => handleAction(event, onSave)}
                                                disabled={actionPending}
                                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-(--border) bg-(--surface) px-3 text-sm font-medium text-(--text) transition hover:bg-(--surface2) disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <Plus size={16} />
                                                Save
                                            </button>
                                        ) : null}

                                        {onRemove ? (
                                            <button
                                                type="button"
                                                onClick={(event) => handleAction(event, onRemove)}
                                                disabled={actionPending}
                                                className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Remove
                                            </button>
                                        ) : null}

                                        {onUpdate ? (
                                            <button
                                                type="button"
                                                onClick={(event) => handleAction(event, onUpdate)}
                                                disabled={actionPending}
                                                className="inline-flex h-10 items-center justify-center rounded-xl border border-(--border) bg-(--surface) px-3 text-sm font-medium text-(--text) transition hover:bg-(--surface2) disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Update
                                            </button>
                                        ) : null}
                                    </div>
                                ) : null}

                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default VideoList;
