import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShortCard from "../components/ShortCard";
import ShortSkeletonLoading from "../components/LoadingScreen/ShortSkeletonLoading";
import Comments from "../components/Comments";
import { fetchLikeToggleShort, isShortLiked } from "../redux/features/likes";
import { fetchShortComment } from "../redux/features/comment";
import { useNavigate } from "react-router-dom";
import { fetchSubcribeToggle } from "../redux/features/subcribers";
import { WifiOff, RefreshCw } from "lucide-react";
import { useAppearance } from "../hooks/appearances";

const Short = (props) => {
  const { appearanceSettings } = useAppearance();
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const [getShortId, setGetShortId] = useState(null);
  const [showComment, setShowComment] = useState(true);
  const [functionCalled, setFunctionCalled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const { short, shortLoading, shortError } = useSelector((state) => state.shorts);

  useEffect(() => {
    setFunctionCalled(false);
  }, [getShortId]);

  useEffect(() => {
    if (currentTime >= 3 && !functionCalled) {
      props.fetchViewCounter(getShortId);
      setFunctionCalled(true);
    }
  }, [getShortId, props.fetchViewCounter, functionCalled, currentTime]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      window.location.reload();
    }, 2000);
  };

  const handleLikeToggle = (ids) => {
    dispatch(fetchLikeToggleShort(ids));
    dispatch(isShortLiked(ids));
  }

  const handleShortComment = (ids) => {
    setShowComment(!showComment)
    dispatch(fetchShortComment(ids));
  }

  const handleSubcribeToggle = (ids) => {
    dispatch(fetchSubcribeToggle(ids))
  }

  const handleAllOverEvent = (e) => {
    const targetId = e.target.id;
    const targetName = e.target.getAttribute("name");
    const evenType = e.type;

    console.log(targetId, targetName, evenType, e.target);

    if ((targetName === "body" || targetName === 'play') && evenType === 'click') {
      const shorts = document.getElementsByName('short');
      const targetedShort = Array.from(shorts).find((short) => short.id === targetId);
      console.log(targetedShort, e.target.id)
      if (isPlaying) {
        targetedShort.pause();
      } else {
        targetedShort.play();
      }
      setIsPlaying(!isPlaying);
      return
    }

    if (targetName === "body" && evenType === 'dblclick') {
      handleLikeToggle(targetId);
      return;
    }

    if ((targetName === "like" || targetName === "heart") && evenType === "click") {
      handleLikeToggle(targetId);
      return;
    }

    if ((targetName === 'comment' || targetName === 'messages')) {
      handleShortComment(targetId);
      return;
    }

    if (targetName === 'share' || targetName === "shares") {
      console.log("nothing to do share bth");
      return;
    }

    if (targetName === 'download' || targetName === "downloads") {
      console.log("nothing to do download btn");
      return;
    }

    if (targetName === "more") {
      console.log("nothing to do more btn");
      return;
    }

    if (targetName === "avatar" && evenType === 'click') {
      const username = e.target.getAttribute('data-username');
      Navigate(`/channel/${username}`);
      return;
    }

    if (targetName === 'subcribe' && evenType === "click") {
      handleSubcribeToggle(targetId);
      return;
    }

    if (targetName === "mute") {
      e.stopPropagation();
      e.preventDefault();

      const shorts = document.getElementsByName('short');
      const targetedShort = Array.from(shorts).find((short) => short.id === targetId);
      if (evenType === 'click') {
        const newMutedState = !targetedShort.muted;
        targetedShort.muted = newMutedState;
        setIsMuted(!isMuted);
        return;
      }
    }

    if (targetName === "setting" && evenType === 'click') {
      setShowSettings(!showSettings);
    }
  }

  return (
    <div
      className="w-full h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] transition-all"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family)',
        transitionDuration: 'var(--animation-duration)'
      }}
      role="main"
      aria-label="Short videos feed"
    >
      <div>
        {shortError && (
          <div
            className="text-center py-16 px-6 transition-all"
            style={{
              padding: 'var(--component-padding)',
              transitionDuration: 'var(--animation-duration)'
            }}
            role="alert"
            aria-live="polite"
          >
            <div className="max-w-md mx-auto">
              {/* Error Icon with Animation */}
              <div
                className="mb-6"
                style={{ marginBottom: 'var(--section-gap)' }}
              >
                <div
                  className="mx-auto w-24 h-24 rounded-full flex items-center justify-center relative"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  }}
                >
                  <WifiOff
                    className="w-12 h-12"
                    style={{ color: 'var(--color-error)' }}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 rounded-full border-2 animate-pulse"
                    style={{
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                      animationDuration: appearanceSettings.reducedMotion ? '0s' : '2s'
                    }}
                  />
                </div>
              </div>

              <h3
                className="text-xl font-semibold mb-3"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-xl)',
                  fontFamily: 'var(--font-family)',
                  marginBottom: 'var(--spacing-unit)'
                }}
              >
                No internet connection
              </h3>
              <p
                className="mb-8"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-base)',
                  marginBottom: 'var(--section-gap)'
                }}
              >
                Please check your network connection and try again. Your feed will load once you're back online.
              </p>

              <div
                className="space-y-4"
                style={{ gap: 'var(--spacing-unit)' }}
              >
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                  style={{
                    backgroundColor: isRetrying ? 'var(--color-text-secondary)' : 'var(--accent-color)',
                    opacity: isRetrying ? '0.6' : '1',
                    cursor: isRetrying ? 'not-allowed' : 'pointer',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-family)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isRetrying) {
                      e.target.style.opacity = '0.9';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isRetrying) {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                  aria-label={isRetrying ? "Checking connection..." : "Try to reconnect"}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${isRetrying && !appearanceSettings.reducedMotion ? 'animate-spin' : ''}`}
                    style={{
                      animationDuration: !appearanceSettings.reducedMotion ? '1s' : '0s'
                    }}
                  />
                  <span>{isRetrying ? 'Checking...' : 'Try Again'}</span>
                </button>

                <div
                  className="text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  <p>Make sure you're connected to Wi-Fi or mobile data</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {shortLoading === true ? (
          <div
            role="status"
            aria-label="Loading short videos"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            <ShortSkeletonLoading />
          </div>
        ) : (
          <div
            className="h-full max-h-screen transition-all"
            style={{
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            <div
              className={`items-center flex ${showComment ? "justify-center" : "justify-evenly"
                } snap-y h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] max-sm:p-0 snap-mandatory max-sm:overflow-hidden scroll-smooth overflow-x-hidden overflow-y-auto transition-all`}
              style={{
                transitionDuration: 'var(--animation-duration)'
              }}
              role="region"
              aria-label="Short videos player"
            >
              {/* Main Video Container */}
              <div
                className="h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] overflow-y-auto snap-y snap-mandatory scrollBar scroll-smooth transition-all"
                style={{
                  transitionDuration: 'var(--animation-duration)'
                }}
                role="list"
                aria-label={`${short?.length || 0} short videos`}
              >
                <div
                  className="sm:pt-3 sm:pb-6 sm:space-y-3"
                  style={{
                    paddingTop: 'var(--spacing-unit)',
                    paddingBottom: 'var(--section-gap)',
                    gap: 'var(--spacing-unit)'
                  }}
                >
                  {short?.map((shortVideo, index) => (
                    <div
                      key={shortVideo._id}
                      className="snap-start transition-all"
                      style={{
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      role="listitem"
                      aria-posinset={index + 1}
                      aria-setsize={short.length}
                    >
                      <ShortCard
                        short={shortVideo}
                        id={shortVideo._id}
                        activeShort={setGetShortId}
                        commentPart={{ showComment, setShowComment }}
                        fetchViewCounter={props.fetchViewCounter}
                        currentTime={{ currentTime, setCurrentTime }}
                        handleAllOverEvent={handleAllOverEvent}
                        playing={{ isPlaying, setIsPlaying }}
                        muted={{ isMuted, setIsMuted }}
                        settingBtn={{ showSettings, setShowSettings }}
                        aria-label={`Short video by ${shortVideo?.owner?.username}: ${shortVideo?.title}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Comments Panel */}
              <div
                className={`${showComment ? "translate-x-[200%] absolute" : ""
                  } ${window.innerWidth < 768 ? "hidden" : ""} z-22 shadow-2xl rounded-lg right-0 ml-2 transition-all w-96 duration-500 h-full`}
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--spacing-unit)',
                  transitionDuration: appearanceSettings.reducedMotion ? '0s' : '0.5s',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
                role="complementary"
                aria-label="Video comments"
                aria-hidden={showComment}
              >
                <Comments
                  whichContent={"shorts"}
                  contentId={getShortId}
                  toggle={{ showComment, setShowComment }}
                />
              </div>
            </div>

            {/* Mobile Comments Panel */}
            <div
              className={`${showComment ? "" : "max-md:-translate-y-[70%]"
                } ${window.innerWidth >= 768 ? "hidden" : ""} z-22 shadow-2xl max-md:rounded-t-2xl transition-all duration-500 h-[70%] max-sm:mx-0`}
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderTopLeftRadius: 'var(--spacing-unit)',
                borderTopRightRadius: 'var(--spacing-unit)',
                transitionDuration: appearanceSettings.reducedMotion ? '0s' : '0.5s',
                boxShadow: '0 -25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              role="complementary"
              aria-label="Video comments"
              aria-hidden={showComment}
            >
              <Comments
                whichContent={"shorts"}
                contentId={getShortId}
                toggle={{ showComment, setShowComment }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Short;
