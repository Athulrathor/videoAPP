import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../libs/axios";
import Header from "../components/Header";

const VideoPages = () => {
  const { VideoId } = useParams();

  const [currentVideo, setCurrentVideo] = useState({});

  // Fetch video details using VideoId (this is just a placeholder, implement your own logic)

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axiosInstance.post(
          `videos/get-video/${VideoId}`
        );
        const data = await response.data.data;
        setCurrentVideo(data);
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideoDetails();
  }, [VideoId]);

  return (
    <>
      <Header />
      <div className="h-[calc(100vh-65px)] m-2 overflow-y-scroll scrollbar-hide">
        <main className="flex p-2">
          <div
            style={{ flex: 3 }}
            className="w-screen"
          >
            <div style={{ marginBottom: "20px" }}>
              <video
                controls
                style={{ width: "100%", borderRadius: "8px" }}
                className="bg-black aspect-video rounded-2xl"
                src={currentVideo[0]?.videoFile}
                poster={currentVideo[0]?.thumbnail}
                typeof="video/mp4"
              >
                Your browser does not support the video tag.
              </video>
              <div className="m-1 mr-2 w-full flex items-center">
                <div className="max-w-20">
                  <img
                    src={currentVideo[0]?.owner.avatar}
                    alt="User Avatar"
                    className="w-14 h-14 rounded-full mr-2.5"
                                  />
                                  <div>
                    <h1 className="text-lg font-bold">{currentVideo[0]?.owner.username}</h1>
                    <p className="text-sm text-gray-500">{currentVideo[0]?.views} views</p>
                                  </div>
                </div>
                <div>
                  <h2>{currentVideo[0]?.title}</h2> {/* Display video title */}
                  {/* <p>{currentVideo[0]?.description}</p>{" "} */}
                </div>
              </div>
              {/* Display video description */}
            </div>
          </div>
          <div
            style={{ flex: 1 }}
            className="ml-2 w-full mb-2 rounded-xl bg-gray-300"
          >
            <h3>Recommended Videos</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "10px" }}>
                <img
                  src="https://via.placeholder.com/150"
                  alt="Thumbnail"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <p>Recommended Video 1</p>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <img
                  src="https://via.placeholder.com/150"
                  alt="Thumbnail"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <p>Recommended Video 2</p>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <img
                  src="https://via.placeholder.com/150"
                  alt="Thumbnail"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <p>Recommended Video 3</p>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </>
  );
};

export default VideoPages;
