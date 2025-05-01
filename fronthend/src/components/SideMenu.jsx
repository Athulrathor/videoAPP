import React from "react";
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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { BsCollectionPlayFill } from "react-icons/bs";
import { BsPlayBtnFill } from "react-icons/bs";
import { BiSolidLike } from "react-icons/bi";
import { LuHistory } from "react-icons/lu";
import { MdWatchLater } from "react-icons/md";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { HiMusicalNote } from "react-icons/hi2";
import { BiLike } from "react-icons/bi";
import achiveout from "../assets/achiveout.png"
import achivefill from "../assets/achivefill.png";

function SideMenu(props) {
  const currentYear = new Date().getFullYear();
  
  const { user, loggedIn } = useSelector((state) => state.user);

  const Navigate = useNavigate();

  return (
    <div
      className={`scroll mr-2 h-[calc(100vh-56px)] max-sm:hidden ${
        props.menuToggle.showMenu === true ? "w-fit" : "w-[188px]"
      } lg:block bg-white shadow-lg p-2.5 overflow-y-scroll scroll-smooth`}
    >
      <div className="border-b border-gray-300 pb-5 gap-1">
        <div
          className={`hover:bg-gray-100 font-semibold rounded-lg px-3 py-2 flex items-center gap-4 ${
            props.sideActive.active === "home" ? "bg-gray-200" : ""
          }`}
          onClick={() => {
            props.sideActive.setActive("home");
          }}
        >
          {props.sideActive.active === "home" ? (
            <GoHomeFill className="w-5 h-5" />
          ) : (
            <GrHomeRounded className="w-5 h-5" />
          )}
          {props.menuToggle.showMenu === true ? "" : <h1>Home</h1>}
        </div>
        <div
          className={`hover:bg-gray-100 font-normal rounded-lg px-3 py-2 gap-4 flex items-center ${
            props.sideActive.active === "shorts" ? "bg-gray-200" : ""
          }`}
          onClick={() => props.sideActive.setActive("shorts")}
        >
          {props.sideActive.active === "shorts" ? (
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
          {props.menuToggle.showMenu === true ? "" : <h1>Shorts</h1>}
        </div>
        <div
          className={`hover:bg-gray-100 font-normal rounded-lg px-3 py-2 gap-4 flex items-center ${
            props.sideActive.active === "subscription" ? "bg-gray-200" : ""
          }`}
          onClick={() => props.sideActive.setActive("subscription")}
        >
          {props.sideActive.activee === "subscription" ? (
            <BsCollectionPlayFill className=" w-5 h-5" />
          ) : (
            <BsCollectionPlay className=" w-5 h-5" />
          )}
          {props.menuToggle.showMenu === true ? "" : <h1>Subcription</h1>}
        </div>
      </div>

      {loggedIn ? (
        <div className="border-b border-gray-300 py-5">
          {props.menuToggle.showMenu === true ? (
            ""
          ) : (
            <h1 className="flex items-center gap-4 font-semibold rounded-lg px-3">
              {loggedIn ? user.data.user.username : "You"} <IoIosArrowForward />
            </h1>
          )}
          <div>
            <h1
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                props.sideActive.active === "history" ? "bg-gray-200" : ""
              }`}
              onClick={() => props.sideActive.setActive("history")}
            >
              {props.sideActive.active === "history" ? (
                <FaHistory className="text-xl fill-black stroke-3" />
              ) : (
                <LuHistory className="text-xl" />
              )}
              {props.menuToggle.showMenu === true ? "" : "History"}
            </h1>
            <h1
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                props.sideActive.active === "playlists" ? "bg-gray-200" : ""
              }`}
              onClick={() => props.sideActive.setActive("playlists")}
            >
              {props.sideActive.active === "playlists" ? (
                <PiQueueBold className="text-xl stroke-1" />
              ) : (
                <PiQueueBold className="text-xl" />
              )}
              {props.menuToggle.showMenu === true ? "" : "Playlists"}
            </h1>
            <h1
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                props.sideActive.active === "your videos" ? "bg-gray-200" : ""
              }`}
              onClick={() => props.sideActive.setActive("your videos")}
            >
              {props.sideActive.active === "your videos" ? (
                <BsPlayBtnFill className="text-xl" />
              ) : (
                <GoVideo className="text-xl" />
              )}
              {props.menuToggle.showMenu === true ? "" : "Your Videos"}
            </h1>
            <h1
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                props.sideActive.active === "watch later" ? "bg-gray-200" : ""
              }`}
              onClick={() => props.sideActive.setActive("watch later")}
            >
              {props.sideActive.active === "watch later" ? (
                <MdWatchLater className="text-2xl" />
              ) : (
                <MdOutlineWatchLater className="text-2xl" />
              )}
              {props.menuToggle.showMenu === true ? "" : "Watch later"}
            </h1>
            <h1
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                props.sideActive.active === "likedVideos" ? "bg-gray-200" : ""
              }`}
              onClick={() => props.sideActive.setActive("likedVideos")}
            >
              {props.sideActive.active === "likedVideos" ? (
                <BiSolidLike className="text-xl" />
              ) : (
                <BiLike className="text-xl" />
              )}
              {props.menuToggle.showMenu === true ? "" : "Liked videos"}
            </h1>
          </div>
        </div>
      ) : (
        ""
      )}

      {loggedIn ? (
        <div className="border-b border-gray-300 py-5">
          {props.menuToggle.showMenu === true ? (
            ""
          ) : (
            <h1
              className={`flex items-center gap-4 font-semibold rounded-lg px-3`}
            >
              <GrChannel className="text-xl" />
              Subcriptions
            </h1>
          )}
          <div>
            <div
              className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
                props.sideActive.active === "Channle_01" ? "bg-gray-200" : ""
              }`}
              onClick={() => props.sideActive.setActive("Channle_01")}
            >
              <div className="border-2 rounded-full p-0.5 border-black">
                <GrChannel className="" />
              </div>
              {props.menuToggle.showMenu === true ? "" : <h1>Channle_01</h1>}
            </div>

            <div className="flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2">
              <div className="border-2 rounded-full p-0.5 border-black">
                <GrChannel className="" />
              </div>
              {props.menuToggle.showMenu === true ? "" : <h1>Channle_02</h1>}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="border-b border-gray-300 py-5">
        {props.menuToggle.showMenu === true ? (
          ""
        ) : (
          <h1 className="items-center gap-4 font-semibold rounded-lg px-3">
            Exlore
          </h1>
        )}
        <div>
          <h1
            className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
              props.sideActive.active === "trending" ? "bg-gray-200" : ""
            }`}
            onClick={() => props.sideActive.setActive("trending")}
          >
            <IoMdTrendingUp className="text-xl" />
            {props.menuToggle.showMenu === true ? "" : "Trending"}
          </h1>
          <h1
            className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
              props.sideActive.active === "music" ? "bg-gray-200" : ""
            }`}
            onClick={() => props.sideActive.setActive("music")}
          >
            {props.sideActive.active === "music" ? (
              <HiMusicalNote className="text-xl" />
            ) : (
              <HiOutlineMusicalNote className="text-xl" />
            )}
            {props.menuToggle.showMenu === true ? "" : "Music"}
          </h1>
          <h1
            className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
              props.sideActive.active === "gaming" ? "bg-gray-200" : ""
            }`}
            onClick={() => props.sideActive.setActive("gaming")}
          >
            {props.sideActive.active === "gaming" ? (
              <IoGameController className="text-xl" />
            ) : (
              <IoGameControllerOutline className="text-xl" />
            )}
            {props.menuToggle.showMenu === true ? "" : "Gaming"}
          </h1>
          <h1
            className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
              props.sideActive.active === "sports" ? "bg-gray-200" : ""
            }`}
            onClick={() => props.sideActive.setActive("sports")}
          >
            {/* <GrAchievement className="text-xl" /> */}
            {props.sideActive.active === "sports" ? (
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
            {props.menuToggle.showMenu === true ? "" : "Sports"}
          </h1>
        </div>
      </div>
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
            props.sideActive.active === "settings" ? "bg-gray-200" : ""
          }`}
          onClick={() => props.sideActive.setActive("settings")}
        >
          <IoSettingsOutline className="text-2xl" />
          {props.menuToggle.showMenu === true ? "" : "Settings"}
        </h1>
        <h1
          className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
            props.sideActive.active === "report history" ? "bg-gray-200" : ""
          }`}
          onClick={() => props.sideActive.setActive("report history")}
        >
          <MdOutlinedFlag className="text-2xl" />
          {props.menuToggle.showMenu === true ? "" : "Report history"}
        </h1>
        <h1
          className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
            props.sideActive.active === "help" ? "bg-gray-200" : ""
          }`}
          onClick={() => props.sideActive.setActive("help")}
        >
          <MdHelpOutline className="text-2xl" />
          {props.menuToggle.showMenu === true ? "" : "Help"}
        </h1>
        <h1
          className={`flex items-center gap-4 hover:bg-gray-100 font-normal rounded-lg px-3 py-2 ${
            props.sideActive.active === "feedback" ? "bg-gray-200" : ""
          }`}
          onClick={() => props.sideActive.setActive("feedback")}
        >
          <MdOutlineFeedback className="text-2xl" />
          {props.menuToggle.showMenu === true ? "" : "Send feedback"}
        </h1>
      </div>

      {props.menuToggle.showMenu === true ? (
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
            <h1>@ {currentYear} Google LLC</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideMenu;
