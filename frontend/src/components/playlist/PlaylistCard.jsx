import { Link } from "react-router-dom";

function PlaylistCard({ playlist, onDelete, onUpdate, isDeleting = false }) {
    return (
        <article className="group overflow-hidden rounded-2xl border border-(--border) bg-(--surface) transition hover:border-(--border-hover)">
            <Link to={`/playlist/${playlist._id}`} className="block">
                <div className="aspect-video w-full overflow-hidden bg-(--surface2)">
                    {playlist.thumbnail ? (
                        <img
                            src={playlist.thumbnail}
                            alt={playlist.title}
                            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-(--muted)">
                            No thumbnail
                        </div>
                    )}
                </div>

                <div className="space-y-2 p-4">
                    <h3 className="line-clamp-1 font-semibold">{playlist.title}</h3>
                    <p className="line-clamp-2 text-sm text-(--muted)">
                        {playlist.description || "No description"}
                    </p>

                    <div className="flex items-center justify-between text-xs text-(--muted)">
                        <span>{playlist.videoCount || 0} videos</span>
                        <span className="capitalize">{playlist.privacy}</span>
                    </div>
                </div>
            </Link>

            <div className="flex justify-end gap-2 border-t border-(--border) p-3">
                <button
                    type="button"
                    onClick={() => onUpdate?.(playlist)}
                    className="inline-flex h-9 items-center rounded-xl border border-(--border) bg-(--surface) px-3 text-sm font-medium transition hover:bg-(--surface2)"
                >
                    Update
                </button>
                <button
                    type="button"
                    onClick={() => onDelete?.(playlist._id)}
                    disabled={isDeleting}
                    className="inline-flex h-9 items-center rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </article>
    );
}

export default PlaylistCard;
