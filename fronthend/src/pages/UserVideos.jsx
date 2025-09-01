import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Video, Volume2, VolumeX } from 'lucide-react';
import { useSelector } from "react-redux";
import UploadVideo from '../components/UploadVideo';

const UserVideos = ({toggleVideoUploading,setToggleVideoUploading,timeAgo,formatTime}) => {
  
  const { videoByOwner } = useSelector(state => state.videos);

  const Navigate = useNavigate();

    const [videoStatus, setVideoStatus] = useState({
      isPlaying: false,
      isMuted: false,
      showControl: false,
      duration: 0,
    });

    const handleOnTimeUpdate = (videoId2,video) => {
      if (video) {
        setVideoStatus((prev) => ({
          ...prev,
          [videoId2]: { ...prev[videoId2], duration: video.currentTime },
        }));
      }
  };

  const handleOverAllEvent = (e) => {
    const targetId = e.target.id;
    const targetName = e.target.getAttribute('name');
    const eventType = e.type;

    if (eventType === 'timeupdate' && (targetName === 'video' || targetName === "duration") && targetId) {
      handleOnTimeUpdate(targetId, e.target);
      return;
    }


    if ((targetName === "duration" || targetName === "title") && eventType === 'click' && targetId) {
      Navigate(`/video/${targetId}`);
      window.location.reload();
      return;
    }

    if ((targetName === "avatar" || targetName === "username") && targetId && eventType === 'click') {
      const username = e.target.getAttribute('data-username');
      Navigate(`/channel/${username}`)
      return;
    }

    if (targetName === "video" || targetName === "duration") {

      const videoElements = document.getElementsByName('video');

      const targetedVideo = Array.from(videoElements).find((video) => video.id === targetId);

      if (!targetedVideo) return;

      if (eventType === 'mouseenter') {
        setVideoStatus((prev) => ({
          ...prev,
          [targetId]: { ...prev[targetId], showControl: true },
        }));
        if (targetedVideo.hoverTimeout) {
          clearTimeout(targetedVideo.hoverTimeout);
        }

        targetedVideo.hoverTimeout = setTimeout(() => {
          targetedVideo.play().catch((error) => console.error(error));
        }, 800);
      }
      else if (eventType === 'mouseleave') {
        setVideoStatus((prev) => ({
          ...prev,
          [targetId]: { ...prev[targetId], showControl: false },
        }));
        if (targetedVideo.hoverTimeout) {
          clearTimeout(targetedVideo.hoverTimeout);
        }

        targetedVideo.hoverTimeout = setTimeout(() => {
          targetedVideo.pause();
        }, 500);
      }
      return
    }

    if ((targetName === 'volume' || targetName === "svg") && targetId) {
      e.stopPropagation();
      e.preventDefault();

      const videoElements = document.getElementsByName('video');

      console.log("from btn :  ", e);
      const targetedVideo = Array.from(videoElements).find((video) => video.id === targetId);
      if (eventType === 'click') {
        const newMutedState = !targetedVideo.muted;
        targetedVideo.muted = newMutedState;

        setVideoStatus((prev) => ({
          ...prev,
          [targetId]: { ...prev[targetId], isMuted: !videoStatus[targetId]?.isMuted },
        }));
      }


      return;
    }
  }

  return (
    <>
      <UploadVideo toggleVideoUploading={toggleVideoUploading} setToggleVideoUploading={setToggleVideoUploading} />
    <div className="h-full w-full overflow-y-scroll scrollBar ">
      {/* title */}
      <div className="w-full flex items-center font-bold text-2xl max-md:text-lg max-sm:text-sm p-2">
        <h1>User Videos</h1>
      </div>
      {/* videoList */}
      
      {videoByOwner.length === 0 ? (
          <div className="text-center py-16 px-6 max-md:w-screen">
            <div className="max-w-lg mx-auto">
              {/* Upload illustration */}
              <div className="mb-8 relative">
                <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Video className="w-16 h-16 text-blue-500" />
                </div>
                {/* Floating upload icons */}
                <div className="absolute top-4 right-8 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center animate-bounce">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div className="absolute bottom-6 left-6 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center animate-pulse">
                  <Plus
                    className="w-4 h-4 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Share your story with the world
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Upload your first video to start building your channel. Whether it's a tutorial, vlog, or creative content - every journey starts with one video.
              </p>

              <div className="space-y-4 mb-8">
                <button onClick={() => setToggleVideoUploading(false)} className="w-full mx-auto sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 max-sm:text-sm text-lg font-semibold">
                  <Upload className="w-6 h-6" />
                  <span>Upload Your First Video</span>
                </button>
              </div>

              {/* Upload tips */}
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h4 className="font-semibold text-blue-900 mb-4">Tips for your first upload:</h4>
                <div className="grid md:grid-cols-2 text-sm text-blue-800">
                  <div className="text-left">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="font-medium">Choose a catchy title</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="font-medium">Add a clear thumbnail</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="font-medium">Write a good description</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="font-medium">Use relevant tags</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      ) :
        (
          <div className="w-[calc(190px - 100%)] px-2 space-y-3 h-[calc(113px - 100vh)]">
        {videoByOwner?.map((video) => (
            <div
                        key={video._id}
                        className="flex h-fit"
                        onClick={handleOverAllEvent}
                        id={video._id}
                        name="container"
                      >
                        {/* video */}
                        <div
                          className="relative max-md:w-[36%] max-sm:w-[42%] w-64  h-fit"
                          name="video-container"
                          onMouseEnter={handleOverAllEvent}
                          onMouseLeave={handleOverAllEvent}
                          id={video._id}
                        >
                          <video
                            src={video?.videoFile}
                            name="video"
                            id={video._id}
                            data-username={video?.owner?.username}
                            muted={videoStatus[video._id]?.isMuted}
                            poster={video?.thumbnail}
                            onTimeUpdate={handleOverAllEvent}
                            preload="metadata"
                            className="bg-black aspect-video rounded-lg"
                          ></video>
                          <div
                            className={`absolute inset-0 p-2`}
                          >
                            <div className="flex justify-end">
                              <button
                                onClick={handleOverAllEvent}
                                name='volume'
                                id={video._id}
                                className={`${videoStatus[video._id]?.showControl ? "" : "hidden"
                              } z-13 p-2 rounded-full hover:bg-black/30 active:bg-black/50 active:border-1 active:border-gray-600 transition-all duration-75`}
                              >
                                {videoStatus[video._id]?.isMuted ? (
                                  <VolumeX
                                    size={16}
                                    name='svg'
                                    onClick={handleOverAllEvent}
                                    color="white"
                                    id={video._id}
                                  />
                                ) : (
                                  <Volume2
                                      size={16}
                                      name='svg'
                                      onClick={handleOverAllEvent}
                                      id={video._id}
                                    color="white"
                                  />
                                )}
                              </button>
                            </div>
                            <div name="duration" id={video._id} className="absolute inset-0 flex items-end justify-end bottom-0 p-2 rounded-[10px] max-lg:text-[2vw] text-lg">
                              <h1 name="duration" className="text-white rounded-md bg-black/30 px-1 py-0.1">
                                {videoStatus[video._id]?.duration ? formatTime(video?.duration - videoStatus[video._id]?.duration) : formatTime(video?.duration)}
                              </h1>
                            </div>
                          </div>
                        </div>
                        <div className="max-w-96 max-md:w-[60%]  flex-col flex py-1 pl-2">
                          
                          <div className="line-clamp-2 w-full font-medium text-3xl pb-2 max-sm:pb-0 max-sm:text-lg max-md:text-2xl">
                            <h2 onClick={handleOverAllEvent} id={video._id} name="title">{video?.title}</h2>
                          </div>
                          <div className="flex">
                            <div className="items-baseline hidden">
                              <img
                                src={video?.owner?.avatar}
                                alt=""
                                name="avatar"
                                data-username={video?.owner?.username}
                                onClick={handleOverAllEvent}
                                id={video._id}
                                className="w-6 mr-3 max-sm:w-6 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                              />
                            </div>
                            <div className="flex flex-col leading-tight">
                              {/* user name */}
                              <div className="mb-1  text-xs font-normal text-gray-500 max-md:text-xs">
                                <h3 onClick={handleOverAllEvent} data-username={video?.owner?.username} name="username" id={video._id}>{video?.owner?.username}</h3>
                              </div>
                              {/* view and month ago */}
                              <div className="text-[11px] font-normal  text-gray-500 max-md:text-[11px] space-x-1.5">
                                <span>{video?.views} views</span>
                                <span>
                                  {timeAgo(video?.createdAt) || "12 year ago"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
          ))}
      </div>)}
      </div>
      </>
  );
}

export default UserVideos;