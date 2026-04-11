import { Link } from "react-router-dom";

function VideoCard({ video }) {
    return (
        <Link to={`/watch/${video._id}`}>
            <div className="cursor-pointer">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-(--surface2)">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="mt-2">
                    <h3 className="font-semibold text-sm">
                        {video.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                        {video.owner?.username}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;
