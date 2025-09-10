import React, { useState } from "react";
import videoLogo from "../assets/favicon.png";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import google from "../assets/google.svg";
import facebook from "../assets/facebook.svg";
import { AuthService, fetchLoginUser, setAuth, setSideActive } from "../redux/features/user.js";
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(fetchLoginUser({ email: email, password: password }));
        Navigate("/");
        dispatch(setSideActive("home"));
      toast.success('Google login successful');
        setEmail("");
        setPassword("");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error('Google login failed');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      const result = await AuthService.loginWithGoogle(access_token);
      if (result.user && result.accessToken) {

        dispatch(setAuth({ loggedIn: true, user: result.user, token: result?.accessToken }));
        console.log(result.accessToken,typeof(result.accessToken))
        toast.success('Google login successful');
        Navigate('/',{replace:true});
      } else {
        dispatch(setAuth({ loggedIn: false, user:{}, token: null }))
        toast.error('Google login failed');
      }
    },
    onError: () => toast.error('Google login failed'),
    flow: 'implicit',
  });
 
  return (
    <>
      <div className="w-screen h-screen flex items-center  justify-center bg-transparent">
        <div className={`${loading ? "bg-black/20 opacity-90" : ""} border-2 border-gray-200 rounded-2xl min-w-sm w-2xl max-sm:border-0 max-sm:shadow-none bg-white shadow-lg p-4`}>
          <div className={`flex justify-between max-sm:block max-sm:flex-col max-sm:py-2.5 max-sm:items-center my-6 mx-4`}>
            <div className="flex flex-col max-sm:items-center">
              <div className="flex items-center font-bold text-2xl mt-4">
                <img
                  src={videoLogo}
                  alt="#"
                  className="w-12 mr-1"
                />
                <h1>VidTube</h1>
              </div>
              <h1 className="mt-4 font-bold text-3xl max-sm:text-4xl max-sm:mt-6">
                Sign in
              </h1>
              <p className="opacity-70">continue to VidTube</p>
            </div>

            <div>
              <form
                onSubmit={handleSubmit}
                className="flex items-center tracking-tighte flex-col min-w-36 max-sm:mt-20"
              >
                <div className="relative flex items-center mt-6 w-2xs">
                  <TextField
                    className="border-gray-200"
                    type="email"
                    style={{ width: "100%" }}
                    label="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative flex items-center mt-6 w-2xs flex-col">
                  <TextField
                    className="border-gray-200"
                    style={{ width: "100%" }}
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <div className="mt-4 flex items-center justify-between w-full">
                    <Link
                      to="/forget/password"
                    
                      className="text-blue-500 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  
                </div>

                <button
                  type="submit"
                  className={`w-2xs outline-2 cursor-pointer disabled:opacity-80 disabled:grayscale-25 mt-6 py-2 text-2xl font-bold rounded-xs outline-[#e62d27] hover:bg-[#e62d27] hover:text-white active:outline-black black:active:outline-white  active:bg-[#e62d27] active:text-white transition duration-200 ease-in-out`}
                  // disabled={loading}
                >
                  {loading ? <h2>Loading</h2> : "Login"}
                </button>
                <div className="mt-4 flex items-center justify-center">
                  <Link
                    to="/register"
                    className="text-blue-500 hover:underline w-2xs"
                  >
                    Don't have an account? Register
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-4">
            <span>OR</span>

            <div className="flex space-x-4 mt-2">
              <button onClick={googleLogin} className="w-14 text-white rounded-full hover:opacity-75 h-14 active:border-2 active:border-black flex items-center justify-center active:shadow-lg transition duration-200 ease-in-out">
                <img
                  src={google}
                  alt=""
                  width={50}
                />
              </button>
              <button className="w-14 text-white hover:opacity-75 rounded-full h-14 active:border-2 active:border-black flex items-center justify-center active:shadow-lg transition duration-200 ease-in-out">
                <img
                  src={facebook}
                  alt=""
                  width={50}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
