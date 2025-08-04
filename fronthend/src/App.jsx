import React from "react";
import "./App.css";
// import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Videos from "./pages/Videos";
// import Short from "./pages/Short";
// import Playlist from "./pages/Playlist";
// import Post from "./pages/Post";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPages from "./pages/VideoPages";
import Channel from "./pages/Channel";
import Settings from "./pages/Settings";
import { useSelector } from "react-redux";
// import { useSelector } from "react-redux";

function App() {

  const { loggedIn } = useSelector((state) => state.user);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            index
            element={<Register />}
          />

          <Route
            path="/video/:VideoId"
            element={loggedIn ? <VideoPages /> : <Login />}
          />
          <Route
            path="/channel/:username"
            element={loggedIn ? <Channel /> : <Login />}
          />
          <Route
            path="/settings"
            element={loggedIn ? <Settings /> : <Login />}
          />
          {/*<Route
            path="/playlist"
            element={<Playlist />}
          />
          <Route
            path="/post"
            element={<Post />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          /> */}
          {/* <Route
            path="*"
            element={<ErrorPage />}
          /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
