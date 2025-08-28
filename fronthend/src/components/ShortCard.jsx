import React,{ useEffect, useRef, useState} from 'react'
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
  Maximize,
  X,
  Eye,
} from "lucide-react";
import {
  fetchSubcribeToggle,
  isSubcribed,
} from "../redux/features/subcribers";
import { useDispatch, useSelector } from 'react-redux';
import { fetchLikeToggleShort, isShortLiked } from '../redux/features/likes';
import { fetchShortComment } from '../redux/features/comment';
import { fetchShort } from '../redux/features/shorts';

const ShortCard = (props) => {

  const dispatch = useDispatch();

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [hide, setHide] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("Auto");

  const shortRef = useRef(null);
  const containerRef = React.useRef(null);

  const { shortLiked } = useSelector(state => state.shorts);
  const { isSubcribedStatus } = useSelector(state => state.subscriber)

  const {
    short,
    activeShort,
    showComment,
    setShowComment,
    setCurrentTime,
    currentTime,
  } = props;

  useEffect(() => {
      dispatch(isShortLiked(short._id))
  }, [short._id, dispatch])

  useEffect(() => {
    const short = shortRef.current;
    if (!short) return;

    const handleTimeUpdate = (e) => {
      e.stopPropagation();
      setCurrentTime(short.currentTime); 
    };

    const handleLoadedMetadata = () => setDuration(short.duration);

    short.addEventListener("timeupdate", handleTimeUpdate);
    short.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      short.removeEventListener("timeupdate", handleTimeUpdate);
      short.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const shorts = shortRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          shorts.play();
          setIsPlaying(true);
          activeShort(short._id);
        } else {
          shorts.pause();
          setIsPlaying(false);
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


  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e) => {
      const tag = event.target.tagName.toLowerCase();

      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (e.key === "Escape" && isFullscreen) {
        exitFullscreen();
      }
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const toggleFullscreen = async (e) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  const exitFullscreen = async (e) => {
    e.stopPropagation();
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error("Error exiting fullscreen:", error);
      }
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    const short = shortRef.current;
    if (isPlaying) {
      short.pause();
    } else {
      short.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const short = shortRef.current;
    short.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    shortRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    shortRef.current.playbackRate = rate;
    setShowSettings(false);
  };

  const handleQualityChange = (qual) => {
    setQuality(qual);
    setShowSettings(false);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleLikeToggle = (ids) => {
    dispatch(fetchLikeToggleShort(ids));
    dispatch(isShortLiked(ids));
  }

  const handleShortComment = (e,ids) => {
    e.stopPropagation();
    setShowComment(!showComment)
    dispatch(fetchShortComment(ids));
  }

  const handleSubcribeToggle = (e, ids) => {
    e.stopPropagation();

    dispatch(fetchSubcribeToggle(ids))
  }

  useEffect(() => {
      dispatch(isSubcribed(short.owner));

  }, [dispatch,short]);

  return (
    <div>
      <div
        className="relative  max-sm:rounded-none max-sm:h-[calc(100vh_-_41px)] rounded-2xl h-[calc(100vh_-_75px)] max-sm:w-screen aspect-[9/16] overflow-hidden"
        ref={containerRef}
        key={short._id}
        onClick={(e) => togglePlay(e)}
        onDoubleClick={() => handleLikeToggle(short._id)}
        style={{
          objectFit: "contain"
        }}
      >
        <div className="max-md:rounded-none overflow-hidden">
          <video
            ref={shortRef}
            id={short._id}
            src={short.shortFile}
            poster={short.thumbnail}
            className=" w-full h-full"
            muted={isMuted}
            volume={volume}
            loop
          ></video>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 z-8">
          <div
            className="h-full bg-red-500 ransition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col justify-between p-4">
          {/* Top Controls */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => togglePlay(e)}
                className="p-4 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <div
                className="flex items-center ml-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors cursor-pointer"
                onMouseEnter={() => setHide(true)}
                onMouseLeave={() => setHide(false)}
              >
                <button
                  onClick={(e) => toggleMute(e)}
                  className="flex justify-center items-center p-2 "
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  onClick={(e) => e.stopPropagation()}
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(e)}
                  className={`${
                    volume === 0 ? "bg-gray-300" : "bg-blue-300"
                  } w-16 h-1 rounded-lg appearance-none cursor-pointer ${
                    hide ? "block" : "hidden"
                  } ml-2 mr-2`}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
                className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(!isFullscreen);
                  toggleFullscreen();
                }}
                className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>

          {/* Center Play/Pause Button */}
          <div className="flex items-end h-full justify-center">
            <button
              onClick={(e) => togglePlay(e)}
              className="p-4 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>

          {/* Bottom Info and Controls */}
          <div className="flex justify-between  items-end">
            <div className="w-full flex justify-between">
              <div onClick={(e) => e.stopPropagation()}>
                <div className="flex text-white text-sm font-medium mb-1 gap-2 text-center">
                  <img
                    src={short.userInfo[0]?.avatar}
                    alt="#"
                    className="w-6 aspect-square rounded-full"
                  />
                  {"@" + short.userInfo[0]?.username || "Unknown User"}
                </div>
                <div className="text-white text-base opacity-90 mb-2">
                  {short.title}
                </div>
              </div>
              <div className="flex items-center mr-2">
                {/* <button className="text-lg px-3 py-1 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-3xl  flex justify-center items-center font-medium">
                  Subcribe
                </button> */}
                <button
                  onClick={(e) => handleSubcribeToggle(e,short.owner)}
                  className={`${
                    isSubcribedStatus === true
                      ? "bg-gray-300 hover:bg-gray-500 active:bg-gray-600"
                      : "bg-red-400 hover:bg-red-500 active:bg-red-600"
                  } text-lg px-3 py-1  rounded-3xl flex justify-center items-center font-medium`}
                >
                  {isSubcribedStatus === true ? "Subcribed" : "Subcribe"}
                </button>
              </div>
            </div>

            {/* Side Controls */}
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col items-center">
                <button className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors">
                  <Eye size={24} />
                </button>
                <span className="text-white text-xs mt-1">{short?.views}</span>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeToggle(short._id);
                  }}
                  className={`p-3 rounded-full transition-all ${
                    shortLiked === true
                    ? " text-white bg-black/30"
                      : "bg-black/30 text-white hover:bg-black/50"
                  }`}
                >
                  <Heart
                    size={24}
                    fill={shortLiked === true ? "white" : "none"}
                  />
                </button>
                <span className="text-white text-xs mt-1">
                  {short?.likeCount}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={(e) => handleShortComment(e,short._id)
                  }
                  className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                  <MessageCircle
                    size={24}
                    fill={showComment === false ? "white" : "transparent"}
                  />
                </button>
                <span className="text-white text-xs mt-1">
                  {short?.commentCount}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                  <Share size={24} />
                </button>
                <span className="text-white text-xs mt-1">{"12"}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <Download size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <MoreHorizontal size={24} />
              </button>
            </div>
          </div>
        </div>
        {showSettings && (
          <div className="absolute top-16 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-2 text-white min-w-[60px]">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Playback Speed</h3>
              <div className="space-y-1">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={(e) => { e.stopPropagation(); handlePlaybackRateChange(rate)}}
                    className={`w-full text-left px-2 py-1 rounded text-sm ${
                      playbackRate === rate
                        ? "bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                  >
                    {rate}x {rate === 1 ? "(Normal)" : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Quality</h3>
              <div className="space-y-1">
                {["Auto", "1080p", "720p", "480p", "360p"].map((qual) => (
                  <button
                    key={qual}
                    onClick={(e) => { e.stopPropagation(); handleQualityChange(qual)}}
                    className={`w-full text-left px-2 py-1 rounded text-sm ${
                      quality === qual ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    {qual}
                  </button>
                ))}
              </div>
            </div>

            {/* <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showCaptions}
                        onChange={(e) => setShowCaptions(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Captions</span>
                    </label>
                  </div> */}
          </div>
        )}
      </div>
      {/* Description box */}
      <div className="absolute hidden  min-w-80  border-1 border-gray-300 rounded-[9px] top-0 right-0 w-[320px]  ml-8 ">
        <div className="p-3 flex items-center justify-between border-b-1 border-gray-300">
          <h1 className="text-2xl font-medium">Description</h1>
          <div>
            {/* close button */}
            <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
              <X />
            </button>
          </div>
        </div>
        <div className="p-3 flex items-center justify-between border-gray-300">
          <div className="text-xs opacity-80 mb-2  overflow-y-scroll scroll-smooth scrollBar max-h-[96px] ">
            <div className="space-x-2">
              <span>12k Views</span>
              <span>day date year</span>
            </div>
            <p className="text-sm">{short?.description}</p>

            <div>Show more</div>
            <div>Show less</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortCard;