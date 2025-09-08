import React,{ useState, useEffect } from "react";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import Main from "../components/Main";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "../redux/features/videos";
import { fetchShort } from "../redux/features/shorts";

import UploadVideo from '../components/UploadVideo';
import UploadShort from "../components/UploadShort";
import UploadLive from '../components/UploadLive';

import UserName from "../components/CheckHasUsername";

function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const { user, loggedIn, sideActive } = useSelector((state) => state.user);

  const [toggleVideoUploading, setToggleVideoUploading] = useState(true);
  const [toggleShortUploading, setToggleShortUploading] = useState(true);
  const [toggleLiveUploading, setToggleLiveUploading] = useState(true);

  const dispatch = useDispatch();

  const [videoParams, setVideoParams] = useState({
    page: 1,
    limit: 20,
    query: "",
    sortBy: 1,
    sortType: "createdAt",
    userId: user?._id,
  });

  const [shortParams, setShortParams] = useState({
    page: 1,
    limit: 10,
    query: "",
    sortBy: 1,
    sortType: "createdAt",
    userId: user?._id,
  });

  useEffect(() => {
    if (window.innerWidth <= 768) setShowMenu(true);
  }, []);

  function timeAgo(createdAt) {
    const now = new Date();
    const created = new Date(createdAt);
    const difference = Math.floor((now - created) / 1000);

    if (difference < 60) {
      return `${difference} seconds ago`;
    } else if (difference < 3600) {
      const minutes = Math.floor(difference / 60);
      return `${minutes} minutes ago`;
    } else if (difference < 86400) {
      const hours = Math.floor(difference / 3600);
      return `${hours} hours ago`;
    } else if (difference < 2419200) {
      const days = Math.floor(difference / 86400);
      return `${days} days ago`;
    } else if (difference / 31536000) {
      const month = Math.floor(difference / 2419200);
      return `${month} month ago`;
    } else {
      const year = Math.floor(difference / 31536000);
      return `${year} year ago`;
    }
  }

  useEffect(() => {
        if (loggedIn === true && sideActive === "home") {
          dispatch(fetchVideos(videoParams));
        }
  }, [dispatch,videoParams,loggedIn,sideActive]);

  useEffect(() => {
    if (loggedIn === true && sideActive === "shorts") {
      dispatch(fetchShort(shortParams));
    }
  }, [dispatch, shortParams, loggedIn, sideActive]);

  return (
    <div className="relative">
      <UploadVideo
        setToggleVideoUploading={setToggleVideoUploading}
        toggleVideoUploading={toggleVideoUploading}
      />
      <UploadShort
        setToggleShortUploading={setToggleShortUploading}
        toggleShortUploading={toggleShortUploading}
      />
      <UploadLive
        setToggleLiveUploading={setToggleLiveUploading}
        toggleLiveUploading={toggleLiveUploading}
      />
      <Header
        menuToggle={{ showMenu, setShowMenu }}
        setToggleVideoUploading={setToggleVideoUploading}
        setToggleShortUploading={setToggleShortUploading}
        setToggleLiveUploading={setToggleLiveUploading}
        videoQueries={{ videoParams, setVideoParams }}
        shortQueries={{shortParams,setShortParams}}
      />
      {/* pop up if user not has username */}
      <UserName />
      <div className={`w-screen h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] flex`}>
        <div className=" h-full">
          <SideMenu
            menuToggle={{ showMenu, setShowMenu }}
            videoParam={{ setVideoParams, videoParams }}
          />
        </div>

        <div className="w-full h-full">
          {/* <TagSection /> */}

          <Main
            showMenu={showMenu}
            timeAgo={timeAgo}
            setToggleVideoUploading={setToggleVideoUploading}
            toggleVideoUploading={toggleVideoUploading}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
