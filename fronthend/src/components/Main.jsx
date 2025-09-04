import React,{ lazy } from "react";
import { useSelector } from "react-redux";
import Channel from "../pages/Channel";
import History from "../pages/History";

const Videos = lazy(() => import('../pages/Videos'))
const Short = lazy(() => import("../pages/Short"));
const Playlist = lazy(() => import("../pages/Playlist"));
const Subscription = lazy(() => import("../pages/Subscription"));
const UserVideos = lazy(() => import("../pages/UserVideos"));
const LikedVideos = lazy(() => import("../pages/LikedVideos"));
const Settings = lazy(() => import("../pages/Settings"));
const ContentManaging = lazy(() => import("../pages/ContentManaging"));

const Main = ({ setToggleVideoUploading, toggleVideoUploading, timeAgo, videoLoading, showMenu, fetchViewCounter }) => {



  const { sideActive } = useSelector(state => state.user);

  const mainWidth = showMenu;

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
  
  return (
    <main
      className={`flex flex-col w-full h-full bg-[#f9f9f9]`}
    >
      {(sideActive === "home" ? (
        <Videos
          timeAgo={timeAgo}
          videoLoading={videoLoading}
          formatTime={formatTime}
          setToggleVideoUploading={setToggleVideoUploading}
          toggleVideoUploading={toggleVideoUploading}
        />
      ) : (
        ""
      )) ||
        (sideActive === "shorts" ? (
          <Short
            width={showMenu}
            timeAgo={timeAgo}
            formatTime={formatTime}
          fetchViewCounter={fetchViewCounter}
          setToggleVideoUploading={setToggleVideoUploading}
          toggleVideoUploading={toggleVideoUploading}
          />
        ) : (
          ""
        )) ||
        (sideActive === "subscription" ? (
          <Subscription
            timeAgo={timeAgo}
          formatTime={formatTime}
          setToggleVideoUploading={setToggleVideoUploading}
          toggleVideoUploading={toggleVideoUploading}
          />
        ) : (
          ""
        )) ||
        (sideActive === "history" ? <History timeAgo={timeAgo}
          formatTime={formatTime} /> : "") ||
        (sideActive === "playlists" ? <Playlist
          timeAgo={timeAgo}
          formatTime={formatTime} /> : "") ||
        (sideActive === "your videos" ? (
          <UserVideos
            timeAgo={timeAgo}
          formatTime={formatTime}
          setToggleVideoUploading={setToggleVideoUploading}
          toggleVideoUploading={toggleVideoUploading}
          />
        ) : (
          ""
        )) ||
        (sideActive === "watch later" ? <WatchLater /> : "") ||
        (sideActive === "likedVideos" ? (
          <LikedVideos
            timeAgo={timeAgo}
          formatTime={formatTime}
          setToggleVideoUploading={setToggleVideoUploading}
          toggleVideoUploading={toggleVideoUploading}
          />
        ) : (
          ""
        )) ||
        (sideActive === "trending" ? <Trending /> : "") ||
        (sideActive === "music" ? <Music /> : "") ||
        (sideActive === "gaming" ? <Gaming /> : "") ||
        (sideActive === "sports" ? <Sports /> : "") ||
        (sideActive === "setting" ? <Settings setToggleVideoUploading={setToggleVideoUploading}
          toggleVideoUploading={toggleVideoUploading} /> : "") ||
        (sideActive === "report history" ? <ReportHistory /> : "") ||
        (sideActive === "help" ? <Help /> : "") ||
        (sideActive === "feedback" ? <Feedback /> : "") ||
        (sideActive === "Manage Videos" ? <ContentManaging /> : "")}
    </main>
  );
};

export default Main;
