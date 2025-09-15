import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Video, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useSelector } from "react-redux";
import UploadVideo from '../components/UploadVideo';
import { useAppearance } from '../hooks/appearances';

const UserVideos = ({ toggleVideoUploading, setToggleVideoUploading, timeAgo, formatTime }) => {
  const { appearanceSettings } = useAppearance();
  const { videoByOwner } = useSelector(state => state.videos);
  const Navigate = useNavigate();

  const [videoStatus, setVideoStatus] = useState({
    isPlaying: false,
    isMuted: false,
    showControl: false,
    duration: 0,
  });

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
      <UploadVideo toggleVideoUploading={toggleVideoUploading} setToggleVideoUploading={setToggleVideoUploading} />
      <div
        className="h-full w-full overflow-y-scroll scrollBar"
        style={{
          backgroundColor: appearanceSettings.customBackground ? 'transparent' : "var(--color-bg-primary)",
          fontFamily: 'var(--font-family)'
        }}
        role="main"
        aria-label="User videos"
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
          <h1>User Videos</h1>
        </div>

        {/* Empty State */}
        {videoByOwner.length === 0 ? (
          <div
            className="text-center py-16 px-6 max-md:w-screen"
            style={{
              padding: 'var(--section-gap) var(--component-padding)',
              color: 'var(--color-text-primary)'
            }}
            role="region"
            aria-label="No videos uploaded"
          >
            <div className="max-w-lg mx-auto">
              {/* Upload illustration */}
              <div
                className="mb-8 relative"
                style={{
                  marginBottom: 'var(--section-gap)',
                  animation: appearanceSettings.reducedMotion ? 'none' : 'float 3s ease-in-out infinite'
                }}
              >
                <div
                  className="mx-auto w-32 h-32 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-accent-bg), var(--color-bg-tertiary))'
                  }}
                >
                  <Video
                    className="w-16 h-16"
                    style={{ color: 'var(--accent-color)' }}
                  />
                </div>
                {/* Floating upload icons */}
                <div
                  className={`absolute top-4 right-8 w-10 h-10 rounded-full flex items-center justify-center`}
                  style={{
                    backgroundColor: 'var(--color-success)',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'bounce 2s infinite'
                  }}
                >
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div
                  className={`absolute bottom-6 left-6 w-8 h-8 rounded-full flex items-center justify-center`}
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s infinite'
                  }}
                >
                  <Plus className="w-4 h-4 text-white" />
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
                Share your story with the world
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
                Upload your first video to start building your channel. Whether it's a tutorial, vlog, or creative content - every journey starts with one video.
              </p>

              <div
                className="space-y-4 mb-8"
                style={{
                  gap: 'var(--spacing-unit)',
                  marginBottom: 'var(--section-gap)'
                }}
              >
                <button
                  onClick={() => setToggleVideoUploading(false)}
                  className="w-full mx-auto sm:w-auto text-white px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 max-sm:text-sm text-lg font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
                    padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 2)',
                    gap: 'var(--spacing-unit)',
                    fontSize: 'var(--font-size-lg)',
                    fontFamily: 'var(--font-family)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    if (!appearanceSettings.reducedMotion) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                    }
                    e.target.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    if (!appearanceSettings.reducedMotion) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                    }
                    e.target.style.opacity = '1';
                  }}
                  aria-label="Upload your first video"
                >
                  <Upload className="w-6 h-6" />
                  <span>Upload Your First Video</span>
                </button>
              </div>

              {/* Upload tips */}
              <div
                className="rounded-lg p-6 text-center"
                style={{
                  backgroundColor: 'var(--color-accent-bg)',
                  padding: 'var(--section-gap)'
                }}
              >
                <h4
                  className="font-semibold mb-4"
                  style={{
                    color: 'var(--accent-color)',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-family)',
                    marginBottom: 'var(--spacing-unit)'
                  }}
                >
                  Tips for your first upload:
                </h4>
                <div
                  className="grid md:grid-cols-2 text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                    gap: 'var(--spacing-unit)'
                  }}
                >
                  <div className="text-left">
                    <div
                      className="flex items-center space-x-2 mb-2"
                      style={{
                        gap: 'var(--spacing-unit)',
                        marginBottom: 'var(--spacing-unit)'
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: 'var(--accent-color)' }}
                      />
                      <span className="font-medium">Choose a catchy title</span>
                    </div>
                    <div
                      className="flex items-center space-x-2 mb-2"
                      style={{
                        gap: 'var(--spacing-unit)',
                        marginBottom: 'var(--spacing-unit)'
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: 'var(--accent-color)' }}
                      />
                      <span className="font-medium">Add a clear thumbnail</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div
                      className="flex items-center space-x-2 mb-2"
                      style={{
                        gap: 'var(--spacing-unit)',
                        marginBottom: 'var(--spacing-unit)'
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: 'var(--accent-color)' }}
                      />
                      <span className="font-medium">Write a good description</span>
                    </div>
                    <div
                      className="flex items-center space-x-2 mb-2"
                      style={{
                        gap: 'var(--spacing-unit)',
                        marginBottom: 'var(--spacing-unit)'
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: 'var(--accent-color)' }}
                      />
                      <span className="font-medium">Use relevant tags</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Video List */
          <div
            className="w-[calc(190px - 100%)] px-2 space-y-3 h-[calc(113px - 100vh)]"
            style={{
              padding: 'var(--spacing-unit)',
              gap: 'var(--spacing-unit)'
            }}
            role="list"
            aria-label="Your uploaded videos"
          >
            {videoByOwner?.map((video) => (
              <div
                key={video._id}
                className="flex h-fit transition-all"
                onClick={handleOverAllEvent}
                id={video._id}
                name="container"
                style={{
                  transitionDuration: 'var(--animation-duration)',
                  // padding: 'var(--spacing-unit)',
                  borderRadius: '12px',
                  backgroundColor: 'transparent'
                }}
                // onMouseEnter={(e) => {
                //   e.target.style.backgroundColor = 'var(--color-hover)';
                // }}
                // onMouseLeave={(e) => {
                //   e.target.style.backgroundColor = 'transparent';
                // }}
                role="listitem"
                aria-label={`Video: ${video?.title}`}
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
                    className="bg-black/90 aspect-video rounded-lg"
                    style={{
                      // backgroundColor: 'rgba(0,0,0,0.3)',
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
                          // backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--color-accent-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
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
                  style={{ paddingLeft: 'var(--spacing-unit)' }}
                >
                  <div
                    className="line-clamp-2 w-full font-medium text-3xl pb-1 max-sm:pb-0 max-sm:text-lg max-md:text-2xl cursor-pointer transition-colors"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-2xl)',
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
                        src={video?.userInfo?.avatar}
                        alt={`${video?.userInfo?.username}'s avatar`}
                        name="avatar"
                        data-username={video?.userInfo?.username}
                        onClick={handleOverAllEvent}
                        id={video._id}
                        className="w-6 mr-3 max-sm:w-6 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg cursor-pointer"
                        style={{ marginRight: 'var(--spacing-unit)' }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Visit ${video?.userInfo?.username}'s channel`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            Navigate(`/channel/${video?.userInfo?.username}`);
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
                          // marginBottom: 'var(--spacing-unit)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                        // onMouseEnter={(e) => {
                        //   e.target.style.color = 'var(--accent-color)';
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.target.style.color = 'var(--color-text-secondary)';
                        // }}
                      >
                        <h3
                          onClick={handleOverAllEvent}
                          data-username={video?.userInfo?.username}
                          name="username"
                          id={video._id}
                          tabIndex={0}
                          role="button"
                          aria-label={`Visit ${video?.userInfo?.username}'s channel`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              Navigate(`/channel/${video?.userInfo?.username}`);
                            }
                          }}
                        >
                          {video?.userInfo?.username}
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
          
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
            40%, 43% { transform: translateY(-10px); }
            70% { transform: translateY(-5px); }
            90% { transform: translateY(-2px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
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
    </>
  );
}

export default UserVideos;
