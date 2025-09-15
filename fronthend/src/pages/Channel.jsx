import React, { useEffect, useState } from "react";
import { Search, Volume2, VolumeX } from 'lucide-react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import Header from "../components/Header";
import UploadVideo from "../components/UploadVideo";
import UploadShort from "../components/UploadShort";
import UploadLive from "../components/UploadLive";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoByOwner } from "../redux/features/videos";
import { getChannelProfileOfUser } from "../redux/features/channel";
import { setSettingsActive, setSideActive } from "../redux/features/user";
import { useAppearance } from '../hooks/appearances';

const Channel = () => {
  const { username } = useParams();
  const getLocation = useLocation();
  const { appearanceSettings } = useAppearance();

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

      <div
        className="flex transition-all"
        style={{
          backgroundColor: appearanceSettings.customBackground ? 'transparent' : "var(--color-bg-primary)",
          transitionDuration: 'var(--animation-duration)'
        }}
      >
        <SideMenu menuToggle={{ showMenu, setShowMenu }} />

        <div
          className="flex w-full flex-col h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] overflow-y-scroll scroll-smooth pb-2 scrollBar transition-all"
          style={{
            backgroundColor: appearanceSettings.customBackground ? 'transparent' : "var(--color-bg-primary)",
            transitionDuration: 'var(--animation-duration)'
          }}
          role="main"
          aria-label={`${channel?.fullname || username}'s channel`}
        >
          {/* Channel Cover */}
          <div
            className="h-96 max-sm:h-50 w-full"
            role="banner"
            aria-label="Channel cover image"
          >
            <img
              src={channel?.coverImage}
              alt={`${channel?.fullname || username}'s channel cover`}
              className="h-full w-full object-cover transition-all"
              style={{
                transitionDuration: 'var(--animation-duration)'
              }}
              loading="lazy"
            />
          </div>

          <div
            className="channel flex-col w-full h-full transition-all"
            style={{
              backgroundColor: appearanceSettings.customBackground ? 'transparent' : "var(--color-bg-primary)",
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            {/* User Details */}
            <div
              className="flex transition-all"
              style={{
                padding: 'var(--component-padding)',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              {/* User Avatar */}
              <div
                className="p-3 max-md:p-2"
                style={{ padding: 'var(--spacing-unit)' }}
              >
                <img
                  src={channel?.avatar}
                  alt={`${channel?.fullname || username}'s avatar`}
                  className="max-md:w-16 w-38 max-[400px]:w-15 max-lg:36 aspect-square rounded-full transition-all"
                  style={{
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  loading="lazy"
                />
              </div>

              {/* User Details */}
              <div
                className="my-1"
                style={{ margin: 'var(--spacing-unit) 0' }}
              >
                {/* Channel Name */}
                <h1
                  className="font-bold max-md:text-lg text-4xl"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-4xl)',
                    fontFamily: 'var(--font-family)'
                  }}
                >
                  {channel?.fullname}
                </h1>

                {/* Username and Subscriber Count */}
                <div
                  className="flex font-semibold items-center"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-xl)',
                    gap: 'var(--spacing-unit)'
                  }}
                >
                  <h1 className="max-md:text-sm text-xl">
                    {channel?.username}
                  </h1>
                  <h3 className="text-xl max-md:text-sm ml-1.5">
                    {channel?.channelsSubcribedToCount} subscribers
                  </h3>
                </div>

                {/* Channel Info */}
                <div
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                    // marginTop: 'var(--spacing-unit)'
                  }}
                >
                  {/* Channel URL */}
                  <h3>
                    <span
                      className="font-semibold max-md:text-sm"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      URL
                    </span>
                    :{" "}
                    <a
                      className="appearance-none pointer-events-none underline max-md:text-sm"
                      href="vidtube/channel/channelname"
                      style={{ color: 'var(--accent-color)' }}
                    >
                      vidtube{getLocation.pathname || "/channel/channelname"}
                    </a>
                  </h3>

                  {/* Joined Date */}
                  <h3
                    className={`text-xs max-[400px]:text-[11px] ${window.innerWidth > 480 ? `space-x-1` : ""
                      }`}
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-xs)'
                    }}
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

                {/* Action Buttons */}
                <div
                  className="font-semibold text-xl max-md:text-sm max-[400px]:text-xs max-[400px]:space-x-1 space-x-2 mt-2"
                  style={{
                    marginTop: 'var(--spacing-unit)',
                    gap: 'var(--spacing-unit)'
                  }}
                >
                  <button
                    onClick={() => {
                      Navigate("/setting");
                      dispatch(setSideActive("settings"));
                      dispatch(setSettingsActive("Accounts"));
                    }}
                    className="px-2 py-1 rounded-lg font-medium transition-all"
                    style={{
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily:'var(--font-family)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                    }}
                    aria-label="Edit channel settings"
                  >
                    Edit channel
                  </button>

                  <button
                    onClick={() => {
                      dispatch(setSideActive("settings"));
                      // Navigate("/");
                    }}
                    className="px-2 py-1 rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                    }}
                    aria-label="Manage your videos"
                  >
                    Manage videos
                  </button>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div
              className="max-md:text-[1rem] text-[1.5rem] font-semibold transition-all"
              style={{
                fontSize: 'var(--font-size-xl)',
                color: 'var(--color-text-primary)',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              {/* Navigation Tabs */}
              <div
                className="flex max-md:space-x-1.5 max-md:text-sm space-x-3 border-b transition-all"
                style={{
                  borderColor: 'var(--color-border)',
                  padding: 'var(--spacing-unit)',
                  gap: 'var(--spacing-unit)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                role="tablist"
                aria-label="Channel content sections"
              >
                <button
                  onClick={() => setActive("home")}
                  className={`ml-3 max-md:ml-1.5 max-md:p-1 py-2 transition-all ${active === "home" ? "border-b-2" : ""
                    }`}
                  style={{
                    color: active === "home" ? 'var(--accent-color)' : 'var(--color-text-primary)',
                    borderColor: active === "home" ? 'var(--accent-color)' : 'transparent',
                    fontSize: 'var(--font-size-base)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  role="tab"
                  aria-selected={active === "home"}
                  aria-controls="home-panel"
                >
                  Home
                </button>

                <button
                  onClick={() => setActive("videos")}
                  className={`py-2 max-md:p-1 transition-all ${active === "videos" ? "border-b-2" : ""
                    } ${videoByOwner.length > 10 ? "" : "hidden"}`}
                  style={{
                    color: active === "videos" ? 'var(--accent-color)' : 'var(--color-text-primary)',
                    borderColor: active === "videos" ? 'var(--accent-color)' : 'transparent',
                    fontSize: 'var(--font-size-base)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  role="tab"
                  aria-selected={active === "videos"}
                  aria-controls="videos-panel"
                >
                  Videos
                </button>

                <button
                  onClick={() => setActive("shorts")}
                  className={`py-2 max-md:p-1 transition-all ${active === "shorts" ? "border-b-2" : ""
                    } ${!shortByOwner || shortByOwner.length > 10 ? "" : "hidden"}`}
                  style={{
                    color: active === "shorts" ? 'var(--accent-color)' : 'var(--color-text-primary)',
                    borderColor: active === "shorts" ? 'var(--accent-color)' : 'transparent',
                    fontSize: 'var(--font-size-base)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  role="tab"
                  aria-selected={active === "shorts"}
                  aria-controls="shorts-panel"
                >
                  Shorts
                </button>

                <button
                  onClick={() => setActive("playlist")}
                  className={`py-2 max-md:p-1 transition-all ${active === "playlist" ? "border-b-2" : ""
                    } ${playlist === null ? "hidden" : ""}`}
                  style={{
                    color: active === "playlist" ? 'var(--accent-color)' : 'var(--color-text-primary)',
                    borderColor: active === "playlist" ? 'var(--accent-color)' : 'transparent',
                    fontSize: 'var(--font-size-base)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  role="tab"
                  aria-selected={active === "playlist"}
                  aria-controls="playlist-panel"
                >
                  Playlists
                </button>

                <div
                  className="flex items-center max-md:space-x-1 space-x-2"
                  style={{ gap: 'var(--spacing-unit)' }}
                >
                  <button
                    onClick={() => setShowInput(!showInput)}
                    className="transition-all p-1 rounded"
                    style={{
                      color: 'var(--color-text-primary)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                    aria-label="Toggle search"
                    aria-expanded={showInput}
                  >
                    <Search size={24} className="max-md:size-4" />
                  </button>
                  <input
                    className={`${showInput ? "" : "hidden"
                      } appearance-none outline-0 pl-1.5 focus:ring-0 border-b-2 max-w-full min-w-44 transition-all`}
                    placeholder="Search here..."
                    type="text"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--accent-color)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    aria-label="Search channel content"
                  />
                </div>
              </div>

              {/* Main Content */}
              <div
                className="mt-1"
                style={{ marginTop: 'var(--spacing-unit)' }}
                role="tabpanel"
                id={`${active}-panel`}
                aria-labelledby={`${active}-tab`}
              >
                <div
                  className="px-2 space-y-3"
                  style={{
                    padding: 'var(--spacing-unit)',
                    gap: 'var(--spacing-unit)'
                  }}
                >
                  {videoByOwner &&
                    videoByOwner.map((video, index) => (
                      <div
                        key={video._id}
                        className="flex h-fit transition-all"
                        onClick={handleOverAllEvent}
                        id={video._id}
                        name="container"
                        style={{
                          transitionDuration: 'var(--animation-duration)'
                        }}
                        // onMouseEnter={(e) => {
                        //   e.target.style.backgroundColor = 'var(--color-hover)';
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.target.style.backgroundColor = 'transparent';
                        // }}
                        role="listitem"
                        aria-posinset={index + 1}
                        aria-setsize={videoByOwner.length}
                        aria-label={`Video: ${video?.title} by ${video?.owner?.username}`}
                      >
                        {/* Video Thumbnail */}
                        <div
                          className="relative max-md:w-[36%] max-sm:w-[42%] w-64 h-fit"
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
                            className="aspect-video rounded-lg transition-all"
                            style={{
                              backgroundColor: '#000000',
                              transitionDuration: 'var(--animation-duration)'
                            }}
                            aria-label={`Video player for ${video?.title}`}
                          />
                          <div className="absolute inset-0 p-2">
                            <div className="flex justify-end">
                              <button
                                onClick={handleOverAllEvent}
                                name='volume'
                                id={video._id}
                                className={`${videoStatus[video._id]?.showControl ? "" : "hidden"
                                  } z-13 p-2 rounded-full transition-all duration-75`}
                                style={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                  transitionDuration: appearanceSettings.reducedMotion ? '0s' : '75ms'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = 'var(--color-accent-hover)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                                }}
                                aria-label={videoStatus[video._id]?.isMuted ? "Unmute video" : "Mute video"}
                                aria-pressed={videoStatus[video._id]?.isMuted}
                              >
                                {videoStatus[video._id]?.isMuted ? (
                                  <VolumeX
                                    size={16}
                                    name='svg'
                                    onClick={handleOverAllEvent}
                                    color="white"
                                    id={video._id}
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Volume2
                                    size={16}
                                    name='svg'
                                    onClick={handleOverAllEvent}
                                    id={video._id}
                                    color="white"
                                    aria-hidden="true"
                                  />
                                )}
                              </button>
                            </div>
                            <div
                              name="duration"
                              id={video._id}
                              className="absolute inset-0 flex items-end justify-end bottom-0 p-2 rounded-[10px] max-lg:text-[2vw] text-lg"
                              role="timer"
                              aria-label={`Duration: ${formatTime(video?.duration)}`}
                            >
                              <h1
                                name="duration"
                                className="text-white rounded-md px-1 py-0.1"
                                style={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                  fontSize: 'var(--font-size-sm)',
                                  fontFamily: 'var(--font-family)'
                                }}
                              >
                                {videoStatus[video._id]?.duration
                                  ? formatTime(video?.duration - videoStatus[video._id]?.duration)
                                  : formatTime(video?.duration)}
                              </h1>
                            </div>
                          </div>
                        </div>

                        {/* Video Info */}
                        <div
                          className="max-w-96 max-md:w-[60%] flex-col flex"
                          style={{
                            paddingLeft: 'var(--spacing-unit)',
                            // paddingTop: 'var(--spacing-unit)'
                          }}
                        >
                          {/* Title */}
                          <div
                            className="line-clamp-2 w-full font-medium text-3xl max-sm:pb-0 max-sm:text-lg max-md:text-2xl cursor-pointer transition-all"
                            style={{
                              color: 'var(--color-text-primary)',
                              fontSize: 'var(--font-size-xl)',
                              fontFamily: 'var(--font-family)',
                              // paddingBottom: 'var(--spacing-unit)',
                              transitionDuration: 'var(--animation-duration)'
                            }}
                            // onMouseEnter={(e) => {
                            //   e.target.style.color = 'var(--accent-color)';
                            // }}
                            // onMouseLeave={(e) => {
                            //   e.target.style.color = 'var(--color-text-primary)';
                            // }}
                          >
                            <h2
                              onClick={handleOverAllEvent}
                              id={video._id}
                              name="title"
                              role="button"
                              tabIndex={0}
                              aria-label={`Watch: ${video?.title}`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleOverAllEvent(e);
                                }
                              }}
                            >
                              {video?.title}
                            </h2>
                          </div>

                          <div className="flex">
                            <div className="flex flex-col">
                              {/* Username */}
                              <div
                                className="text-xs font-normal max-md:text-xs"
                                style={{
                                  color: 'var(--color-text-secondary)',
                                  fontSize: 'var(--font-size-xs)',
                                  // marginBottom: 'var(--spacing-unit)'
                                }}
                              >
                                <h3
                                  onClick={handleOverAllEvent}
                                  data-username={video?.userInfo?.username}
                                  name="username"
                                  id={video._id}
                                  className="cursor-pointer transition-colors"
                                  style={{
                                    transitionDuration: 'var(--animation-duration)'
                                  }}
                                  // onMouseEnter={(e) => {
                                  //   e.target.style.color = 'var(--accent-color)';
                                  // }}
                                  // onMouseLeave={(e) => {
                                  //   e.target.style.color = 'var(--color-text-secondary)';
                                  // }}
                                  role="button"
                                  tabIndex={0}
                                  aria-label={`Visit ${video?.userInfo?.username}'s channel`}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      handleOverAllEvent(e);
                                    }
                                  }}
                                >
                                  {video?.userInfo?.username}
                                </h3>
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
                                <span
                                  aria-hidden="true"
                                  style={{ color: 'var(--color-text-secondary)' }}
                                >
                                  •
                                </span>
                                <span>
                                  {timeAgo(video?.createdAt) || "Unknown time"}
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

