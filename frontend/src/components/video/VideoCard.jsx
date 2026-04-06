import { Link } from "react-router-dom";

function VideoCard({ video }) {
    return (
        <Link to={`/watch/${video._id}`}>
            <div className="cursor-pointer">
                <img
                    src={video.thumbnail}
                    className="rounded-lg w-full"
                />

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