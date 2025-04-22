import React, { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import TagSection from "../components/tagSection";
import Main from "../components/Main";
import { useSelector, useDispatch } from "react-redux";
import {
  videos,
  videoError,
  videoLoading,
  noVideo,
} from "../redux/features/videos";
import { axiosInstance } from "../libs/axios.js";
// import { getvideos } from "../feature/getAllVideo.js";

const Home = () => {
  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useDispatch();

  const { user, loggedIn } = useSelector((state) => state.user);

  const [videoParams, setVideoParams] = useState({
    page: 1,
    limit: 10,
    query: "",
    sortBy: 1,
    sortType: "createdAt",
    userId: user?.data?.user?._id,
  });

  useEffect(() => {
    if (loggedIn) {
      const getVideos = async () => {
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
          console.log("Videos fetched successfully :", response.data.data.data);
        } catch (error) {
          dispatch(noVideo());
          dispatch(videoError(true));
          console.log("Error :", error.message);
        } finally {
          dispatch(videoLoading(false));
        }
      };

      getVideos();
    } else {
      dispatch(noVideo());
    }
  });

  return (
    <div>
      <Header menuToggle={{ showMenu, setShowMenu }} />
      <div className={`w-fit flex justify-end`}>
        <div className="w-fit">
          <SideMenu
            menuToggle={{ showMenu }}
            videoParam={{ setVideoParams, videoParams }}
          />
        </div>

        <div className="">
          {/* <TagSection /> */}

          <div className="p-1 items-center justify-center">
            <Main videoParam={{ setVideoParams, videoParams }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
