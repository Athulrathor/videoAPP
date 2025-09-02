import React, { useEffect } from "react";
import { PiQueueBold } from "react-icons/pi";
import { GoVideo } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
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
import { BiLike } from "react-icons/bi";
import { setSideActive } from "../redux/features/user";
import { ChartNoAxesGanttIcon, History, LucideHistory } from "lucide-react";
import { fetchVideoByOwner } from "../redux/features/videos";
import { userSubcribers } from "../redux/features/subcribers";

function SideMenu(props) {
  const currentYear = new Date().getFullYear();

  const dispatch = useDispatch();
  const getLocation = useLocation();
  const Navigate = useNavigate();

  const { user, loggedIn, sideActive } = useSelector((state) => state.user);
  const { subcriber } = useSelector(state => state.subscriber)

  useEffect(() => {
    dispatch(userSubcribers());
  }, [dispatch]);

  return (
    <div>
    <div
      className={`scrollBar h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] ${
        props.menuToggle?.showMenu ? `-translate-x-[100%] absolute` : "translate-x-[0%]"
      } max-md:absolute bg-white shadow-2xl  p-2.5 max-w-[224px] z-14  -translate-x-[100%] overflow-y-scroll transition-transform duration-1000 ease-in-out scroll-smooth`}
    >
      <div className="border-b border-gray-300 pb-5 gap-1">
        <div
          className={`hover:bg-gray-100 cursor-pointer rounded-lg px-3 py-2 flex items-center gap-4 ${
            sideActive === "home" ? "bg-gray-200" : ""
          }`}
          onClick={() => {
            dispatch(setSideActive("home"));
            props.menuToggle?.setShowMenu(true);
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
          className={`hover:bg-gray-100 font-normal cursor-pointer rounded-lg px-3 py-2 gap-4 flex items-center ${
            sideActive === "shorts" ? "bg-gray-200" : ""
          }`}
          onClick={() => {
            dispatch(setSideActive("shorts"));
            props.menuToggle?.setShowMenu(true);
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
          className={`hover:bg-gray-100 font-normal cursor-pointer rounded-lg px-3 py-2 gap-4 flex items-center ${
            sideActive === "subscription" ? "bg-gray-200" : ""
          }`}
          onClick={() => {
            dispatch(setSideActive("subscription"));
            props.menuToggle?.setShowMenu(true);
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
              onClick={() => Navigate(`/channel/${user?.username}`)}
                className="flex items-center gap-4 py-1 font-semibold cursor-pointer rounded-lg px-3"
            >
              {loggedIn ? user?.username : "You"}{" "}
              <IoIosArrowForward />
            </h1>
          )}
          <div>
            <h1
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                sideActive === "history" ? "bg-gray-200" : ""
              }`}
              onClick={() => dispatch(setSideActive("history"))}
            >
              {sideActive === "history" ? (
                <History className="text-xl fill-black stroke-3" />
              ) : (
                <LucideHistory className="text-xl" />
              )}
              {props.menuToggle?.showMenu === true ? "" : "History"}
            </h1>
            <h1
              className={`flex items-center gap-4 text-nowrap hover:bg-gray-100  cursor-pointer font-normal rounded-lg px-3 py-2 ${
                sideActive === "Manage Videos" ? "bg-gray-200" : ""
              }`}
              onClick={() => { dispatch(setSideActive("Manage Videos")); props.menuToggle?.setShowMenu(true); dispatch(fetchVideoByOwner(user?.data?.user?._id))}}
            >
              {sideActive === "Manage Videos" ? (
                <ChartNoAxesGanttIcon className="text-xl stroke-3" />
              ) : (
                  <ChartNoAxesGanttIcon className="text-xl" />
              )}
              {props.menuToggle?.showMenu === true ? "" : "Manage Videos"}
            </h1>
            <h1
              className={`flex items-center gap-4 hover:bg-gray-100 cursor-pointer font-normal rounded-lg px-3 py-2 ${
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
              className={`flex items-center gap-4 hover:bg-gray-100 cursor-pointer font-normal rounded-lg px-3 py-2 ${
                sideActive === "your videos" ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                dispatch(setSideActive("your videos"));
                dispatch(fetchVideoByOwner(user?._id));
                props.menuToggle?.setShowMenu(true);
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
              className={`flex items-center gap-4 hover:bg-gray-100 cursor-pointer font-normal rounded-lg px-3 py-2 ${
                sideActive === "likedVideos" ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                dispatch(setSideActive("likedVideos"));
                props.menuToggle?.setShowMenu(true);
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
          <div className={`${subcriber.length === 0 ? "hidden" : ""} border-b border-gray-300 py-5`}>
          {props.menuToggle?.showMenu === true ? (
            ""
          ) : (
            <h1
                className={`flex items-center gap-4 font-semibold cursor-pointer rounded-lg px-3 mb-2`}
            >
              {/* <GrChannel className="text-xl" /> */}
              Subcribers
            </h1>
          )}
          <div>
            {subcriber !== null &&
              subcriber.map((sub) => (
                <div
                  key={sub?._id}
                  className={`flex items-center gap-4 hover:bg-gray-100 cursor-pointer font-normal rounded-lg px-3 py-2`}
                  onClick={() =>{
                    Navigate(`/channel/${sub?.subcribers?.username}`);
                    props.menuToggle?.setShowMenu(true); }
                  }
                >
                  <div className=" border-black">
                    {/* <GrChannel className="" /> */}
                    <img
                      src={sub?.subcribers?.avatar}
                      className="rounded-full w-6 aspect-square drop-shadow-xs"
                      alt=""
                    />
                  </div>
                  {props.menuToggle?.showMenu === true ? (
                    ""
                  ) : (
                    <h1>{sub?.subcribers?.username}</h1>
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
          className={`flex items-center gap-4 hover:bg-gray-100 font-normal cursor-pointer rounded-lg px-3 py-2 ${
            sideActive === "settings" ? "bg-gray-200" : ""
          }`}
          // onClick={() => dispatch(setSideActive("settings"))}
          onClick={() => Navigate(`/settings`)}
        >
          <IoSettingsOutline className="text-2xl" />
          {props.menuToggle?.showMenu === true ? "" : "Settings"}
        </h1>
        <h1
          className={`flex items-center gap-4 text-nowrap hover:bg-gray-100 font-normal cursor-pointer rounded-lg px-3 py-2 ${
            sideActive === "report history" ? "bg-gray-200" : ""
          }`}
          onClick={() => { dispatch(setSideActive("report history")); props.menuToggle?.setShowMenu(true); }}
        >
          <MdOutlinedFlag className="text-2xl" />
          {props.menuToggle?.showMenu === true ? "" : "Report history"}
        </h1>
        <h1
          className={`flex items-center gap-4 hover:bg-gray-100 font-normal cursor-pointer rounded-lg px-3 py-2 ${
            sideActive === "help" ? "bg-gray-200" : ""
          }`}
          onClick={() => { dispatch(setSideActive("help")); props.menuToggle?.setShowMenu(true); }}
        >
          <MdHelpOutline className="text-2xl" />
          {props.menuToggle?.showMenu === true ? "" : "Help"}
        </h1>
        <h1
          className={`flex items-center gap-4 hover:bg-gray-100 font-normal cursor-pointer rounded-lg px-3 py-2 ${
            sideActive === "feedback" ? "bg-gray-200" : ""
          }`}
          onClick={() => { dispatch(setSideActive("feedback")); props.menuToggle?.setShowMenu(true); }}
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
      </div>
  );
}

export default SideMenu;
