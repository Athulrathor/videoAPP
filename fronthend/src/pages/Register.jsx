import React, { useCallback, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import camera from "../assets/camera.svg";
import { Tooltip } from "@mui/material";
import { axiosInstance } from "../libs/axios";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Register = () => {
  const [data, setData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    avatar: "",
    coverImage: "",
  });

  const [loading, setLoading] = useState(false);

  const Navigate = useNavigate();

  const [viewData, setViewData] = useState({
    viewAvatar: "",
    viewCoverImage:"",
  });

  console.log(data)

  const [show, setShow] = useState(false);

  const [error, setError] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });

  const errorCheck = useCallback(() => {
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/m;

    // if (!data.password.match(passwordRegex)) {
    //   setError({ password: "Password is weak!" });
    // }

    if (data.email.trim() === "") {
      setError({email : "Email field empty!"});
    } else if (!data.email.match(emailFormat)) {
      setError({email : "Email syntax invalid!"});
    }

    // if (data.password.trim() === "") {
    //   setError({ password: "Password should not be empty!" });
    // }

    if (data.password.trim() === "") {
      setError({password : "Password should not be empty!"});
    } else if (!data.password.match(passwordRegex)) {
      setError({password : "Password is weak!"});
    }

    if (data.password.match(passwordRegex)) {
      setError({ password: "" });
    }

    if (data.fullname.trim() === "") {
      setError({ fullname: "Fullname is required!" });
    }

    if (data.username.trim() === "") {
      setError({ username: "username is required!" });
    }

    return 1;
  }, [data]);

  useEffect(() => {

    if (data.username !== "" || data.fullname !== "") {
      errorCheck();
    }

  }, [data,errorCheck,setData]);

  const handleFileChange1 = (event) => {
    const file = event.target.files[0];

    console.log(file, event.target.files[0]);
    setData({ ...data, avatar: file });
    if (file) {

      
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setViewData({ ...viewData, viewAvatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange2 = (event) => {
    const file = event.target.files[0];
    setData({...data, coverImage: file });
    if (file) {
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setViewData({ ...viewData, viewCoverImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (errorCheck() === 1) {
        const formData = new FormData();
        formData.append("fullname", data.fullname);
        formData.append("email", data.email);
        formData.append("username", data.username);
        formData.append("password", data.password);

        setLoading(true);

        if (data.avatar) formData.append("avatar", data.avatar);
        if (data.coverImage) formData.append("coverImage", data.coverImage);

        const res = await axiosInstance.post("/users/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res) {
          setLoading(false);
        }

        console.log("User logged in successfully!",res);
        Navigate("/login");

      }
    } catch (error) {
      console.log("Error : ", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex items-center max-sm:items-baseline  justify-center bg-transparent">
        <div className="border-2 border-gray-200 rounded-2xl min-w-sm w-2xl max-sm:border-0 max-sm:shadow-none bg-white shadow-lg p-4 m-2 max-sm:m-0">
          <form
            onSubmit={handleSubmit}
            className= {`flex justify-between max-sm:block max-sm:flex-col max-sm:py-2.5 my-6 mx-4 ${loading ? "opacity-50" : ""} relative`}
          >

            <div className= {`animate-pulse absolute right-1/2 top-1/2 text-4xl translate-x-1/2 -translate-y-1/2 ${loading ? "" : "hidden"} `}>Loading...</div>
            <div className="flex flex-col max-sm:items-center">
              <h1 className="mt-4 font-bold text-3xl max-sm:text-4xl max-sm:mt-6">
                Register
              </h1>
              <p className="opacity-70">Create an account in VidTube</p>
              <div>
                <div>
                  <div className="flex flex-col items-center gap-4 mt-2">
                    <div className="relative">
                      <img
                        src={viewData.viewAvatar || null}
                        alt="avatar"
                        className="size-18 rounded-full object-cover border-4 flex items-center justify-center"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200`}
                      >
                        <Tooltip title={"Upload avatar"}>
                          <div className="w-5 h-5 text-base-200 bg-white rounded-full">
                            <img
                              src={camera}
                              alt=""
                            />
                          </div>
                        </Tooltip>
                        <input
                          type="file"
                          id="avatar-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange1}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="relative flex items-center mt-6 max-sm:w-full w-2xs flex-col">
                  <TextField
                    className="border-gray-200"
                    style={{ width: "100%" }}
                    label="Username"
                    type="text"
                    value={data.username}
                    onChange={(e) =>
                      setData({ ...data, username: e.target.value })
                    }
                  />
                </div>
                <div className="text-red-600 text-base mt-0.5 mb-0.5 w-full ml-1">
                  {error.username}
                </div>
                <div>
                  <div>
                    <div className="flex flex-col items-center gap-4 mt-4">
                      <div className="relative w-full">
                        <img
                          src={viewData.viewCoverImage || null}
                          alt="coverImage"
                          className="h-20 w-[100%] border-4"
                        />
                        <label
                          htmlFor="cover-image-upload"
                          className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200`}
                        >
                          <Tooltip title={"Upload cover image"}>
                            <div className="w-5 h-5 text-base-200 bg-white rounded-full">
                              <img
                                src={camera}
                                alt=""
                              />
                            </div>
                          </Tooltip>
                          <input
                            type="file"
                            id="cover-image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange2}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center flex-col max-sm:mt-20">
                <div className="relative flex items-center mt-6 max-sm:w-full w-2xs flex-col">
                  <TextField
                    className="border-gray-200"
                    style={{ width: "100%" }}
                    label="Fullname"
                    type="text"
                    value={data.fullname}
                    onChange={(e) =>
                      setData({ ...data, fullname: e.target.value })
                    }
                  />
                </div>
                <div className="text-red-600 text-base mt-0.5 mb-0.5 w-full ml-1">
                  {error.fullname}
                </div>
                <div className="relative flex items-center mt-6 max-sm:w-full w-2xs">
                  <TextField
                    className="border-gray-200"
                    type="email"
                    style={{ width: "100%" }}
                    label="Email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </div>
                <div className="text-red-600 text-base mt-0.5 mb-0.5 w-full ml-1">
                  {error.email}
                </div>
                <div className="relative flex items-center mt-6 max-sm:w-full w-2xs">
                  <TextField
                    className="border-gray-200"
                    type={show ? "text" : "password"}
                    style={{ width: "100%" }}
                    label="Password"
                    autoComplete="password"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                  <div
                    onClick={() => setShow(!show)}
                    className="absolute right-0 mr-2"
                  >
                    {show ? (
                      <FaRegEyeSlash size={30} />
                    ) : (
                      <FaRegEye size={30} />
                    )}
                  </div>
                </div>
                <div className="text-red-600 text-base mt-0.5 mb-0.5 w-full ml-1">
                  {error.password}
                </div>
                <div className="w-full">
                  <button
                    className="w-2xs max-sm:w-full py-1.5 mt-2 bg-blue-800 text-white font-medium rounded-xs hover:bg-blue-600 active:outline-2 active:outline-black active:shadow-lg"
                    type="submit"
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>

                <div className="mt-4 w-full">
                  <Link
                    to="/login"
                    className="text-blue-500 hover:underline"
                  >
                    Already have an account? Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
