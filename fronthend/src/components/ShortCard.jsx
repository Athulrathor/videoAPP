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
  const [showdesc, setshowdesc] = useState(false);

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
        // onClick={(e) => togglePlay(e)}
        // onDoubleClick={() => handleLikeToggle(short._id)}
        onClick={props.handleAllOverEvent}
        onDoubleClick={props.handleAllOverEvent}
        id={short._id}
        name="short-container"
        style={{
          objectFit: "contain"
        }}
      >
        <div className="max-md:rounded-none overflow-hidden">
          <video
            ref={shortRef}
            id={short._id}
            name="short"
            src={short.shortFile}
            poster={short.thumbnail}
            className=" w-full h-full"
            muted={isMuted}
            volume={volume}
            loop
          ></video>
        </div>
        <div className={`${showComment ? "" : "hidden"} absolute bottom-0 left-0 right-0 h-1 z-1`}>
          <div
            className={`h-full bg-red-500`}
            name="duration"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div name="body" id={short._id} className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col justify-between max-sm:p-2 p-4">
          {/* Top Controls */}
          <div name="body" id={short._id} className="flex justify-between items-start">
            <div name='body' id={short._id} className="flex items-center space-x-2 max-sm:space-x-1">
              <button
                // onClick={(e) => togglePlay(e)}
                onClick={props.handleAllOverEvent}
                name='play' id={short._id}
                className="p-4 max-sm:p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200"
              >
                {props.isPlaying ? <Pause name='play' id={short._id} onClick={props.handleAllOverEvent} className='size-[24px] max-sm:size-[16px]' /> : <Play size={24} name='play' id={short._id} onClick={props.handleAllOverEvent} className='max-sm:size-[16px]' />}
              </button>
              <div
                name='mute-container'
                id={short._id}
                className="flex items-center ml-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors cursor-pointer"
                onMouseEnter={() => setHide(true)}
                onMouseLeave={() => setHide(false)}
              >
                <button
                  // onClick={(e) => toggleMute(e)}
                  onClick={props.handleAllOverEvent} name='mute' id={short._id}
                  className="flex justify-center items-center p-2 "
                >
                  {props.isMuted ? <VolumeX size={20} onClick={props.handleAllOverEvent} name='mute' id={short._id} className='max-sm:size-[16px]' /> : <Volume2 size={20} onClick={props.handleAllOverEvent} name='mute' id={short._id} className='max-sm:size-[16px]' />}
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

            <div name='body' id={short._id} className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
                className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <Settings size={20} className='max-sm:size-[16px]' />
              </button>
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(!isFullscreen);
                  toggleFullscreen();
                }}
                className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <Maximize size={20} className='max-sm:size-[16px]' />
              </button> */}
            </div>
          </div>

          {/* Center Play/Pause Button */}
          <div name='play' id={short._id} className="flex items-end h-full justify-center">
            <button
              onClick={props.handleAllOverEvent} name='play' id={short._id}
              className="p-4 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200"
            >
              {props.isPlaying ? <Pause onClick={props.handleAllOverEvent} name='play' id={short._id} size={24} /> : <Play onClick={props.handleAllOverEvent} name='play' id={short._id} size={24} />}
            </button>
          </div>

          {/* Bottom Info and Controls */}
          <div name="body" id={short._id} className="flex justify-between  items-end">
            <div name="body" id={short._id} className="w-full flex justify-between">
              <div name="content" id={short._id} className='' onClick={(e) => e.stopPropagation()}>
                <div name="body" id={short._id} className="flex text-white text-sm font-medium mb-1 items-center space-x-2">
                  <img
                    src={short.userInfo[0]?.avatar}
                    alt="#"
                    className="w-6 max-sm:w-8 aspect-square rounded-full"
                    data-username={short?.userInfo[0]?.username}
                    id={short._id}
                    onClick={props.handleAllOverEvent}
                    name="avatar"
                  />
                  <span onClick={props.handleAllOverEvent} data-username={short?.userInfo[0]?.username} id={short._id} name="avatar">
                    {"@" + short.userInfo[0]?.username || "Unknown User"}
                  </span>
                  <button
                    // onClick={(e) => handleSubcribeToggle(e, short.owner)}
                    onClick={props.handleAllOverEvent}
                    name='subcribe'
                    id={short._id}
                    className={`${isSubcribedStatus === true
                      ? "bg-gray-400 hover:bg-gray-500 active:bg-gray-600"
                      : "bg-red-400 hover:bg-red-500 active:bg-red-600"
                      } text-lg px-2 py-0.5 ml-2  rounded-xl flex justify-center items-center font-medium`}
                  >
                    {isSubcribedStatus === true ? "Subcribed" : "Subcribe"}
                  </button>
                </div>
                <div onClick={() => setshowdesc(!showdesc)} className="text-white line-clamp-2 text-base opacity-90 mb-2">
                  <span>{short.title}</span>
                  <p className='line-clamp-1'>{"sdhfosdfhlsdhsifhlsdhfsldfhsdf"+short?.description}</p>
                </div>

                {/* Description box */}
                <div className={`${showdesc ? "" : "translate-y-[100%]"} absolute min-w-full z-20 bottom-0 -translate-x-2  border-1 border-gray-300 rounded-t-lg h-[50%] bg-gray-50 transition-all duration-500 ease-in-out`}>
                  <div className="p-3 flex items-center justify-between border-b-1 border-gray-300">
                    <h1 className="text-2xl font-medium">Description</h1>
                    <div>
                      {/* close button */}
                      <button onClick={(e) => { e.stopPropagation(); setshowdesc(false)}} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
                        <X className='max-sm:size-[16px]' />
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
              <div className="flex items-center mr-2">
                {/* <button className="text-lg px-3 py-1 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-3xl  flex justify-center items-center font-medium">
                  Subcribe
                </button> */}
                
              </div>
            </div>

            {/* Side Controls */}
            <div name="body" id={short._id} className="flex flex-col space-y-4">
              <div name="body" id={short._id} className="flex flex-col items-center">
                <button name="views" id={short._id} className="p-3 rounded-full bg-black/30 text-white transition-colors">
                  <Eye size={24} name='eye' id={short._id} className='max-sm:size-[16px]' />
                </button>
                <span className="text-white text-xs mt-1">{short?.views}</span>
              </div>
              <div name="body" id={short._id} className="flex flex-col items-center">
                <button
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   handleLikeToggle(short._id);
                  // }}
                  onClick={props.handleAllOverEvent}
                  name='like'
                  id={short._id}
                  className={`p-3 rounded-full transition-all ${
                    shortLiked === true
                    ? " text-white bg-black/30"
                      : "bg-black/30 text-white hover:bg-black/50"
                  }`}
                >
                  <Heart
                    size={24}
                    className='max-sm:size-[16px]'
                    name='heart'
                    onClick={props.handleAllOverEvent}
                    id={short._id}
                    fill={shortLiked === true ? "white" : "none"}
                  />
                </button>
                <span className="text-white text-xs mt-1">
                  {short?.likeCount}
                </span>
              </div>

              <div name="body" id={short._id} className="flex flex-col items-center">
                <button
                  // onClick={(e) => handleShortComment(e, short._id)}
                  onClick={props.handleAllOverEvent}
                  name="comment"
                  id={short._id}
                  className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                  <MessageCircle
                    size={24}
                    name='message'
                    id={short._id}
                    onClick={props.handleAllOverEvent}
                    className='max-sm:size-[16px]'
                    fill={showComment === false ? "white" : "transparent"}
                  />
                </button>
                <span className="text-white text-xs mt-1">
                  {short?.commentCount}
                </span>
              </div>

              <div name="body" id={short._id} className="flex flex-col items-center">
                <button
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  // }}
                  onClick={props.handleAllOverEvent}
                  name='share'
                  id={short._id}
                  className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                  <Share name='shares' onClick={props.handleAllOverEvent}
                    id={short._id} size={24} className='max-sm:size-[16px]' />
                </button>
                <span className="text-white text-xs mt-1">{"12"}</span>
              </div>

              <button
                // onClick={(e) => {
                //   e.stopPropagation();
                // }}
                name='download'
                id={short._id}
                onClick={props.handleAllOverEvent}
                className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <Download name='downloads' onClick={props.handleAllOverEvent}
                  id={short._id} size={24} className='max-sm:size-[16px]' />
              </button>

              <button
                // onClick={(e) => {
                //   e.stopPropagation();
                // }}
                name='more'
                id={short._id}
                onClick={props.handleAllOverEvent}
                className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <MoreHorizontal onClick={props.handleAllOverEvent} size={24} className='max-sm:size-[16px]' />
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
    </div>
  );
}

export default ShortCard;