import { CheckCircle, MoreVertical, Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const VideoCard = ({ video, timeAgo, formatTime, muted, handleOverAllEvent }) => {
  const createrVideoRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleOnTimeUpdate = useCallback(() => {
    const videoElement = createrVideoRef.current;
    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
      setProgress((videoElement.currentTime / videoElement.duration) * 100);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const videoElement = createrVideoRef.current;
    if (videoElement) {
      setDuration(videoElement.duration);
    }
  }, []);

  useEffect(() => {
    const videoElement = createrVideoRef.current;
    if (!videoElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    const handleMuteToggle = (event) => {
      if (event.detail.videoId === video._id) {
        const videoElement = createrVideoRef.current;
        if (videoElement) {
          videoElement.muted = event.detail.muted;
        }
      }
    };

    document.addEventListener('videoMuteToggle', handleMuteToggle);
    return () => document.removeEventListener('videoMuteToggle', handleMuteToggle);
  }, [video._id]);

  return (
    <div name="video-container" className="flex flex-col cursor-pointer group max-sm:mt-2 max-md:mt-3 mt-4 overflow-hidden">
      {/* Thumbnail Container */}
      <div className="relative w-full">
        <div name="video-container" className=" aspect-video bg-gray-200 rounded-lg max-md:rounded-none overflow-hidden">
          <div
            id={video._id}
            name="video-cover"
            onClick={handleOverAllEvent}
            onMouseEnter={handleOverAllEvent}
            onMouseLeave={handleOverAllEvent}
            className="h-full bg-black relative overflow-hidden"
          >
            <video
              src={video.videoFile}
              poster={video.thumbnail}
              loading="lazy"
              id={video._id}
              name="video"
              ref={createrVideoRef}
              onTimeUpdate={handleOnTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              muted={muted}
              className="object-contain w-full h-full aspect-video overflow-hidden"
            />

            {/* Control Overlay */}
            <div
              id={video._id}
              name="control-container"
              className="absolute inset-0 items-end h-full flex-col opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto"
            >
              {/* Mute/Unmute Button */}
              <div id={video._id}
                name="control-container" className="absolute h-full right-0 pointer-events-auto">
                <button
                  id={video._id}
                  name="mute-button"
                  className="p-1.5 mt-2 mr-2 hover:bg-gray-900/50 rounded-full transition-colors"
                >
                  {muted ? (
                    <VolumeX size={18} name="mute-button1" id={video._id} color="white" />
                  ) : (
                    <Volume2 size={18} name="mute-button2" id={video._id} color="white" />
                  )}
                </button>
                {/* Duration Badge */}
                <div className=" z-20 absolute right-1.5 bottom-1.5">
                  <div className="bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
                    {isPlaying ? formatTime(duration - currentTime) : formatTime(duration)}
                  </div>
                </div>
              </div>
              

              {/* Progress Bar */}
                <div name="progress" className="bottom-0 absolute z-16 w-full flex h-1 bg-gray-600/30">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>             
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="flex mt-3 mx-3 gap-3">
        {/* Channel Avatar */}
        <div
          id={video._id}
          name="avatar"
          data-username={video?.userInfo?.username}
          className="flex-shrink-0"
        >
          <img
            src={video?.userInfo?.avatar}
            alt={video?.userInfo?.username}
            loading="lazy"
            name="avatar"
            id={video._id}
            className="w-9 h-9 rounded-full cursor-pointer"
          />
        </div>

        {/* Video Details */}
        <div name="title" className="flex-1 min-w-0">
          <h3
            id={video._id}
            name="title"
            className="max-sm:text-lg text-xl font-medium text-gray-900 line-clamp-2 leading-5 group-hover:text-gray-700"
          >
            {video.title}
          </h3>

          <div className="mt-1">
            <div className="text-sm text-gray-600 mt-0.5">
              <span name="username" className="space-x-1">{video?.userInfo?.username}</span>
              <span className="mx-1">•</span>
              <span className="space-x-1">{video.views} views</span>
              <span className="mx-1">•</span>
              <span>{timeAgo(video.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Options Menu */}
        <div className="flex-shrink-0">
          <button
            id={video._id}
            name="more-btn"
            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
