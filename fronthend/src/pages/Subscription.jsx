import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Bell, Heart, Rss, TrendingUp, UserPlus, Users, Volume2, VolumeX } from 'lucide-react';
import { subcribedUserContent } from '../redux/features/subcribers';
import { useDispatch, useSelector } from 'react-redux';
import { setSideActive } from '../redux/features/user';
import { useAppearance } from '../hooks/appearances';

const Subscription = (props) => {
  const { timeAgo, formatTime } = props;
  const { appearanceSettings } = useAppearance();

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { subcribedContent } = useSelector(state => state.subscriber);

  const [videoStatus, setVideoStatus] = useState({
    isPlaying: false,
    isMuted: false,
    showControl: false,
    duration: 0,
  });

  useEffect(() => {
    dispatch(subcribedUserContent());
  }, [dispatch]);

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
    <div
      className="h-[90vh] max-md:h-screen max-md:w-screen scroll-smooth overflow-y-scroll scrollBar"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        fontFamily: 'var(--font-family)'
      }}
      role="main"
      aria-label="Subscription feed"
    >
      {/* Title */}
      <div
        className="w-full flex items-center font-bold text-2xl max-md:text-lg max-sm:text-sm p-2"
        style={{
          color: 'var(--color-text-primary)',
          fontSize: 'var(--font-size-2xl)',
          fontFamily: 'var(--font-family)',
          padding: 'var(--spacing-unit)'
        }}
      >
        <h1>Subscribed Content</h1>
      </div>

      {/* Video List */}
      {subcribedContent?.videos?.length > 0 ? (
        <div
          className="w-[calc(190px - 100%)] px-2 space-y-3 h-[calc(113px - 100vh)]"
          style={{
            padding: 'var(--spacing-unit)',
            gap: 'var(--spacing-unit)'
          }}
          role="list"
          aria-label="Subscribed videos"
        >
          {subcribedContent?.videos.map((video) => (
            <div
              key={video._id}
              className="flex h-fit transition-all"
              onClick={handleOverAllEvent}
              id={video._id}
              name="container"
              style={{
                transitionDuration: 'var(--animation-duration)',
                padding: 'var(--spacing-unit)',
                borderRadius: '12px',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-hover)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              role="listitem"
              aria-label={`Video: ${video?.title} by ${video?.owner?.username}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  Navigate(`/video/${video._id}`);
                }
              }}
            >
              {/* Video */}
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
                  className="bg-black aspect-video rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg-tertiary)',
                    borderRadius: '12px'
                  }}
                  aria-label={`Video player for ${video?.title}`}
                />
                <div className={`absolute inset-0 p-2`}>
                  <div className="flex justify-end">
                    <button
                      onClick={handleOverAllEvent}
                      name='volume'
                      id={video._id}
                      className={`${videoStatus[video._id]?.showControl ? "" : "hidden"
                        } z-13 p-2 rounded-full transition-all duration-75`}
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
                  <div
                    name="duration"
                    id={video._id}
                    className="absolute inset-0 flex items-end justify-end bottom-0 p-2 rounded-[10px] max-lg:text-[2vw] text-lg"
                  >
                    <h1
                      name="duration"
                      className="text-white rounded-md px-1 py-0.1"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        fontSize: 'var(--font-size-sm)',
                        fontFamily: 'var(--font-family)',
                        padding: 'calc(var(--spacing-unit) * 0.25) calc(var(--spacing-unit) * 0.5)'
                      }}
                    >
                      {videoStatus[video._id]?.duration ? formatTime(video?.duration - videoStatus[video._id]?.duration) : formatTime(video?.duration)}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Video Details */}
              <div
                className="max-w-96 max-md:w-[60%] flex-col flex py-1 pl-2"
                style={{ padding: 'var(--spacing-unit)' }}
              >
                {/* Title */}
                <div
                  className="line-clamp-2 w-full font-medium text-3xl pb-2 max-sm:pb-0 max-sm:text-lg max-md:text-2xl cursor-pointer transition-colors"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-2xl)',
                    fontFamily: 'var(--font-family)',
                    paddingBottom: 'var(--spacing-unit)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--accent-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--color-text-primary)';
                  }}
                >
                  <h2
                    onClick={handleOverAllEvent}
                    id={video._id}
                    name="title"
                    tabIndex={0}
                    role="button"
                    aria-label={`Play video: ${video?.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        Navigate(`/video/${video._id}`);
                      }
                    }}
                  >
                    {video?.title}
                  </h2>
                </div>
                <div className="flex">
                  <div className="items-baseline hidden">
                    <img
                      src={video?.owner?.avatar}
                      alt={`${video?.owner?.username}'s avatar`}
                      name="avatar"
                      data-username={video?.owner?.username}
                      onClick={handleOverAllEvent}
                      id={video._id}
                      className="w-6 mr-3 max-sm:w-6 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg cursor-pointer"
                      style={{ marginRight: 'var(--spacing-unit)' }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Visit ${video?.owner?.username}'s channel`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          Navigate(`/channel/${video?.owner?.username}`);
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    {/* User name */}
                    <div
                      className="mb-1 text-xs font-normal max-md:text-xs cursor-pointer transition-colors"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)',
                        marginBottom: 'var(--spacing-unit)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--accent-color)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--color-text-secondary)';
                      }}
                    >
                      <h3
                        onClick={handleOverAllEvent}
                        data-username={video?.owner?.username}
                        name="username"
                        id={video._id}
                        tabIndex={0}
                        role="button"
                        aria-label={`Visit ${video?.owner?.username}'s channel`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            Navigate(`/channel/${video?.owner?.username}`);
                          }
                        }}
                      >
                        {video?.owner?.username}
                      </h3>
                    </div>
                    {/* View and time ago */}
                    <div
                      className="text-[11px] font-normal max-md:text-[11px] space-x-1.5"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)',
                        gap: 'calc(var(--spacing-unit) * 0.75)'
                      }}
                    >
                      <span aria-label={`${video?.views} views`}>{video?.views} views</span>
                      <span aria-hidden="true">•</span>
                      <time dateTime={video?.createdAt}>
                        {timeAgo(video?.createdAt) || "12 year ago"}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          className="text-center py-16 px-6"
          style={{
            padding: 'var(--section-gap) var(--component-padding)',
            color: 'var(--color-text-primary)'
          }}
          role="region"
          aria-label="No subscriptions available"
        >
          <div className="max-w-lg mx-auto">
            {/* Connected users illustration */}
            <div
              className="mb-8"
              style={{
                marginBottom: 'var(--section-gap)',
                animation: appearanceSettings.reducedMotion ? 'none' : 'float 3s ease-in-out infinite'
              }}
            >
              <div
                className="mx-auto w-32 h-32 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-bg), var(--color-bg-tertiary))'
                }}
              >
                <Users
                  className="w-16 h-16"
                  style={{ color: 'var(--accent-color)' }}
                />
                {/* Connection lines */}
                <div className="absolute top-4 right-8">
                  <div
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    <UserPlus
                      className="w-4 h-4"
                      style={{ color: 'var(--accent-color)' }}
                    />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6">
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    <Heart
                      className="w-3 h-3"
                      style={{ color: 'var(--color-success)' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <h3
              className="text-2xl font-bold mb-4"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-2xl)',
                fontFamily: 'var(--font-family)',
                marginBottom: 'var(--spacing-unit)'
              }}
            >
              Start building your network
            </h3>
            <p
              className="mb-8 leading-relaxed"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-base)',
                marginBottom: 'var(--section-gap)',
                lineHeight: '1.6'
              }}
            >
              Follow creators and users to see their latest content in your feed. Build a personalized experience around people you're interested in.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              style={{
                gap: 'var(--spacing-unit)',
                marginBottom: 'var(--section-gap)'
              }}
            >
              <button
                onClick={() => dispatch(setSideActive("home"))}
                className="text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
                  padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 1.5)',
                  gap: 'var(--spacing-unit)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  if (!appearanceSettings.reducedMotion) {
                    e.target.style.transform = 'translateY(-2px)';
                  }
                  e.target.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  if (!appearanceSettings.reducedMotion) {
                    e.target.style.transform = 'translateY(0)';
                  }
                  e.target.style.opacity = '1';
                }}
                aria-label="Discover new creators"
              >
                <UserPlus className="w-5 h-5" />
                <span>Discover Creators</span>
              </button>
              <button
                onClick={() => dispatch(setSideActive("home"))}
                className="px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-primary)',
                  padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 1.5)',
                  gap: 'var(--spacing-unit)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-hover)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                aria-label="See popular content"
              >
                <TrendingUp className="w-5 h-5" />
                <span>See Popular</span>
              </button>
            </div>

            {/* Benefits */}
            <div
              className="grid grid-cols-3 gap-4 mt-8"
              style={{
                gap: 'var(--spacing-unit)',
                marginTop: 'var(--section-gap)'
              }}
            >
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{
                    backgroundColor: 'var(--color-success-bg)',
                    marginBottom: 'var(--spacing-unit)'
                  }}
                >
                  <Rss
                    className="w-5 h-5"
                    style={{ color: 'var(--color-success)' }}
                  />
                </div>
                <p
                  className="text-xs"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-xs)'
                  }}
                >
                  Personalized Feed
                </p>
              </div>
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{
                    backgroundColor: 'var(--color-warning-bg)',
                    marginBottom: 'var(--spacing-unit)'
                  }}
                >
                  <Bell
                    className="w-5 h-5"
                    style={{ color: 'var(--color-warning)' }}
                  />
                </div>
                <p
                  className="text-xs"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-xs)'
                  }}
                >
                  New Content Alerts
                </p>
              </div>
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{
                    backgroundColor: 'var(--color-accent-bg)',
                    marginBottom: 'var(--spacing-unit)'
                  }}
                >
                  <Heart
                    className="w-5 h-5"
                    style={{ color: 'var(--accent-color)' }}
                  />
                </div>
                <p
                  className="text-xs"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-xs)'
                  }}
                >
                  Support Creators
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Region for Video Status */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {Object.entries(videoStatus).map(([videoId, status]) => {
          if (status.showControl) {
            return `Video controls visible for video ${videoId}`;
          }
          return '';
        }).filter(Boolean).join(', ')}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Subscription;
