import React,{ useState, useEffect, lazy } from "react";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import Main from "../components/Main";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "../redux/features/videos";
import { fetchShort } from "../redux/features/shorts";
import { axiosInstance } from "../libs/axios";

const UploadVideo = lazy(() => import('../components/UploadVideo'));
const UploadShort = lazy(() => import("../components/UploadShort"));
const UploadLive = lazy(() => import('../components/UploadLive'));

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
   },[]);

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



    const fetchViewCounter = async (getShortId) => {
      if (!getShortId) return "id not found";
      try {
        await axiosInstance.get(`short/view-counter/${getShortId}`);
        dispatch(fetchShort(shortParams));
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {

      // const time = setInterval(() => {
        if (loggedIn === true && sideActive === "home") {
          dispatch(fetchVideos(videoParams));
        }
      // }, 350);
      

      // return () => clearInterval(time);
  }, [dispatch,videoParams,loggedIn,sideActive]);

  useEffect(() => {
    if (loggedIn === true && sideActive === "shorts") {
      dispatch(fetchShort(shortParams));
    }
  }, [dispatch, shortParams, loggedIn, sideActive]);

  //       const fetchLikeToggle = async (getShortId) => {
  //         try {
  //           const likes = await axiosInstance.get(
  //             `like/toggle-like-to-short/${getShortId}`
  //           );
  //           console.log("cliked",likes)

  //           dispatch(fetchShort( shortParams));
  //         } catch (error) {
  //           console.error(error);
  //         }
  // };

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
      <div className={`w-fit flex justify-end`}>
        <div className="w-fit">
          <SideMenu
            menuToggle={{ showMenu, setShowMenu }}
            videoParam={{ setVideoParams, videoParams }}
          />
        </div>

        <div className="">
          {/* <TagSection /> */}

          <Main
            showMenu={showMenu}
            timeAgo={timeAgo}
            fetchViewCounter={fetchViewCounter}
            setToggleVideoUploading={setToggleVideoUploading}
            toggleVideoUploading={toggleVideoUploading}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
