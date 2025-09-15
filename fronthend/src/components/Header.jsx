import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { ChevronLeft, X } from "lucide-react";
import MicSpeechToText from "./TextToSpeach.jsx";
import { fetchLogoutUser,logOut,setSideActive } from "../redux/features/user.js";;
import { toast } from "react-toastify";
import { fetchVideosSuggestion } from "../redux/features/videos.js";
import { useAppearance } from "../hooks/appearances.jsx";

const Header = (props) => {
  const { setToggleVideoUploading, setToggleShortUploading, setToggleLiveUploading, videoQueries } = props;
  const { appearanceSettings } = useAppearance();

  const { user, loggedIn,sideActive } = useSelector((state) => state.user);
  const { getsuggestion } = useSelector(state => state.videos);

  const [showDropdown, setShowDropdown] = useState(false);
  const searchBtn = useRef(null);
  const mobileInputRef = useRef();

  const [suggestionBar, setSuggestionBar] = useState(false);
  const [inputBar, setInputBar] = useState({ query: "" })
  const [counter, setCounter] = useState(0)

  const [micOpen, setMicOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [openDropMenu, setOpenDropMenu] = useState(false);

  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const handleKeyDown = useCallback((e) => {
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
  }, [suggestionBar, counter, getsuggestion])

  useEffect(() => {
    setCounter(-1);
  }, [getsuggestion])

  const logoutUser = () => {
    try {
      dispatch(fetchLogoutUser());
      dispatch(logOut());

      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      Navigate('/login', { replace: true });
      toast.success('Logged out successfully');
      setOpenDropMenu(false)
      
    } catch (error) {
      console.error("Error:", error.message);
      alert("Logout failed. Please try again.");
      setOpenDropMenu(false)
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
      <div
        className={`${appearanceSettings} flex justify-between items-center w-full p-2 max-md:p-1 max-[400px]:p-0.5 relative `}
        style={{
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: appearanceSettings.customBackground ? 'transparent' : "var(--color-bg-primary)",
          fontFamily: 'var(--font-family)'
        }}
    // className="flex justify-between items-center p-2 w-full relative header-container"
      >
        {/* yt LOGO + MENU ICON */}
        <div
          className="flex items-center gap-3 max-md:gap-1 max-[400px]:gap-0.5 min-w-0"
        >
          <Tooltip title="Menu" arrow placement="bottom">
            <button
              type="button"
              onClick={() => { props.menuToggle.setShowMenu(!props.menuToggle.showMenu); if (sideActive === "shorts") setSideActive("home") }}
              className="w-10 h-10 max-md:w-8 max-md:h-8 max-[400px]:w-7 max-[400px]:h-7 flex items-center justify-center cursor-pointer rounded-full p-0"
              style={{
                color: 'var(--color-text-primary)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {sideActive === "shorts" ? <ChevronLeft className="text-2xl max-md:text-xl max-[400px]:text-base" /> :
              <HiMenu className="text-2xl max-md:text-xl max-[400px]:text-base" />}
            </button>
          </Tooltip>
          <Tooltip title="VidTube" arrow placement="bottom">
            <button
              type="button"
              onClick={() => { Navigate("/"); setSideActive("home"); }}
              className="
            flex items-center font-bold 
             max-md:text-[var(--font-size-lg)] max-[400px]:text-base
            tracking-tighter cursor-pointer
            min-w-0
          "
              style={{
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--font-size-2xl)'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
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
        relative flex items-center 
        ${suggestionBar ? "rounded-t-2xl" : "rounded-full"} 
        h-11 max-xl:h-10 max-[400px]:h-8 
        transition-all 
        w-full max-w-[650px] max-xl:max-w-[420px] max-lg:max-w-[200px] max-[400px]:max-w-[120px] cursor-pointer
        pl-2 pr-1
      `} style={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)'
            }}>
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
              className="outline-none  w-full text-sm max-[400px]:text-xs bg-transparent py-1"
              style={{
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--font-size-sm)'
              }}
            />
            <div className={`flex ${getsuggestion.length > 0 && !suggestionBar ? "" : "hidden"}`}>
              <button
                type="button"
                onClick={() => { videoQueries.setVideoParams((prev) => ({ ...prev, query: "" })); setInputBar(prev => ({ ...prev, query: "" })) }} className="p-1 bg-transparent border-none cursor-pointer"
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = 'var(--color-hover)'}
                onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center rounded-full transition-colors duration-[--animation-duration]"
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
              <Tooltip title="Search" arrow placement="bottom">
                <button
                  ref={searchBtn}
                  onClick={e => { e.preventDefault(); if (inputBar.query === "") return; videoQueries.setVideoParams((prev) => ({ ...prev, query: inputBar.query })) }}
                  className="p-1 bg-transparent border-none cursor-pointer"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <IoIosSearch className="text-2xl max-md:text-lg max-[400px]:text-base m-0 cursor-pointer" />
                </button>
              </Tooltip>
            </div>

            {/* Suggestion Bar */}
            {suggestionBar && getsuggestion.length > 0 && (
              <ul className="absolute top-full left-0 right-0 z-15 space-y-1 py-1 max-h-80 overflow-y-auto transition-transform duration-500 w-full cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border)',
                  borderTop: 'none'
                }}>
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
                    className={`cursor-pointer w-full py-0.5 pl-2 text-sm max-[400px]:text-xs transition-colors duration-[--animation-duration] ${index === counter ? "" : ""
                      }`}
                    style={{
                      color: 'var(--color-text-primary)',
                      backgroundColor: index === counter ? 'var(--color-hover)' : 'transparent',
                      fontSize: 'var(--font-size-sm)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = index === counter ? 'var(--color-hover)' : 'transparent'}
                  >{title.title}</li>
                ))}
              </ul>
            )}
          </div>
          {/* Mic Icon */}
          <div className="ml-2 max-lg:ml-1">
            <Tooltip title="Mic" arrow placement="bottom">
              <div onClick={() => setMicOpen(!micOpen)} className="p-2 cursor-pointer max-md:p-1 rounded-full flex items-center justify-center transition-colors duration-[--animation-duration]"
                style={{
                  backgroundColor: 'var(--color-hover)',
                  color: 'var(--color-text-primary)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-active)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}>
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
            className="fixed inset-0 z-50 bg-black/60 flex flex-col cursor-pointer"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            tabIndex={-1}
            onKeyDown={e => {
              if (e.key === "Escape") setShowMobileSearch(false);
            }}
          >
            <div className="z-31 flex items-center w-full p-2 max-[400px]:p-1"
              style={{ backgroundColor: 'var(--color-bg-primary)' }}>
              {/* Close Button */}
              <button
                onClick={() => setShowMobileSearch(false)}
                aria-label="Close search"
                className="p-2 bg-transparent border-none cursor-pointer"
                style={{ color: 'var(--color-text-primary)' }}
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
                style={{
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--font-size-base)'
                }}
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
                className="p-2 cursor-pointer bg-transparent border-none"
                style={{ color: 'var(--color-text-primary)' }}
                aria-label="Search"
              >
                <IoIosSearch className="text-2xl" />
              </button>
              {/* Mic Button with basic animation */}
              <button
                onClick={() => setMicOpen(!micOpen)}
                aria-label="Voice search"
                className={`ml-1 rounded-full p-2 transition-transform cursor-pointer duration-200 border-none ${micOpen ? "animate-pulse scale-110" : ""
                  }`}
                style={{
                  backgroundColor: micOpen ? 'var(--accent-color)' : 'var(--color-hover)',
                  color: micOpen ? 'white' : 'var(--color-text-primary)'
                }}
              >
                <MdMic className={`text-xl transition-colors ${micOpen ? "text-blue-600" : "text-gray-600"}`} />
              </button>
            </div>
                
            {/* SUGGESTION DROPDOWN (shows below the search bar) */}
            { getsuggestion.length > 0 && (
              <ul className="border-t border-b space-y-1 py-1 w-full max-w-full z-30 max-h-80 overflow-y-auto text-sm"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)'
                }}>
                {getsuggestion.map((title, idx) => (
                  <li
                    key={title._id}
                    className="border-t border-b space-y-1 py-1 w-full max-w-full z-30 max-h-80 overflow-y-auto text-sm"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      borderColor: 'var(--color-border)'
                    }}
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
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = idx === counter ? 'var(--color-hover)' : 'transparent'}
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
        <div className="flex items-center space-x-2 max-lg:gap-2 max-md:gap-1 text-xl relative min-w-0">
          {/* Video Upload Dropdown */}
          <div className="relative space-x-1.5">

            <button
              onClick={() => setShowMobileSearch(true)}
              aria-label="Open search"
            className="md:hidden cursor-pointer p-2 max-md:p-1 rounded-full bg-transparent border-none transition-colors duration-[--animation-duration]"
            style={{ color: 'var(--color-text-primary)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <IoIosSearch stroke="4" className="text-2xl max-md:text-lg max-[400px]:text-base" />
            </button>
            <button
              type="button"
            className="p-2 max-md:p-1 cursor-pointer rounded-full bg-transparent border-none transition-colors duration-[--animation-duration]"
            style={{ color: 'var(--color-text-primary)' }}
            onClick={() => setShowDropdown(!showDropdown)}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <RiVideoAddLine stroke="4" className="text-2xl max-md:text-lg max-[400px]:text-base" />
            </button>
            {showDropdown && (
            <ul className="absolute right-0 top-10 mt-2 w-28 max-[400px]:w-20 z-12 border rounded-md shadow-lg cursor-pointer text-xs"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)'
              }}>
              <li onClick={() => { setToggleVideoUploading(false); setShowDropdown(false) }} className="px-4 py-2 transition-colors duration-[--animation-duration] cursor-pointer"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Video</li>
              <li onClick={() => { setToggleShortUploading(false); setShowDropdown(false) }} className="px-4 py-2 transition-colors duration-[--animation-duration] cursor-pointer"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Short</li>
              <li onClick={() => { setToggleLiveUploading(false); setShowDropdown(false) }} className="px-4 py-2 transition-colors duration-[--animation-duration] cursor-pointer"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Live</li>
              </ul>
            )}
          </div>

          {/* Notification */}
          <div>
            <Tooltip title="Notifications" arrow placement="bottom">
              <div className="p-2 max-md:p-1 cursor-pointer rounded-full flex items-center transition-colors duration-[--animation-duration]"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                <HiOutlineBell className="text-2xl max-md:text-lg max-[400px]:text-base" />
              </div>
            </Tooltip>
          </div>

          {/* Profile */}
          <div>
            <Tooltip
              title={!user?.username ? "Profile" : user?.username}
              arrow placement="bottom"
            >
              <button
                onClick={handleLoginAndProfile}
                className="px-2 py-1 max-lg:px-1 cursor-pointer rounded-full flex items-center gap-1 min-w-0 bg-transparent border-none transition-colors duration-[--animation-duration]"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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
                {/* <span className="max-md:hidden max-xl:inline-block truncate text-sm">
                  {user?.username || "Profile"}
                </span> */}
              </button>
            </Tooltip>
            <ul className={`${openDropMenu ? "" : "hidden"} cursor-pointer z-18 w-fit h-fit p-1 translate-y-2 text-lg max-md:text-sm absolute py-2 max-md:py-1 right-px shadow-2xl backdrop-blur-3xl rounded-lg`}
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)'
              }}>
              <li onClick={() => { setOpenDropMenu(false) }} className="px-2 rounded-lg cursor-pointer transition-colors duration-[--animation-duration]"
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Profile</li>
              <li onClick={() => { Navigate(`/channel/${user?.username.replace(' ', '')}`); setOpenDropMenu(false) }} className="px-2 rounded-lg cursor-pointer transition-colors duration-[--animation-duration]"
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>View channel</li>
              <li onClick={() => { Navigate("/settings"); setOpenDropMenu(false) }} className="px-2 rounded-lg cursor-pointer transition-colors duration-[--animation-duration]"
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Settings</li>
              <li onClick={logoutUser} className="px-2 rounded-lg cursor-pointer transition-colors duration-[--animation-duration]"
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Logout</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
