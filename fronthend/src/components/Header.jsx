import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { MdMic } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiVideoAddLine } from "react-icons/ri";
import { HiOutlineBell } from "react-icons/hi";
import { FiMoreVertical } from "react-icons/fi";
import videoLogo from "../assets/favicon.png";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { setLoading, setError, logout } from "../redux/features/user.js";
import { axiosInstance } from "../libs/axios.js";
import Login from "../pages/Login.jsx";
import Select from "react-select";

const Header = (props) => {
  const { user } = useSelector((state) => state.user);
  const { loggedIn } = useSelector((state) => state.user);

  const [showDropdown, setShowDropdown] = useState(false);

  const Navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(loggedIn);

  if (user == undefined) {
    return null;
  }

  const logoutUser = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    await axiosInstance
      .post("/users/logout")
      .then(async (response) => {
        console.log(response.data.message);

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("persist:root");

        dispatch(setLoading(false));
        dispatch(setError(false));
        dispatch(logout());
      })
      .catch((error) => {
        console.error("Error:", error.message);
        dispatch(setLoading(false));
        dispatch(setError(true));
        alert("Logout failed. Please try again.");
      });
  };

  return (
    <>
      <div className="flex justify-between my-2 px-2 py-2 border-b-1 border-gray-300">
        {/* yt logo */}
        <div className="flex items-center gap-3 mr-6">
          <Tooltip
            title="Menu"
            arrow
            placement="bottom"
          >
            <button
              type="button"
              onClick={() =>
                props.menuToggle.setShowMenu(!props.menuToggle.showMenu)
              }
              className="w-12 rounded-full hover:bg-gray-200"
            >
              <HiMenu className="text-2xl hover:bg-gray-200 m-3" />
            </button>
          </Tooltip>
          <Tooltip
            title="VidTube"
            arrow
            placement="bottom"
          >
            <button
              type="button"
              onClick={() => Navigate("/")}
              className="flex items-center font-bold text-2xl tracking-tighter cursor-pointer "
            >
              <img
                src={videoLogo}
                alt="#"
                className="w-12 mr-1"
              />
              <h1>VidTube</h1>
            </button>
          </Tooltip>
        </div>

        {/* Search Section */}
        <div className="flex items-center px-8 max-lg:px-2">
          <div className="flex bg-white border-1 border-gray-300 items-center rounded-full h-12 transition-all w-[650px] max-xl:w-[420px] max-lg:w-[200px] pl-4 pr-1">
            <input
              type="text"
              placeholder="Search"
              className=" outline-none text-gray-700 w-full"
            />

            {/* Search Icon */}
            <div className="flex items-center justify-center rounded-full hover:bg-gray-200">
              <Tooltip
                title="Search"
                arrow
                placement="bottom"
              >
                <div className="">
                  <IoIosSearch className="text-2xl m-2" />
                </div>
              </Tooltip>
            </div>
          </div>

          {/* voice search icon with transition */}
          <div className="ml-5 max-lg:ml-1">
            <Tooltip
              title="Mic"
              arrow
              placement="bottom"
            >
              <div className="bg-gray-200 p-3 rounded-full">
                <MdMic className="text-2xl" />
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Control Section */}
        <div className="flex  items-center  gap-6 max-lg:gap-1.5 text-xl relative">
          {/* <button className="p-3 rounded-2xl hover:bg-gray-200">
              <FiMoreVertical />
            </button> */}
          <div>
            {/* <Tooltip
              title="Create"
              arrow
              placement="bottom"
            >
              <button
                type="button"
                className="hover:bg-gray-200 p-3 rounded-full"
              >
                <RiVideoAddLine />
              </button>
            </Tooltip> */}
            {/* <ul ref={dropDown} className="container w-24 p-1 gap-1 hidden absolute border-1 border-gray-200 bg-gray-100 flex-col items-center justify-center text-xs font-bold right-40">
              <li className="bg-white hover:bg-gray-200 w-full text-center">
                <h3>Video</h3>
              </li>
              <li className="bg-white hover:bg-gray-200 w-full text-center">
                <h3>Short</h3>
              </li>
            </ul> */}
            <div className="relative">
              <button
                type="button"
                className="hover:bg-gray-200 p-3 rounded-full"
                onMouseEnter={() => setShowDropdown(!showDropdown)}
              >
                <RiVideoAddLine />
              </button>

              {showDropdown && (
                <ul
                  className="absolute right-[-45px] mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg"
                  onMouseLeave={() => setShowDropdown(!showDropdown)}
                >
                    <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Video
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Short
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Live
                    </li>

                </ul>
              )}
            </div>
          </div>

          <div>
            <Tooltip
              title="Notifications"
              arrow
              placement="bottom"
            >
              <div className="hover:bg-gray-200 p-3 rounded-full">
                <HiOutlineBell />
              </div>
            </Tooltip>
          </div>

          <div>
            <Tooltip
              title={
                !user?.data?.user?.username
                  ? "Profile"
                  : user?.data?.user?.username
              }
              arrow
              placement="bottom"
            >
              <button
                onClick={loggedIn ? logoutUser : () => Navigate("/login")}
                className="hover:bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1"
              >
                {!loggedIn ? (
                  <CgProfile className="flex items-center justify-center" />
                ) : (
                  <img
                    src={user?.data?.user?.avatar || ""}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <h2 className="flex items-center justify-center">
                  {user?.data?.user?.username || "Profile"}
                </h2>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
