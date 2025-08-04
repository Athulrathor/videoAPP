import React, { useEffect, useRef, useState,useCallback } from "react";
import { Search, Volume2, VolumeX } from 'lucide-react';
// import { useSelector } from "react-redux";
import { axiosInstance } from "../libs/axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import Header from "../components/Header";
import  UploadVideo  from "../components/UploadVideo";
import  UploadShort  from "../components/UploadShort";
import UploadLive from "../components/UploadLive";

const Channel = () => {
  const Username = useParams();

  const getLocation = useLocation();

  // const { loggedIn } = useSelector(state => state.user);

  const Navigate = useNavigate();
  const videoRef = useRef({});

  const [active, setActive] = useState("home");
  const [showInput, setShowInput] = useState(false);

  const [users, setUser] = useState({
    loading: true,
    error: "",
    data: null,
  });

    const [showMenu, setShowMenu] = useState(false);

    const [toggleVideoUploading, setToggleVideoUploading] = useState(true);
    const [toggleShortUploading, setToggleShortUploading] = useState(true);
    const [toggleLiveUploading, setToggleLiveUploading] = useState(true);

    const [playList, setplayList] = useState({
      loading: true,
      error: "",
      data: null,
    });
  
    const [videoParams, setVideoParams] = useState({
      page: 1,
      limit: 10,
      query: "",
      sortBy: 1,
      sortType: "createdAt",
      userId: users?.data?.user?._id,
    });
  
    const [shortParams, setShortParams] = useState({
      page: 1,
      limit: 10,
      query: "",
      sortBy: 1,
      sortType: "createdAt",
      userId: users?.data?.user?._id,
    });
  
      const [videoStatus, setVideoStatus] = useState({
        isPlaying: false,
        isMuted: false,
        showControl: false,
        duration: 0,
      });

  const [video, setVideo] = useState({
    loading: true,
    error: "",
    data: null,
  });

  const [short, setShort] = useState({
    loading: true,
    error: "",
    data: null,
  });
  
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
  
  const fetchVideoByOwner = async (Id) => {
    if (Id === null) return "Not found";
    setVideo((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      const videos = await axiosInstance.get(
        `videos/get-all-videos-of-owner/${Id}`
      );
      setVideo((prev) => ({
        ...prev,
        loading: false,
        data: videos?.data?.data?.data,
      }));
      console.log(videos.data.data);
    } catch (error) {
      setVideo((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      console.error(error);
    }
  };
  
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchVideoByOwner();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // },[])

  const fetchUserChannel = async () => {
    setUser((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const channel = await axiosInstance.get(
        `users/channel/${Username.username}`
      );
      setUser((prev) => ({
        ...prev,
        loading: false,
        data: channel?.data?.data,
      }));
      fetchVideoByOwner(channel?.data?.data?._id);
    } catch (error) {
      setUser((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      console.error(error.message);
    }
  };

  useEffect(() => {
     fetchUserChannel();
  }, [Username]);
  
  console.log(video.data)

    const fetchShortByOwner = async () => {
        setShort((prev) => ({
          ...prev,
          loading: true,
        }));
        try {
          const short = await axiosInstance.get(`short/get-all-short-of-owner/${users?.data._id}`);
          setShort((prev) => ({
            ...prev,
            loading: true,
            data: short?.data?.data?.data,
          }));
        } catch (error) {
          setShort((prev) => ({
            ...prev,
            loading: true,
            error: error.message,
          }));
          console.error(error);
        }
  };
  
  const formatToLocalString = (nows) => {

    const now = new Date(nows);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const formattedDateTime = now.toLocaleString("en-US", options);

    return formattedDateTime;
  } 

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

    function timeAgo(createdAt) {
      const now = new Date();
      const created = new Date(createdAt);
      const difference = Math.floor((now - created) / 1000);

      if (difference < 60) {
        return `${difference} seconds ago`;
      } else if (difference < 3600) {
        const minutes = Math.floor(difference / 60);
        return `${minutes} minutes ago`;
      } else if (difference < 86400) {
        const hours = Math.floor(difference / 3600);
        return `${hours} hours ago`;
      } else if (difference < 2419200) {
        const days = Math.floor(difference / 86400);
        return `${days} days ago`;
      } else if (difference / 31536000) {
        const month = Math.floor(difference / 2419200);
        return `${month} month ago`;
      } else {
        const year = Math.floor(difference / 31536000);
        return `${year} year ago`;
      }
    }

  return (
    <>
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

      <div className="flex">
        <SideMenu
          menuToggle={{ showMenu, setShowMenu }}
          videoParam={{ setVideoParams, videoParams }}
        />
        <div className="flex w-full flex-col h-[92vh] overflow-y-scroll scroll-smooth scrollBar">
          {/* channel */}
          <div className="h-[30%] w-full">
            <img
              src={users?.data?.coverImage}
              alt=""
              className="h-full w-full object-fill"
            />
          </div>
          <div className="channel flex-col  w-full h-full">
            {/* user details */}
            <div className=" flex">
              {/* user avatar */}
              <div className="p-3 max-md:p-2">
                <img
                  src={users?.data?.avatar}
                  alt=""
                  className="max-md:w-16 w-38 max-[400px]:w-15 max-lg:36 aspect-square rounded-full"
                />
              </div>
              {/* user details */}
              <div className="my-2">
                {/* channel name */}
                <h1 className="font-bold max-md:text-lg text-4xl">
                  {users?.data?.fullname}
                </h1>
                {/* username and subcriber count */}
                <div className="flex font-semibold items-center ">
                  {/* username */}
                  <h1 className=" max-md:text-sm text-xl">
                    {users?.data?.username}
                  </h1>
                  {/* subcriber count */}
                  <h3 className="text-xl max-md:text-sm ml-1.5">
                    {users?.data?.channelsSubcribedToCount} subcriber
                  </h3>
                </div>
                {/* more about channel */}
                <div>
                  {/* channel url */}
                  <h3>
                    <span className="font-semibold max-md:text-sm">URL</span> :{" "}
                    <a
                      className="appearance-none pointer-events-none underline max-md:text-sm"
                      href="vidtube/channel/channelname"
                    >
                      vidtube{getLocation.pathname || "/channel/channelname"}
                    </a>
                  </h3>
                  {/* joined date */}
                  <h3
                    className={`text-xs max-[400px]:text-[11px] ${
                      window.innerWidth > 480 ? `space-x-1` : ""
                    } `}
                  >
                    <span className="font-semibold">
                      {window.innerWidth > 480 ? `Joined` : ""}
                    </span>
                    <span>
                      {formatToLocalString(users?.data?.createdAt) ||
                        " 12 june 2001 11:59:23"}
                    </span>
                  </h3>
                </div>
                {/* button like customise and manage videos */}
                <div className="font-semibold text-xl max-md:text-sm max-[400px]:text-xs max-[400px]:space-x-1  space-x-2 mt-2">
                  {/* customise */}
                  <button className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300">
                    Edit channel
                  </button>
                  {/* manage videos */}
                  <button className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300">
                    Manage videos
                  </button>
                </div>
              </div>
            </div>
            {/* Content details uploaded by user */}
            <div className="max-md:text-[1rem]] text-[1.5rem] font-semibold">
              {/* Navlist and search button */}
              <div className="flex max-md:space-x-1.5 max-md:text-sm space-x-3 border-b-1 border-gray-600">
                <button
                  onClick={() => {
                    setActive("home");
                  }}
                  className={`ml-3 max-md:ml-1.5 max-md:p-1 py-2 ${
                    active === "home" ? "border-b-2 border-gray-700" : ""
                  }  `}
                >
                  Home
                </button>
                <button
                  onClick={() => setActive("videos")}
                  className={`py-2 max-md:p-1 ${
                    active === "videos" ? "border-b-2 border-gray-900" : ""
                  } ${video?.length > 10 ? "" : "hidden"} `}
                >
                  Videos
                </button>
                <button
                  onClick={() => {
                    setActive("shorts");
                  }}
                  className={` py-2 max-md:p-1 ${
                    active === "shorts" ? "border-b-2 border-black" : ""
                  } ${!short || short.length > 10 ? "" : "hidden"} `}
                >
                  Shorts
                </button>
                <button
                  onClick={() => setActive("playlist")}
                  className={` py-2 max-md:p-1 ${
                    active === "playlist" ? "border-b-2 border-gray-900" : ""
                  } ${playList.data === null ? "hidden" : ""}  `}
                >
                  Playlists
                </button>
                <div className="flex items-center max-md:space-x-1 space-x-2">
                  <button onClick={() => setShowInput(!showInput)}>
                    <Search
                      size={24}
                      className="max-md:size-4"
                    />
                  </button>
                  <input
                    className={`${
                      showInput ? "" : "hidden"
                    } appearance-none outline-0 pl-1.5 focus:ring-0 border-b-2 max-w-full min-w-44`}
                    placeholder="Search here..."
                    type="text"
                  />
                </div>
              </div>
              {/* main content portions */}
              <div className=" overflow-y-scroll scrollBar mt-1">
                <div className="w-[calc(190px - 100%)] px-2 space-y-3 h-[calc(113px - 100vh)]">
                  {video.data &&
                    video?.data.map((video) => (
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
                              [video._id]: {
                                ...prev[video._id],
                                showControl: true,
                              },
                            }));
                            togglePlay(video._id);
                          }}
                          onMouseLeave={() => {
                            setVideoStatus((prev) => ({
                              ...prev,
                              [video._id]: {
                                ...prev[video._id],
                                showControl: false,
                              },
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
                              videoStatus[video._id]?.showControl
                                ? ""
                                : "hidden"
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
                                {formatTime(
                                  videoStatus[video._id]?.duration || 0
                                )}
                              </h1>
                            </div>
                          </div>
                        </div>
                        <div className="w-1/2  flex-col flex py-1 pl-2">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Channel;
