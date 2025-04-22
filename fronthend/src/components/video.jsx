import React, { useRef, useState } from "react";
import { GoUnmute } from "react-icons/go";
import { IoVolumeMuteOutline } from "react-icons/io5";

const VideoPlayer = ({duration, options }) => {
  const videoRef = useRef(null);

  const [muteState, setMuteState] = useState(false);
  // const [duration, setDuration] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handleMute = () => {
    if (videoRef.current.muted == false) {
      videoRef.current.muted = true;
      setMuteState(false);
    } else {
      videoRef.current.muted = false;
      setMuteState(true);
    }
  };

  // const handleLoadedMetadata = () => {
  //   setDuration(videoRef.current.duration);
  // };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const hoverPlay = () => {
    videoRef.current.play();
  };

  const hoverPause = () => {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

      function secondsToTimeFormat(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds) % 60;

        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(secs).padStart(2, "0");

        return `${
          Math.floor(formattedHours) == 0
            ? ""
            : Math.floor(formattedHours) + ":"
        }${
          Math.floor(formattedMinutes) == 0
            ? ""
            : Math.floor(formattedMinutes) + ":"
        }${
          Math.floor(formattedSeconds) == 0 ? "" : Math.floor(formattedSeconds)
        }`;
      }

  return (
    <div className="">
      <div
        className="relative"
        onMouseEnter={hoverPlay}
        onMouseOut={hoverPause}
      >
        <video
          ref={videoRef}
          // onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          className="rounded-2xl w-full h-full"
          id="my-video"
          onMouseEnter={hoverPlay}
          onMouseOut={hoverPause}
          muted
          src={options.sources[0].src}
          poster={options.thumbnail}
        ></video>
        <button
          className="absolute top-0 right-0 mr-4 mt-4 text-white font-bold cursor-pointer p-1.5 hover:bg-gray-700 opacity-75 active:bg-gray-300 rounded-2xl"
          onClick={handleMute}>
          {muteState == false ? <IoVolumeMuteOutline /> : <GoUnmute />}
        </button>
        <h3 className="text-white absolute bottom-0 right-0 mr-4 mb-2 opacity-60 px-1.5 py-0.5 bg-black rounded-xs">
          {secondsToTimeFormat(duration)-secondsToTimeFormat(currentTime)}
        </h3>
      </div>
    </div>
  );
};

export default VideoPlayer;
