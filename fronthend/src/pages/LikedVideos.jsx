import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../libs/axios";
import { Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LikedVideos = (props) => {

  const { timeAgo, formatTime } = props;

  const [likedVideo, setLikedVideo] = useState({
    loading: true,
    error: "",
    data: null,
  });

  const [videoStatus, setVideoStatus] = useState({
    isPlaying: false,
    isMuted: false,
    showControl: false,
    duration: 0,
  });

  const videoRef = useRef({});

  const Navigate = useNavigate();

  const fetchLikedVideos = async () => {
    setLikedVideo((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const likedVideos = await axiosInstance.get(`like/get-liked-video`);

      setLikedVideo((prev) => ({
        ...prev,
        loading: false,
        data: likedVideos?.data?.data,
      }));
    } catch (error) {
      setLikedVideo((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const togglePlay = (videoId2) => {
    const video = videoRef.current[videoId2];
    if (video) {
      setVideoStatus((prev) => ({
        ...prev,
        [videoId2]: { ...prev[videoId2], isPlaying: true },
      }));
      video.play();
    }
  };

  const togglePause = (videoId2) => {
    const video = videoRef.current[videoId2];
    if (video) {
      setVideoStatus((prev) => ({
        ...prev,
        [videoId2]: { ...prev[videoId2], isPlaying: false },
      }));
      video.pause();
    }
  };

  const toggleMute = (e, videoId2) => {
    e.stopPropagation();
    
    const video = videoRef.current[videoId2];
    if (video) {
      const currentMuteState = videoStatus[videoId2]?.isMuted;
      const newMuteState = !currentMuteState;

      setVideoStatus((prev) => ({
        ...prev,
        [videoId2]: { ...prev[videoId2], isMuted: newMuteState },
      }));

      video.muted = newMuteState;
    }
  };

  const handleOnTimeUpdate = (videoId2) => {
    const video = videoRef.current[videoId2];
    if (video) {
      setVideoStatus((prev) => ({
        ...prev,
        [videoId2]: { ...prev[videoId2], duration: video.currentTime },
      }));
    }
  };

  return (
    <div className="h-[90vh] scroll-smooth overflow-y-scroll">
      <div className="w-full flex items-center font-bold text-2xl max-md:text-lg max-sm:text-sm p-2">
        <h1>Liked Videos</h1>
      </div>
      {/* videoList */}
      <div className="w-[calc(190px - 100%)] px-2 space-y-3 h-[calc(113px - 100vh)]">
        {likedVideo?.loading === false &&
          likedVideo?.data.map((video) => (
            <div
              key={video._id}
              className="flex h-fit"
              onClick={() => Navigate(`/video/${video._id}`)}
            >
              {/* video */}
              <div
                className="relative max-lg:w-1/2 w-96  h-fit"
                onMouseEnter={() => {
                  setVideoStatus((prev) => ({
                    ...prev,
                    [video._id]: { ...prev[video._id], showControl: true },
                  }));
                  togglePlay(video._id);
                }}
                onMouseLeave={() => {
                  setVideoStatus((prev) => ({
                    ...prev,
                    [video._id]: { ...prev[video._id], showControl: false },
                  }));
                  togglePause(video._id);
                }}
              >
                <video
                  src={video?.videoFile}
                  ref={(el) => {
                    if (el) {
                      videoRef.current[video._id] = el;
                    }
                  }}
                  muted={videoStatus[video._id]?.isMuted}
                  poster={video?.thumbnail}
                  onTimeUpdate={() => handleOnTimeUpdate(video._id)}
                  preload="metadata"
                  className="bg-black aspect-video rounded-2xl"
                ></video>
                <div
                  className={`${
                    videoStatus[video._id]?.showControl ? "" : "hidden"
                  } absolute inset-0 p-2`}
                >
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => toggleMute(e, video._id)}
                      className={` z-13 p-2 rounded-full hover:bg-black/30 active:bg-black/50 active:border-1 active:border-gray-600 transition-all duration-75`}
                    >
                      {videoStatus[video._id]?.isMuted === true ? (
                        <VolumeX
                          size={16}
                          color="white"
                        />
                      ) : (
                        <Volume2
                          size={16}
                          color="white"
                        />
                      )}
                    </button>
                  </div>
                  <div className="absolute inset-0 flex items-end justify-end bottom-0 p-2 rounded-[10px] max-lg:text-[2vw] text-lg">
                    <h1 className="text-white rounded-md bg-black/30 px-1 py-0.1">
                      {formatTime(videoStatus[video._id]?.duration || 0)}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="w-1/2  flex-col flex justify-center py-1 pl-2">
                <div className="line-clamp-2 w-full font-medium text-md max-md:text-[16px]">
                  <h2>{video?.title}</h2>
                </div>
                <div className="flex">
                  <div className="flex items-baseline ">
                    <img
                      src={video?.owner?.avatar}
                      alt=""
                      className="w-6 mr-3 max-sm:w-8 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    {/* user name */}
                    <div className="mb-1  text-xs font-normal text-gray-500 max-md:text-xs">
                      <h3>{video?.owner?.username}</h3>
                    </div>
                    {/* view and month ago */}
                    <div className="text-[11px] font-normal  text-gray-500 max-md:text-[11px] space-x-1.5">
                      <span>{video?.views} views</span>
                      <span>
                        {timeAgo(video?.createdAt) || "12 year ago"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LikedVideos;
