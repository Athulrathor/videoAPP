import { CheckCircle, MoreVertical, Volume2, VolumeX } from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useSelector } from 'react-redux';
// import { useNavigate } from "react-router-dom";

const VideoCard = ({video,timeAgo,formatTime}) => {

  const Navigate = useNavigate();
  const createrVideoRef = useRef(null);
  const muteButtonRef = useRef(null);

  const [progress, setProgress] = useState(0)
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControl, setShowControl] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0)

  const handleHoverPLay = (e) => {
    e.preventDefault();
    const video = createrVideoRef.current;

    setShowControl(true);
    setIsPlaying(true);
    const interval = setTimeout(() => {
      if (video) video.play();
    }, 1000);

    return () => clearTimeout(interval);
  }

  const handleButtonMuted = (e) => {
    e.stopPropagation();
    const video = createrVideoRef.current;

    if (video) video.muted = !muted;
    setMuted(!muted);
  }

  const handleVideoClick = (e,id) => {
    e.preventDefault();

    const video = createrVideoRef.current;
    const button = muteButtonRef.current;

    if (video) {
      Navigate(`/video/${id}`);
      handleHoverPause(e);
    }
  }

  const handleOnTimeUpdate = () => {
    const video = createrVideoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const video = createrVideoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleHoverPause = (e) => {
    e.preventDefault();
    const video = createrVideoRef.current;

    setShowControl(false);
    setIsPlaying(false);
    const interval = setTimeout(() => {
      if (video) video.pause();
    }, 1000);

    return () => clearTimeout(interval);
  }

  return (
    <div className="flex flex-col cursor-pointer group max-sm:mt-2 max-md:mt-3 mt-4">
      {/* Thumbnail Container */}
      <div className="relative w-full">
        <div className="relative aspect-video bg-gray-200 rounded-lg max-md:rounded-none overflow-hidden">
          <div onMouseEnter={(e) => handleHoverPLay(e)} onMouseLeave={(e) => handleHoverPause(e)} className=" flex items-center justify-center bg-black">
            <video
              src={video.videoFile}
              poster={video.thumbnail}
              loading="lazy"
              onClick={(e) => handleVideoClick(e,video._id)}
              ref={createrVideoRef}
              onTimeUpdate={(e) => handleOnTimeUpdate(e)}
              onLoadedMetadata={handleLoadedMetadata}
              muted={muted}
            ></video>
          </div>
          {/* mute unmute icon */}
          <button ref={muteButtonRef} onClick={(e) => handleButtonMuted(e)} className={`${showControl ? "" : "hidden"} absolute top-1 right-1 p-1 hover:bg-gray-900/50 rounded-full`}>
            {muted ? <VolumeX size={20} color="white" /> : <Volume2 size={20} color="white" />}
          </button>
          {/* Duration Badge */}
          <div className="absolute bottom-1 right-1 bg-black/50 bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded  font-medium">
            {isPlaying ? formatTime(currentTime) : formatTime(duration)}
          </div>
          {/* progress bar */}
          <div className={`${showControl ? "" : "hidden"} absolute w-full rounded-full bottom-0 left-0 right-0 h-1 z-9`} >
            <div
              className="h-full bg-red-500 rounded-full ransition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="flex mt-3 mx-3 gap-3">
        {/* Channel Avatar */}
        <div onClick={(e) => {e.nativeEvent.stopImmediatePropagation(); Navigate(`channel/${video?.userInfo?.username}`)}} className="flex-shrink-0">
          <img
            src={video?.userInfo?.avatar}
            alt={video?.userInfo?.username}
            loading="lazy"
            className="w-9 h-9 rounded-full"
          />
        </div>

        {/* Video Details */}
        <div className="flex-1 min-w-0">
          <h3 className="max-sm:text-lg text-xl font-medium text-gray-900 line-clamp-2 leading-5 group-hover:text-gray-700">
            {video.title}
          </h3>

          <div className="mt-1">
            {/* <div className="flex items-center text-sm text-gray-600">
              <span className="hover:text-gray-900 cursor-pointer">{video.channelName}</span>
              {video.verified && (
                <CheckCircle className="w-3 h-3 ml-1 text-gray-600" />
              )}
            </div> */}

            <div className="text-sm text-gray-600 mt-0.5">
              <span className="space-x-1">{video.views} views </span>
              <span className="mx-1">•</span>
              <span>{timeAgo(video.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Options Menu */}
        <div className="flex-shrink-0">
          <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full transition-opacity">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
