import { CheckCircle, MoreVertical, Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppearance } from '../hooks/appearances';

const VideoCard = ({ video, timeAgo, formatTime, muted, handleOverAllEvent }) => {
  const { appearanceSettings } = useAppearance();
  const createrVideoRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleOnTimeUpdate = useCallback(() => {
    const videoElement = createrVideoRef.current;
    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
      setProgress((videoElement.currentTime / videoElement.duration) * 100);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const videoElement = createrVideoRef.current;
    if (videoElement) {
      setDuration(videoElement.duration);
    }
  }, []);

  useEffect(() => {
    const videoElement = createrVideoRef.current;
    if (!videoElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    const handleMuteToggle = (event) => {
      if (event.detail.videoId === video._id) {
        const videoElement = createrVideoRef.current;
        if (videoElement) {
          videoElement.muted = event.detail.muted;
        }
      }
    };

    document.addEventListener('videoMuteToggle', handleMuteToggle);
    return () => document.removeEventListener('videoMuteToggle', handleMuteToggle);
  }, [video._id]);

  return (
    <div
      name="video-container"
      className="flex flex-col cursor-pointer group max-sm:mt-2 max-md:mt-3 mt-4 overflow-hidden transition-all"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        transitionDuration: 'var(--animation-duration)'
      }}
      role="listitem"
      aria-label={`Video: ${video.title} by ${video?.userInfo?.username}`}
    >
      {/* Thumbnail Container */}
      <div className="relative w-full">
        <div
          name="video-container"
          className="aspect-video rounded-lg max-md:rounded-none overflow-hidden transition-all"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          <div
            id={video._id}
            name="video-cover"
            onClick={handleOverAllEvent}
            onMouseEnter={handleOverAllEvent}
            onMouseLeave={handleOverAllEvent}
            className="h-full relative overflow-hidden transition-all"
            style={{
              backgroundColor: '#000000',
              transitionDuration: 'var(--animation-duration)'
            }}
            role="button"
            tabIndex={0}
            aria-label={`Play ${video.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOverAllEvent(e);
              }
            }}
          >
            <video
              src={video.videoFile}
              poster={video.thumbnail}
              loading="lazy"
              id={video._id}
              name="video"
              ref={createrVideoRef}
              onTimeUpdate={handleOnTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              data-username={video?.userInfo?.username}
              muted={muted}
              className="object-contain w-full h-full aspect-video overflow-hidden"
              aria-label={`Video player for ${video.title}`}
            />

            {/* Control Overlay */}
            <div
              id={video._id}
              name="control-container"
              className="absolute inset-0 items-end h-full flex-col opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto"
              style={{
                transitionDuration: appearanceSettings.reducedMotion ? '0s' : 'var(--animation-duration)'
              }}
            >
              {/* Mute/Unmute Button */}
              <div
                id={video._id}
                name="control-container"
                className="absolute h-full right-0 pointer-events-auto"
              >
                <button
                  id={video._id}
                  name="mute-button"
                  className="p-1.5 mt-2 mr-2 rounded-full transition-all"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-accent-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                  }}
                  aria-label={muted ? "Unmute video" : "Mute video"}
                  aria-pressed={muted}
                  tabIndex={0}
                >
                  {muted ? (
                    <VolumeX
                      size={18}
                      name="mute-button1"
                      id={video._id}
                      color="white"
                      aria-hidden="true"
                    />
                  ) : (
                    <Volume2
                      size={18}
                      name="mute-button2"
                      id={video._id}
                      color="white"
                      aria-hidden="true"
                    />
                  )}
                </button>

                {/* Duration Badge */}
                <div
                  className="z-20 absolute right-1.5 bottom-1.5"
                  role="timer"
                  aria-label={`Duration: ${formatTime(duration)}`}
                >
                  <div
                    className="text-white text-xs px-2 py-1 rounded font-medium"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      fontSize: 'var(--font-size-xs)',
                      fontFamily: 'var(--font-family)'
                    }}
                  >
                    {isPlaying ? formatTime(duration - currentTime) : formatTime(duration)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                name="progress"
                className="bottom-0 absolute z-16 w-full flex h-1 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label={`Video progress: ${Math.round(progress)}%`}
              >
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: 'var(--accent-color)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div
        name="info"
        className="flex mt-3 mx-3 gap-3 transition-all"
        style={{
          marginTop: 'var(--spacing-unit)',
          gap: 'var(--spacing-unit)',
          transitionDuration: 'var(--animation-duration)'
        }}
      >
        {/* Channel Avatar */}
        <div
          id={video._id}
          name="avatar"
          className="flex-shrink-0"
        >
          <img
            src={video?.userInfo?.avatar}
            alt={`${video?.userInfo?.username}'s avatar`}
            loading="lazy"
            name="avatar"
            onClick={handleOverAllEvent}
            id={video._id}
            className="w-9 h-9 rounded-full cursor-pointer transition-all"
            style={{
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
            tabIndex={0}
            role="button"
            aria-label={`Visit ${video?.userInfo?.username}'s channel`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOverAllEvent(e);
              }
            }}
          />
        </div>

        {/* Video Details */}
        <div name="title" className="flex-1 min-w-0">
          <h3
            id={video._id}
            name="title"
            onClick={handleOverAllEvent}
            className="max-sm:text-lg text-xl font-medium line-clamp-2 leading-5 cursor-pointer transition-all"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-xl)',
              fontFamily: 'var(--font-family)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--accent-color)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--color-text-primary)';
            }}
            role="button"
            tabIndex={0}
            aria-label={`Watch: ${video.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOverAllEvent(e);
              }
            }}
          >
            {video.title}
          </h3>

          <div
            className="mt-1"
            // style={{ marginTop: 'var(--spacing-unit)' }}
          >
            <div
              className="text-sm mt-0.5 transition-colors"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              <span
                onClick={handleOverAllEvent}
                id={video._id}
                name="username"
                className="space-x-1 cursor-pointer transition-colors"
                style={{
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--accent-color)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--color-text-secondary)';
                }}
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
              </span>
              <span
                className="mx-1"
                style={{ color: 'var(--color-text-secondary)' }}
                aria-hidden="true"
              >
                •
              </span>
              <span className="space-x-1">
                {video.views} views
              </span>
              <span
                className="mx-1"
                style={{ color: 'var(--color-text-secondary)' }}
                aria-hidden="true"
              >
                •
              </span>
              <span>{timeAgo(video.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Options Menu */}
        <div className="flex-shrink-0">
          <button
            id={video._id}
            name="more-btn"
            className="p-1 opacity-0 group-hover:opacity-100 rounded-full transition-all"
            style={{
              backgroundColor: 'transparent',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-hover)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
            aria-label={`More options for ${video.title}`}
            tabIndex={0}
          >
            <MoreVertical
              className="w-4 h-4"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
