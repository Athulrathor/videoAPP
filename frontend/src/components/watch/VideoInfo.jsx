import { useState } from "react";
import { formatLastActive } from "../../utils/formatDate";
import { Heart } from "lucide-react";
import { useToggleVideoLike } from "../../features/like/useLike";
import { useSubscribe } from "../../features/subscribe/useSubscribe";
import { Button } from "../ui";
import AddToPlaylistModal from "../playlist/AddToPlaylistModal";

function VideoInfo({ video }) {
    const [expanded, setExpanded] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);

    const toggleVideoLikeMutation = useToggleVideoLike();
    const { mutate: toggleSubscribe, isPending } = useSubscribe();

    return (
        <div className="w-full max-sm:max-w-full space-y-4 border-b pb-6 px-2">
            <h1 className="text-lg sm:text-2xl font-semibold leading-snug">
                {video?.title}
            </h1>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    <img
                        src={video?.owner?.avatar || "https://via.placeholder.com/40"}
                        alt={video?.owner?.channelName || video?.owner?.username}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover shrink-0"
                    />

                    <div className="flex flex-col min-w-0">
                        <h2 className="text-sm font-semibold text-gray-900 truncate">
                            {video?.owner?.channelName || video?.owner?.username}
                        </h2>
                        <p className="text-xs text-gray-500 truncate">
                            {video?.owner?.subscribers || "0"} subscribers
                        </p>
                    </div>

                    {/* <Button variant={video?.owner?.subscribers ? "secondary" : "primary"} onClick={() => toggleSubscribe(video?.owner?._id)} disabled={!video?.owner?._id || isPending} className="ml-auto sm:ml-3 rounded-full bg-black px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-800 shrink-0">
                        {video?.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
                    </Button> */}

                    <Button
                        onClick={() => toggleSubscribe(video?.owner?._id)}
                        disabled={!video?.owner?._id || isPending}
                        variant={video?.owner?.isSubscribed ? "secondary" : "primary"}
                        className="inline-flex items-center gap-2"
                    >
                        {video?.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
                    </Button>

                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => toggleVideoLikeMutation.mutate(video._id)} className="flex items-center justify-center gap-2 rounded-full bg-gray-100 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-gray-200">
                        <Heart size={16} absoluteStrokeWidth className={video.isLiked ? "icon-liked" : "icon-unliked"} />
                        <span>{video?.likeCount > 0 ? video?.likeCount : "Like"}</span>
                    </button>

                    <button className="rounded-full bg-gray-100 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-gray-200">
                        Share
                    </button>

                    <button
                        type="button"
                        onClick={() => setOpenAddModal(true)}
                        className="rounded-full bg-gray-100 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-gray-200"
                    >
                        Save
                    </button>
                </div>
            </div>

            <div className="rounded-xl bg-gray-100 p-3 sm:p-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-gray-800">
                    <span>{video?.views || "0"} views</span>
                    <span>•</span>
                    <span>{formatLastActive(video?.createdAt) || "Just now"}</span>
                </div>

                <div
                    onClick={() => setExpanded(!expanded)}
                    className="cursor-pointer"
                >
                    <p
                        className={`text-sm text-gray-700 whitespace-pre-line transition-all duration-200 ${expanded ? "" : "line-clamp-1"
                            }`}
                    >
                        {video?.description || "No description available."}
                    </p>

                    <span className="mt-1 inline-block text-xs text-gray-500 font-medium">
                        {expanded ? "Show less" : "Show more"}
                    </span>
                </div>
            </div>

            <AddToPlaylistModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                videoId={video?._id}
            />
        </div>
    );
}

export default VideoInfo;
