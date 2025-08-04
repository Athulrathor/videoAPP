import React, { lazy, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../libs/axios";
import Header from "../components/Header";
import { ArrowDownToLine, ChevronDown, EllipsisVertical, Maximize, Pause, Play, SendHorizonal, SendHorizontal, Settings, Settings2, Share2, SkipForward, ThumbsDown, ThumbsUp, Volume2, VolumeX } from "lucide-react";
import { useSelector } from "react-redux";
import SideMenu from "../components/SideMenu";

const UploadVideo = lazy(() => import('../components/UploadVideo'));
const UploadShort = lazy(() => import("../components/UploadShort"));
const UploadLive = lazy(() => import('../components/UploadLive'));

const VideoPages = (props) => {

  const { VideoId } = useParams();

  const { timeAgo } = props;

  const [currentVideo, setCurrentVideo] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setisMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentVolumeBar, setCurrentVolumeBar] = useState(false)

  const [videoCommentCount, setVideoCommentCount] = useState("12");
  const [videoComment, setVideoComment] = useState([]);
  const [commentReplies, setCommentReplies] = useState([]);
  const [videoCommentInput, setVideoCommentInput] = useState('');
  const [repliesCommentInput, setRepliesCommentInput] = useState({});
  const [getCommentRepliesId, setGetCommentRepliesId] = useState(null);

  const [recommendationStates, setRecommendationStates] = useState({});
  const [currentDuration, setCurrentDuration] = useState(false)
  const [progess, setProgress] = useState(0);

  const [currentStatus, setCurrentStatus] = useState({
    likeStatus: false,
    subcriberStatus: false
  });

  const [functionCalled, setFunctionCalled] = useState(false);

  const [commentStatus, setCommentStatus] = useState({
    like: false,
    disLike: false,
    repliesLike: false,
    repliesDisLike: false,
    repliesToggle: false,
    replyToggle: false,
    replyInput: "",
    getUserName: ""
  });

  const [minimiseComment, setMinimiseComment] = useState(false);

  const videoRecommendationRefs = useRef({});
  const currentVideoRef = useRef(null);
  const muteButtonRef = useRef({})

  // const [subcribeStatus, setSubcribeStatus] = useState(false);
  const [isAutoplayOn, setIsAutoplayOn] = useState(false);

  const Navigate = useNavigate();

  const { videos } = useSelector((state) => state.videos);
  const { user } = useSelector(state => state.user);
  
  const filteredVideos = videos.filter(
    (video) => video?._id !== currentVideo[0]?._id
  );
  
  useEffect(() => {
    if (videos.length > 0 && currentVideo[0]?._id) {
      const filtered = videos.filter(
        (video) => video?._id !== currentVideo[0]?._id
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
  }, [videos, currentVideo]);

  useEffect(() => {
    const initialStates = {};
    commentReplies.forEach((replies) => {
      initialStates[replies._id] = {
        inputStatus: false,
        inputValue: ''
      };
    });
    setRepliesCommentInput(initialStates);
  }, [commentReplies]);

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

    const handleDislikeComment = (commentId) => {
      setCommentStatus((prev) => ({
        ...prev,
        [commentId]: {
          ...prev[commentId],
          disLike: !commentStatus[commentId]?.disLike,
        },
      }));

      if (!commentStatus[commentId]?.disLike) {
        setCommentStatus((prev) => ({
          ...prev,
          [commentId]: {
            ...prev[commentId],
            like: false,
          },
        }));
      }
    };

    const handleDislikeReplies = (commentId) => {
      setCommentStatus((prev) => ({
        ...prev,
        [commentId]: {
          ...prev[commentId],
          repliesDisLike: !commentStatus[commentId]?.repliesDisLike,
        },
      }));

      if (!commentStatus[commentId]?.repliesDisLike) {
        setCommentStatus((prev) => ({
          ...prev,
          [commentId]: {
            ...prev[commentId],
            repliesLike: false,
          },
        }));
      }
    };

    const handlelikeComment = (commentId) => {
      setCommentStatus((prev) => ({
        ...prev,
        [commentId]: {
          ...prev[commentId],
          like: !commentStatus[commentId]?.like,
        },
      }));

      if (!commentStatus[commentId]?.like) {
        setCommentStatus((prev) => ({
          ...prev,
          [commentId]: {
            ...prev[commentId],
            disLike: false,
          },
        }));
      }

      fetchLikeToggleComments(commentId);
    };

    const handlelikeReplies = (commentId) => {
      setCommentStatus((prev) => ({
        ...prev,
        [commentId]: {
          ...prev[commentId],
          repliesLike: !commentStatus[commentId]?.repliesLike,
        },
      }));

      if (!commentStatus[commentId]?.repliesLike) {
        setCommentStatus((prev) => ({
          ...prev,
          [commentId]: {
            ...prev[commentId],
            repliesDisLike: false,
          },
        }));
      }

      fetchLikeToggleComments(commentId);
  };
  
          const fetchIsLikedOrNotComment = async (commentId) => {
              if (!commentId) return "id not found";
              try {
                const likesChecking = await axiosInstance.get(
                  `like/is-liked-or-not-comment/${commentId}`
                );
                setCommentStatus((prev) => ({
                  ...prev,
                  [commentId]: {
                    ...prev[commentId],
                    like:
                      likesChecking?.data?.data,
                  },
                }));
              } catch (error) {
                console.error(error);
              }
      }
    
            const fetchIsLikedOrNotReplies =
            async (commentId) => {
              if (!commentId) return "id not found";
              try {
                const likesChecking = await axiosInstance.get(
                  `like/is-liked-or-not-comment/${commentId}`
                );
                setCommentStatus((prev) => ({
                  ...prev,
                  [commentId]: {
                    ...prev[commentId],
                    repliesLike:
                      likesChecking?.data?.data,
                  },
                }));
              } catch (error) {
                console.error(error);
              }
            }
  
    const fetchLikeToggleComments = async (commentId) => {
      try {
         await axiosInstance.get(
          `like/toggle-like-to-comment/${commentId}`
        );
  
        fetchVideoComment();
        fetchCommentReplies(commentId)
      } catch (error) {
        console.error(error);
      }
    };
  
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
      fetchViewCounter();
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

    const fetchViewCounter = async () => {
      if (!currentVideo[0]?._id) return "id not found";
      try {
        await axiosInstance.get(
          `videos/view-counter/${VideoId}`
        );
        await fetchVideoDetails();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSubcribeToggle = async () => {
      if (!currentVideo[0]?.owner?._id) return "id not found";

      try {
        await axiosInstance.get(`subcriber/toggle-subcriber/${currentVideo[0]?.owner?._id}`);
        setCurrentStatus((prev) => ({
          ...prev,
          subcriberStatus: !prev.subcriberStatus,
        }));
        await fetchVideoDetails();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLikeToggleVideo = async () => {
      try {
        await axiosInstance.get(
          `like/toggle-like-to-video/${VideoId}`
        );
        setCurrentStatus((prev) => ({
          ...prev,
          likeStatus: !prev.likeStatus,
        }));
        await fetchVideoDetails();
      } catch (error) {
        console.error(error);
      }
  };
  
    const fetchIsSubcribed = async () => {
      if (!currentVideo[0]?.owner._id) return "id not found";
      try {
        const subcribe = await axiosInstance.get(
          `subcriber/is-subcribed/${currentVideo[0]?.owner._id}`
        );
        setCurrentStatus((prev) => ({
          ...prev,
          subcriberStatus: subcribe?.data?.data,
        }));
        fetchVideoDetails();
      } catch (error) {
        console.error(error);
      }
  }
  
  useEffect(() => {
    fetchIsSubcribed();
  }, []);

    const fetchIsLikedOrNotVideo = async () => {
      if (!VideoId
      ) return "id not found";
      try {
        const likesChecking = await axiosInstance.get(
          `like/is-liked-or-not-video/${VideoId}`
        );
        setCurrentStatus((prev) => ({
          ...prev,
          likeStatus: likesChecking?.data?.data,
        }));
        fetchVideoDetails();
      } catch (error) {
        console.error(error);
      }
  }
  
  useEffect(() => {
    fetchIsLikedOrNotVideo();
  }, []);

  const fetchVideoDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.post(`videos/get-video/${VideoId}`);
      const data = await response.data.data;
      setCurrentVideo(data);
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  }, [VideoId]);

  useEffect(() => {
    fetchVideoDetails();
  },[fetchVideoDetails])

  const fetchVideoComment = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `comment/get-video-comment/${VideoId}`
      );
      response?.data?.data?.data.map((comment) => {
        fetchIsLikedOrNotComment(comment._id);
      })
      setVideoCommentCount(response?.data?.data?.totalCountOfShort);
      setVideoComment(response?.data?.data?.data);
    } catch (error) {
      console.log("Error :", error.message);
    }
  }, [VideoId]);
  
  useEffect(() => {
    fetchVideoComment();
  }, [fetchVideoComment, setVideoCommentCount]);

  const fetchCommentReplies = useCallback(
    async (id) => {

      if (!id) return "id not found";

      try {
        const replies = await axiosInstance.get(
          `comment//get-comment-to-comment/${id}`
        );
        replies?.data?.data?.data.map((replies) => {
          fetchIsLikedOrNotReplies(replies._id)
        })
        setCommentReplies(replies?.data?.data?.data);
      } catch (error) {
        console.error(error);
      }
    },
    [setCommentReplies]
  );

  const [showMenu, setShowMenu] = useState(false);
    const [toggleVideoUploading, setToggleVideoUploading] = useState(true);
    const [toggleShortUploading, setToggleShortUploading] = useState(true);
    const [toggleLiveUploading, setToggleLiveUploading] = useState(true);
  
  useEffect(() => {
    fetchCommentReplies(getCommentRepliesId);
  }, [fetchCommentReplies, getCommentRepliesId]);
  
  const fetchAddVideoComment = useCallback(
    async (commentOfShort) => {

      if (!commentOfShort) return "comment is not found";

      try {
        await axiosInstance.post(
          `comment/add-comment-to-video/${VideoId}`,
          {
            comment: commentOfShort,
          }
        );
        fetchVideoComment();
      } catch (error) {
        console.error(error);
      }
    },
    [fetchVideoComment, VideoId]
  );
  
  const fetchAddCommentReplies = useCallback(
    async (id, newComment) => {

      if (!id || !newComment) return "id or comment not found";

      try {
        await axiosInstance.post(`comment/add-comment-to-comment/${id}`, {
          comment: newComment,
        });
        fetchCommentReplies(id);
        setRepliesCommentInput((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            inputValue: "",
          },
        }));
      } catch (error) {
        console.error(error);
      }
    },
    [fetchCommentReplies]
  );

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
      <div className="h-[calc(100vh-70px)] max-lg:flex-col flex justify-evenly max-md:pl-0 max-md:pr-0 pl-4 pr-4 pt-2 overflow-y-scroll scroll-smooth scrollBar overflow-x-hidden">
        {/* video section */}
        <div className=" w-[68%] max-lg:w-full max-lg:flex-shrink-0 h-auto">
          {/* video and its controls */}
          <div className="relative">
            {/* videos */}
            <div className="w-full aspect-video">
              <video
                src={currentVideo[0]?.videoFile}
                ref={currentVideoRef}
                poster={currentVideo[0]?.thumbnail}
                className="bg-black w-full h-full max-md:rounded-none rounded-2xl"
                muted={isMuted}
                onTimeUpdate={handleOntimeCurrent}
                volume={volume}
                autoPlay={isAutoplayOn}
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
                    id={currentVideo[0]?._id}
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
                        formatTime(currentVideo[0]?.duration) ||
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
          <div>
            {/* title */}
            <div className="flex items-center justify-between max-sm:p-1 max-sm:text-sm p-2.5 text-lg font-bold">
              <span className="line-clamp-2">{currentVideo[0]?.title}</span>
            </div>
            {/* button and detail */}
            <div className="flex items-center justify-between p-2.5 max-sm:p-1">
              <div className="h-full flex items-center">
                <div className="flex justify-center items-center">
                  <img
                    src={currentVideo[0]?.owner.avatar}
                    alt=""
                    className="w-12 max-lg:w-8 bg-pink-300 aspect-square rounded-full drop-shadow-lg"
                  />
                </div>
                <div className="flex flex-col ml-2">
                  <span className="text-[24px] max-lg:text-[16px] font-medium leading-tight">
                    {currentVideo[0]?.owner.username}
                  </span>
                  <span className="text-[11px] max-lg:text-xs font-medium opacity-65">
                    {"12.23M"} <span className="leading-0 ">subcribers</span>
                  </span>
                </div>
                <div className="h-full flex justify-center items-center">
                  <button
                    onClick={() =>
                      fetchSubcribeToggle(currentVideo[0]?.owner._id)
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
                      onClick={fetchLikeToggleVideo}
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
                      <span>{currentVideo[0]?.likeCount || "12k"}</span>
                    </button>
                  </div>
                </div>
                {/* save */}
                <div className="hidden h-full flex justify-center items-center space-x-3">
                  <button className="pt-2 max-lg:text-sm max-sm:px-2 max-sm:py-1 pb-2 pl-4 pr-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-4xl flex justify-center items-center font-medium space-x-2">
                    <Share2 className={`max-lg:w-4`} /> <span>Share</span>
                  </button>
                </div>
                {/* Download */}
                <div className="hidden h-full flex justify-center items-center space-x-3">
                  <button className="pt-2 max-lg:text-sm max-sm:px-2 max-sm:py-1 pb-2 pl-4 pr-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-4xl flex justify-center items-center font-medium space-x-2">
                    <ArrowDownToLine className={`max-lg:w-4`} />{" "}
                    <span>Download</span>
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
            <div className="flex justify-center w-full my-2  max-md:rounded-none rounded-2xl line-clamp-2 max-md:line-clamp-1">
              <div className="w-full p-3 max-md:p-1.5 flex-col bg-gray-200  border-2 border-gray-300">
                {/* views and day date year */}
                <div className="flex space-x-3 text-[11px] font-medium ">
                  <span>
                    {currentVideo[0]?.views} <span>View</span>
                  </span>
                  <span className="flex space-x-2">
                    {formatToLocalString(currentVideo[0]?.createdAt)}
                  </span>
                </div>
                {/* description */}
                <p className="">{currentVideo[0]?.description}</p>
              </div>
            </div>
            {/* comments setion */}
            <div
              onClick={() => setMinimiseComment(true)}
              className={`w-full p-2 h-auto max-lg:flex-shrink-0 max-lg:p-1 max-lg:my-2 border-2 bg-gray-200 border-gray-300 max-md:rounded-none rounded-2xl mb-2 ${
                minimiseComment
                  ? "max-lg:h-fit"
                  : "max-lg:h-32 max-lg:overflow-hidden"
              }  `}
            >
              <div className="font-semibold max-lg:lg text-2xl mb-1 flex items-center">
                {/* comments title  */}
                <div className="space-x-1 text-md max-sm:text-[16px] flex">
                  <h1>Comments</h1>
                  <span className="opacity-40">{videoCommentCount}</span>
                </div>
                {/* comments filter box */}
              </div>
              <div className="w-full  flex items-center h-fit">
                {/* input field */}
                <div className="flex w-full">
                  {/* image of user */}
                  <div className="aspect-square">
                    <img
                      src={user?.data?.user?.avatar}
                      className="w-14 max-md:p-1 max-md:w-12 rounded-full aspect-square p-2"
                    />
                  </div>
                  {/* comment input box */}
                  <div className="w-full  h-12 max-md:h-8 flex items-center justify-center">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={videoCommentInput}
                      onChange={(e) => setVideoCommentInput(e.target.value)}
                      className="border-b pl-3 max-md:text-md max-md:pl-1 text-lg w-full border-gray-300 focus:outline-none focus:ring-0"
                    />
                  </div>
                  {/* comment send button */}
                  <div className="aspect-square flex items-center justify-center w-14 max-md:w-8">
                    <button
                      onClick={() => {
                        fetchAddVideoComment(videoCommentInput);
                        setVideoCommentInput("");
                      }}
                      className="w-14 max-md:w-8 max-md:p-0 p-2 hover:bg-gray-100 active:bg-gray-200  aspect-square flex justify-center items-center"
                    >
                      <SendHorizonal className="max-md:size-4" />
                    </button>
                  </div>
                </div>
              </div>
              {/* comment content section */}
              <div className="w-full p-3 max-md:p-0">
                {videoComment?.map((comment) => (
                  <div key={comment._id}>
                    {/* username, time ago and image */}
                    <div>
                      <div className="flex items-center ">
                        <div className="aspect-square max-md:p-1 p-2">
                          <img
                            src={comment?.user_info?.avatar}
                            className="max-md:p-1 rounded-full w-8 aspect-square"
                          />
                        </div>

                        <div className="space-x-3 max-md:space-x-1.5">
                          <span className="text-lg max-md:text-sm font-medium">
                            {comment?.user_info?.username}
                          </span>
                          <span className="text-gray-500 text-md max-md:text-sm">
                            {formatTimeAgo(comment?.createdAt)}
                          </span>
                        </div>
                      </div>
                      {/* content */}
                      <div className="scrollBar ml-12 max-md:ml-10 max-md:text-[15px] text-md overflow-y-auto">
                        {comment?.content}
                      </div>
                      <div className="ml-10  flex items-center p-1">
                        {/* liked button */}
                        <div className="flex items-center mr-2">
                          <button
                            onClick={() => handlelikeComment(comment._id)}
                            className="mr-1"
                          >
                            {commentStatus[comment._id]?.like ? (
                              <ThumbsUp
                                fill="black"
                                size={20}
                                className="max-md:size-4"
                              />
                            ) : (
                              <ThumbsUp
                                size={20}
                                className="max-md:size-4"
                              />
                            )}
                          </button>
                          <span>{comment?.totalLikes}</span>
                        </div>
                        {/* disliked button */}
                        <div className="flex items-center  mr-2">
                          <button
                            onClick={() => handleDislikeComment(comment._id)}
                            className="mr-1"
                          >
                            {commentStatus[comment._id]?.disLike ? (
                              <ThumbsDown
                                fill="black"
                                size={20}
                                className="max-md:size-4"
                              />
                            ) : (
                              <ThumbsDown
                                size={20}
                                className="max-md:size-4"
                              />
                            )}
                          </button>
                          <span></span>
                        </div>
                        {/* reply button */}
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              setRepliesCommentInput((prev) => ({
                                ...prev,
                                [comment._id]: {
                                  ...prev[comment._id],
                                  inputStatus:
                                    !repliesCommentInput[comment._id]
                                      ?.inputStatus,
                                },
                              }))
                            }
                            className="py-1 px-3 rounded-[11px]  hover:bg-gray-100 active:bg-gray-200"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                      {/* input for taking replies */}
                      <div
                        className={`${
                          !repliesCommentInput[comment._id]?.inputStatus
                            ? "hidden"
                            : ""
                        } w-full flex items-center`}
                      >
                        {/* input field */}
                        <div className="flex w-full ml-8">
                          {/* image of user */}
                          <div className="aspect-square">
                            <img
                              src={user?.data?.user?.avatar}
                              className="w-14 max-md:p-1 max-md:w-12 rounded-full max-w-8 aspect-square p-2"
                            />
                          </div>
                          {/* comment input box */}
                          <div className="w-full h-14 max-md:h-8  flex items-center justify-center">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={
                                repliesCommentInput[comment._id]?.inputValue
                              }
                              onChange={(e) =>
                                setRepliesCommentInput((prev) => ({
                                  ...prev,
                                  [comment._id]: {
                                    ...prev[comment._id],
                                    inputValue: e.target.value,
                                  },
                                }))
                              }
                              className="border-b pl-3 max-md:[15px] text-lg w-full border-gray-300 focus:outline-none focus:ring-0"
                            />
                          </div>
                          {/* comment send button */}
                          <div className="aspect-square flex items-center justify-center w-14 max-w-8">
                            <button
                              onClick={() => {
                                fetchAddCommentReplies(
                                  comment._id,
                                  repliesCommentInput[comment._id]?.inputValue
                                );
                              }}
                              className="w-14 max-md:w-8 px-2 hover:bg-gray-100 active:bg-gray-200 aspect-square flex justify-center items-center"
                            >
                              <SendHorizonal />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* replied list */}
                      <div className="ml-12 mt-2 flex items-center">
                        <button
                          onClick={() => {
                            setCommentStatus((prev) => ({
                              ...prev,
                              [comment._id]: {
                                ...prev[comment._id],
                                repliesToggle:
                                  !commentStatus[comment._id]?.repliesToggle,
                              },
                            }));
                            setGetCommentRepliesId(comment._id);
                            fetchCommentReplies(comment._id);
                          }}
                          className="space-y-2 pt-1 pb-1 pl-3 pr-3 rounded-[11px] bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-500 flex justify-center items-center"
                        >
                          Replies{" "}
                          <span>
                            <ChevronDown size={20} />
                          </span>
                        </button>
                      </div>

                      <div></div>
                      {/* sub comment means replies */}
                      <div
                        className={`${
                          commentStatus[comment._id]?.repliesToggle
                            ? ""
                            : "hidden"
                        }  overfolw-y-scroll scroll-smooth scrollBar `}
                      >
                        {commentReplies.map((replies) => (
                          <div
                            key={replies._id}
                            // id={replies._id || "userid"}
                            className="ml-12"
                          >
                            {/* image,username and time ago */}
                            <div className="flex items-center ">
                              <div className="aspect-square p-2">
                                <img
                                  src={replies?.user_info?.avatar}
                                  className="min-w-6 bg-blue-300 rounded-full w-8 aspect-square"
                                />
                              </div>
                              <div className="-space-x-3">
                                <span className="text-lg max-md:text-[15px] font-medium">
                                  {replies?.user_info?.username}
                                </span>
                                <span className="text-gray-500 max-md:text-sm text-md">
                                  {replies?.createdAt}
                                </span>
                              </div>
                            </div>
                            {/* sub content */}
                            <div className="scrollBar ml-12 max-md:ml-12 max-md:text-sm text-md overflow-y-auto">
                              {replies?.content}
                            </div>
                            <div className="ml-12  flex items-center p-1">
                              {/* liked button sub comment */}
                              <div className="flex items-center mr-2">
                                <button
                                  onClick={() => handlelikeReplies(replies._id)}
                                  className="mr-1"
                                >
                                  {commentStatus[replies._id]?.repliesLike ? (
                                    <ThumbsUp
                                      fill={"black"}
                                      size={20}
                                      className="max-md:size-4"
                                    />
                                  ) : (
                                    <ThumbsUp
                                      size={20}
                                      className="max-md:size-4"
                                    />
                                  )}
                                </button>
                                <span>{replies?.totalLikes}</span>
                              </div>
                              {/* disliked button sub comment */}
                              <div className="flex items-center  mr-2">
                                <button
                                  onClick={() =>
                                    handleDislikeReplies(replies._id)
                                  }
                                  className="mr-1"
                                >
                                  {commentStatus[replies._id]
                                    ?.repliesDisLike ? (
                                    <ThumbsDown
                                      fill={"black"}
                                      size={20}
                                      className="max-md:size-4"
                                    />
                                  ) : (
                                    <ThumbsDown
                                      size={20}
                                      className="max-md:size-4"
                                    />
                                  )}
                                </button>
                                <span></span>
                              </div>
                              {/* reply button sub comment */}
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    setCommentStatus((prev) => ({
                                      ...prev,
                                      [replies._id]: {
                                        ...prev[replies._id],
                                        replyToggle:
                                          !commentStatus[replies._id]
                                            ?.replyToggle,
                                      },
                                    }))
                                  }
                                  className="py-1 px-3 rounded-[11px]  hover:bg-gray-100 active:bg-gray-200"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                            {/* replies input set */}
                            <div
                              className={`${
                                commentStatus[replies._id]?.replyToggle
                                  ? ""
                                  : "hidden"
                              } w-full flex items-center`}
                            >
                              {/* input field */}
                              <div className="flex w-full">
                                {/* image of user */}
                                <div className="aspect-square flex justify-center items-center mr-2">
                                  <img
                                    src={user?.data?.user?.avatar}
                                    className="w-14 rounded-full max-md:p-0 max-md:w-8 aspect-square p-2"
                                  />
                                </div>
                                {/* comment input box */}
                                <div className="w-full max-md:text-sm h-14 max-md:h-12 flex items-center justify-center">
                                  <span className="text-sm max-md:text-[12px] font-stretch-extra-condensed ">{`@${replies?.user_info?.username}`}</span>

                                  <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={
                                      commentStatus[replies._id]?.replyInput
                                    }
                                    onChange={(e) => {
                                      setCommentStatus((prev) => ({
                                        ...prev,
                                        [replies._id]: {
                                          ...prev[replies._id],
                                          replyInput: e.target.value,
                                        },
                                      }));
                                    }}
                                    className="border-b pl-3 max-md:pl-1.5 max-md:text-sm text-lg w-full border-gray-300 focus:outline-none focus:ring-0"
                                  />
                                </div>
                                {/* comment send button */}
                                <div className="aspect-square flex items-center justify-center w-14 max-md:w-8">
                                  <button
                                    onClick={() => {
                                      fetchAddCommentReplies(
                                        replies._id,
                                        commentStatus[replies._id]?.replyInput
                                      );
                                      setCommentStatus((prev) => ({
                                        ...prev,
                                        [replies._id]: {
                                          ...prev[replies._id],
                                          replyInput: "",
                                        },
                                      }));
                                    }}
                                    className="w-14 max-md:w-8 max-md:p-0 p-2.5 hover:bg-gray-100 active:bg-gray-200 aspect-square flex justify-center items-center"
                                  >
                                    <SendHorizonal />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={`${!minimiseComment ? "hidden" : "max-lg:text-xs"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimiseComment(false);
                }}
              >
                show less
              </button>
            </div>
          </div>
        </div>
        {/* recommandation section */}
        <div className=" w-[29%] max-lg:mt-2 max-lg:w-full max-lg:rounded-none rounded-2xl flex flex-col space-y-3">
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="flex max-lg:flex-col max-lg:w-full h-fit"
              onClick={() => Navigate(`/video/${video._id}`)}
            >
              {/* video */}
              <div
                className="relative w-1/2 max-lg:w-full  h-fit"
                onMouseEnter={(prev) => {
                  setRecommendationStates({
                    ...prev,
                    [video._id]: { ...prev[video._id], mutedStatus: true },
                  });
                  togglePlayRecommendation(video._id);
                }}
                onMouseLeave={(prev) => {
                  setRecommendationStates({
                    ...prev,
                    [video._id]: { ...prev[video._id], mutedStatus: false },
                  });
                  togglePauseRecommendation(video._id);
                }}
              >
                <video
                  src={video?.videoFile}
                  ref={(el) => {
                    if (el) {
                      videoRecommendationRefs.current[video._id] = el;
                    }
                  }}
                  muted={recommendationStates[video._id]?.isMuted}
                  poster={video?.thumbnail}
                  onTimeUpdate={() => handleOnTimeUpdate(video._id)}
                  preload="metadata"
                  className="bg-black/90 aspect-video max-md:rounded-none max-lg:w-full rounded-2xl"
                ></video>
                <div className="absolute inset-0 p-2">
                  <div className="flex justify-end">
                    <button
                      ref={(el) => {
                        if (el) {
                          muteButtonRef.current[video._id] = el;
                        }
                      }}
                      onClick={(e) => toggleMuteRecommendation(e, video._id)}
                      className={`${
                        recommendationStates[video._id]?.mutedStatus
                          ? ""
                          : "hidden"
                      } p-2 rounded-full hover:bg-black30 active:bg-black/50 z-13`}
                    >
                      {recommendationStates[video._id]?.isMuted === true &&
                      recommendationStates[video._id]?.mutedStatus === true ? (
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
                      {recommendationStates[video._id]?.isPlaying === true
                        ? formatTime(
                            recommendationStates[video._id]?.duration || 0
                          )
                        : formatTime(video?.duration || 0)}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="w-1/2 max-lg:w-full flex justify-base flex-col max-md:py-0 py-1 pl-2 max-md:my-1">
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
      </div>
    </div>
  );
};

export default VideoPages;




