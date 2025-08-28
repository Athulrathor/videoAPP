import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import VideoPages from "./VideoPages";
import VideoSkeletonLoading from "../components/LoadingScreen/VideoSkeletonLoading"
import { RefreshCw, WifiOff } from "lucide-react";

const Videos = (props) => {

  const { timeAgo, formatTime } = props;

  const { videos, videoLoading,videoError } = useSelector((state) => state.videos);

  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColumnsCount = () => {
    if (viewportWidth >= 1440) return 4;
    if (viewportWidth >= 1280) return 3;
    if (viewportWidth >= 1024) return 3;
    if (viewportWidth >= 768) return 2;
    return 1;
  };

  const handleRetry = () => {
    setIsRetrying(true);
    // Simulate retry attempt
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-white">

      {/* Video Grid */}
      <div className="scrollBar max-w-full max-md:w-screen mx-auto overflow-y-scroll h-[calc(100vh-65px)] max-md:h-[calc(100vh-53px)] max-sm:h-[calc(100vh-39px)] max-sm:pb-6 max-md:px-0 px-2">
        {(!videoError || videos.length > 0) ? (
        <div>
          {videoLoading ? ( 
            <div>
              <VideoSkeletonLoading />
            </div>
          ) : (
            <div className={`grid gap-x-6 gap-y-6 ${getColumnsCount() === 4 ? 'grid-cols-3' :
              getColumnsCount() === 3 ? 'grid-cols-3' :
                getColumnsCount() === 2 ? 'grid-cols-2' :
                  'grid-cols-1'
              }`}>
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} timeAgo={timeAgo} formatTime={formatTime} />
              ))}
            </div>
          )}
          </div>
        ) : (
            <div>
          <div className="text-center py-16 px-6">
            <div className="max-w-md mx-auto">
              {/* Wifi Off Icon with animation */}
              <div className="mb-6">
                <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center relative">
                  <WifiOff className="w-12 h-12 text-red-400" />
                  <div className="absolute inset-0 rounded-full border-2 border-red-200 animate-pulse"></div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                No internet connection
              </h3>
              <p className="text-gray-500 mb-8">
                Please check your network connection and try again. Your feed will load once you're back online.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
                >
                  <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                  <span>{isRetrying ? 'Checking...' : 'Try Again'}</span>
                </button>

                <div className="text-sm text-gray-400">
                  <p>Make sure you're connected to Wi-Fi or mobile data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
