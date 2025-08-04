import React from "react";

const VideoSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="">
        <div className="">
          <div className="aspect-video">
            {/* Video placeholder with fixed 16:9 aspect ratio */}
            <div className="w-full h-full bg-gray-300 aspect-video rounded"></div>

            <div className="flex items-center mt-4 max-md:pl-0 max-md:pr-2 pl-2 pr-2">
              {/* Avatar placeholder */}
              <div className="h-[36px] w-[36px] bg-gray-300 rounded-full mr-2.5 flex-shrink-0"></div>

              <div className="flex-1">
                {/* Title placeholder */}
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

                {/* Views and time placeholder */}
                <div className="flex items-center justify-between mt-0.5">
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage component showing multiple skeleton items
const VideoListSkeleton = ({ count = 9 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {Array.from({ length: count }).map((_, index) => (
        <VideoSkeleton key={index} />
      ))}
    </div>
  );
};

export default VideoListSkeleton;
