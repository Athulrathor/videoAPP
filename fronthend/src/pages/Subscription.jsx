import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Bell, Heart, Rss, TrendingUp, UserPlus, Users, Volume2, VolumeX } from 'lucide-react';
import { subcribedUserContent } from '../redux/features/subcribers';
import { useDispatch, useSelector } from 'react-redux';
import { setSideActive } from '../redux/features/user';

const Subscription = (props) => {

  const { timeAgo, formatTime } = props;

  const dispatch = useDispatch();
  const Navigate = useNavigate();
  
  const { subcribedContent } = useSelector(state => state.subscriber);

      const [videoStatus, setVideoStatus] = useState({
        isPlaying: false,
        isMuted: false,
        showControl: false,
        duration: 0,
      });
  
  useEffect(() => {
    dispatch(subcribedUserContent());
  }, [dispatch]);

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

    if (eventType === 'timeupdate' && (targetName === 'video' || targetName === "duration" )&& targetId) {
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
          [targetId]: { ...prev[targetId], showControl:true },
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

    if ((targetName === 'volume' || targetName === "svg" ) && targetId) {
      e.stopPropagation();
      e.preventDefault();

      const videoElements = document.getElementsByName('video');

      console.log("from btn :  ",e);
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
    <div className="h-[90vh] max-md:h-screen max-md:w-screen scroll-smooth overflow-y-scroll scrollBar">
      {/* {loggedIn ? "" : */}
      <div className="w-full flex items-center font-bold text-2xl max-md:text-lg max-sm:text-sm p-2">
        <h1>User Subcriber Videos</h1>
      </div>
      {/* videoList */}
      {subcribedContent?.videos?.length > 0 ? (<div className="w-[calc(190px - 100%)] px-2 space-y-3 h-[calc(113px - 100vh)]">
        {subcribedContent?.videos.map((video) => (
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
              {/* title */}
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
      </div>) : (
          <div className="text-center py-16 px-6">
            <div className="max-w-lg mx-auto">
              {/* Connected users illustration */}
              <div className="mb-8">
                <div className="mx-auto w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center relative">
                  <Users className="w-16 h-16 text-purple-400" />
                  {/* Connection lines */}
                  <div className="absolute top-4 right-8">
                    <div className="w-8 h-8 bg-white rounded-full border-2 border-purple-200 flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-blue-200 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                Start building your network
              </h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Follow creators and users to see their latest content in your feed. Build a personalized experience around people you're interested in.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button onClick={() => dispatch(setSideActive("home"))} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2">
                  <UserPlus  className="w-5 h-5" />
                  <span>Discover Creators</span>
                </button>
                <button onClick={() => dispatch(setSideActive("home"))} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>See Popular</span>
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Rss className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500">Personalized Feed</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-xs text-gray-500">New Content Alerts</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  <p className="text-xs text-gray-500">Support Creators</p>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

export default Subscription;
