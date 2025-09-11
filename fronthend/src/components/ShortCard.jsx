import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Share,
  Download,
  MoreHorizontal,
  Settings,
  X,
  Eye,
} from "lucide-react";
import { isSubcribed } from "../redux/features/subcribers";
import { useDispatch, useSelector } from 'react-redux';
import { useAppearance } from '../hooks/appearances';

const ShortCard = (props) => {
  const { appearanceSettings } = useAppearance();
  const dispatch = useDispatch();

  const [duration, setDuration] = useState(0);
  const [hide, setHide] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("Auto");
  const [showdesc, setshowdesc] = useState(false);

  const shortRef = useRef(null);
  const containerRef = React.useRef(null);

  const { shortLiked } = useSelector(state => state.shorts);
  const { isSubcribedStatus } = useSelector(state => state.subscriber)

  const {
    short,
    activeShort,
    currentTime,
    playing,
    muted,
    settingBtn,
    commentPart
  } = props;

  const handleTimeUpdate = useCallback((e) => {
    e.stopPropagation();
    currentTime.setCurrentTime(shortRef.current?.currentTime || 0);
  }, [currentTime]);

  const handleLoadedMetadata = useCallback(() => {
    setDuration(shortRef.current?.duration || 0);
  }, [setDuration]);

  useEffect(() => {
    const short = shortRef.current;
    if (!short) return;

    short.addEventListener("timeupdate", handleTimeUpdate);
    short.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      short.removeEventListener("timeupdate", handleTimeUpdate);
      short.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [handleTimeUpdate, handleLoadedMetadata]);

  useEffect(() => {
    const shorts = shortRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          shorts.play();
          playing.setIsPlaying(true);
          activeShort(short._id);
        } else {
          shorts.pause();
          playing.setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    if (shorts) {
      observer.observe(shorts);
    }

    return () => {
      if (shorts) {
        observer.unobserve(shorts);
      }
    };
  }, []);

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    shortRef.current.volume = newVolume;
    muted.setIsMuted(newVolume === 0);
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    shortRef.current.playbackRate = rate;
    settingBtn.setShowSettings(false);
  };

  const handleQualityChange = (qual) => {
    setQuality(qual);
    settingBtn.setShowSettings(false);
  };

  const progressPercentage = duration > 0 ? (currentTime.currentTime / duration) * 100 : 0;

  useEffect(() => {
    dispatch(isSubcribed(short.owner));
  }, [dispatch, short]);

  return (
    <div>
      <div
        className="relative max-sm:rounded-none max-sm:h-[calc(100vh_-_41px)] rounded-2xl h-[calc(100vh_-_75px)] max-sm:w-screen aspect-[9/16] overflow-hidden transition-all"
        ref={containerRef}
        key={short._id}
        onClick={props.handleAllOverEvent}
        onDoubleClick={props.handleAllOverEvent}
        id={short._id}
        name="short-container"
        style={{
          objectFit: "contain",
          backgroundColor: 'var(--color-bg-primary)',
          transitionDuration: 'var(--animation-duration)'
        }}
        role="article"
        aria-label={`Short video: ${short.title} by ${short.userInfo[0]?.username}`}
        tabIndex={0}
      >
        <div
          className="max-md:rounded-none overflow-hidden"
          style={{ borderRadius: 'var(--spacing-unit)' }}
        >
          <video
            ref={shortRef}
            id={short._id}
            name="short"
            src={short.shortFile}
            poster={short.thumbnail}
            className="w-full h-full"
            muted={muted.isMuted}
            volume={volume}
            loop
            aria-label={`Short video player: ${short.title}`}
            aria-describedby={`desc-${short._id}`}
          />
        </div>

        {/* Progress Bar */}
        <div
          className={`${commentPart.showComment ? "" : "hidden"} absolute bottom-0 left-0 right-0 h-1 z-1`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          aria-label={`Video progress: ${Math.round(progressPercentage)}%`}
        >
          <div
            className="h-full transition-all"
            name="duration"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: 'var(--accent-color)',
              transitionDuration: 'var(--animation-duration)'
            }}
          />
        </div>

        {/* Main Overlay */}
        <div
          name="body"
          id={short._id}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col justify-between max-sm:p-2 p-4 transition-all"
          style={{
            padding: 'var(--component-padding)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          {/* Top Controls */}
          <div
            name="body"
            id={short._id}
            className="flex justify-between items-start"
          >
            <div
              name='body'
              id={short._id}
              className="flex items-center space-x-2 max-sm:space-x-1"
              style={{ gap: 'var(--spacing-unit)' }}
            >
              <button
                onClick={props.handleAllOverEvent}
                name='play'
                id={short._id}
                className="p-4 max-sm:p-2 rounded-full text-white transition-all duration-200"
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
                aria-label={playing.isPlaying ? "Pause video" : "Play video"}
                aria-pressed={playing.isPlaying}
                role="button"
                tabIndex={0}
              >
                {props.playing.isPlaying ? (
                  <Pause
                    name='play'
                    id={short._id}
                    onClick={props.handleAllOverEvent}
                    className='size-[24px] max-sm:size-[16px]'
                    aria-hidden="true"
                  />
                ) : (
                  <Play
                    size={24}
                    name='play'
                    id={short._id}
                    onClick={props.handleAllOverEvent}
                    className='max-sm:size-[16px]'
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* Volume Control */}
              <div
                name='mute-container'
                id={short._id}
                className="flex items-center ml-2 rounded-full text-white transition-all cursor-pointer"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={() => {
                  setHide(true);
                }}
                onMouseLeave={() => {
                  setHide(false);
                }}
              >
                <button
                  onClick={props.handleAllOverEvent}
                  name='mute'
                  id={short._id}
                  className="flex justify-center items-center p-2"
                  aria-label={muted.isMuted ? "Unmute video" : "Mute video"}
                  aria-pressed={muted.isMuted}
                  role="button"
                  tabIndex={0}
                >
                  {props.muted.isMuted ? (
                    <VolumeX
                      size={20}
                      onClick={props.handleAllOverEvent}
                      name='mute'
                      id={short._id}
                      className='max-sm:size-[16px]'
                      aria-hidden="true"
                    />
                  ) : (
                    <Volume2
                      size={20}
                      onClick={props.handleAllOverEvent}
                      name='mute'
                      id={short._id}
                      className='max-sm:size-[16px]'
                      aria-hidden="true"
                    />
                  )}
                </button>
                <input
                  onClick={(e) => e.stopPropagation()}
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(e)}
                  className={`w-16 h-1 rounded-lg appearance-none cursor-pointer ml-2 mr-2 transition-all ${hide ? "block" : "hidden"
                    }`}
                  style={{
                    backgroundColor: volume === 0 ? 'var(--color-border)' : 'var(--accent-color)',
                    accentColor: 'var(--accent-color)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  aria-label="Volume control"
                  aria-valuemin={0}
                  aria-valuemax={1}
                  aria-valuenow={volume}
                />
              </div>
            </div>

            <div
              name='body'
              id={short._id}
              className="flex space-x-2"
              style={{ gap: 'var(--spacing-unit)' }}
            >
              <button
                name='setting'
                id={short._id}
                onClick={props.handleAllOverEvent}
                className="p-2 rounded-full text-white transition-all"
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
                aria-label="Video settings"
                aria-expanded={settingBtn.showSettings}
                role="button"
                tabIndex={0}
              >
                <Settings
                  size={20}
                  name='setting'
                  id={short._id}
                  onClick={props.handleAllOverEvent}
                  className='max-sm:size-[16px]'
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* Center Play/Pause Button */}
          <div
            name='play'
            id={short._id}
            className="flex items-end h-full justify-center"
          >
            <button
              onClick={props.handleAllOverEvent}
              name='play'
              id={short._id}
              className="p-4 rounded-full text-white transition-all duration-200"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                e.target.style.transform = 'scale(1)';
              }}
              aria-label={playing.isPlaying ? "Pause video" : "Play video"}
              aria-pressed={playing.isPlaying}
              role="button"
              tabIndex={0}
            >
              {props.playing.isPlaying ? (
                <Pause
                  onClick={props.handleAllOverEvent}
                  name='play'
                  id={short._id}
                  size={24}
                  aria-hidden="true"
                />
              ) : (
                <Play
                  onClick={props.handleAllOverEvent}
                  name='play'
                  id={short._id}
                  size={24}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>

          {/* Bottom Info and Controls */}
          <div
            name="body"
            id={short._id}
            className="flex justify-between items-end"
          >
            <div
              name="body"
              id={short._id}
              className="w-full flex justify-between"
            >
              {/* Content Information */}
              <div
                name="content"
                id={short._id}
                className=''
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  name="body"
                  id={short._id}
                  className="flex text-white text-sm font-medium mb-1 items-center space-x-2"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'var(--font-family)',
                    gap: 'var(--spacing-unit)',
                    marginBottom: 'var(--spacing-unit)'
                  }}
                >
                  <img
                    src={short.userInfo[0]?.avatar}
                    alt={`${short.userInfo[0]?.username}'s avatar`}
                    className="w-6 max-sm:w-8 aspect-square rounded-full cursor-pointer transition-all"
                    data-username={short?.userInfo[0]?.username}
                    id={short._id}
                    onClick={props.handleAllOverEvent}
                    name="avatar"
                    style={{
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Visit ${short.userInfo[0]?.username}'s channel`}
                  />
                  <span
                    onClick={props.handleAllOverEvent}
                    data-username={short?.userInfo[0]?.username}
                    id={short._id}
                    name="avatar"
                    className="cursor-pointer transition-colors"
                    style={{
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--accent-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'white';
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Visit ${short.userInfo[0]?.username}'s channel`}
                  >
                    {"@" + short.userInfo[0]?.username || "Unknown User"}
                  </span>
                  <button
                    onClick={props.handleAllOverEvent}
                    name='subcribe'
                    id={short._id}
                    className="text-sm px-3 py-1 ml-2 rounded-2xl flex justify-center items-center font-medium transition-all"
                    style={{
                      backgroundColor: isSubcribedStatus === true
                        ? 'var(--color-bg-secondary)'
                        : 'var(--color-error)',
                      color: isSubcribedStatus === true ? 'var(--color-text-primary)' : 'white',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)',
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
                    aria-label={isSubcribedStatus ? `Unsubscribe from ${short.userInfo[0]?.username}` : `Subscribe to ${short.userInfo[0]?.username}`}
                    aria-pressed={isSubcribedStatus}
                  >
                    {isSubcribedStatus === true ? "Subscribed" : "Subscribe"}
                  </button>
                </div>

                <div
                  onClick={() => setshowdesc(!showdesc)}
                  className="text-white line-clamp-2 text-base opacity-90 mb-2 cursor-pointer transition-all"
                  style={{
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-family)',
                    marginBottom: 'var(--spacing-unit)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '0.9';
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Show video description"
                  aria-expanded={showdesc}
                  id={`desc-${short._id}`}
                >
                  <span>{short.title}</span>
                  <p className='line-clamp-1'>{short?.description}</p>
                </div>

                {/* Description Modal */}
                <div
                  className={`${showdesc ? "" : "translate-y-[100%]"} absolute min-w-full z-20 bottom-0 -translate-x-2 border rounded-t-lg h-[50%] transition-all duration-500 ease-in-out`}
                  style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: 'var(--color-border)',
                    transitionDuration: appearanceSettings.reducedMotion ? '0s' : '0.5s'
                  }}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`desc-title-${short._id}`}
                  aria-hidden={!showdesc}
                >
                  <div
                    className="p-3 flex items-center justify-between border-b"
                    style={{
                      borderColor: 'var(--color-border)',
                      padding: 'var(--component-padding)'
                    }}
                  >
                    <h1
                      id={`desc-title-${short._id}`}
                      className="text-2xl font-medium"
                      style={{
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-2xl)',
                        fontFamily: 'var(--font-family)'
                      }}
                    >
                      Description
                    </h1>
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setshowdesc(false);
                        }}
                        className="p-3 rounded-full transition-all"
                        style={{
                          backgroundColor: 'var(--color-bg-secondary)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--color-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                        }}
                        aria-label="Close description"
                      >
                        <X className='max-sm:size-[16px]' style={{ color: 'var(--color-text-primary)' }} />
                      </button>
                    </div>
                  </div>
                  <div
                    className="p-3 flex items-center justify-between"
                    style={{
                      padding: 'var(--component-padding)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    <div
                      className="text-xs opacity-80 mb-2 overflow-y-scroll scroll-smooth scrollBar max-h-[96px]"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)'
                      }}
                    >
                      <div
                        className="space-x-2"
                        style={{ gap: 'var(--spacing-unit)' }}
                      >
                        <span>{short?.views || '12k'} Views</span>
                        <span>day date year</span>
                      </div>
                      <p
                        className="text-sm"
                        style={{
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-sm)'
                        }}
                      >
                        {short?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Controls */}
            <div
              name="body"
              id={short._id}
              className="flex flex-col space-y-4"
              style={{ gap: 'var(--spacing-unit)' }}
            >
              {/* Views */}
              <div
                name="body"
                id={short._id}
                className="flex flex-col items-center"
              >
                <button
                  name="views"
                  id={short._id}
                  className="p-3 rounded-full text-white transition-all"
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
                  aria-label={`${short?.views} views`}
                  role="button"
                  tabIndex={0}
                >
                  <Eye size={24} name='eye' id={short._id} className='max-sm:size-[16px]' aria-hidden="true" />
                </button>
                <span
                  className="text-white text-xs mt-1"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    marginTop: 'var(--spacing-unit)'
                  }}
                >
                  {short?.views}
                </span>
              </div>

              {/* Like Button */}
              <div
                name="body"
                id={short._id}
                className="flex flex-col items-center"
              >
                <button
                  onClick={props.handleAllOverEvent}
                  name='like'
                  id={short._id}
                  className="p-3 rounded-full transition-all"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                  }}
                  aria-label={shortLiked ? "Unlike this video" : "Like this video"}
                  aria-pressed={shortLiked}
                  role="button"
                  tabIndex={0}
                >
                  <Heart
                    size={24}
                    className='max-sm:size-[16px]'
                    name='heart'
                    onClick={props.handleAllOverEvent}
                    id={short._id}
                    fill={shortLiked === true ? "var(--accent-color)" : "none"}
                    style={{ color: shortLiked === true ? 'var(--accent-color)' : 'white' }}
                    aria-hidden="true"
                  />
                </button>
                <span
                  className="text-white text-xs mt-1"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    marginTop: 'var(--spacing-unit)'
                  }}
                >
                  {short?.likeCount}
                </span>
              </div>

              {/* Comment Button */}
              <div
                name="body"
                id={short._id}
                className="flex flex-col items-center"
              >
                <button
                  onClick={props.handleAllOverEvent}
                  name="comment"
                  id={short._id}
                  className="p-3 rounded-full text-white transition-all"
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
                  aria-label="Show comments"
                  aria-expanded={!commentPart.showComment}
                  role="button"
                  tabIndex={0}
                >
                  <MessageCircle
                    size={24}
                    name='message'
                    id={short._id}
                    onClick={props.handleAllOverEvent}
                    className='max-sm:size-[16px]'
                    fill={commentPart.showComment === false ? "white" : "transparent"}
                    aria-hidden="true"
                  />
                </button>
                <span
                  className="text-white text-xs mt-1"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    marginTop: 'var(--spacing-unit)'
                  }}
                >
                  {short?.commentCount}
                </span>
              </div>

              {/* Share Button */}
              <div
                name="body"
                id={short._id}
                className="flex flex-col items-center"
              >
                <button
                  onClick={props.handleAllOverEvent}
                  name='share'
                  id={short._id}
                  className="p-3 rounded-full text-white transition-all"
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
                  aria-label="Share this video"
                  role="button"
                  tabIndex={0}
                >
                  <Share
                    name='shares'
                    onClick={props.handleAllOverEvent}
                    id={short._id}
                    size={24}
                    className='max-sm:size-[16px]'
                    aria-hidden="true"
                  />
                </button>
                <span
                  className="text-white text-xs mt-1"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    marginTop: 'var(--spacing-unit)'
                  }}
                >
                  Share
                </span>
              </div>

              {/* Download Button */}
              <button
                name='download'
                id={short._id}
                onClick={props.handleAllOverEvent}
                className="p-3 rounded-full text-white transition-all"
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
                aria-label="Download this video"
                role="button"
                tabIndex={0}
              >
                <Download
                  name='downloads'
                  onClick={props.handleAllOverEvent}
                  id={short._id}
                  size={24}
                  className='max-sm:size-[16px]'
                  aria-hidden="true"
                />
              </button>

              {/* More Options */}
              <button
                name='more'
                id={short._id}
                onClick={props.handleAllOverEvent}
                className="p-3 rounded-full text-white transition-all"
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
                aria-label="More options"
                role="button"
                tabIndex={0}
              >
                <MoreHorizontal
                  onClick={props.handleAllOverEvent}
                  size={24}
                  className='max-sm:size-[16px]'
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {props.settingBtn.showSettings && (
          <div
            className="absolute top-16 right-4 rounded-lg p-2 text-white min-w-[60px] transition-all"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--spacing-unit)',
              color: 'var(--color-text-primary)',
              transitionDuration: 'var(--animation-duration)'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Video settings"
          >
            <div className="mb-4">
              <h3
                className="text-sm font-medium mb-2"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'var(--font-family)',
                  marginBottom: 'var(--spacing-unit)'
                }}
              >
                Playback Speed
              </h3>
              <div
                className="space-y-1"
                style={{ gap: 'var(--spacing-unit)' }}
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaybackRateChange(rate);
                    }}
                    className="w-full text-left px-2 py-1 rounded text-sm transition-all"
                    style={{
                      backgroundColor: playbackRate === rate
                        ? 'var(--color-accent-bg)'
                        : 'transparent',
                      color: playbackRate === rate
                        ? 'var(--accent-color)'
                        : 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      if (playbackRate !== rate) {
                        e.target.style.backgroundColor = 'var(--color-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (playbackRate !== rate) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                    aria-pressed={playbackRate === rate}
                  >
                    {rate}x {rate === 1 ? "(Normal)" : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3
                className="text-sm font-medium mb-2"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'var(--font-family)',
                  marginBottom: 'var(--spacing-unit)'
                }}
              >
                Quality
              </h3>
              <div
                className="space-y-1"
                style={{ gap: 'var(--spacing-unit)' }}
              >
                {["Auto", "1080p", "720p", "480p", "360p"].map((qual) => (
                  <button
                    key={qual}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQualityChange(qual);
                    }}
                    className="w-full text-left px-2 py-1 rounded text-sm transition-all"
                    style={{
                      backgroundColor: quality === qual
                        ? 'var(--color-accent-bg)'
                        : 'transparent',
                      color: quality === qual
                        ? 'var(--accent-color)'
                        : 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      if (quality !== qual) {
                        e.target.style.backgroundColor = 'var(--color-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (quality !== qual) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                    aria-pressed={quality === qual}
                  >
                    {qual}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShortCard;
