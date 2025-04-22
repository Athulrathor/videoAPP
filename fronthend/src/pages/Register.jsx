import React, { useState } from "react";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";
import camera from "../assets/camera.svg"
import { Tooltip } from "@mui/material";
import { axiosInstance } from "../libs/axios";

const Register = () => {
  
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    coverImage:"",
  })
  const errorCheck = () => {
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!data.email.match(emailFormat)) {
      return "Email syntax invalid!";
    }

    if (data.email.trim() === '') {
      return "Email field empty!";
    }

    if (!data.password.match(passwordRegex)) {
      return "Password is weak!";
    }

    if (data.password.trim() === '') {
      return "Password should not be empty!";
    }

    if (data.name.trim() === '') {
      return "Fullname is required!";
    }

    return true;

  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({...data,avatar:reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (errorCheck() === true) {
        const res = await axiosInstance.post("/users/register", data);
        console.log(res)
      }

    } catch (error) {
      console.log("Error : ",error)
    }
  }

  return (
    <>
      <div className="w-screen h-screen flex items-center max-sm:items-baseline  justify-center bg-transparent">
        <div className="border-2 border-gray-200 rounded-2xl min-w-sm w-2xl max-sm:border-0 max-sm:shadow-none bg-white shadow-lg p-4 m-2 max-sm:m-0">
          <div className="flex justify-between max-sm:block max-sm:flex-col max-sm:py-2.5 my-6 mx-4">
            <div className="flex flex-col max-sm:items-center">
              {/* <div className="flex items-center font-bold text-2xl mt-4">
                <img
                src={videoLogo}
                  alt="#"
                  className="w-12 mr-1"
                />
                <h1>VidTube</h1>
              </div> */}
              <h1 className="mt-4 font-bold text-3xl max-sm:text-4xl max-sm:mt-6">
                Register
              </h1>
              <p className="opacity-70">Create an account in VidTube</p>
            </div>

            <div>
              <form
                onSubmit={handleSubmit}
                className="flex items-center flex-col max-sm:mt-20"
              >
                <div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <img
                        src={data.avatar}
                        alt="avatar"
                        className="size-32 rounded-full object-cover border-4 flex items-center justify-center"
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
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="relative flex items-center mt-6 max-sm:w-full w-2xs flex-col">
                  <TextField
                    className="border-gray-200"
                    style={{ width: "100%" }}
                    label="Fullname"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                  />
                </div>
                <div className="relative flex items-center mt-6 max-sm:w-full w-2xs">
                  <TextField
                    className="border-gray-200"
                    type="email"
                    style={{ width: "100%" }}
                    label="Email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                  />
                </div>
                <div className="relative flex items-center mt-6 max-sm:w-full w-2xs">
                  <TextField
                    className="border-gray-200"
                    type="password"
                    style={{ width: "100%" }}
                    label="Password"
                    autoComplete="password"
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value} )}
                  />
                </div>

                <div className="w-full">
                  <button
                    className="w-2xs max-sm:w-full py-1.5 mt-2 bg-blue-800 text-white font-medium rounded-xs hover:bg-blue-600 active:outline-2 active:outline-black active:shadow-lg"
                    type="submit"
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
