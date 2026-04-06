import { Link } from "react-router-dom";

function RecommendedList({ currentVideoId }) {
    // 🔌 replace with real API later
    const videos = [
        { _id: "1", title: "Next Video 1", thumbnail: "/thumb.jpg" },
        { _id: "2", title: "Next Video 2", thumbnail: "/thumb.jpg" },
        { _id: "3", title: "Next Video 2", thumbnail: "/thumb.jpg" },
        { _id: "4", title: "Next Video 2", thumbnail: "/thumb.jpg" },
        { _id: "5", title: "Next Video 2", thumbnail: "/thumb.jpg" },
        { _id: "6", title: "Next Video 2", thumbnail: "/thumb.jpg" },
        { _id: "7", title: "Next Video 2", thumbnail: "/thumb.jpg" },
        { _id: "8", title: "Next Video 2", thumbnail: "/thumb.jpg" },
        { _id: "9", title: "Next Video 2", thumbnail: "/thumb.jpg" },
        { _id: "10", title: "Next Video 2", thumbnail: "/thumb.jpg" },
    ];

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