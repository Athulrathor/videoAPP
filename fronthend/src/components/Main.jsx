import React,{ lazy } from "react";
import { useSelector } from "react-redux";
import { shortLoading } from "../redux/features/shorts";
import Channel from "../pages/Channel";

const Videos = lazy(() => import('../pages/Videos'))
const Short = lazy(() => import("../pages/Short"));
const Playlist = lazy(() => import("../pages/Playlist"));
const Subscription = lazy(() => import("../pages/Subscription"));
const UserVideos = lazy(() => import("../pages/UserVideos"));
const LikedVideos = lazy(() => import("../pages/LikedVideos"));
const Settings = lazy(() => import("../pages/Settings"));

const Main = (props) => {

  const { sideActive } = useSelector(state => state.user);

  const mainWidth = props.showMenu;

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
  
  return (
    <main
      className={`flex flex-col max-md:w-full ${
        mainWidth ? "w-[calc(100vw-66px)]" : "w-[calc(100vw-200px)]"
      } h-[calc(100vh - 65px)] bg-[#f9f9f9]`}
    >
      {(sideActive === "home" ? (
        <Videos
          timeAgo={props.timeAgo}
          videoLoading={props.videoLoading}
          formatTime={formatTime}
        />
      ) : (
        ""
      )) ||
        (sideActive === "shorts" ? (
          <Short
            width={props.showMenu}
            timeAgo={props.timeAgo}
            formatTime={formatTime}
            shortLoading={shortLoading}
            fetchLikeToggle={props.fetchLikeToggle}
            fetchViewCounter={props.fetchViewCounter}
          />
        ) : (
          ""
        )) ||
        (sideActive === "subscription" ? (
          <Subscription
            timeAgo={props.timeAgo}
            formatTime={formatTime}
          />
        ) : (
          ""
        )) ||
        (sideActive === "history" ? <History /> : "") ||
        (sideActive === "playlists" ? <Playlist /> : "") ||
        (sideActive === "your videos" ? (
          <UserVideos
            timeAgo={props.timeAgo}
            formatTime={formatTime}
          />
        ) : (
          ""
        )) ||
        (sideActive === "watch later" ? <WatchLater /> : "") ||
        (sideActive === "likedVideos" ? (
          <LikedVideos
            timeAgo={props.timeAgo}
            formatTime={formatTime}
          />
        ) : (
          ""
        )) ||
        (sideActive === "trending" ? <Trending /> : "") ||
        (sideActive === "music" ? <Music /> : "") ||
        (sideActive === "gaming" ? <Gaming /> : "") ||
        (sideActive === "sports" ? <Sports /> : "") ||
        (sideActive === "setting" ? <Settings /> : "") ||
        (sideActive === "report history" ? <ReportHistory /> : "") ||
        (sideActive === "help" ? <Help /> : "") ||
        (sideActive === "feedback" ? <Feedback /> : "")}
    </main>
  );
};

export default Main;
