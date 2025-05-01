import React from "react";
import Videos from "../pages/Videos";
import Short from "../pages/Short";
import Playlist from "../pages/Playlist"
import Subscription from "../pages/Subscription";

const Main = (props) => {

  return (
    <main className="lex flex-col w-[calc(100vw-188px)] h-[calc(100vh - 65px)] overflow-y-scroll bg-[#f9f9f9] scrollbar-hide">
      {(props.sideActive.active === "home" ? <Videos /> : "") ||
        (props.sideActive.active === "shorts" ? <Short /> : "") ||
        (props.sideActive.active === "subscription" ? <Subscription /> : "") ||
        (props.sideActive.active === "history" ? <History /> : "") ||
        (props.sideActive.active === "playlists" ? <Playlist /> : "") ||
        (props.sideActive.active === "your videos" ? <UserVideos /> : "") ||
        (props.sideActive.active === "watch later" ? <WatchLater /> : "") ||
        (props.sideActive.active === "likedVideos" ? <LikedVideos /> : "") ||
        (props.sideActive.active === "trending" ? <Trending /> : "") ||
        (props.sideActive.active === "music" ? <Music /> : "") ||
        (props.sideActive.active === "gaming" ? <Gaming /> : "") ||
        (props.sideActive.active === "sports" ? <Sports /> : "") ||
        (props.sideActive.active === "setting" ? <Setting /> : "") ||
        (props.sideActive.active === "report history" ? <ReportHistory /> : "") ||
        (props.sideActive.active === "help" ? <Help /> : "") ||
        (props.sideActive.active === "feedback" ? <Feedback /> : "")}
    </main>
  );
};

export default Main;
