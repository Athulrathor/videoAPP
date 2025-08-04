import React, { useEffect, useRef, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { PiQueueBold } from "react-icons/pi";
import { GoVideo } from "react-icons/go";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { GrChannel } from "react-icons/gr";
import { IoMdTrendingUp } from "react-icons/io";
import { IoGameController, IoGameControllerOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlinedFlag } from "react-icons/md";
import { MdHelpOutline } from "react-icons/md";
import { MdOutlineFeedback } from "react-icons/md";
import { GrHomeRounded } from "react-icons/gr";
import { BsCollectionPlay } from "react-icons/bs";
import shorts from "../assets/shorts.svg";
import shortsfill from "../assets/shortsfill.svg";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { BsCollectionPlayFill } from "react-icons/bs";
import { BsPlayBtnFill } from "react-icons/bs";
import { BiSolidLike } from "react-icons/bi";
import { LuHistory } from "react-icons/lu";
import { MdWatchLater } from "react-icons/md";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { HiMusicalNote } from "react-icons/hi2";
import { BiLike } from "react-icons/bi";
import { setSideActive } from "../redux/features/user";
import { axiosInstance } from "../libs/axios";

function SideMenu(props) {
  const currentYear = new Date().getFullYear();

  const dispatch = useDispatch();
  const getLocation = useLocation();

  const { user, loggedIn, sideActive } = useSelector((state) => state.user);

  const Navigate = useNavigate();

  const [subcribers, setSubcribers] = useState({
    loading: true,
    error: "",
    data: null,
  });

  const [hideName, setHideName] = useState(false);

  const fetchUserSubcribers = async () => {
    setSubcribers((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const subcriber = await axiosInstance.get(`subcriber/get-subcriber`);
      setSubcribers((prev) => ({
        ...prev,
        loading: false,
        data: subcriber?.data?.data,
      }));
    } catch (error) {
      setSubcribers((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserSubcribers();
  }, []);

  useEffect(() => {
    if (window.innerWidth > 768) {
      setHideName(true)
    } else {
      setHideName(false)
    }
  }, [setHideName, props.menuToggle?.showMenu]);

  return (
    <div
      className={`scroll h-[calc(100vh-65px)]  ${
        props.menuToggle?.showMenu ? hideName ? "w-fit" : "hidden" : "w-[200px] z-14"
      } max-md:absolute bg-white shadow-lg p-2.5 overflow-y-scroll transition-transform duration-1000 ease-in-out scroll-smooth`}
    >
      <div className="border-b border-gray-300 pb-5 gap-1">
        <div
          className={`hover:bg-gray-100 font-semibold rounded-lg px-3 py-2 flex items-center gap-4 ${
            sideActive === "home" ? "bg-gray-200" : ""
          }`}
          onClick={() => {
            dispatch(setSideActive("home"));
            if (getLocation !== "/") return Navigate("/");
          }}
        >
          {sideActive === "home" ? (
            <GoHomeFill className="w-5 h-5" />
          ) : (
            <GrHomeRounded className="w-5 h-5" />
          )}
          {props.menuToggle?.showMenu === true ? "" : <h1>Home</h1>}
        </div>
        <div
          className={`hover:bg-gray-100 font-normal rounded-lg px-3 py-2 gap-4 flex items-center ${
            sideActive === "shorts" ? "bg-gray-200" : ""
          }`}
          onClick={() => {
            dispatch(setSideActive("shorts"));
            if (getLocation !== "/") return Navigate("/");
          }}
        >
          {sideActive === "shorts" ? (
            <img
              src={shortsfill}
              alt="#"
              className="w-5 h-5"
            />
          ) : (
            <img
              src={shorts}
              alt="#"
              className="w-5 h-5"
            />
          )}
          {/* <SiYoutubeshorts className="w-5 h-5" /> */}
          {props.menuToggle?.showMenu === true ? "" : <h1>Shorts</h1>}
        </div>
        <div
          className={`hover:bg-gray-100 font-normal rounded-lg px-3 py-2 gap-4 flex items-center ${
            sideActive === "subscription" ? "bg-gray-200" : ""
          }`}
          onClick={() => {
            dispatch(setSideActive("subscription"));
            if (getLocation !== "/") return Navigate("/");
          }}
        >
          {sideActive === "subscription" ? (
            <BsCollectionPlayFill className=" w-5 h-5" />
          ) : (
            <BsCollectionPlay className=" w-5 h-5" />
          )}
          {props.menuToggle?.showMenu === true ? "" : <h1>Subcription</h1>}
        </div>
      </div>

      {loggedIn ? (
        <div className="border-b border-gray-300 py-5">
          {props.menuToggle?.showMenu === true ? (
            ""
          ) : (
            <h1
              onClick={() => Navigate(`/channel/${user?.data?.user?.username}`)}
              className="flex items-center gap-4 font-semibold rounded-lg px-3"
            >
              {loggedIn ? user?.data?.user?.username : "You"}{" "}
              <IoIosArrowForward />
            </h1>
          )}
          <div>
            {/* <h1
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                sideActive === "history" ? "bg-gray-200" : ""
              }`}
              onClick={() => dispatch(setSideActive("history"))}
            >
              {sideActive === "history" ? (
                <FaHistory className="text-xl fill-black stroke-3" />
              ) : (
                <LuHistory className="text-xl" />
              )}
              {props.menuToggle?.showMenu === true ? "" : "History"}
            </h1> */}
            <h1
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                sideActive === "playlists" ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                dispatch(setSideActive("playlists"));
                if (getLocation !== "/") return Navigate("/");
              }}
            >
              {sideActive === "playlists" ? (
                <PiQueueBold className="text-xl stroke-1" />
              ) : (
                <PiQueueBold className="text-xl" />
              )}
              {props.menuToggle?.showMenu === true ? "" : "Playlists"}
            </h1>
            <h1
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                sideActive === "your videos" ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                dispatch(setSideActive("your videos"));
                if (getLocation !== "/") return Navigate("/");
              }}
            >
              {sideActive === "your videos" ? (
                <BsPlayBtnFill className="text-xl" />
              ) : (
                <GoVideo className="text-xl" />
              )}
              {props.menuToggle?.showMenu === true ? "" : "Your Videos"}
            </h1>
            {/* <h1
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                sideActive === "watch later" ? "bg-gray-200" : ""
              }`}
              onClick={() => dispatch(setSideActive("watch later"))}
            >
              {sideActive === "watch later" ? (
                <MdWatchLater className="text-2xl" />
              ) : (
                <MdOutlineWatchLater className="text-2xl" />
              )}
              {props.menuToggle?.showMenu === true ? "" : "Watch later"}
            </h1> */}
            <h1
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                sideActive === "likedVideos" ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                dispatch(setSideActive("likedVideos"));
                if (getLocation !== "/") return Navigate("/");
              }}
            >
              {sideActive === "likedVideos" ? (
                <BiSolidLike className="text-xl" />
              ) : (
                <BiLike className="text-xl" />
              )}
              {props.menuToggle?.showMenu === true ? "" : "Liked videos"}
            </h1>
          </div>
        </div>
      ) : (
        ""
      )}

      {loggedIn ? (
        <div className="border-b border-gray-300 py-5">
          {props.menuToggle?.showMenu === true ? (
            ""
          ) : (
            <h1
              className={`flex items-center gap-4 font-semibold rounded-lg px-3 mb-2`}
            >
              {/* <GrChannel className="text-xl" /> */}
              Subcribers
            </h1>
          )}
          <div>
            {subcribers.data !== null &&
              subcribers.data.map((subcriber) => (
                <div
                  key={subcriber?._id}
                  className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2`}
                  onClick={() =>
                    Navigate(`/channel/${subcriber?.subcribers?.username}`)
                  }
                >
                  <div className=" border-black">
                    {/* <GrChannel className="" /> */}
                    <img
                      src={subcriber?.subcribers?.avatar}
                      className="rounded-full w-6 aspect-square drop-shadow-xs"
                      alt=""
                    />
                  </div>
                  {props.menuToggle?.showMenu === true ? (
                    ""
                  ) : (
                    <h1>{subcriber?.subcribers?.username}</h1>
                  )}
                </div>
              ))}

            {/* <div className="flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2">
              <div className="border-2 rounded-full p-0.5 border-black">
                <GrChannel className="" />
              </div>
              {props.menuToggle?.showMenu === true ? "" : <h1>Channle_02</h1>}
            </div> */}
          </div>
        </div>
      ) : (
        ""
      )}

      {/* <div className="border-b border-gray-300 py-5"> */}
      {/* {props.menuToggle?.showMenu === true ? (
          ""
        ) : (
          <h1 className="items-center gap-4 font-semibold rounded-lg px-3">
            Explore
          </h1>
        )} */}
      <div>
        {/* <h1
            className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
              sideActive === "trending" ? "bg-gray-200" : ""
            }`}
            onClick={() => dispatch(setSideActive("trending"))}
          >
            <IoMdTrendingUp className="text-xl" />
            {props.menuToggle?.showMenu === true ? "" : "Trending"}
          </h1> */}
        {/* <h1
            className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
              sideActive === "music" ? "bg-gray-200" : ""
            }`}
            onClick={() => dispatch(setSideActive("music"))}
          >
            {sideActive === "music" ? (
              <HiMusicalNote className="text-xl" />
            ) : (
              <HiOutlineMusicalNote className="text-xl" />
            )}
            {props.menuToggle?.showMenu === true ? "" : "Music"}
          </h1> */}
        {/* <h1
            className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
              sideActive === "gaming" ? "bg-gray-200" : ""
            }`}
            onClick={() => dispatch(setSideActive("gaming"))}
          >
            {sideActive === "gaming" ? (
              <IoGameController className="text-xl" />
            ) : (
              <IoGameControllerOutline className="text-xl" />
            )}
            {props.menuToggle?.showMenu === true ? "" : "Gaming"}
          </h1> */}
        {/* <h1
            className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
              sideActive === "sports" ? "bg-gray-200" : ""
            }`}
            onClick={() => dispatch(setSideActive("sports"))}
          >

            {sideActive === "sports" ? (
              <img
                src={achivefill}
                className="w-5 h-5"
              />
            ) : (
              <img
                src={achiveout}
                className="w-5 h-5"
              />
            )}
            {props.menuToggle?.showMenu === true ? "" : "Sports"}
          </h1> */}
      </div>
      {/* </div> */}
      {/* 
      <div className="border-b border-gray-300 py-5">
        <h1 className="items-center gap-4 font-semibold rounded-lg px-3 py-2">
          More from YouTube
        </h1>
        <div>
          <h1 className="flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2">
            <FaYoutube className="text-2xl text-red-500" />
            YouTube Premium
          </h1>
          <h1 className="flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2">
            <SiYoutubestudio className="text-2xl text-red-500" />
            YouTube Studio
          </h1>
          <h1 className="flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2">
            <SiYoutubemusic className="text-2xl text-red-500" />
            YouTube Music
          </h1>
          <h1 className="flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2">
            <SiYoutubekids className="text-2xl text-red-500" />
            YouTube Kids
          </h1>
        </div>
      </div> */}

      <div className="border-b border-gray-300 py-5">
        <h1
          className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
            sideActive === "settings" ? "bg-gray-200" : ""
          }`}
          // onClick={() => dispatch(setSideActive("settings"))}
          onClick={() => Navigate(`/settings`)}
        >
          <IoSettingsOutline className="text-2xl" />
          {props.menuToggle?.showMenu === true ? "" : "Settings"}
        </h1>
        <h1
          className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
            sideActive === "report history" ? "bg-gray-200" : ""
          }`}
          onClick={() => dispatch(setSideActive("report history"))}
        >
          <MdOutlinedFlag className="text-2xl" />
          {props.menuToggle?.showMenu === true ? "" : "Report history"}
        </h1>
        <h1
          className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
            sideActive === "help" ? "bg-gray-200" : ""
          }`}
          onClick={() => dispatch(setSideActive("help"))}
        >
          <MdHelpOutline className="text-2xl" />
          {props.menuToggle?.showMenu === true ? "" : "Help"}
        </h1>
        <h1
          className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
            sideActive === "feedback" ? "bg-gray-200" : ""
          }`}
          onClick={() => dispatch(setSideActive("feedback"))}
        >
          <MdOutlineFeedback className="text-2xl" />
          {props.menuToggle?.showMenu === true ? "" : "Send feedback"}
        </h1>
      </div>

      {props.menuToggle?.showMenu === true ? (
        ""
      ) : (
        <div className="py-5 ">
          <p className="text-gray-500 text-sm font-semibold pb-2 text-wrap">
            About Press Copyright Contact us Creators Advertise Developers
          </p>
          <p className="text-gray-500 text-sm font-semibold pb-2 text-wrap">
            Terms Privacy Policy & Safety How YouTube works Test new features
          </p>
          <div className="text-gray-400 pt-2">
            <h1>@ {currentYear} VidTube CC</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideMenu;
