
import React from 'react';

const ShortSkeletonLoading = () => {
  return (
    <div className="relative m-auto snap-start animate-pulse">
      <div
        className="relative bg-gray-300 m-auto"
        style={{
          aspectRatio: "9/16",
          height: "90vh",
          maxWidth: "100vw",
          maxHeight: "90vh",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* Video placeholder */}
        {/* <div className="aspect-[9/16] h-full w-full rounded-lg bg-gray-700 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
            <Play size={32} className="text-gray-500 ml-1" />
          </div>
        </div> */}

        {/* Progress bar placeholder */}
        <div className="absolute bottom-0 left-0 right-0 h-1 z-40">
          <div className="h-full bg-gray-200 w-0" />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t  via-transparent  flex flex-col justify-between p-4">
          
          {/* Top Controls Skeleton */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className="p-4 rounded-full bg-gray-400 animate-pulse">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
              {/* <div className="flex items-center ml-2 rounded-full bg-gray-700 animate-pulse">
                <div className="p-2 flex justify-center items-center">
                  <div className="w-5 h-5 bg-gray-600 rounded"></div>
                </div>
                <div className="w-16 h-1 bg-gray-600 rounded-lg ml-2"></div>
              </div> */}
            </div>

            <div className="flex space-x-2">
              <div className="p-2 rounded-full bg-gray-400 animate-pulse">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
              </div>
              <div className="p-2 rounded-full bg-gray-400 animate-pulse">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Center Play Button Skeleton */}
          <div className="flex items-end h-full justify-center">
            <div className="p-4 rounded-full bg-gray-400 animate-pulse">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Bottom Info and Controls Skeleton */}
          <div className="flex justify-between items-end">
            <div className="flex-1 mr-4">
              {/* User info skeleton */}
              <div className="flex text-white text-sm font-medium mb-1 gap-2 items-center">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              
              {/* Title skeleton */}
              <div className="mb-2 space-y-1">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>

            {/* Side Controls Skeleton */}
            <div className="flex flex-col space-y-4">
              {/* Like button */}
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-gray-400 animate-pulse">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-6 mt-1 animate-pulse"></div>
              </div>

              {/* Comments button */}
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-gray-400 animate-pulse">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-6 mt-1 animate-pulse"></div>
              </div>

              {/* Share button */}
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-gray-400 animate-pulse">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-4 mt-1 animate-pulse"></div>
              </div>

              {/* Download button */}
              <div className="p-3 rounded-full bg-gray-400 animate-pulse">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>

              {/* More button */}
              <div className="p-3 rounded-full bg-gray-400 animate-pulse">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortSkeletonLoading;