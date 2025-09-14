import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { ArrowDownToLine, EllipsisVertical, Maximize, Pause, Play, Plus, Settings, Share2, SkipForward, ThumbsDown, ThumbsUp, Video, Volume2, VolumeX } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SideMenu from "../components/SideMenu";
import { fetchVideosById, fetchViewCounter } from "../redux/features/videos";
import {  fetchLikeToggleVideo, isVideoLiked } from "../redux/features/likes";
import { fetchSubcribeToggle, isSubcribed } from "../redux/features/subcribers";
import Comments from "../components/Comments";
import UploadVideo from '../components/UploadVideo';
import UploadShort from "../components/UploadShort";
import UploadLive from '../components/UploadLive';
import { addingToWatchHistory } from "../redux/features/user";
import { useAppearance } from "../hooks/appearances";

const VideoPages = (props) => {
  const { appearanceSettings } = useAppearance();

  const { VideoId } = useParams();
  const dispatch = useDispatch();

  const { timeAgo } = props;

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setisMuted] = useState(true);
  const [volume, setVolume] = useState(100);
  const [currentVolumeBar, setCurrentVolumeBar] = useState(false);

  const [ToggleAddPlaylistBtn, setToggleAddPlaylistBtn] = useState(false);

  const [recommendationStates, setRecommendationStates] = useState({});
  const [currentDuration, setCurrentDuration] = useState(false)
  const [progess, setProgress] = useState(0);

  const [currentStatus, setCurrentStatus] = useState({
    likeStatus: false,
    subcriberStatus: false
  });

    const [videoParams, setVideoParams] = useState({
      page: 1,
      limit: 20,
      query: "",
      sortBy: 1,
      sortType: "createdAt",
    });

  const [functionCalled, setFunctionCalled] = useState(false);

  const [minimiseComment, setMinimiseComment] = useState(false);

  const videoRecommendationRefs = useRef({});
  const currentVideoRef = useRef(null);
  // const muteButtonRef = useRef({})

  const [isAutoplayOn, setIsAutoplayOn] = useState(false);
  const [showDesc, setshowDesc] = useState(false);

  const Navigate = useNavigate();

  const { videos, targetVideo } = useSelector((state) => state.videos);
  const {  videoLiked } = useSelector(state => state.likes);
  const { isSubcribedStatus } = useSelector(state => state.subscriber);
  const { playlist } = useSelector(state => state.Playlists);
  const { watchHistoryPaused } = useSelector(state => state.user);
  
  const filteredVideos = useMemo(() => 
    videos.filter(video => video?._id !== targetVideo?._id)
    , [videos, targetVideo]);

  useEffect(() => {
    dispatch(fetchVideosById(VideoId));
    if (!watchHistoryPaused) {
      dispatch(addingToWatchHistory(VideoId));
    }
  }, [dispatch, VideoId, watchHistoryPaused]);

  useEffect(() => {
    if (videos.length > 0 && targetVideo?._id) {
      const filtered = videos.filter(
        (video) => video?._id !== targetVideo?._id
      );

      const initialStates = {};
      filtered.forEach((video) => {
        initialStates[video._id] = {
          isMuted: false,
          duration: 0,
          isPlaying: false,
          mutedStatus: false
        };
      });
      setRecommendationStates(initialStates);
    }
  }, [videos, targetVideo]);

  const togglePlayRecommendation = (videoId2) => {
    const video = videoRecommendationRefs.current[videoId2];
    if (video) {
      video.play();
      setRecommendationStates((prev) => ({
        ...prev,
        [videoId2]: { ...prev[videoId2], isPlaying: true },
      }));

    }
  };
  
  useEffect(() => {
    if (currentVideoRef.current) {
      currentVideoRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    currentVideoRef.current.volume = newVolume / 100;
    setisMuted(newVolume === 0);
  };

  const handleOnTimeUpdate = (videoId2) => {
    const video = videoRecommendationRefs.current[videoId2];
    if (video) {
      setRecommendationStates((prev) => ({
        ...prev,
        [videoId2]: { ...prev[videoId2], duration: video.currentTime },
      }));
    }
  };

  const handleOntimeCurrent = () => {
    const video = currentVideoRef.current;

    if (video.currentTime >= 10 && !functionCalled) {
      setFunctionCalled(true);
      handleVideoViewCounter()
    }

    if (video) {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
      setCurrentDuration(video.currentTime);
    }
  }

  const handleProgressCurrent = (e) => {
    const video = currentVideoRef.current;
    const newProgress = e.target.value;
    if (video) {
      video.currentTime = (newProgress / 100) * video.duration;
      setProgress(newProgress);
      setCurrentDuration(video.currentTime);
    }
  };
  
  // const handleNextVideo = () => {
  //   const videos = filteredVideos;

  //   const randomIndex = Math.floor(Math.random() * videos.length);
  //   const video_id = videos[randomIndex]._id;

  //   Navigate(`/video/${video_id}`)
  // }

  // const togglePauseRecommendation = (videoId2) => {
  //   const video = videoRecommendationRefs.current[videoId2];
  //   if (video) {
        
  //     setRecommendationStates((prev) => ({
  //       ...prev,
  //       [videoId2]: { ...prev[videoId2], isPlaying: false },
  //     }));
  //     video.pause();
  //   }
  // };

  // const toggleMuteRecommendation = (e, videoId2) => {
  //   e.stopPropagation();

  //   const video = videoRecommendationRefs.current[videoId2];
  //   if (video) {
  //     const currentMuteState = recommendationStates[videoId2]?.isMuted;
  //     const newMuteState = !currentMuteState;

  //     video.muted = newMuteState;

  //     setRecommendationStates((prev) => ({
  //       ...prev,
  //       [videoId2]: { ...prev[videoId2], isMuted: newMuteState },
  //     }));
  //   }
  // };
  
  const togglePlayCurrent = () => {
    const video = currentVideoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMuteCurrent = () => {
    const video = currentVideoRef.current;
    video.muted = !isMuted;
    setisMuted(!isMuted);
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleVideoViewCounter = () => {
    dispatch(fetchViewCounter(targetVideo?._id));
    // dispatch(fetchVideosById(VideoId));
  }

  const handleSubcribeUser = () => {
    dispatch(fetchSubcribeToggle(targetVideo?.owner?._id));
    setCurrentStatus((prev) => ({
      ...prev,
      subcriberStatus: !prev.subcriberStatus,
    }));
    dispatch(fetchVideosById(VideoId));
  }

  const handleLikeToggleVideos = () => {
    dispatch(fetchLikeToggleVideo(VideoId));
    // dispatch(fetchVideosById(VideoId));
    setCurrentStatus((prev) => ({
      ...prev,
    likeStatus: !prev.likeStatus,
    }));
  }

  const handleIsSubcribed = useCallback(() => {
    dispatch(isSubcribed(targetVideo?.owner?._id));
    setCurrentStatus((prev) => ({
      ...prev,
      subcriberStatus: isSubcribedStatus,
    }));
    // dispatch(fetchVideosById(VideoId));
  },[dispatch,targetVideo,isSubcribedStatus])
  
  useEffect(() => {
    handleIsSubcribed();
  }, [handleIsSubcribed]);

  const handleIsVideoLiked = useCallback(() => {
    dispatch(isVideoLiked(VideoId));
    // dispatch(fetchVideosById(VideoId));
    setCurrentStatus((prev) => ({
      ...prev,
      likeStatus: videoLiked,
    }));
  },[dispatch,VideoId,videoLiked])
  
  useEffect(() => {
    handleIsVideoLiked();
  }, [handleIsVideoLiked]);

  const [showMenu, setShowMenu] = useState(false);
    const [toggleVideoUploading, setToggleVideoUploading] = useState(true);
    const [toggleShortUploading, setToggleShortUploading] = useState(true);
    const [toggleLiveUploading, setToggleLiveUploading] = useState(true);

    const formatTimeAgo = (date) => {
      if (timeAgo && typeof timeAgo === "function") {
        return timeAgo(date);
      }

      // Fallback time ago calculation
      if (!date) return "Unknown time";

      const now = new Date();
      const past = new Date(date);
      const diffInSeconds = Math.floor((now - past) / 1000);

      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 31536000)
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

    const formatToLocalString = (nows) => {
      const now = new Date(nows);

      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      const formattedDateTime = now.toLocaleString("en-US", options);

      return formattedDateTime;
  };

  const handleOverAllEvent = (e) => {
    const targetId = e.target.id;
    const targetName = e.target.getAttribute('name');
    const eventType = e.type;
    const tagName = e.target.tagName;


    if ((targetName === "duration" || targetName === "title") && eventType === 'click' && targetId) {
      Navigate(`/video/${targetId}`);
      return;
    }

    if ((targetName === "avatar" || targetName === "username") && targetId && eventType === 'click') {
      const username = e.target.getAttribute('data-username');
      console.log(e.target)
      Navigate(`/channel/${username}`)
      return;
    }
    
    if (targetName === "duration") {

      const videoElements = document.getElementsByName('video');

      const targetedVideo = Array.from(videoElements).find((video) => video.id === targetId);

      if (!targetedVideo) return;

      if (eventType === 'mouseenter') {
        setRecommendationStates((prev) => ({
          ...prev,
          [targetId]: { ...prev[targetId], mutedStatus: true },
        }));
        if (targetedVideo.hoverTimeout) {
          clearTimeout(targetedVideo.hoverTimeout);
        }

        if (eventType === 'click') {
          setRecommendationStates((prev) => ({
            ...prev,
            [targetId]: { ...prev[targetId], mutedStatus: false },
          }));
          if (targetedVideo.hoverTimeout) {
            clearTimeout(targetedVideo.hoverTimeout);
          }

          targetedVideo.hoverTimeout = setTimeout(() => {
            targetedVideo.pause();
            targetedVideo.currentTime = 0;
          }, 500);
          return;
        }

        targetedVideo.hoverTimeout = setTimeout(() => {
          targetedVideo.play().catch((error) => console.error(error));
        }, 800);
      }
      else if (eventType === 'mouseleave') {
        setRecommendationStates((prev) => ({
          ...prev,
          [targetId]: { ...prev[targetId], mutedStatus: false },
        }));
        if (targetedVideo.hoverTimeout) {
          clearTimeout(targetedVideo.hoverTimeout);
        }

        targetedVideo.hoverTimeout = setTimeout(() => {
          targetedVideo.pause();
          targetedVideo.currentTime = 0;
        }, 500);
      }
      return
    }

    if ((targetName === "volume" || tagName === 'svg' || tagName === 'path' || tagName === 'line' || tagName === 'BUTTON') && targetId && eventType === 'click') {
      e.stopPropagation();
      e.preventDefault();

      const videoElements = document.getElementsByName('video');

      const targetedVideo = Array.from(videoElements).find((video) => video.id === targetId);

      const newMutedState = !targetedVideo.muted;
      targetedVideo.muted = newMutedState;
      
      setRecommendationStates((prev) => ({
        ...prev,
        [targetId]: { ...prev[targetId], isMuted: newMutedState },
      }));

      return;
    }
  }

  return (
    <div
      className="relative h-full transition-all"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family)',
        transitionDuration: 'var(--animation-duration)'
      }}
    >
      <UploadVideo
        setToggleVideoUploading={setToggleVideoUploading}
        toggleVideoUploading={toggleVideoUploading}
      />
      <UploadShort
        setToggleShortUploading={setToggleShortUploading}
        toggleShortUploading={toggleShortUploading}
      />
      <UploadLive
        setToggleLiveUploading={setToggleLiveUploading}
        toggleLiveUploading={toggleLiveUploading}
      />
      <Header
        menuToggle={{ showMenu, setShowMenu }}
        setToggleVideoUploading={setToggleVideoUploading}
        setToggleShortUploading={setToggleShortUploading}
        setToggleLiveUploading={setToggleLiveUploading}
      />

      <div
        className="h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] max-lg:flex-col flex justify-evenly max-sm:justify-baseline max-md:pl-0 max-md:pr-0 w-full pb-2 pr-4 overflow-y-scroll scroll-smooth scrollBar overflow-x-hidden transition-all"
        style={{
          transitionDuration: 'var(--animation-duration)'
        }}
        role="main"
        aria-label="Video player page"
      >
        <div className="max-lg:absolute top-[57px] fixed max-md:top-[41px] z-40 left-0">
          <SideMenu
            menuToggle={{ showMenu, setShowMenu }}
            videoParam={{ setVideoParams, videoParams }}
          />
        </div>

        {/* Video Section */}
        <div
          className="w-[70%] max-lg:w-full pl-4 pt-2 max-lg:flex-shrink-0 px-2 max-md:px-0 h-auto transition-all"
          style={{
            // paddingLeft: 'var(--component-padding)',
            // paddingTop: 'var(--spacing-unit)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          {/* Video and Controls */}
          <div className="relative">
            {/* Video Player */}
            <div
              className="w-full aspect-video"
              role="region"
              aria-label="Main video player"
            >
              <video
                src={targetVideo?.videoFile}
                ref={currentVideoRef}
                poster={targetVideo?.thumbnail}
                className="w-full h-full max-md:rounded-none rounded-2xl transition-all"
                style={{
                  backgroundColor: '#000000',
                  transitionDuration: 'var(--animation-duration)'
                }}
                muted={isMuted}
                onTimeUpdate={handleOntimeCurrent}
                volume={volume}
                autoPlay
                aria-label={`Playing: ${targetVideo?.title}`}
              />
            </div>

            {/* Video Controls Overlay */}
            <div
              className="absolute inset-0 p-2.5 w-full h-full flex flex-col justify-between"
              style={{ padding: 'var(--spacing-unit)' }}
            >
              {/* Top Controls */}
              <div className="flex justify-end">
                <div>
                  <button
                    className="rounded-full p-2 transition-all"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    }}
                    aria-label="Video options"
                  >
                    <EllipsisVertical
                      size={20}
                      color={"white"}
                      className="max-md:size-4"
                    />
                  </button>
                </div>
              </div>

              {/* Center Play/Pause Button */}
              <div className="flex items-center justify-center mx-auto h-fit">
                <button
                  onClick={togglePlayCurrent}
                  className="max-md:p-3 p-6 rounded-full transition-all"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <Pause
                      size={44}
                      fill="white"
                      stroke="5"
                      className="max-md:size-6"
                      color={"white"}
                    />
                  ) : (
                    <Play
                      size={44}
                      fill="white"
                      stroke="5"
                      className="max-md:size-6"
                      color={"white"}
                    />
                  )}
                </button>
              </div>

              {/* Bottom Controls */}
              <div>
                {/* Progress Bar */}
                <div className="w-full px-0.5 mb-0.5">
                  <input
                    type="range"
                    name="progress"
                    id={targetVideo?._id}
                    min={0}
                    max={100}
                    value={progess}
                    onChange={handleProgressCurrent}
                    className="w-full h-1 transition-all"
                    style={{
                      accentColor: 'var(--accent-color)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    aria-label="Video progress"
                  />
                </div>

                {/* Bottom Control Bar */}
                <div
                  className="w-full px-3 max-sm:p-1 flex justify-between"
                  // style={{ padding: 'var(--spacing-unit)' }}
                >
                  {/* Left Controls */}
                  <div className="flex space-x-1">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlayCurrent}
                      className="rounded-full p-2 max-sm:p-1 transition-all"
                      style={{
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause
                          size={20}
                          fill="white"
                          stroke="5"
                          color={"white"}
                          className="max-md:size-4"
                        />
                      ) : (
                        <Play
                          size={20}
                          fill="white"
                          stroke="5"
                          className="max-md:size-4"
                          color={"white"}
                        />
                      )}
                    </button>

                    {/* Skip Forward */}
                    <button
                      onClick={() => {/* handleNextVideo function */ }}
                      className="rounded-full p-2 max-sm:p-1 transition-all"
                      style={{
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                      aria-label="Next video"
                    >
                      <SkipForward
                        size={20}
                        fill="white"
                        color={"white"}
                        className="max-md:size-4"
                      />
                    </button>

                    {/* Volume Controls */}
                    <div
                      className="flex items-center ml-1.5 w-fit rounded-full text-white cursor-pointer"
                      onMouseEnter={() => setCurrentVolumeBar(true)}
                      onMouseLeave={() => setCurrentVolumeBar(false)}
                    >
                      <button
                        onClick={toggleMuteCurrent}
                        className="flex justify-center items-center w-fit p-2 max-sm:p-1 transition-all"
                        style={{
                          transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? (
                          <VolumeX
                            size={20}
                            className="max-md:size-4"
                          />
                        ) : (
                          <Volume2
                            size={20}
                            className="max-md:size-4"
                          />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className={`w-16 h-1 appearance-none transition-all delay-75 rounded-lg cursor-pointer ml-2 ${currentVolumeBar ? "block" : "hidden"
                          }`}
                        style={{
                          backgroundColor: volume === 0 ? 'var(--color-border)' : 'white',
                          accentColor: 'var(--accent-color)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                        aria-label="Volume control"
                      />
                    </div>

                    {/* Duration Display */}
                    <div
                      className="text-white max-sm:text-sm flex items-center justify-center"
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        fontFamily: 'var(--font-family)'
                      }}
                    >
                      {formatTime(currentDuration) +
                        " / " +
                        formatTime(targetVideo?.duration) ||
                        "0:00 / 0:00"}
                    </div>
                  </div>

                  {/* Right Controls */}
                  <div className="space-x-2 flex items-center">
                    {/* Autoplay Toggle */}
                    <button
                      onClick={() => setIsAutoplayOn(!isAutoplayOn)}
                      className="relative inline-flex items-center max-md:h-2 max-md:w-4 h-3 w-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
                      style={{
                        backgroundColor: isAutoplayOn ? 'var(--accent-color)' : 'var(--color-border)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        if (isAutoplayOn) {
                          e.target.style.opacity = '0.9';
                        } else {
                          e.target.style.backgroundColor = 'var(--color-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isAutoplayOn) {
                          e.target.style.opacity = '1';
                        } else {
                          e.target.style.backgroundColor = 'var(--color-border)';
                        }
                      }}
                      aria-label={`Autoplay is ${isAutoplayOn ? 'on' : 'off'}`}
                    >
                      <span
                        className="max-md:h-3 max-md:w-3 h-4 w-4 absolute transform rounded-full appearance-none outline-0 shadow-lg transition-transform duration-300 ease-in-out flex items-center justify-center"
                        style={{
                          backgroundColor: 'var(--color-bg-primary)',
                          transform: isAutoplayOn ? 'translateX(0.625rem)' : 'translateX(0)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                      >
                        {isAutoplayOn ? (
                          <Play
                            size={12}
                            fill="var(--accent-color)"
                            stroke="3"
                            className="max-md:size-2"
                          />
                        ) : (
                          <Pause
                            size={12}
                            fill="var(--color-text-secondary)"
                            stroke="3"
                            className="max-md:size-2"
                          />
                        )}
                      </span>
                    </button>

                    {/* Settings */}
                    <button
                      className="rounded-full p-2 max-sm:p-1 transition-all"
                      style={{
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'rotate(45deg)';
                        if (appearanceSettings.reducedMotion) {
                          e.target.style.transition = 'transform 0.3s ease';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'rotate(0deg)';
                        if (appearanceSettings.reducedMotion) {
                          e.target.style.transition = 'transform 0.3s ease';
                        }
                      }}
                      aria-label="Video settings"
                    >
                      <Settings
                        size={20}
                        color={"white"}
                        className="max-md:size-4"
                      />
                    </button>

                    {/* Fullscreen */}
                    <button
                      className="rounded-full p-2 max-sm:p-1 transition-all"
                      style={{
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                      aria-label="Enter fullscreen"
                    >
                      <Maximize
                        size={20}
                        color={"white"}
                        className="max-md:size-4"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Information */}
          <div
            className="pb-2 transition-all"
            style={{
              paddingBottom: 'var(--spacing-unit)',
              transitionDuration: 'var(--animation-duration)',
              paddingLeft: 'var(--spacing-unit)',
              paddingRight: 'var(--spacing-unit)'
            }}
          >
            {/* Video Title */}
            <div
              className="flex items-center justify-between max-sm:p-1 max-sm:text-sm p-2.5 text-lg font-bold"
              style={{
                paddingTop: 'var(--spacing-unit)',
                fontSize: 'var(--font-size-lg)',
                fontFamily: 'var(--font-family)',
                color: 'var(--color-text-primary)'
              }}
            >
              <span className="line-clamp-2">{targetVideo?.title}</span>
            </div>

            {/* Channel Info and Actions */}
            <div
              className="flex sm:items-center justify-between max-sm:flex-col p-2.5 max-sm:p-1"
              style={{
                // paddingTop: 'var(--spacing-unit)',
                gap: 'var(--spacing-unit)'
              }}
            >
              {/* Channel Info */}
              <div className="h-full flex items-center  max-sm:w-full">
                <div className="flex justify-center items-center">
                  <img
                    src={targetVideo?.owner?.avatar}
                    alt={`${targetVideo?.owner?.username} avatar`}
                    className="w-12 max-lg:w-10 aspect-square rounded-full drop-shadow-lg"
                    loading="lazy"
                  />
                </div>
                <div
                  className="flex flex-col ml-2"
                  style={{ marginLeft: 'var(--spacing-unit)' }}
                >
                  <span
                    className="text-[24px] max-lg:text-[16px] font-medium leading-tight"
                    style={{
                      fontSize: 'var(--font-size-xl)',
                      fontFamily: 'var(--font-family)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {targetVideo?.owner?.username}
                  </span>
                  <span
                    className="text-[11px] max-lg:text-xs font-medium opacity-65"
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    {"12.23M"} <span>subscribers</span>
                  </span>
                </div>
                <div className="h-full flex justify-center items-center">
                  <button
                    onClick={handleSubcribeUser}
                    className="px-3 max-sm:px-2  max-sm:py-1 max-lg:px-2 max-lg:text-sm py-2 max-lg:py-2 rounded-full flex justify-center items-center font-medium transition-all"
                    style={{
                      backgroundColor: currentStatus?.subcriberStatus
                        ? 'var(--color-bg-secondary)'
                        : 'var(--color-error)',
                      color: currentStatus?.subcriberStatus ? 'var(--color-text-primary)' : 'white',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      marginLeft: 'var(--spacing-unit)',
                      paddingLeft: 'var(--spacing-unit)',
                      paddingRight: 'var(--spacing-unit)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '0.9';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    aria-label={`${currentStatus?.subcriberStatus ? 'Unsubscribe from' : 'Subscribe to'} ${targetVideo?.owner?.username}`}
                  >
                    {currentStatus?.subcriberStatus ? "Subscribed" : "Subscribe"}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="h-full flex max-sm:space-x-1 space-x-3"
                style={{ gap: 'var(--spacing-unit)' }}
              >
                {/* Like Button */}
                <div className="h-full flex justify-center items-center">
                  <div className="font-medium flex">
                    <button
                      onClick={handleLikeToggleVideos}
                      className="font-medium max-lg:text-sm max-sm:px-2 max-sm:py-1 pt-2 pl-4 pb-2 pr-4 rounded-full items-center flex transition-all"
                      style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-base)',
                        fontFamily: 'var(--font-family)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                      }}
                      aria-label={`${currentStatus?.likeStatus ? 'Unlike' : 'Like'} this video`}
                    >
                      {currentStatus?.likeStatus ? (
                        <ThumbsUp
                          // fill="var(--accent-color)"
                          className="mr-2 max-lg:w-4"
                          style={{ color: 'var(--accent-color)' }}
                        />
                      ) : (
                        <ThumbsUp className="mr-2 max-lg:w-4" />
                      )}
                      <span>{targetVideo?.likeCount || "0"}</span>
                    </button>
                  </div>
                </div>

                {/* Add to Playlist */}
                <div className="h-full justify-center items-center relative">
                  <div
                    className={`${ToggleAddPlaylistBtn
                        ? "-translate-y-[104%] max-sm:-translate-x-[25%] translate-x-[5%] max-lg:-translate-x-[3%]"
                        : "hidden"
                      } absolute max-sm:right-1 h-[160px] aspect-square transition-all duration-1000 overflow-hidden rounded-lg shadow-lg z-50`}
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border)',
                      transitionDuration: appearanceSettings.reducedMotion ? '0s' : '1s'
                    }}
                  >
                    <h3
                      className="text-center mt-1"
                      style={{
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-base)',
                        fontFamily: 'var(--font-family)'
                      }}
                    >
                      Add To Playlist
                    </h3>
                    <ul className="overflow-y-scroll scrollBar w-full h-full">
                      {/* Playlist items would go here */}
                      <li
                        className="flex justify-center py-2 transition-all"
                        style={{
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-sm)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--color-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span><input type="checkbox" className="mr-1" /></span>
                        Sample Playlist
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setToggleAddPlaylistBtn(!ToggleAddPlaylistBtn)}
                    className="pt-2 max-lg:text-sm max-sm:px-2 max-sm:py-1 pb-2 pl-4 pr-4 rounded-full flex justify-center items-center font-medium max-sm:space-x-0 space-x-2 transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                    }}
                    aria-label="Add to playlist"
                  >
                    <Plus className="max-lg:w-4" />
                    <span className="sm:max-lg:hidden">Add to playlist</span>
                  </button>
                </div>

                {/* More Options */}
                <div className="h-full flex justify-center items-center">
                  <button
                    className="max-sm:py-1 sm:px-4 sm:py-2 max-sm:px-2 rounded-full flex justify-center items-center font-medium transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                    }}
                    aria-label="More options"
                  >
                    <EllipsisVertical className="max-lg:w-4 aspect-square" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Description */}
            <div
              onClick={() => setshowDesc(true)}
              onBlur={() => setshowDesc(false)}
              className={`${showDesc ? "" : "line-clamp-2"} w-full transition-all`}
              style={{
                margin: 'var(--spacing-unit) 0',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              <div
                className={`p-3 flex-col border-2 rounded-2xl ${showDesc ? "" : "line-clamp-2 max-md:line-clamp-1"
                  } transition-all cursor-pointer`}
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)',
                  // padding: 'var(--component-padding)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                // onMouseEnter={(e) => {
                //   e.target.style.backgroundColor = 'var(--color-hover)';
                // }}
                // onMouseLeave={(e) => {
                //   e.target.style.backgroundColor = 'var(--color-hover)';
                // }}
                role="button"
                tabIndex={0}
                aria-expanded={showDesc}
                aria-label="Video description"
              >
                {/* Views and Date */}
                <div
                  className={`${showDesc ? "" : "hidden"} flex space-x-2 text-[11px] font-medium`}
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  <span>
                    {targetVideo?.views} <span>Views</span>
                  </span>
                  <span className="flex space-x-2">
                    {formatToLocalString(targetVideo?.createdAt)}
                  </span>
                </div>
                {/* Description Text */}
                <p
                  className={`${showDesc ? "" : "line-clamp-1"} w-full`}
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-family)',
                    backgroundColor:'var(--color-bg-primary)'
                  }}
                >
                  {targetVideo?.description}
                </p>
                <div
                  className={`${!showDesc ? "hidden" : ""} text-xs cursor-pointer transition-colors`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setshowDesc(false);
                  }}
                  style={{
                    color: 'var(--accent-color)',
                    fontSize: 'var(--font-size-xs)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1';
                  }}
                >
                  Show Less
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div
              onClick={() => setMinimiseComment(true)}
              className="border-2 rounded-2xl overflow-hidden transition-all"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border)',
                // margin: 'var(--spacing-unit) 0',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              <Comments
                whichContent={"videos"}
                contentId={VideoId}
                timeAgo={timeAgo}
                minimiseComment={minimiseComment}
                setMinimiseComment={setMinimiseComment}
              />
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div
          className="w-[30%] max-lg:mt-2 px-2 pt-2 max-md:px-0 max-lg:w-full max-lg:rounded-none rounded-lg flex flex-col space-y-3 transition-all"
          style={{
            gap: 'var(--spacing-unit)',
            // padding: 'var(--spacing-unit)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          {/* Playlist Videos */}
          <div>
            {playlist?.video?.map((video) => (
              <div
                key={video._id}
                className="flex max-lg:flex-col max-lg:w-full h-fit mb-3 transition-all cursor-pointer"
                onClick={() => Navigate(`/video/${video?._id}`)}
                style={{
                  marginBottom: 'var(--spacing-unit)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-hover)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                role="button"
                tabIndex={0}
                aria-label={`Play ${video?.title}`}
              >
                {/* Video Thumbnail */}
                <div
                  className="relative w-[40%] max-lg:w-full h-fit"
                  onMouseEnter={(prev) => {
                    setRecommendationStates({
                      ...prev,
                      [video?._id]: { ...prev[video?._id], mutedStatus: true },
                    });
                    togglePlayRecommendation(video?._id);
                  }}
                  onMouseLeave={(prev) => {
                    setRecommendationStates({
                      ...prev,
                      [video?._id]: { ...prev[video?._id], mutedStatus: false },
                    });
                    // togglePauseRecommendation(video?._id);
                  }}
                >
                  <video
                    src={video?.videoFile}
                    ref={(el) => {
                      if (el) {
                        videoRecommendationRefs.current[video?._id] = el;
                      }
                    }}
                    muted={recommendationStates[video?._id]?.isMuted}
                    poster={video?.thumbnail}
                    // onTimeUpdate={() => handleOnTimeUpdate(video?._id)}
                    preload="metadata"
                    className="aspect-video max-md:rounded-none max-lg:w-full rounded-lg"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
                    aria-label={`Preview of ${video?.title}`}
                  />
                  <div className="absolute inset-0 p-2">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // toggleMuteRecommendation(e, video?._id);
                        }}
                        className={`${recommendationStates[video?._id]?.mutedStatus ? "" : "hidden"
                          } p-2 rounded-full transition-all z-10`}
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                        }}
                        aria-label={recommendationStates[video?._id]?.isMuted ? "Unmute" : "Mute"}
                      >
                        {recommendationStates[video?._id]?.isMuted === true &&
                          recommendationStates[video?._id]?.mutedStatus === true ? (
                          <VolumeX size={16} color="white" />
                        ) : (
                          <Volume2 size={16} color="white" />
                        )}
                      </button>
                    </div>
                    <div className="absolute inset-0 flex items-end justify-end bottom-0 p-2 text-[10px]">
                      <h1
                        className="text-white text-lg max-md:text-sm font-semibold px-1 py-0.1 rounded-sm"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          fontSize: 'var(--font-size-sm)',
                          fontFamily: 'var(--font-family)'
                        }}
                      >
                        {recommendationStates[video?._id]?.isPlaying === true
                          ? formatTime(recommendationStates[video?._id]?.duration || 0)
                          : formatTime(video?.duration || 0)}
                      </h1>
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div
                  className="w-[60%] max-lg:w-full flex justify-base flex-col max-md:py-0 py-1 pl-2 max-md:my-1"
                  style={{
                    paddingLeft: 'var(--spacing-unit)',
                    paddingTop: 'var(--spacing-unit)'
                  }}
                >
                  {/* Title */}
                  <div
                    className="line-clamp-2 w-full font-medium text-md max-md:text-[16px]"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)'
                    }}
                  >
                    <h2>{video?.title}</h2>
                  </div>
                  <div className="flex">
                    <div className="flex items-baseline">
                      <img
                        src={video?.userInfo?.avatar}
                        alt={`${video?.userInfo?.username} avatar`}
                        className="w-6 mr-3 max-sm:w-8 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col leading-tight">
                      {/* Username */}
                      <div
                        className="mb-1 text-xs font-normal max-md:text-xs"
                        style={{
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-xs)'
                        }}
                      >
                        <h3>{video?.userInfo?.username}</h3>
                      </div>
                      {/* Views and Date */}
                      <div
                        className="text-[11px] font-normal max-md:text-[11px] space-x-1.5"
                        style={{
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-xs)'
                        }}
                      >
                        <span>{video?.views} views</span>
                        <span className="mx-1">•</span>
                        <span>
                          {formatTimeAgo(video?.createdAt) || "Unknown time"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filtered Recommendations */}
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="flex max-lg:flex-col max-lg:w-full h-fit mb-3 transition-all"
              name="filter-container"
              data-id={video._id}
              onClick={handleOverAllEvent}
              style={{
                marginBottom: 'var(--spacing-unit)',
                transitionDuration: 'var(--animation-duration)'
              }}
              // onMouseEnter={(e) => {
              //   e.target.style.backgroundColor = 'var(--color-hover)';
              // }}
              // onMouseLeave={(e) => {
              //   e.target.style.backgroundColor = 'transparent';
              // }}
            >
              {/* Video Thumbnail */}
              <div
                className="relative w-[40%] max-lg:w-full h-fit"
                name="video-cover"
                onMouseEnter={handleOverAllEvent}
                onMouseLeave={handleOverAllEvent}
              >
                <video
                  src={video?.videoFile}
                  name="video"
                  id={video._id}
                  muted={recommendationStates[video?._id]?.isMuted}
                  poster={video?.thumbnail}
                  onTimeUpdate={() => handleOnTimeUpdate(video?._id)}
                  preload="metadata"
                  className="aspect-video max-md:rounded-none max-lg:w-full rounded-lg"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
                />
                <div name="control-container" className="absolute inset-0 p-1 max-lg:p-2">
                  <div className="flex justify-end items-baseline">
                    <button
                      name="volume"
                      onClick={handleOverAllEvent}
                      id={video._id}
                      className={`${recommendationStates[video?._id]?.mutedStatus ? "" : "hidden"
                        } p-2 rounded-full transition-all z-10`}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-accent-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                      }}
                    >
                      {recommendationStates[video?._id]?.isMuted === true ? (
                        <VolumeX
                          id={video._id}
                          color="white"
                          className="size-5 max-lg:size-7 max-sm:size-6"
                        />
                      ) : (
                        <Volume2
                          id={video._id}
                          color="white"
                          className="size-5 max-lg:size-7 max-sm:size-6"
                        />
                      )}
                    </button>
                  </div>
                  <div name="duration" id={video._id} className="absolute inset-0 flex items-end justify-end bottom-0 max-lg:p-2 lg:p-1">
                    <h1
                      className="text-white max-md:text-xs text-[10px] lg:px-1 lg:py-0.5 px-2 py-1 rounded font-medium"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        fontSize: 'var(--font-size-xs)',
                        fontFamily: 'var(--font-family)'
                      }}
                    >
                      {recommendationStates[video?._id]?.isPlaying === true
                        ? formatTime(recommendationStates[video?._id]?.duration || 0)
                        : formatTime(video?.duration || 0)}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div
                className="w-[60%] max-lg:w-full flex justify-base flex-col max-md:py-0 py-1 pl-2 max-md:my-1"
                style={{
                  paddingLeft: 'var(--spacing-unit)',
                  paddingTop: 'var(--spacing-unit)'
                }}
              >
                {/* Desktop Layout */}
                <div
                  className="line-clamp-2 max-lg:hidden w-full font-medium text-md max-md:text-[16px]"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-family)'
                  }}
                >
                  <h2 name="title" id={video._id}>{video?.title}</h2>
                </div>
                <div className="flex max-lg:hidden">
                  <div className="flex items-baseline lg:hidden">
                    <img
                      src={video?.userInfo?.avatar}
                      alt={`${video?.userInfo?.username} avatar`}
                      name="avatar"
                      id={video._id}
                      data-username={video?.userInfo?.username}
                      className="w-6 mr-3 max-sm:w-8 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <div
                      className="mb-1 text-xs font-normal max-md:text-xs"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)'
                      }}
                    >
                      <h3 name="username" data-username={video?.userInfo?.username} id={video._id}>
                        {video?.userInfo?.username}
                      </h3>
                    </div>
                    <div
                      className="text-[11px] font-normal max-md:text-[11px] space-x-1.5"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)'
                      }}
                    >
                      <span>{video?.views} views</span>
                      <span className="mx-1">•</span>
                      <span>
                        {formatTimeAgo(video?.createdAt) || "Unknown time"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="flex lg:hidden">
                  <div className="flex">
                    <div className="flex items-baseline">
                      <img
                        src={video?.userInfo?.avatar}
                        alt={`${video?.userInfo?.username} avatar`}
                        name="avatar"
                        id={video._id}
                        data-username={video?.userInfo?.username}
                        className="w-6 mr-3 max-sm:w-8 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div
                        className="line-clamp-2 w-full font-medium text-lg max-md:text-[16px]"
                        style={{
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-lg)',
                          fontFamily: 'var(--font-family)'
                        }}
                      >
                        <h2 name="title" id={video._id}>{video?.title}</h2>
                      </div>
                      <div
                        className="mb-1 text-xs font-normal max-md:text-xs leading-tight flex"
                        style={{
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-xs)'
                        }}
                      >
                        <div className="mb-1 text-xs font-normal max-md:text-xs">
                          <h3 name="username" data-username={video?.userInfo?.username} id={video._id}>
                            {video?.userInfo?.username}
                          </h3>
                        </div>
                        <span className="mx-1">•</span>
                        <span>{video?.views} views</span>
                        <span className="mx-1">•</span>
                        <span>
                          {formatTimeAgo(video?.createdAt) || "Unknown time"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPages;




