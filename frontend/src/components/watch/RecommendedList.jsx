import { Link } from "react-router-dom";
import { recommendedVideo } from "../../apis/video.api";
import { useEffect, useState } from "react";

function RecommendedList({ currentVideoId }) {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        recommendedVideo(currentVideoId).then((recommended) => {
            setVideos(recommended?.data?.data?.videos);
        });
    }, [currentVideoId]);

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-sm">Recommended</h3>

            {videos.map((v) => (
                <Link
                    key={v._id}
                    to={`/watch/${v._id}`}
                    className="flex gap-3 group"
                >
                    <img
                        src={v.thumbnail}
                        className="w-32 h-20 object-cover rounded"
                    />

                    <div className="text-sm">
                        <p className="line-clamp-2 group-hover:text-(--primary)">
                            {v.title}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default RecommendedList;
