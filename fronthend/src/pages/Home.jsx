import React, { useState, useEffect, useCallback } from "react";
import VideoCard from "../components/VideoCard";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
// import TagSection from "../components/tagSection";
import Main from "../components/Main";
import { useDispatch, useSelector } from "react-redux";
import { noVideo, videoError, videoLoading, videos } from "../redux/features/videos";
import { axiosInstance } from "../libs/axios";
import { noshort, shortError, shortLoading, shorts } from "../redux/features/shorts";

// import { getvideos } from "../feature/getAllVideo.js";

function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [active, setActive] = useState("home");
  const { user, loggedIn } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [videoParams, setVideoParams] = useState({
    page: 1,
    limit: 10,
    query: "",
    sortBy: 1,
    sortType: "createdAt",
    userId: user?.data?.user?._id,
  });

  const getAllVideo = useCallback(async () => {
    dispatch(videoLoading(true));

         try {
           const response = await axiosInstance.get("/videos/get-all-videos", {
             params: videoParams,
           });
           dispatch(videos(response.data.data.data));
           dispatch(videoLoading(false));
           sessionStorage.setItem(
             "videos",
             JSON.stringify(response.data.data.data)
           );
           console.log(response.data.message);
         } catch (error) {
           dispatch(noVideo());
           dispatch(videoError(true));
           dispatch(videoLoading(false));
           console.log("Error :", error.message);
         } finally {
           dispatch(videoLoading(false));
         }
       
}, [loggedIn, active, videoParams, dispatch]);

const getAllShorts = useCallback(async () => {
  dispatch(shortLoading(true));

  try {
    const response = await axiosInstance.get("/short/get-all-short", {
      params: videoParams,
    });
    dispatch(shorts(response.data.data.data));
    console.log(response.data.message);
    dispatch(shortLoading(false));
    //  sessionStorage.setItem(
    //    "shorts",
    //    JSON.stringify(response.data.data.data)
    //  );
    // console.log("shorts fetched successfully");
  } catch (error) {
    dispatch(noshort());
    dispatch(shortError(true));
    dispatch(shortLoading(false));
    console.log("Error :", error.message);
  } finally {
    dispatch(shortLoading(false));
  }
}, [loggedIn, active, videoParams, dispatch]);

   useEffect(() => {
     if (loggedIn === true && active === "home") {
         getAllVideo()
      }
   },[getAllVideo]);
  
     useEffect(() => {
       if (loggedIn === true && active === "shorts") {
         getAllShorts();
       }
       
     },[getAllShorts]);
  
  return (
    <>
      <Header menuToggle={{ showMenu, setShowMenu }} />
      <div className={`w-fit flex justify-end`}>
        <div className="w-fit">
          <SideMenu
            menuToggle={{ showMenu }}
            videoParam={{ setVideoParams, videoParams }}
            sideActive={{ active, setActive }}
          />
        </div>

        <div className="">
          {/* <TagSection /> */}

          {videoLoading === true ? (
            <div>loading</div>
          ) : (
              <Main
                videoParam={{ setVideoParams, videoParams }}
                sideActive={{ active, setActive }}
              />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
