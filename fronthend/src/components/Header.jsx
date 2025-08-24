import React, { useEffect, useRef, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { MdMic } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiVideoAddLine } from "react-icons/ri";
import { HiOutlineBell } from "react-icons/hi";
import videoLogo from "../assets/favicon.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import Login from "../pages/Login.jsx";
import { X } from "lucide-react";
import MicSpeechToText from "./TextToSpeach.jsx";
import { fetchLogoutUser,logOut } from "../redux/features/user.js";
import { googleLogout } from "@react-oauth/google";
import { toast } from "react-toastify";
import { fetchVideosSuggestion } from "../redux/features/videos.js";

const Header = (props) => {
  const { user, loggedIn } = useSelector((state) => state.user);
  const { getsuggestion } = useSelector(state => state.videos);

  const { setToggleVideoUploading,setToggleShortUploading,setToggleLiveUploading,videoQueries } = props;

  const [showDropdown, setShowDropdown] = useState(false);
  const searchBtn = useRef(null);
  const mobileInputRef = useRef();

  // const [suggestion, setSuggestion] = useState([]);
  const [suggestionBar, setSuggestionBar] = useState(false);
  const [inputBar, setInputBar] = useState({ query: "" })
  const [counter, setCounter] = useState(0)

  const [micOpen, setMicOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [openDropMenu, setOpenDropMenu] = useState(false);

  const Navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(user.avatar)

  const handleKeyDown = (e) => {

    if (e.key === "ArrowDown") {
      e.preventDefault();

      if (!suggestionBar) return;

      setCounter(prev => prev < getsuggestion.length - 1 ? prev + 1 : 0)

    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      if (!suggestionBar) return;

      setCounter(prev => prev > 0 ? prev - 1 : getsuggestion.length - 1)
    } else if (e.key === "Enter") {

      if (suggestionBar && counter >= 0 && getsuggestion[counter]) {
        e.preventDefault();

        setInputBar(prev => ({ ...prev, query: getsuggestion[counter].title }));
        searchBtn.current.click();
        setSuggestionBar(false);
        setCounter(-1);
      }
    } 
  }

  useEffect(() => {
    setCounter(-1);
  }, [getsuggestion])

  const logoutUser = async (e) => {
    e.preventDefault();

    try {
      const logout = await dispatch(fetchLogoutUser());
      googleLogout
      console.log(logout?.data.message);
      console.warn(logout?.data.message);

      googleLogout();

      dispatch(logOut());

      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');

      toast.success('Logged out successfully');

      Navigate('/login', { replace: true });
    } catch (error) {
      console.error("Error:", error.message);
      alert("Logout failed. Please try again.");
    }
  };

  useEffect(() => {

    

    const timer = setTimeout(async () => {
      dispatch(fetchVideosSuggestion({ query: inputBar.query }));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch,inputBar]);

  const handleLoginAndProfile = () => {

    if (loggedIn) {
      setOpenDropMenu(!openDropMenu);
    } else {
      Navigate("/login")
    }
  }

  return (
    <>
      <div className="
    flex justify-between items-center 
    w-full 
    p-2 max-md:p-1 max-[400px]:p-0.5
    border-b border-gray-300 
    relative
    ">
        {/* yt LOGO + MENU ICON */}
        <div className="flex items-center gap-3 max-md:gap-1 max-[400px]:gap-0.5 min-w-0">
          <Tooltip title="Menu" arrow placement="bottom">
            <button
              type="button"
              onClick={() => props.menuToggle.setShowMenu(!props.menuToggle.showMenu)}
              className="w-10 h-10 max-md:w-8 max-md:h-8 max-[400px]:w-7 max-[400px]:h-7 flex items-center justify-center rounded-full hover:bg-gray-200 p-0"
            >
              <HiMenu className="text-2xl max-md:text-xl max-[400px]:text-base" />
            </button>
          </Tooltip>
          <Tooltip title="VidTube" arrow placement="bottom">
            <button
              type="button"
              onClick={() => Navigate("/")}
              className="
            flex items-center font-bold 
            text-2xl max-md:text-lg max-[400px]:text-base
            tracking-tighter cursor-pointer
            min-w-0
          "
            >
              <img
                src={videoLogo}
                alt="logo"
                className="w-10 max-md:w-8 max-[400px]:w-6 mr-1"
              />
              <span className="max-md:inline-block">
                VidTube
              </span>
            </button>
          </Tooltip>
        </div>

        {/* SEARCH SECTION */}
        <div className="
      flex-grow flex items-center
      justify-center
      mx-2
      max-lg:px-2
      max-md:hidden
      ">
          <div className={`
        relative flex bg-white border border-gray-300 items-center 
        ${suggestionBar ? "rounded-t-2xl" : "rounded-full"} 
        h-11 max-xl:h-10 max-[400px]:h-8 
        transition-all 
        w-full max-w-[650px] max-xl:max-w-[420px] max-lg:max-w-[200px] max-[400px]:max-w-[120px]
        pl-2 pr-1
      `}>
            <input
              type="text"
              name="search"
              placeholder="Search"
              value={inputBar.query}
              autoComplete="off"
              onKeyDown={handleKeyDown}
              onFocus={() => getsuggestion.length > 0 && setSuggestionBar(true)}
              onBlur={() => setTimeout(() => setSuggestionBar(false), 100)}
              onChange={(e) => setInputBar(prev => ({ ...prev, query: e.target.value }))}
              className="outline-none text-gray-700 w-full text-sm max-[400px]:text-xs bg-transparent py-1"
            />
            <div className={`flex hover:bg-gray-100 active:bg-gray-200 ${getsuggestion.length > 0 && !suggestionBar ? "" : "hidden"}`}>
              <button
                type="button"
                onClick={() => { videoQueries.setVideoParams((prev) => ({ ...prev, query: "" })); setInputBar(prev => ({ ...prev, query: "" })) }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center rounded-full hover:bg-gray-200">
              <Tooltip title="Search" arrow placement="bottom">
                <button
                  ref={searchBtn}
                  onClick={e => { e.preventDefault(); if (inputBar.query === "") return; videoQueries.setVideoParams((prev) => ({ ...prev, query: inputBar.query })) }}
                  className="p-1"
                >
                  <IoIosSearch className="text-2xl max-md:text-lg max-[400px]:text-base m-0" />
                </button>
              </Tooltip>
            </div>

            {/* Suggestion Bar */}
            {suggestionBar && getsuggestion.length > 0 && (
              <ul className="absolute top-full left-0 right-0 z-15 bg-white space-y-1 border border-gray-300 py-1 max-h-80 overflow-y-auto transition-transform duration-500 w-full">
                {getsuggestion.map((title, index) => (
                  <li
                    key={title._id}
                    onMouseDown={e => {
                      e.preventDefault();
                      setInputBar(prev => ({ ...prev, query: title.title }));
                      setSuggestionBar(false);
                    }}
                    onClick={e => {
                      e.preventDefault();
                      videoQueries.setVideoParams((prev) => ({ ...prev, query: title.title }))
                      setInputBar(prev => ({ ...prev, query: title.title }));
                      setSuggestionBar(false);
                      setCounter(-1);
                    }}
                    className={`${index === counter ? "bg-gray-200" : ""} cursor-pointer w-full py-0.5 hover:bg-gray-100 pl-2 text-sm max-[400px]:text-xs`}
                  >{title.title}</li>
                ))}
              </ul>
            )}
          </div>
          {/* Mic Icon */}
          <div className="ml-2 max-lg:ml-1">
            <Tooltip title="Mic" arrow placement="bottom">
              <div onClick={() => setMicOpen(!micOpen)} className="bg-gray-200 p-2 max-md:p-1 rounded-full flex items-center justify-center">
                <MdMic className="text-2xl max-md:text-lg max-[400px]:text-base" />
              </div>
            </Tooltip>
            <MicSpeechToText setMicOpen={setMicOpen} micOpen={micOpen} />
          </div>
        </div>

        {/* --- CONTROL SECTION ...unchanged... */}

        {/* === MOBILE SEARCH OVERLAY/MODAL === */}
        {showMobileSearch && (
          <div
            className="fixed inset-0 z-50 bg-black/60 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            tabIndex={-1}
            onKeyDown={e => {
              if (e.key === "Escape") setShowMobileSearch(false);
            }}
          >
            <div className="bg-white z-31 flex items-center w-full p-2 max-[400px]:p-1">
              {/* Close Button */}
              <button
                onClick={() => setShowMobileSearch(false)}
                aria-label="Close search"
                className="p-2"
                tabIndex={0}
              >
                <X className="w-5 h-5" />
              </button>
              {/* Input Field */}
              <input
                type="text"
                ref={mobileInputRef}
                value={inputBar.query}
                onChange={e => setInputBar(prev => ({ ...prev, query: e.target.value }))}
                placeholder="Search"
                className="flex-1 mx-2 bg-transparent outline-none border-none text-base max-[400px]:text-sm"
                autoFocus
                aria-label="Search query"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (inputBar.query.trim() !== "") {
                      videoQueries.setVideoParams(prev => ({ ...prev, query: inputBar.query }));
                      setShowMobileSearch(false);
                    }
                  }
                  // Make accessibility navigation easy: ESC closes, ENTER submits
                }}
              />
              {/* Search Button */}
              <button
                onClick={() => {
                  if (inputBar.query.trim() === "") return;
                  videoQueries.setVideoParams(prev => ({ ...prev, query: inputBar.query }));
                  setShowMobileSearch(false);
                }}
                className="p-2"
                aria-label="Search"
              >
                <IoIosSearch className="text-2xl" />
              </button>
              {/* Mic Button with basic animation */}
              <button
                onClick={() => setMicOpen(!micOpen)}
                aria-label="Voice search"
                className={`
              ml-1 bg-gray-200 rounded-full p-2 transition-transform duration-200
              ${micOpen ? "animate-pulse scale-110 bg-blue-200" : ""}
            `}
              >
                <MdMic className={`text-xl transition-colors ${micOpen ? "text-blue-600" : "text-gray-600"}`} />
              </button>
            </div>
                
            {/* SUGGESTION DROPDOWN (shows below the search bar) */}
            { getsuggestion.length > 0 && (
              <ul className="
        bg-white border-t border-b border-gray-200
        space-y-1 py-1
        w-full max-w-full
        z-30
        max-h-80 overflow-y-auto
        text-sm
      ">
                {getsuggestion.map((title, idx) => (
                  <li
                    key={title._id}
                    className={`cursor-pointer py-2 px-4 hover:bg-gray-100 ${idx === counter ? "bg-gray-200" : ""}`}
                    tabIndex={0}
                    onMouseDown={e => {
                      e.preventDefault();
                      setInputBar(prev => ({ ...prev, query: title.title }));
                      setSuggestionBar(false);
                      setShowMobileSearch(false);
                      videoQueries.setVideoParams(prev => ({ ...prev, query: title.title }));
                      setCounter(-1);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        setInputBar(prev => ({ ...prev, query: title.title }));
                        setSuggestionBar(false);
                        setShowMobileSearch(false);
                        videoQueries.setVideoParams(prev => ({ ...prev, query: title.title }));
                        setCounter(-1);
                      }
                    }}
                  >
                    {title.title}
                  </li>
                ))}
              </ul>
            )}

            {/* MicSpeechToText (with backdrop): */}
            <MicSpeechToText setMicOpen={setMicOpen} micOpen={micOpen} />
            {/* (Optional) suggestions dropdown here for mobile */}
          </div>
        )}

        {/* CONTROL SECTION */}
        <div className="
      flex items-center 
      gap-4 max-lg:gap-2 max-md:gap-1 
      text-xl 
      relative
      min-w-0
    ">
          {/* Video Upload Dropdown */}
          <div className="relative">

            <button
              onClick={() => setShowMobileSearch(true)}
              aria-label="Open search"
              className="md:hidden hover:bg-gray-200 p-2 max-md:p-1 rounded-full"
            >
              <IoIosSearch stroke="4" className="text-2xl max-md:text-lg max-[400px]:text-base" />
            </button>
            <button
              type="button"
              className="hover:bg-gray-200 p-2 max-md:p-1 rounded-full"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <RiVideoAddLine className="text-2xl max-md:text-lg max-[400px]:text-base" />
            </button>
            {showDropdown && (
              <ul className="absolute right-0 top-10 mt-2 w-28 max-[400px]:w-20 z-12 bg-white border border-gray-300 rounded-md shadow-lg cursor-pointer text-xs">
                <li onClick={() => { setToggleVideoUploading(false); setShowDropdown(false) }} className="px-4 py-2 hover:bg-gray-100">Video</li>
                <li onClick={() => { setToggleShortUploading(false); setShowDropdown(false) }} className="px-4 py-2 hover:bg-gray-100">Short</li>
                <li onClick={() => { setToggleLiveUploading(false); setShowDropdown(false) }} className="px-4 py-2 hover:bg-gray-100">Live</li>
              </ul>
            )}
          </div>

          {/* Notification */}
          <div>
            <Tooltip title="Notifications" arrow placement="bottom">
              <div className="hover:bg-gray-200 p-2 max-md:p-1 rounded-full flex items-center">
                <HiOutlineBell className="text-2xl max-md:text-lg max-[400px]:text-base" />
              </div>
            </Tooltip>
          </div>

          {/* Profile */}
          <div>
            <Tooltip
              title={!user?.fullname ? "Profile" : user?.fullname}
              arrow placement="bottom"
            >
              <button
                onClick={handleLoginAndProfile}
                className="hover:bg-gray-200 px-2 py-1 max-lg:px-1 rounded-full flex items-center gap-1 min-w-0"
              >
                {!loggedIn ? (
                  <CgProfile className="w-7 h-7 max-md:w-6 max-md:h-6" />
                ) : (
                  <img
                      src={user?.avatar}
                    alt="User Profile"
                    className="w-7 h-7 max-md:h-6 max-md:w-6 rounded-full object-cover"
                  />
                )}
                <span className="max-md:hidden max-xl:inline-block truncate text-sm">
                  {user?.fullname || "Profile"}
                </span>
              </button>
            </Tooltip>
            <ul className={`${openDropMenu ? "" : "hidden"} z-18 w-fit h-fit p-1 translate-y-2 text-lg max-md:text-sm absolute py-2 max-md:py-1 right-px shadow-2xs backdrop-blur-3xl bg-white`}>
              <li onClick={() => {  setOpenDropMenu(false) }} className="px-1 active:bg-gray-300 hover:bg-gray-200 ">Profile</li>
              <li onClick={() => { Navigate(`/channel/${user?.username.replace(' ','')}`); setOpenDropMenu(false)}} className="px-1  active:bg-gray-300 hover:bg-gray-200">View channel</li>
              <li onClick={() => { Navigate("/settings"); setOpenDropMenu(false) }} className="px-1  active:bg-gray-300 hover:bg-gray-200">Settings</li>
              <li onClick={() => { logoutUser(); setOpenDropMenu(false) }} className="px-1  active:bg-gray-300 hover:bg-gray-200">Logout</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
