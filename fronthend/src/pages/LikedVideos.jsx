import React, { useEffect, useRef, useState } from "react";
import { Heart, Play, Sparkles, Star, ThumbsUp, TrendingUp, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserLikeVideos } from "../redux/features/likes";
import { useDispatch, useSelector } from "react-redux";
import { setSideActive } from "../redux/features/user";

const LikedVideos = (props) => {

  const dispatch = useDispatch();

  const { timeAgo, formatTime, setToggleVideoUploading, toggleVideoUploading } = props;

  const { userLikeVideos, userLikeVideosError, userLikeVideosLoading } = useSelector(state => state.likes);
  const { sideActive } = useSelector(state => state.user);

  const [videoStatus, setVideoStatus] = useState({
    isPlaying: false,
    isMuted: false,
    showControl: false,
    duration: 0,
  });

  const videoRef = useRef({});

  const Navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserLikeVideos());
  }, [dispatch]);

  console.log(userLikeVideos,userLikeVideosLoading,userLikeVideosError)

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
    <div className="h-screen max-md:w-screen scroll-smooth overflow-y-scroll scrollBar">
      <div className="w-full flex items-center font-bold text-2xl max-md:text-lg max-sm:text-sm p-2">
        <h1>Liked Videos</h1>
      </div>
      {/* videoList */}
      {userLikeVideos?.length > 0 ? (<div className="w-[calc(190px - 100%)] px-2 space-y-3 h-[calc(113px - 100vh)]">
        {userLikeVideos.map((video) => (
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
                className={`${videoStatus[video._id]?.showControl ? "" : "hidden"
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
      </div>) : (
          <div className="text-center py-16 px-6 max-md:px-2">
            <div className="max-w-lg mx-auto">
              {/* Animated hearts */}
              <div className="mb-8 relative">
                <div className="mx-auto w-32 h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center relative overflow-hidden">
                  <Heart className="w-16 h-16 text-pink-400" />
                  {/* Floating mini hearts */}
                  <div className="absolute top-3 right-6 animate-bounce">
                    <Heart className="w-4 h-4 text-pink-300" fill="currentColor" />
                  </div>
                  <div className="absolute bottom-4 left-6 animate-pulse">
                    <Heart className="w-3 h-3 text-red-300" fill="currentColor" />
                  </div>
                  <div className="absolute top-6 left-4 animate-bounce delay-300">
                    <Heart className="w-2 h-2 text-pink-200" fill="currentColor" />
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                Your favorites await discovery
              </h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Explore amazing videos and build a collection of your favorites. Every heart you give creates your personal library of memorable content.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button onClick={() => dispatch(setSideActive("home"))} className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Start Exploring</span>
                </button>
              </div>

              {/* How it works */}
              <div className="bg-gray-50 rounded-lg max-sm:p-0 p-6">
                <h4 className="font-medium text-gray-700 mb-4">How to build your collection:</h4>
                <div className="flex items-center justify-center space-x-6 max-sm:space-x-2 max-sm:text-[10px] text-sm">
                  <div className="flex items-center space-x-2 max-sm:space-x-0.5 text-gray-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>Watch videos</span>
                  </div>
                  <div className="text-gray-300">→</div>
                  <div className="flex items-center space-x-2 max-sm:space-x-0.5 text-gray-600">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <ThumbsUp className="w-4 h-4 text-pink-600" />
                    </div>
                    <span>Tap thumbs up to like</span>
                  </div>
                  <div className="text-gray-300">→</div>
                  <div className="flex items-center space-x-2 max-sm:space-x-0.5 text-gray-600">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Build collection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default LikedVideos;
