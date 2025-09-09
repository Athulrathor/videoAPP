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

const VideoPages = (props) => {

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
  const muteButtonRef = useRef({})

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
  
  const handleNextVideo = () => {
    const videos = filteredVideos;

    const randomIndex = Math.floor(Math.random() * videos.length);
    const video_id = videos[randomIndex]._id;

    Navigate(`/video/${video_id}`)
  }

  const togglePauseRecommendation = (videoId2) => {
    const video = videoRecommendationRefs.current[videoId2];
    if (video) {
        
      setRecommendationStates((prev) => ({
        ...prev,
        [videoId2]: { ...prev[videoId2], isPlaying: false },
      }));
      video.pause();
    }
  };

  const toggleMuteRecommendation = (e, videoId2) => {
    e.stopPropagation();

    const video = videoRecommendationRefs.current[videoId2];
    if (video) {
      const currentMuteState = recommendationStates[videoId2]?.isMuted;
      const newMuteState = !currentMuteState;

      video.muted = newMuteState;

      setRecommendationStates((prev) => ({
        ...prev,
        [videoId2]: { ...prev[videoId2], isMuted: newMuteState },
      }));
    }
  };
  
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
  },[dispatch,targetVideo])
  
  useEffect(() => {
    handleIsSubcribed();
  }, []);

  const handleIsVideoLiked = useCallback(() => {
    dispatch(isVideoLiked(VideoId));
    // dispatch(fetchVideosById(VideoId));
    setCurrentStatus((prev) => ({
      ...prev,
      likeStatus: videoLiked,
    }));
  },[dispatch,VideoId])
  
  useEffect(() => {
    handleIsVideoLiked();
  }, []);

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
    <div className="relative h-full">
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
      {/* <SideMenu /> */}
      <div className="h-[calc(100vh_-_57px)] max-md;h-[calc(100vh_-_41px)] max-lg:flex-col flex justify-evenly max-sm:justify-baseline max-md:pl-0 max-md:pr-0 w-full pb-2  pr-4  overflow-y-scroll scroll-smooth scrollBar overflow-x-hidden">
        
        <div className="max-lg:absolute top-[57px] fixed max-md:top-[41px] z-40 left-0">
          <SideMenu menuToggle={{ showMenu, setShowMenu }}
            videoParam={{ setVideoParams, videoParams }} />
        </div>
        {/* video section */}
        <div className=" w-[70%] max-lg:w-full pl-4 pt-2 max-lg:flex-shrink-0 px-2 max-md:px-0 h-auto">
          {/* video and its controls */}
          <div className="relative">
            {/* videos */}
            <div className="w-full aspect-video">
              <video
                src={targetVideo?.videoFile}
                ref={currentVideoRef}
                poster={targetVideo?.thumbnail}
                className="bg-black w-full h-full max-md:rounded-none rounded-2xl"
                muted={isMuted}
                onTimeUpdate={handleOntimeCurrent}
                volume={volume}
                autoPlay
              ></video>
            </div>
            {/* controls */}
            <div
              className={`absolute inset-0 p-2.5 w-full h-full flex flex-col justify-between`}
            >
              {/* top container */}
              <div className="flex justify-end">
                {/* video user logo */}
                <button></button>
                {/* options */}
                <div>
                  <button className="rounded-full p-2">
                    <EllipsisVertical
                      size={20}
                      color={"white"}
                      className="max-md:size-4"
                    />
                  </button>
                </div>
              </div>
              {/* middle container */}
              <div className="flex items-center justify-center mx-auto h-fit">
                {/* openables dropdown list */}
                <div className="absolute inset-0 mx-[72%] my-[18%] w-fit h-fit  rounded-2xl"></div>
                {/* move left button */}
                {/* <button></button> */}
                {/* play pause button */}
                <button
                  onClick={togglePlayCurrent}
                  className={`max-md:p-3 p-6 rounded-full bg-black/25`}
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
                {/* move right button */}
                {/* <button></button> */}
              </div>
              {/* buttom container */}
              <div className="">
                {/* progressBar */}
                <div className="w-full px-0.5 mb-0.5">
                  <input
                    type="range"
                    name="progress"
                    id={targetVideo?._id}
                    min={0}
                    max={100}
                    value={progess}
                    onChange={handleProgressCurrent}
                    className="w-full h-1"
                  />
                </div>

                {/* bottom controlable controls */}
                <div className=" w-full px-3 max-sm:p-1 flex justify-between">
                  {/* bottm left part */}
                  <div className="flex space-x-1">
                    {/* play button */}
                    <button
                      onClick={togglePlayCurrent}
                      className="rounded-full p-2 max-sm:p-1"
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
                    {/* next video in the list */}
                    <button
                      onClick={handleNextVideo}
                      className="rounded-full p-2 max-sm:p-1"
                    >
                      <SkipForward
                        size={20}
                        fill="white"
                        color={"white"}
                        className="max-md:size-4"
                      />
                    </button>
                    {/* toggle volume mute */}
                    <div
                      className="flex items-center ml-1.5 w-fit rounded-full text-white cursor-pointer"
                      onMouseEnter={() => setCurrentVolumeBar(true)}
                      onMouseLeave={() => setCurrentVolumeBar(false)}
                    >
                      <button
                        onClick={toggleMuteCurrent}
                        className="flex justify-center items-center w-fit p-2 max-sm:p-1"
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
                        className={`${
                          volume === 0 ? "bg-gray-300" : "bg-white"
                        } w-16 h-1 appearance-none transition-all delay-75 rounded-lg cursor-pointer ${
                          currentVolumeBar ? "block" : "hidden"
                        } ml-2`}
                      />
                    </div>
                    {/* duration runner with progressbar */}
                    <div className="text-white max-sm:text-sm flex items-center justify-center">
                      {formatTime(currentDuration) +
                        " / " +
                        formatTime(targetVideo?.duration) ||
                        "12:90 / 13:90"}
                    </div>
                  </div>
                  {/* bottom right part */}
                  <div className=" space-x-2 flex items-center">
                    {/* autoPlay toggle button */}
                    <button
                      onClick={() => setIsAutoplayOn(!isAutoplayOn)}
                      className={`
              relative inline-flex items-center max-md:h-2 max-md:w-4 h-3 w-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-0
              ${
                isAutoplayOn
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 hover:bg-gray-400"
              }
            `}
                    >
                      {/* Toggle Circle */}
                      <span
                        className={`
                 max-md:h-3 max-md:w-3 h-4 w-4 absolute transform rounded-full appearance-none outline-0 bg-gray-300 shadow-lg transition-transform duration-300 ease-in-out flex items-center justify-center
                ${isAutoplayOn ? "translate-x-2.5" : "translate-x-0"}
              `}
                      >
                        {isAutoplayOn ? (
                          <Play
                            size={12}
                            fill="black/50"
                            stroke="3"
                            className="max-md:size-4 text-gray-200"
                          />
                        ) : (
                          <Pause
                            size={12}
                            fill="black/50"
                            stroke="3"
                            className="max-md:size-4 text-gray-100"
                          />
                        )}
                      </span>
                    </button>
                    {/* setting drop down */}
                    <button className="rounded-full p-2 max-sm:p-1">
                      <Settings
                        size={20}
                        color={"white"}
                        className="max-md:size-4"
                      />
                    </button>
                    {/* full screen toggle */}
                    <button className="rounded-full p-2 max-sm:p-1">
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

          {/* button and some details */}
          <div className="pb-2">
            {/* title */}
            <div className="flex items-center justify-between max-sm:p-1 max-sm:text-sm p-2.5 text-lg font-bold">
              <span className="line-clamp-2">{targetVideo?.title}</span>
            </div>
            {/* button and detail */}
            <div className="flex items-center justify-between p-2.5 max-sm:p-1">
              <div className="h-full flex items-center">
                <div className="flex justify-center items-center">
                  <img
                    src={targetVideo?.owner?.avatar}
                    alt=""
                    className="w-12 max-lg:w-8 bg-pink-300 aspect-square rounded-full drop-shadow-lg"
                  />
                </div>
                <div className="flex flex-col ml-2">
                  <span className="text-[24px] max-lg:text-[16px] font-medium leading-tight">
                    {targetVideo?.owner?.username}
                  </span>
                  <span className="text-[11px] max-lg:text-xs font-medium opacity-65">
                    {"12.23M"} <span className="leading-0 ">subcribers</span>
                  </span>
                </div>
                <div className="h-full flex justify-center items-center">
                  <button
                    onClick={() =>
                      handleSubcribeUser()
                    }
                    className={`${
                      currentStatus?.subcriberStatus
                        ? "bg-gray-300 hover:bg-gray-500 active:bg-gray-600"
                        : "bg-red-400 hover:bg-red-500 active:bg-red-600"
                    } ml-3 px-3 max-sm:px-2 max-sm:py-1 max-lg:px-2 max-lg:text-sm py-2 max-lg:py-2 rounded-4xl flex justify-center items-center font-medium`}
                  >
                    {currentStatus?.subcriberStatus ? "Subcribed" : "Subcribe"}
                  </button>
                </div>
                <div></div>
              </div>
              <div className=" h-full flex max-sm:space-x-1 space-x-3">
                {/* like */}
                <div className="h-full flex justify-center items-center">
                  <div className=" font-medium flex">
                    <button
                      onClick={handleLikeToggleVideos}
                      className=" font-medium max-lg:text-sm max-sm:px-2 max-sm:py-1 pt-2 pl-4 pb-2 pr-4 rounded-4xl items-center  flex bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
                    >
                      {currentStatus?.likeStatus ? (
                        <ThumbsUp
                          fill="black"
                          className="mr-2 max-lg:w-4"
                        />
                      ) : (
                        <ThumbsUp className="mr-2 max-lg:w-4" />
                      )}
                      <span>{targetVideo?.likeCount || "12k"}</span>
                    </button>
                  </div>
                </div>
                {/* save */}
                <div className="hidden h-full justify-center items-center space-x-3">
                  <button className="pt-2 max-lg:text-sm max-sm:px-2 max-sm:py-1 pb-2 pl-4 pr-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-4xl flex justify-center items-center font-medium space-x-2">
                    <Share2 className={`max-lg:w-4`} /> <span>Share</span>
                  </button>
                </div>
                {/* Download */}
                <div className="hidden h-full justify-center items-center space-x-3">
                  <button className="pt-2 max-lg:text-sm max-sm:px-2 max-sm:py-1 pb-2 pl-4 pr-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-4xl flex justify-center items-center font-medium space-x-2">
                    <ArrowDownToLine className={`max-lg:w-4`} />{" "}
                    <span>Download</span>
                  </button>
                </div>
                {/* add video to playlist */}
                
                <div className=" h-full justify-center items-center">
                  <div className={`${ToggleAddPlaylistBtn ? "-translate-y-[104%] max-sm:-translate-x-[25%] translate-x-[5%] max-lg:-translate-x-[3%]" : "hidden"} absolute max-sm:right-1  h-[160px] aspect-square   transition-all duration-1000 overflow-hidden bg-gray-50 rounded-lg shadow-2xs`}>
                    <h3 className="text-center mt-1">Add To PlayList</h3>
                    <ul className=" overflow-y-scroll scrollBar w-full h-full">
                      <li className="flex justify-center py-2 hover:bg-gray-100 active:bg-gray-200 active:opacity-80"><span><input type="checkbox" name="" id="1" className="mr-1" /></span> playlist name</li>
                      <li className="flex justify-center py-2 hover:bg-gray-100 active:bg-gray-200 active:opacity-80"><span><input type="checkbox" name="" id="1" className="mr-1" /></span> playlist name</li>
                      <li className="flex justify-center py-2 hover:bg-gray-100 active:bg-gray-200 active:opacity-80"><span><input type="checkbox" name="" id="1" className="mr-1" /></span> playlist name</li>
                      <li className="flex justify-center py-2 hover:bg-gray-100 active:bg-gray-200 active:opacity-80"><span><input type="checkbox" name="" id="1" className="mr-1" /></span> playlist name</li>
                      <li className="flex justify-center py-2 hover:bg-gray-100 active:bg-gray-200 active:opacity-80"><span><input type="checkbox" name="" id="1" className="mr-1" /></span> playlist name</li>
                      <li className="flex justify-center py-2 hover:bg-gray-100 active:bg-gray-200 active:opacity-80"><span><input type="checkbox" name="" id="1" className="mr-1" /></span> playlist name</li>
                      <li className="flex justify-center py-2 hover:bg-gray-100 active:bg-gray-200 active:opacity-80"><span><input type="checkbox" name="" id="1" className="mr-1" /></span> playlist name</li>
                    </ul>
                  </div>
                  <button onClick={() => setToggleAddPlaylistBtn(!ToggleAddPlaylistBtn)} className="pt-2 max-lg:text-sm max-sm:px-2 max-sm:py-1 pb-2 pl-4 pr-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-4xl flex justify-center items-center font-medium max-sm:space-x-0 space-x-2">
                    <Plus className={`max-lg:w-4`} />{" "}
                    <span className="max-sm:hidden">Add to playList</span>
                  </button>
                </div>
                {/* more list */}
                <div className="h-full flex justify-center items-center">
                  <button className="max-sm:py-1 sm:px-4 sm:py-2 max-sm:px-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-4xl flex justify-center items-center font-medium">
                    <EllipsisVertical className={`max-lg:w-4 aspect-square`} />
                  </button>
                </div>
                {/* can add button for video videos like save,flag etc  */}
              </div>
            </div>
            {/* descriptions  */}
            <div onClick={() => setshowDesc(true)} onBlur={() =>showDesc(false)} className={`${showDesc ? "h-fit" : "line-clamp-2"} w-full my-2.5`}>
              <div className={`p-3 max-md:p-1.5 max-md:mx-2 flex-col bg-gray-50  border-2 border-gray-200   rounded-lg ${showDesc ? "" : "line-clamp-2 max-md:line-clamp-1"}`}>
                {/* views and day date year */}
                <div className={`${showDesc ? "" : "hidden"} flex space-x-2 text-[11px] font-medium `}>
                  <span>
                    {targetVideo?.views} <span>View</span>
                  </span>
                  <span className="flex space-x-2">
                    {formatToLocalString(targetVideo?.createdAt)}
                  </span>
                </div>
                {/* description */}
                <p className="w-full">{targetVideo?.description}</p>
                <div className="text-xs cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  setshowDesc(false);
                }}>Show Less</div>
              </div>
              
            </div>
            {/* comments setion */}
            <div onClick={() => setMinimiseComment(true)} className="border-2 my-3 border-gray-200 bg-gray-50 rounded-2xl overflow-hidden">
              <Comments whichContent={"videos"} contentId={VideoId} timeAgo={timeAgo} minimiseComment={minimiseComment} setMinimiseComment={setMinimiseComment} />
            </div>
          </div>
        </div>
        {/* recommandation section */}
        <div className=" w-[30%] max-lg:mt-2 px-2 pt-2 max-md:px-0 max-lg:w-full max-lg:rounded-none rounded-lg flex flex-col space-y-3">
          <div className={``}>
            {playlist?.video?.map((video) => (
              <div
                key={video._id}
                className="flex max-lg:flex-col max-lg:w-full h-fit"
                onClick={() => Navigate(`/video/${video?._id}`)}
              >
                {/* video */}
                <div
                  className="relative w-[40%] max-lg:w-full  h-fit"
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
                    togglePauseRecommendation(video?._id);
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
                    onTimeUpdate={() => handleOnTimeUpdate(video?._id)}
                    preload="metadata"
                    className="bg-black/90 aspect-video max-md:rounded-none max-lg:w-full rounded-lg"
                  ></video>
                  <div className="absolute inset-0 p-2">
                    <div className="flex justify-end">
                      <button
                        ref={(el) => {
                          if (el) {
                            muteButtonRef.current[video?._id] = el;
                          }
                        }}
                        onClick={(e) => toggleMuteRecommendation(e, video?._id)}
                        className={`${recommendationStates[video?._id]?.mutedStatus
                            ? ""
                            : "hidden"
                          } p-2 rounded-full hover:bg-black30 active:bg-black/50 z-13`}
                      >
                        {recommendationStates[video?._id]?.isMuted === true &&
                          recommendationStates[video?._id]?.mutedStatus === true ? (
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
                    <div className="absolute inset-0 flex items-end justify-end bottom-0 p-2 text-[10px]">
                      <h1 className="text-white text-lg max-md:text-sm bg-black/30 font-semibold px-1 py-0.1 rounded-sm">
                        {recommendationStates[video?._id]?.isPlaying === true
                          ? formatTime(
                            recommendationStates[video?._id]?.duration || 0
                          )
                          : formatTime(video?.duration || 0)}
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="w-[60%] max-lg:w-full flex justify-base flex-col max-md:py-0 py-1 pl-2 max-md:my-1">
                  {/* title */}
                  <div className="line-clamp-2 w-full font-medium text-md max-md:text-[16px]">
                    <h2>{video?.title}</h2>
                  </div>
                  <div className="flex">
                    <div className="flex items-baseline ">
                      <img
                        src={video?.userInfo?.avatar}
                        alt=""
                        className="w-6 mr-3 max-sm:w-8 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                      />
                    </div>
                    <div className="flex flex-col leading-tight">
                      {/* user name */}
                      <div className="mb-1  text-xs font-normal text-gray-500 max-md:text-xs">
                        <h3>{video?.userInfo?.username}</h3>
                      </div>
                      {/* view and month ago */}
                      <div className="text-[11px] font-normal  text-gray-500 max-md:text-[11px] space-x-1.5">
                        <span>{video?.views} views</span>
                        <span className="mx-1">•</span>
                        <span>
                          {formatTimeAgo(video?.createdAt) || "12 year ago"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="flex max-lg:flex-col max-lg:w-full h-fit"
              // onClick={() => Navigate(`/video/${video?._id}`)}
              name="filter-container"
              data-id={video._id}
              onClick={handleOverAllEvent}
            >
              {/* video */}
              <div
                className="relative w-[40%] max-lg:w-full  h-fit"
                name="video-cover"
                onMouseEnter={handleOverAllEvent}
                onMouseLeave={handleOverAllEvent}
                // onMouseEnter={(prev) => {
                //   setRecommendationStates({
                //     ...prev,
                //     [video?._id]: { ...prev[video?._id], mutedStatus: true },
                //   });
                //   togglePlayRecommendation(video?._id);
                // }}
                // onMouseLeave={(prev) => {
                //   setRecommendationStates({
                //     ...prev,
                //     [video?._id]: { ...prev[video._id], mutedStatus: false },
                //   });
                //   togglePauseRecommendation(video._id);
                // }}
              >
                <video
                  src={video?.videoFile}
                  // ref={(el) => {
                  //   if (el) {
                  //     videoRecommendationRefs.current[video?._id] = el;
                  //   }
                  // }}
                  name="video"
                  id={video._id}
                  muted={recommendationStates[video?._id]?.isMuted}
                  poster={video?.thumbnail}
                  onTimeUpdate={() => handleOnTimeUpdate(video?._id)}
                  preload="metadata"
                  className="bg-black/90 aspect-video max-md:rounded-none max-lg:w-full rounded-lg"
                ></video>
                <div name="control-container" className="absolute inset-0 p-1 max-lg:p-2">
                  <div className="flex justify-end items-baseline">
                    <button
                      // ref={(el) => {
                      //   if (el) {
                      //     muteButtonRef.current[video?._id] = el;
                      //   }
                      // }}
                      name="volume"
                      // onClick={(e) => toggleMuteRecommendation(e, video?._id)}
                      onClick={handleOverAllEvent}
                      id={video._id}
                      className={`${
                        recommendationStates[video?._id]?.mutedStatus
                          ? ""
                          : "hidden"
                      } p-2 rounded-full hover:bg-black30 active:bg-black/50 z-13`}
                      // className="lg:p-1 p-1 rounded-full hover:bg-black/30 active:bg-black/50 z-13"
                    >
                      {recommendationStates[video?._id]?.isMuted === true ? (
                        <VolumeX
                            // size={16}
                            id={video._id}
                          color="white"
                          className="size-5 max-lg:size-7 max-sm:size-6"
                        />
                      ) : (
                        <Volume2
                            // size={16}
                            id={video._id}
                            color="white"
                            className="size-5 max-lg:size-7 max-sm:size-6"
                        />
                      )}
                    </button>
                  </div>
                  <div name="duration" id={video._id} className="absolute inset-0 flex items-end justify-end bottom-0 max-lg:p-2 lg:p-1">
                    <h1 className="bg-black/50 text-white  max-md:text-xs text-[10px] lg:px-1 lg:py-0.5 px-2 py-1 rounded font-medium">
                      {recommendationStates[video?._id]?.isPlaying === true
                        ? formatTime(
                            recommendationStates[video?._id]?.duration || 0
                          )
                        : formatTime(video?.duration || 0)}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="w-[60%] max-lg:w-full flex justify-base flex-col max-md:py-0 py-1 pl-2 max-md:my-1">

                {/* design for upto laptop */}
                <div  className="line-clamp-2 max-lg:hidden w-full font-medium text-md max-md:text-[16px] ">
                  <h2 name="title" id={video._id}>{video?.title}</h2>
                </div>
                <div className="flex max-lg:hidden">
                  <div className="flex items-baseline lg:hidden">
                    <img
                      src={video?.userInfo?.avatar}
                      alt=""
                      name="avatar"
                      id={video._id}
                      data-username={video?.userInfo?.username}
                      className="w-6 mr-3 max-sm:w-8 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    {/* user name */}
                    <div  className="mb-1  text-xs font-normal text-gray-500 max-md:text-xs">
                      <h3 name="username" data-username={video?.userInfo?.username} id={video._id}>{video?.userInfo?.username}</h3>
                    </div>
                    {/* view and month ago */}
                    <div className="text-[11px] font-normal  text-gray-500 max-md:text-[11px] space-x-1.5">
                      <span>{video?.views} views</span>
                      <span className="mx-1">•</span>
                      <span>
                        {formatTimeAgo(video?.createdAt) || "12 year ago"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* design for under laptop */}
                <div className="flex lg:hidden">
                  {/* image */}
                  <div className="flex">
                    <div className="flex items-baseline">
                      <img
                        src={video?.userInfo?.avatar}
                        alt=""
                        name="avatar"
                        id={video._id}
                        data-username={video?.userInfo?.username}
                        className="w-6 mr-3 max-sm:w-8 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                      />
                    </div>
                    {/* title username createdAt views */}
                    <div>
                      {/* title */}
                      <div  className="line-clamp-2 w-full font-medium text-lg max-md:text-[16px]">
                        <h2 name="title" id={video._id} >{video?.title}</h2>
                      </div>
                      <div className="mb-1  text-xs font-normal text-gray-500 max-md:text-xs leading-tight flex">
                        {/* username */}
                        <div  className="mb-1  text-xs font-normal text-gray-500 max-md:text-xs">
                          <h3 name="username" data-username={video?.userInfo?.username} id={video._id}>{video?.userInfo?.username}</h3>
                        </div>
                        <span className="mx-1">•</span>
                        {/* view */}
                        <span>{video?.views} views</span>
                        <span className="mx-1">•</span>
                        {/* time ago */}
                        <span>
                          {formatTimeAgo(video?.createdAt) || "12 year ago"}
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




