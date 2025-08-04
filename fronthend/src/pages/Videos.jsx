import React from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import VideoPages from "./VideoPages";
import VideoSkeletonLoading from "../components/LoadingScreen/VideoSkeletonLoading"

const Videos = (props) => {

  const { videos, videoLoading } = useSelector((state) => state.videos);
  const { loggedIn } = useSelector((state) => state.user);

  if (videos === undefined) {
    return null;
  }

  return (
    <div className="">
      <div className="">
        {loggedIn === false || videos.length <= 0 ? (
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
          <div>
            {videoLoading ? (
              <div>
                <VideoSkeletonLoading />
              </div>
            ) : (
              <div>
                <div className="scrollBar grid overflow-y-scroll grid-cols-3 max-md:grid-cols-1 max-md:w-full max-lg:grid-cols-2 max-xl:grid-cols-3 gap-4 p-4 max-md:p-0 h-[92vh]">
                  {loggedIn === true &&
                    videos.map((video, index) => (
                      <div
                        className="flex-1 min-w-0"
                        key={index}
                      >
                        <VideoCard
                          timeAgo={props.timeAgo}
                          formatTime={props.formatTime}
                          video={video}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
