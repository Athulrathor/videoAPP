import React, { useEffect, useState } from "react";
import { Search, Volume2, VolumeX } from 'lucide-react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import Header from "../components/Header";
import  UploadVideo  from "../components/UploadVideo";
import  UploadShort  from "../components/UploadShort";
import UploadLive from "../components/UploadLive";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoByOwner } from "../redux/features/videos";
// import { fetchShortByOwner } from "../redux/features/shorts";
import { getChannelProfileOfUser } from "../redux/features/channel";
import { setSettingsActive,setSideActive } from "../redux/features/user";

const Channel = () => {

  const {username} = useParams();
  const getLocation = useLocation();

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { channel } = useSelector(state => state.channels);
  const { videoByOwner } = useSelector(state => state.videos);
  const { shortByOwner } = useSelector(state => state.shorts);
  const { playlist } = useSelector(state => state.Playlists);

  const [active, setActive] = useState("home");
  const [showInput, setShowInput] = useState(false);

    const [showMenu, setShowMenu] = useState(false);

    const [toggleVideoUploading, setToggleVideoUploading] = useState(true);
    const [toggleShortUploading, setToggleShortUploading] = useState(true);
    const [toggleLiveUploading, setToggleLiveUploading] = useState(true);
  
      const [videoStatus, setVideoStatus] = useState({
        isPlaying: false,
        isMuted: false,
        showControl: false,
        duration: 0,
      });

  useEffect(() => {
    dispatch(getChannelProfileOfUser(username)).unwrap()
  }, [dispatch, username]);
  
  useEffect(() => {
    dispatch(fetchVideoByOwner(channel?._id));
  }, [dispatch, channel]);
  
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
  

  const handleOnTimeUpdate = (videoId2, video) => {
    if (video) {
      setVideoStatus((prev) => ({
        ...prev,
        [videoId2]: { ...prev[videoId2], duration: video.currentTime },
      }));
    }
  };

  const handleOverAllEvent = (e) => {
    const targetId = e.target.id;
    const targetName = e.target.getAttribute('name');
    const eventType = e.type;

    if (eventType === 'timeupdate' && (targetName === 'video' || targetName === "duration") && targetId) {
      handleOnTimeUpdate(targetId, e.target);
      return;
    }


    if ((targetName === "duration" || targetName === "title") && eventType === 'click' && targetId) {
      Navigate(`/video/${targetId}`);
      window.location.reload();
      return;
    }

    if ((targetName === "avatar" || targetName === "username") && targetId && eventType === 'click') {
      const username = e.target.getAttribute('data-username');
      Navigate(`/channel/${username}`)
      return;
    }

    if (targetName === "video" || targetName === "duration") {

      const videoElements = document.getElementsByName('video');

      const targetedVideo = Array.from(videoElements).find((video) => video.id === targetId);

      if (!targetedVideo) return;

      if (eventType === 'mouseenter') {
        setVideoStatus((prev) => ({
          ...prev,
          [targetId]: { ...prev[targetId], showControl: true },
        }));
        if (targetedVideo.hoverTimeout) {
          clearTimeout(targetedVideo.hoverTimeout);
        }

        targetedVideo.hoverTimeout = setTimeout(() => {
          targetedVideo.play().catch((error) => console.error(error));
        }, 800);
      }
      else if (eventType === 'mouseleave') {
        setVideoStatus((prev) => ({
          ...prev,
          [targetId]: { ...prev[targetId], showControl: false },
        }));
        if (targetedVideo.hoverTimeout) {
          clearTimeout(targetedVideo.hoverTimeout);
        }

        targetedVideo.hoverTimeout = setTimeout(() => {
          targetedVideo.pause();
        }, 500);
      }
      return
    }

    if ((targetName === 'volume' || targetName === "svg") && targetId) {
      e.stopPropagation();
      e.preventDefault();

      const videoElements = document.getElementsByName('video');

      console.log("from btn :  ", e);
      const targetedVideo = Array.from(videoElements).find((video) => video.id === targetId);
      if (eventType === 'click') {
        const newMutedState = !targetedVideo.muted;
        targetedVideo.muted = newMutedState;

        setVideoStatus((prev) => ({
          ...prev,
          [targetId]: { ...prev[targetId], isMuted: !videoStatus[targetId]?.isMuted },
        }));
      }


      return;
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
        />
        <div className="flex w-full  flex-col h-[calc(100vh_-_57px)]  max-md:h-[calc(100vh_-_41px)] overflow-y-scroll scroll-smooth pb-2 scrollBar">
          {/* channel */}
          <div className="h-96 max-sm:h-50 w-full">
            <img
              src={channel?.coverImage}
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
                  src={channel?.avatar}
                  alt=""
                  className="max-md:w-16 w-38 max-[400px]:w-15 max-lg:36 aspect-square rounded-full"
                />
              </div>
              {/* user details */}
              <div className="my-2">
                {/* channel name */}
                <h1 className="font-bold max-md:text-lg text-4xl">
                  {channel?.fullname}
                </h1>
                {/* username and subcriber count */}
                <div className="flex font-semibold items-center ">
                  {/* username */}
                  <h1 className=" max-md:text-sm text-xl">
                    {channel?.username}
                  </h1>
                  {/* subcriber count */}
                  <h3 className="text-xl max-md:text-sm ml-1.5">
                    {channel?.channelsSubcribedToCount} subcriber
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
                      {formatToLocalString(channel?.createdAt) ||
                        " 12 june 2001 11:59:23"}
                    </span>
                  </h3>
                </div>
                {/* button like customise and manage videos */}
                <div className="font-semibold text-xl max-md:text-sm max-[400px]:text-xs max-[400px]:space-x-1  space-x-2 mt-2">
                  {/* customise */}
                  <button onClick={() => { Navigate("/"); dispatch(setSideActive("settings")); dispatch(setSettingsActive("Accounts"))}} className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300">
                    Edit channel
                  </button>
                  {/* manage videos */}
                  <button onClick={() => { dispatch(setSideActive("settings")); Navigate("/" )}} className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300">
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
                  } ${videoByOwner.length > 10 ? "" : "hidden"} `}
                >
                  Videos
                </button>
                <button
                  onClick={() => {
                    setActive("shorts");
                  }}
                  className={` py-2 max-md:p-1 ${
                    active === "shorts" ? "border-b-2 border-black" : ""
                    } ${!shortByOwner || shortByOwner.length > 10 ? "" : "hidden"} `}
                >
                  Shorts
                </button>
                <button
                  onClick={() => setActive("playlist")}
                  className={` py-2 max-md:p-1 ${
                    active === "playlist" ? "border-b-2 border-gray-900" : ""
                    } ${playlist === null ? "hidden" : ""}  `}
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
              <div className="mt-1">
                <div className="px-2 space-y-3">
                  {videoByOwner &&
                    videoByOwner.map((video) => (
                      <div
                                  key={video._id}
                                  className="flex h-fit"
                                  onClick={handleOverAllEvent}
                                  id={video._id}
                                  name="container"
                                >
                                  {/* video */}
                                  <div
                                    className="relative max-md:w-[36%] max-sm:w-[42%] w-64  h-fit"
                                    name="video-container"
                                    onMouseEnter={handleOverAllEvent}
                                    onMouseLeave={handleOverAllEvent}
                                    id={video._id}
                                  >
                                    <video
                                      src={video?.videoFile}
                                      name="video"
                                      id={video._id}
                                      data-username={video?.owner?.username}
                                      muted={videoStatus[video._id]?.isMuted}
                                      poster={video?.thumbnail}
                                      onTimeUpdate={handleOverAllEvent}
                                      preload="metadata"
                                      className="bg-black aspect-video rounded-lg"
                                    ></video>
                                    <div
                                      className={`absolute inset-0 p-2`}
                                    >
                                      <div className="flex justify-end">
                                        <button
                                          onClick={handleOverAllEvent}
                                          name='volume'
                                          id={video._id}
                                          className={`${videoStatus[video._id]?.showControl ? "" : "hidden"
                                        } z-13 p-2 rounded-full hover:bg-black/30 active:bg-black/50 active:border-1 active:border-gray-600 transition-all duration-75`}
                                        >
                                          {videoStatus[video._id]?.isMuted ? (
                                            <VolumeX
                                              size={16}
                                              name='svg'
                                              onClick={handleOverAllEvent}
                                              color="white"
                                              id={video._id}
                                            />
                                          ) : (
                                            <Volume2
                                                size={16}
                                                name='svg'
                                                onClick={handleOverAllEvent}
                                                id={video._id}
                                              color="white"
                                            />
                                          )}
                                        </button>
                                      </div>
                                      <div name="duration" id={video._id} className="absolute inset-0 flex items-end justify-end bottom-0 p-2 rounded-[10px] max-lg:text-[2vw] text-lg">
                                        <h1 name="duration" className="text-white rounded-md bg-black/30 px-1 py-0.1">
                                          {videoStatus[video._id]?.duration ? formatTime(video?.duration - videoStatus[video._id]?.duration) : formatTime(video?.duration)}
                                        </h1>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="max-w-96 max-md:w-[60%]  flex-col flex py-1 pl-2">
                                    {/* title */}
                                    <div className="line-clamp-2 w-full font-medium text-3xl pb-2 max-sm:pb-0 max-sm:text-lg max-md:text-2xl">
                                      <h2 onClick={handleOverAllEvent} id={video._id} name="title">{video?.title}</h2>
                                    </div>
                                    <div className="flex">
                                      <div className="items-baseline hidden">
                                        <img
                                          src={video?.owner?.avatar}
                                          alt=""
                                          name="avatar"
                                          data-username={video?.owner?.username}
                                          onClick={handleOverAllEvent}
                                          id={video._id}
                                          className="w-6 mr-3 max-sm:w-6 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                                        />
                                      </div>
                                      <div className="flex flex-col leading-tight">
                                        {/* user name */}
                                        <div className="mb-1  text-xs font-normal text-gray-500 max-md:text-xs">
                                          <h3 onClick={handleOverAllEvent} data-username={video?.owner?.username} name="username" id={video._id}>{video?.owner?.username}</h3>
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
