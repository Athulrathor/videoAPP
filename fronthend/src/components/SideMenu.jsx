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
import { useAppearance } from '../hooks/appearances';

function SideMenu(props) {
  const { appearanceSettings } = useAppearance();
  const currentYear = new Date().getFullYear();

  const dispatch = useDispatch();
  const getLocation = useLocation();
  const Navigate = useNavigate();

  const { user, loggedIn, sideActive } = useSelector((state) => state.user);
  const { subcriber } = useSelector(state => state.subscriber);

  useEffect(() => {
    dispatch(userSubcribers());
  }, [dispatch]);

  return (
    <div>
      <div
        className={`scrollBar h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] ${props.menuToggle?.showMenu ? `-translate-x-[100%] absolute` : "translate-x-[0%]"
          } max-md:absolute p-2.5 max-w-[224px] z-14 -translate-x-[100%] overflow-y-scroll transition-all duration-1000 ease-in-out scroll-smooth`}
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transitionDuration: appearanceSettings.reducedMotion ? '0s' : '1s'
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Main Navigation Section */}
        <div
          className="border-b pb-5 gap-1 transition-colors"
          style={{
            borderColor: 'var(--color-border)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          <div
            className={`cursor-pointer rounded-lg px-3 py-2 flex items-center gap-4 transition-all ${sideActive === "home" ? "" : ""
              }`}
            onClick={() => {
              dispatch(setSideActive("home"));
              props.menuToggle?.setShowMenu(true);
              if (getLocation !== "/") return Navigate("/");
            }}
            style={{
              backgroundColor: sideActive === "home"
                ? 'var(--color-bg-secondary)'
                : 'transparent',
              color: sideActive === "home"
                ? 'var(--accent-color)'
                : 'var(--color-text-primary)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              if (sideActive !== "home") {
                e.target.style.backgroundColor = 'var(--color-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (sideActive !== "home") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            role="button"
            tabIndex={0}
            aria-current={sideActive === "home" ? "page" : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dispatch(setSideActive("home"));
                props.menuToggle?.setShowMenu(true);
                if (getLocation !== "/") return Navigate("/");
              }
            }}
          >
            {sideActive === "home" ? (
              <GoHomeFill className="w-5 h-5 flex-shrink-0" />
            ) : (
              <GrHomeRounded className="w-5 h-5 flex-shrink-0" />
            )}
            {props.menuToggle?.showMenu === true ? "" : (
              <h1
                className="font-medium"
                style={{
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)'
                }}
              >
                Home
              </h1>
            )}
          </div>

          <div
            className={`font-normal cursor-pointer rounded-lg px-3 py-2 gap-4 flex items-center transition-all ${sideActive === "shorts" ? "" : ""
              }`}
            onClick={() => {
              dispatch(setSideActive("shorts"));
              props.menuToggle?.setShowMenu(true);
              if (getLocation !== "/") return Navigate("/");
            }}
            style={{
              backgroundColor: sideActive === "shorts"
                ? 'var(--color-bg-secondary)'
                : 'transparent',
              color: sideActive === "shorts"
                ? 'var(--accent-color)'
                : 'var(--color-text-primary)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              if (sideActive !== "shorts") {
                e.target.style.backgroundColor = 'var(--color-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (sideActive !== "shorts") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            role="button"
            tabIndex={0}
            aria-current={sideActive === "shorts" ? "page" : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dispatch(setSideActive("shorts"));
                props.menuToggle?.setShowMenu(true);
                if (getLocation !== "/") return Navigate("/");
              }
            }}
          >
            {sideActive === "shorts" ? (
              <img
                src={shortsfill}
                alt="Shorts"
                className="w-5 h-5 flex-shrink-0"
              />
            ) : (
              <img
                src={shorts}
                alt="Shorts"
                className="w-5 h-5 flex-shrink-0"
              />
            )}
            {props.menuToggle?.showMenu === true ? "" : (
              <h1
                className="font-medium"
                style={{
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)'
                }}
              >
                Shorts
              </h1>
            )}
          </div>

          <div
            className={`font-normal cursor-pointer rounded-lg px-3 py-2 gap-4 flex items-center transition-all ${sideActive === "subscription" ? "" : ""
              }`}
            onClick={() => {
              dispatch(setSideActive("subscription"));
              props.menuToggle?.setShowMenu(true);
              if (getLocation !== "/") return Navigate("/");
            }}
            style={{
              backgroundColor: sideActive === "subscription"
                ? 'var(--color-bg-secondary)'
                : 'transparent',
              color: sideActive === "subscription"
                ? 'var(--accent-color)'
                : 'var(--color-text-primary)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              if (sideActive !== "subscription") {
                e.target.style.backgroundColor = 'var(--color-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (sideActive !== "subscription") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            role="button"
            tabIndex={0}
            aria-current={sideActive === "subscription" ? "page" : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dispatch(setSideActive("subscription"));
                props.menuToggle?.setShowMenu(true);
                if (getLocation !== "/") return Navigate("/");
              }
            }}
          >
            {sideActive === "subscription" ? (
              <BsCollectionPlayFill className="w-5 h-5 flex-shrink-0" />
            ) : (
              <BsCollectionPlay className="w-5 h-5 flex-shrink-0" />
            )}
            {props.menuToggle?.showMenu === true ? "" : (
              <h1
                className="font-medium"
                style={{
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)'
                }}
              >
                Subscription
              </h1>
            )}
          </div>
        </div>

        {/* User Personal Section */}
        {loggedIn ? (
          <div
            className="border-b py-5 transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              paddingTop: 'var(--component-padding)',
              paddingBottom: 'var(--component-padding)',
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            {props.menuToggle?.showMenu === true ? (
              ""
            ) : (
              <h1
                onClick={() => Navigate(`/channel/${user?.username}`)}
                className="flex items-center gap-4 py-1 font-semibold cursor-pointer rounded-lg px-3 transition-all"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-hover)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    Navigate(`/channel/${user?.username}`);
                  }
                }}
              >
                {loggedIn ? user?.username : "You"}{" "}
                <IoIosArrowForward />
              </h1>
            )}

            <div>
              <h1
                className={`flex items-center gap-4 font-normal rounded-lg px-3 py-2 cursor-pointer transition-all ${sideActive === "history" ? "" : ""
                  }`}
                onClick={() => dispatch(setSideActive("history"))}
                style={{
                  backgroundColor: sideActive === "history"
                    ? 'var(--color-bg-secondary)'
                    : 'transparent',
                  color: sideActive === "history"
                    ? 'var(--accent-color)'
                    : 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  if (sideActive !== "history") {
                    e.target.style.backgroundColor = 'var(--color-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sideActive !== "history") {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
                role="button"
                tabIndex={0}
                aria-current={sideActive === "history" ? "page" : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch(setSideActive("history"));
                  }
                }}
              >
                {sideActive === "history" ? (
                  <History className="text-xl fill-current stroke-3 flex-shrink-0" />
                ) : (
                  <LucideHistory className="text-xl flex-shrink-0" />
                )}
                {props.menuToggle?.showMenu === true ? "" : "History"}
              </h1>

              <h1
                className={`flex items-center gap-4 text-nowrap cursor-pointer font-normal rounded-lg px-3 py-2 transition-all ${sideActive === "Manage Videos" ? "" : ""
                  }`}
                onClick={() => {
                  dispatch(setSideActive("Manage Videos"));
                  props.menuToggle?.setShowMenu(true);
                  dispatch(fetchVideoByOwner(user?.data?.user?._id));
                }}
                style={{
                  backgroundColor: sideActive === "Manage Videos"
                    ? 'var(--color-bg-secondary)'
                    : 'transparent',
                  color: sideActive === "Manage Videos"
                    ? 'var(--accent-color)'
                    : 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  if (sideActive !== "Manage Videos") {
                    e.target.style.backgroundColor = 'var(--color-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sideActive !== "Manage Videos") {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
                role="button"
                tabIndex={0}
                aria-current={sideActive === "Manage Videos" ? "page" : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch(setSideActive("Manage Videos"));
                    props.menuToggle?.setShowMenu(true);
                    dispatch(fetchVideoByOwner(user?.data?.user?._id));
                  }
                }}
              >
                {sideActive === "Manage Videos" ? (
                  <ChartNoAxesGanttIcon className="text-xl stroke-3 flex-shrink-0" />
                ) : (
                  <ChartNoAxesGanttIcon className="text-xl flex-shrink-0" />
                )}
                {props.menuToggle?.showMenu === true ? "" : "Manage Videos"}
              </h1>

              <h1
                className={`flex items-center gap-4 cursor-pointer font-normal rounded-lg px-3 py-2 transition-all ${sideActive === "playlists" ? "" : ""
                  }`}
                onClick={() => {
                  dispatch(setSideActive("playlists"));
                  if (getLocation !== "/") return Navigate("/");
                }}
                style={{
                  backgroundColor: sideActive === "playlists"
                    ? 'var(--color-bg-secondary)'
                    : 'transparent',
                  color: sideActive === "playlists"
                    ? 'var(--accent-color)'
                    : 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  if (sideActive !== "playlists") {
                    e.target.style.backgroundColor = 'var(--color-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sideActive !== "playlists") {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
                role="button"
                tabIndex={0}
                aria-current={sideActive === "playlists" ? "page" : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch(setSideActive("playlists"));
                    if (getLocation !== "/") return Navigate("/");
                  }
                }}
              >
                {sideActive === "playlists" ? (
                  <PiQueueBold className="text-xl stroke-1 flex-shrink-0" />
                ) : (
                  <PiQueueBold className="text-xl flex-shrink-0" />
                )}
                {props.menuToggle?.showMenu === true ? "" : "Playlists"}
              </h1>

              <h1
                className={`flex items-center gap-4 cursor-pointer font-normal rounded-lg px-3 py-2 transition-all ${sideActive === "your videos" ? "" : ""
                  }`}
                onClick={() => {
                  dispatch(setSideActive("your videos"));
                  dispatch(fetchVideoByOwner(user?._id));
                  props.menuToggle?.setShowMenu(true);
                  if (getLocation !== "/") return Navigate("/");
                }}
                style={{
                  backgroundColor: sideActive === "your videos"
                    ? 'var(--color-bg-secondary)'
                    : 'transparent',
                  color: sideActive === "your videos"
                    ? 'var(--accent-color)'
                    : 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  if (sideActive !== "your videos") {
                    e.target.style.backgroundColor = 'var(--color-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sideActive !== "your videos") {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
                role="button"
                tabIndex={0}
                aria-current={sideActive === "your videos" ? "page" : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch(setSideActive("your videos"));
                    dispatch(fetchVideoByOwner(user?._id));
                    props.menuToggle?.setShowMenu(true);
                    if (getLocation !== "/") return Navigate("/");
                  }
                }}
              >
                {sideActive === "your videos" ? (
                  <BsPlayBtnFill className="text-xl flex-shrink-0" />
                ) : (
                  <GoVideo className="text-xl flex-shrink-0" />
                )}
                {props.menuToggle?.showMenu === true ? "" : "Your Videos"}
              </h1>

              <h1
                className={`flex items-center gap-4 cursor-pointer font-normal rounded-lg px-3 py-2 transition-all ${sideActive === "likedVideos" ? "" : ""
                  }`}
                onClick={() => {
                  dispatch(setSideActive("likedVideos"));
                  props.menuToggle?.setShowMenu(true);
                  if (getLocation !== "/") return Navigate("/");
                }}
                style={{
                  backgroundColor: sideActive === "likedVideos"
                    ? 'var(--color-bg-secondary)'
                    : 'transparent',
                  color: sideActive === "likedVideos"
                    ? 'var(--accent-color)'
                    : 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  if (sideActive !== "likedVideos") {
                    e.target.style.backgroundColor = 'var(--color-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sideActive !== "likedVideos") {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
                role="button"
                tabIndex={0}
                aria-current={sideActive === "likedVideos" ? "page" : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch(setSideActive("likedVideos"));
                    props.menuToggle?.setShowMenu(true);
                    if (getLocation !== "/") return Navigate("/");
                  }
                }}
              >
                {sideActive === "likedVideos" ? (
                  <BiSolidLike className="text-xl flex-shrink-0" />
                ) : (
                  <BiLike className="text-xl flex-shrink-0" />
                )}
                {props.menuToggle?.showMenu === true ? "" : "Liked videos"}
              </h1>
            </div>
          </div>
        ) : (
          ""
        )}

        {/* Subscribers Section */}
        {loggedIn ? (
          <div
            className={`${subcriber.length === 0 ? "hidden" : ""} border-b py-5 transition-colors`}
            style={{
              borderColor: 'var(--color-border)',
              paddingTop: 'var(--component-padding)',
              paddingBottom: 'var(--component-padding)',
              transitionDuration: 'var(--animation-duration)'
            }}
            role="region"
            aria-label="Subscriptions"
          >
            {props.menuToggle?.showMenu === true ? (
              ""
            ) : (
              <h1
                className="flex items-center gap-4 font-semibold cursor-pointer rounded-lg px-3 mb-2"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  marginBottom: 'var(--spacing-unit)'
                }}
              >
                Subscribers
              </h1>
            )}
            <div>
              {subcriber !== null &&
                subcriber.map((sub) => (
                  <div
                    key={sub?._id}
                    className="flex items-center gap-4 cursor-pointer font-normal rounded-lg px-3 py-2 transition-all"
                    onClick={() => {
                      Navigate(`/channel/${sub?.subcribers?.username}`);
                      props.menuToggle?.setShowMenu(true);
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        Navigate(`/channel/${sub?.subcribers?.username}`);
                        props.menuToggle?.setShowMenu(true);
                      }
                    }}
                  >
                    <div className="border-transparent">
                      <img
                        src={sub?.subcribers?.avatar}
                        className="rounded-full w-6 aspect-square drop-shadow-xs flex-shrink-0"
                        alt={`${sub?.subcribers?.username} avatar`}
                        loading="lazy"
                      />
                    </div>
                    {props.menuToggle?.showMenu === true ? (
                      ""
                    ) : (
                      <h1 className="truncate">{sub?.subcribers?.username}</h1>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          ""
        )}

        {/* Settings and Support Section */}
        <div
          className="border-b py-5 transition-colors"
          style={{
            borderColor: 'var(--color-border)',
            paddingTop: 'var(--component-padding)',
            paddingBottom: 'var(--component-padding)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          <h1
            className={`flex items-center gap-4 font-normal cursor-pointer rounded-lg px-3 py-2 transition-all ${sideActive === "settings" ? "" : ""
              }`}
            onClick={() => Navigate(`/settings`)}
            style={{
              backgroundColor: sideActive === "settings"
                ? 'var(--color-bg-secondary)'
                : 'transparent',
              color: sideActive === "settings"
                ? 'var(--accent-color)'
                : 'var(--color-text-primary)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              if (sideActive !== "settings") {
                e.target.style.backgroundColor = 'var(--color-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (sideActive !== "settings") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                Navigate(`/settings`);
              }
            }}
          >
            <IoSettingsOutline className="text-2xl flex-shrink-0" />
            {props.menuToggle?.showMenu === true ? "" : "Settings"}
          </h1>

          <h1
            className={`flex items-center gap-4 text-nowrap font-normal cursor-pointer rounded-lg px-3 py-2 transition-all ${sideActive === "report history" ? "" : ""
              }`}
            onClick={() => {
              dispatch(setSideActive("report history"));
              props.menuToggle?.setShowMenu(true);
            }}
            style={{
              backgroundColor: sideActive === "report history"
                ? 'var(--color-bg-secondary)'
                : 'transparent',
              color: sideActive === "report history"
                ? 'var(--accent-color)'
                : 'var(--color-text-primary)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              if (sideActive !== "report history") {
                e.target.style.backgroundColor = 'var(--color-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (sideActive !== "report history") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            role="button"
            tabIndex={0}
            aria-current={sideActive === "report history" ? "page" : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dispatch(setSideActive("report history"));
                props.menuToggle?.setShowMenu(true);
              }
            }}
          >
            <MdOutlinedFlag className="text-2xl flex-shrink-0" />
            {props.menuToggle?.showMenu === true ? "" : "Report history"}
          </h1>

          <h1
            className={`flex items-center gap-4 font-normal cursor-pointer rounded-lg px-3 py-2 transition-all ${sideActive === "help" ? "" : ""
              }`}
            onClick={() => {
              dispatch(setSideActive("help"));
              props.menuToggle?.setShowMenu(true);
            }}
            style={{
              backgroundColor: sideActive === "help"
                ? 'var(--color-bg-secondary)'
                : 'transparent',
              color: sideActive === "help"
                ? 'var(--accent-color)'
                : 'var(--color-text-primary)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              if (sideActive !== "help") {
                e.target.style.backgroundColor = 'var(--color-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (sideActive !== "help") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            role="button"
            tabIndex={0}
            aria-current={sideActive === "help" ? "page" : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dispatch(setSideActive("help"));
                props.menuToggle?.setShowMenu(true);
              }
            }}
          >
            <MdHelpOutline className="text-2xl flex-shrink-0" />
            {props.menuToggle?.showMenu === true ? "" : "Help"}
          </h1>

          <h1
            className={`flex items-center gap-4 font-normal cursor-pointer rounded-lg px-3 py-2 transition-all ${sideActive === "feedback" ? "" : ""
              }`}
            onClick={() => {
              dispatch(setSideActive("feedback"));
              props.menuToggle?.setShowMenu(true);
            }}
            style={{
              backgroundColor: sideActive === "feedback"
                ? 'var(--color-bg-secondary)'
                : 'transparent',
              color: sideActive === "feedback"
                ? 'var(--accent-color)'
                : 'var(--color-text-primary)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              if (sideActive !== "feedback") {
                e.target.style.backgroundColor = 'var(--color-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (sideActive !== "feedback") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            role="button"
            tabIndex={0}
            aria-current={sideActive === "feedback" ? "page" : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dispatch(setSideActive("feedback"));
                props.menuToggle?.setShowMenu(true);
              }
            }}
          >
            <MdOutlineFeedback className="text-2xl flex-shrink-0" />
            {props.menuToggle?.showMenu === true ? "" : "Send feedback"}
          </h1>
        </div>

        {/* Footer Section */}
        {props.menuToggle?.showMenu === true ? (
          ""
        ) : (
          <div
            className="py-5 transition-colors"
            style={{
              paddingTop: 'var(--component-padding)',
              paddingBottom: 'var(--component-padding)',
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            <p
              className="text-sm font-semibold pb-2 text-wrap"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                paddingBottom: 'var(--spacing-unit)'
              }}
            >
              About Press Copyright Contact us Creators Advertise Developers
            </p>
            <p
              className="text-sm font-semibold pb-2 text-wrap"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                paddingBottom: 'var(--spacing-unit)'
              }}
            >
              Terms Privacy Policy & Safety How YouTube works Test new features
            </p>
            <div
              className="pt-2"
              style={{ paddingTop: 'var(--spacing-unit)' }}
            >
              <h1
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                @ {currentYear} VidTube CC
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideMenu;
