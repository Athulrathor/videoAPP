import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import VideoPages from "./VideoPages";
import VideoSkeletonLoading from "../components/LoadingScreen/VideoSkeletonLoading";
import { RefreshCw, WifiOff } from "lucide-react";
import { useAppearance } from "../hooks/appearances";

const Videos = (props) => {
  const { timeAgo, formatTime } = props;
  const { appearanceSettings } = useAppearance();
  const navigate = useNavigate();

  const { videos, videoLoading, videoError } = useSelector((state) => state.videos);

  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isRetrying, setIsRetrying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColumnsCount = () => {
    if (viewportWidth >= 1440) return 4;
    if (viewportWidth >= 1280) return 3;
    if (viewportWidth >= 1024) return 3;
    if (viewportWidth >= 768) return 2;
    return 1;
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      window.location.reload();
    }, 2000);
  };

  // All your existing event handling logic remains the same...
  const handleOverAllEvent = (e) => {
    const targetId = e.target.id;
    const targetName = e.target.getAttribute('name');
    const eventType = e.type;

    console.log(targetId, e.target.tagName, eventType);

    if (eventType === 'click' && (
      targetName?.includes('mute-button') || targetName?.includes('mute-button1') || targetName?.includes('mute-button2') || e.target.tagName === 'path' ||
      e.target.tagName === 'line' || e.target.tagName === 'svg'
    )) {
      e.stopPropagation();
      e.preventDefault();

      const videoElements = document.getElementsByName('video');
      const targetedVideo = Array.from(videoElements).find((video) => video.id === targetId);

      const newMutedState = !targetedVideo.muted;
      targetedVideo.muted = newMutedState;
      setMuted(newMutedState);
      return;
    }

    if ((targetName === "title" || targetName === "video" || targetName === "control-container") && eventType === 'click') {
      navigate(`/video/${targetId}`);
      return;
    }

    if ((targetName === "avatar" || targetName === "username") && eventType === 'click') {
      const videoElements = document.getElementsByName('video');
      const targetedVideo = Array.from(videoElements).find((video) => video.id === targetId);
      console.log("from avatar or username element: ", targetId, targetedVideo);
      const username = targetedVideo.getAttribute('data-username');
      if (username) {
        navigate(`/channel/${username}`);
      }
      return;
    }

    if (targetName === "progress" || targetName === "video" || targetName === "control-container" || targetName === "control-container1") {
      const videoElements = document.getElementsByName('video');
      const targetedVideo = Array.from(videoElements).find((video) => video.id === targetId);

      if (!targetedVideo) return;

      if (eventType === 'mouseenter') {
        if (targetedVideo.hoverTimeout) {
          clearTimeout(targetedVideo.hoverTimeout);
        }

        if (eventType === 'click') {
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
        console.log(targetedVideo);
        if (targetedVideo.hoverTimeout) {
          clearTimeout(targetedVideo.hoverTimeout);
        }

        targetedVideo.hoverTimeout = setTimeout(() => {
          targetedVideo.pause();
          targetedVideo.currentTime = 0;
        }, 500);
      }
      return;
    }
  };

  return (
    <div
      className="min-h-screen w-full transition-all"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        transitionDuration: 'var(--animation-duration)'
      }}
    >
      {/* Video Grid */}
      <div
        className="scrollBar max-w-full max-md:w-screen mx-auto overflow-y-scroll h-[calc(100vh-65px)] max-md:h-[calc(100vh-53px)] max-sm:h-[calc(100vh-39px)] max-sm:pb-6 max-md:px-0 px-2 transition-all"
        role="main"
        aria-label="Video feed"
        style={{
          transitionDuration: 'var(--animation-duration)'
        }}
      >
        {(!videoError || videos.length > 0) ? (
          <div>
            {videoLoading ? (
              <div role="status" aria-label="Loading videos">
                <VideoSkeletonLoading />
              </div>
            ) : (
              <div
                name="video-body"
                className={`grid gap-x-6 gap-y-6 transition-all ${getColumnsCount() === 4 ? 'grid-cols-4' :
                    getColumnsCount() === 3 ? 'grid-cols-3' :
                      getColumnsCount() === 2 ? 'grid-cols-2' :
                        'grid-cols-1'
                  }`}
                style={{
                  gap: 'var(--section-gap)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                role="grid"
                aria-label={`Video grid with ${videos.length} videos`}
              >
                {videos.map((video, index) => (
                  <VideoCard
                    key={video._id || video.id}
                    video={video}
                    handleOverAllEvent={handleOverAllEvent}
                    muted={muted}
                    timeAgo={timeAgo}
                    formatTime={formatTime}
                    role="gridcell"
                    tabIndex={0}
                    aria-posinset={index + 1}
                    aria-setsize={videos.length}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
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
                {/* Wifi Off Icon with animation */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
