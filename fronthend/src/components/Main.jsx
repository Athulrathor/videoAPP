import React, { lazy, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAppearance } from '../hooks/appearances';
import Channel from "../pages/Channel";
import History from "../pages/History";

// Lazy loaded components for better performance
const Videos = lazy(() => import('../pages/Videos'))
const Short = lazy(() => import("../pages/Short"));
const Playlist = lazy(() => import("../pages/Playlist"));
const Subscription = lazy(() => import("../pages/Subscription"));
const UserVideos = lazy(() => import("../pages/UserVideos"));
const LikedVideos = lazy(() => import("../pages/LikedVideos"));
const Settings = lazy(() => import("../pages/Settings"));
const ContentManaging = lazy(() => import("../pages/ContentManaging"));

const Main = ({
  setToggleVideoUploading,
  toggleVideoUploading,
  timeAgo,
  videoLoading,
  showMenu,
  fetchViewCounter
}) => {
  const { appearanceSettings } = useAppearance();
  const { sideActive } = useSelector(state => state.user);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Component mapping for cleaner conditional rendering
  const componentMap = useMemo(() => ({
    home: (
      <Videos
        timeAgo={timeAgo}
        videoLoading={videoLoading}
        formatTime={formatTime}
        setToggleVideoUploading={setToggleVideoUploading}
        toggleVideoUploading={toggleVideoUploading}
      />
    ),
    shorts: (
      <Short
        width={showMenu}
        timeAgo={timeAgo}
        formatTime={formatTime}
        fetchViewCounter={fetchViewCounter}
        setToggleVideoUploading={setToggleVideoUploading}
        toggleVideoUploading={toggleVideoUploading}
      />
    ),
    subscription: (
      <Subscription
        timeAgo={timeAgo}
        formatTime={formatTime}
        setToggleVideoUploading={setToggleVideoUploading}
        toggleVideoUploading={toggleVideoUploading}
      />
    ),
    history: (
      <History
        timeAgo={timeAgo}
        formatTime={formatTime}
      />
    ),
    playlists: (
      <Playlist
        timeAgo={timeAgo}
        formatTime={formatTime}
      />
    ),
    "your videos": (
      <UserVideos
        timeAgo={timeAgo}
        formatTime={formatTime}
        setToggleVideoUploading={setToggleVideoUploading}
        toggleVideoUploading={toggleVideoUploading}
      />
    ),
    likedVideos: (
      <LikedVideos
        timeAgo={timeAgo}
        formatTime={formatTime}
        setToggleVideoUploading={setToggleVideoUploading}
        toggleVideoUploading={toggleVideoUploading}
      />
    ),
    settings: (
      <Settings
        setToggleVideoUploading={setToggleVideoUploading}
        toggleVideoUploading={toggleVideoUploading}
      />
    ),
    "Manage Videos": (
      <ContentManaging />
    )
  }), [
    timeAgo,
    videoLoading,
    formatTime,
    setToggleVideoUploading,
    toggleVideoUploading,
    showMenu,
    fetchViewCounter
  ]);

  // Get the current component to render
  const currentComponent = componentMap[sideActive];

  return (
    <main
      className="flex flex-col w-full h-full transition-all"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family)',
        transitionDuration: 'var(--animation-duration)'
      }}
      role="main"
      aria-label={`${sideActive} content`}
      tabIndex={-1}
      id="main-content"
    >
      {/* Error Boundary could be added here for production */}
      <React.Suspense
        fallback={
          <div
            className="flex items-center justify-center h-full w-full"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)'
            }}
            role="status"
            aria-live="polite"
            aria-label="Loading content"
          >
            <div
              className="flex flex-col items-center space-y-4"
              style={{ gap: 'var(--spacing-unit)' }}
            >
              {/* Loading Spinner */}
              <div
                className="w-12 h-12 border-4 border-solid rounded-full animate-spin"
                style={{
                  borderColor: 'var(--color-border)',
                  borderTopColor: 'var(--accent-color)',
                  animationDuration: appearanceSettings.reducedMotion ? '0s' : '1s'
                }}
                aria-hidden="true"
              />

              {/* Loading Text */}
              <div
                className="text-lg font-medium"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-lg)',
                  fontFamily: 'var(--font-family)'
                }}
              >
                Loading {sideActive}...
              </div>

              {/* Screen Reader Only Text */}
              <div className="sr-only">
                Please wait while we load the {sideActive} page content.
              </div>
            </div>
          </div>
        }
      >
        {/* Render the current component based on sideActive state */}
        {currentComponent || (
          <div
            className="flex items-center justify-center h-full w-full"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)'
            }}
            role="alert"
            aria-live="assertive"
          >
            <div
              className="text-center space-y-4"
              style={{ gap: 'var(--spacing-unit)' }}
            >
              <h2
                className="text-2xl font-bold"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-2xl)',
                  fontFamily: 'var(--font-family)'
                }}
              >
                Page Not Found
              </h2>
              <p
                className="text-lg"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-lg)',
                  fontFamily: 'var(--font-family)'
                }}
              >
                The requested page "{sideActive}" is not available.
              </p>
            </div>
          </div>
        )}
      </React.Suspense>
    </main>
  );
};

export default Main;
