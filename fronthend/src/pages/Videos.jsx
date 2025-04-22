import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import VideoCard from "../components/VideoCard";

const Videos = () => {
  const { videos } = useSelector((state) => state.videos);

  return (
    <div className="h-screen m-2 w-[calc(100vw-188px)] scroll grid max-sm:grid-cols-1 max-lg:grid-cols-2 grid-cols-3">
      {videos.length <= 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">Welcome to the Main Page</h1>
          <p className="mt-4 text-gray-500">This is the main content area.</p>
          <Link
            to="/videos"
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go to Videos
          </Link>
        </div>
      ) : (
        videos.map((video, index) => (
          <VideoCard
            key={index}
            video={video}
          />
        ))
      )}
    </div>
  );
};

export default Videos;
