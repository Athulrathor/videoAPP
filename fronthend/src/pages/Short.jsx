import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShortCard from "../components/ShortCard";
import ShortSkeletonLoading from "../components/LoadingScreen/ShortSkeletonLoading";
import Comments from "../components/Comments";
import { fetchLikeToggleShort, isShortLiked } from "../redux/features/likes";
import { fetchShortComment } from "../redux/features/comment";
import { useNavigate } from "react-router-dom";
import { fetchSubcribeToggle } from "../redux/features/subcribers";

const Short = (props) => {

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const [getShortId, setGetShortId] = useState(null);
  const [showComment, setShowComment] = useState(true);

  const [functionCalled, setFunctionCalled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);

  const { short, shortLoading, shortError } = useSelector((state) => state.shorts);
  
  const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
  
  useEffect(() => {
    setFunctionCalled(false);
  }, [getShortId]);

  useEffect(() => {

    if (currentTime >= 3 && !functionCalled) {
      props.fetchViewCounter(getShortId);
      setFunctionCalled(true);
    }
  }, [getShortId, props.fetchViewCounter, functionCalled]);

  const handleRetry = () => {
    setIsRetrying(true);
    // Simulate retry attempt
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  const handleLikeToggle = (ids) => {
    dispatch(fetchLikeToggleShort(ids));
    dispatch(isShortLiked(ids));
  }

   const handleShortComment = (ids) => {
      setShowComment(!showComment)
      dispatch(fetchShortComment(ids));
  }
  
    const handleSubcribeToggle = (ids) => {
      dispatch(fetchSubcribeToggle(ids))
  }
  
  // const toggleMute = () => {
  //   short.muted = !isMuted;
  //   setIsMuted(!isMuted);
  // };
  

  const handleAllOverEvent = (e) => {
    const targetId = e.target.id;
    const targetName = e.target.getAttribute("name");
    const evenType = e.type;

    console.log(targetId, targetName, evenType, e.target);
    
    if ((targetName === "body" || targetName === 'play') && evenType === 'click') {
      const shorts = document.getElementsByName('short');

      const targetedShort = Array.from(shorts).find((short) => short.id === targetId);
      console.log(targetedShort, e.target.id)
      if (isPlaying) {
        targetedShort.pause();
      } else {
        targetedShort.play();
      }
      setIsPlaying(!isPlaying);
      return
    }

    if (targetName === "body" && evenType === 'dblclick') {
      handleLikeToggle(targetId);
      return;
    }

    if ((targetName === "like" || targetName === "heart") && evenType === "click") {
      handleLikeToggle(targetId);
      return;
    }

    if ((targetName === 'comment' || targetName === 'messages')) {
      handleShortComment(targetId);
      return;
    }

    if (targetName === 'share' || targetName === "shares") {
      console.log("nothing to do share bth");
      return;
    }

    if (targetName === 'download' || targetName === "downloads") {
      console.log("nothing to do download btn");
      return;
    }

    if (targetName === "more") {
      console.log("nothing to do more btn");
      return;
    }

    if (targetName === "avatar" && evenType === 'click') {
      const username = e.target.getAttribute('data-username');
      Navigate(`/channel/${username}`);
      return;
    }

    if (targetName === 'subcribe' && evenType === "click") {
      handleSubcribeToggle(targetId);
      return;
    }

    if (targetName === "mute") {
      e.stopPropagation();
      e.preventDefault();

      const shorts = document.getElementsByName('short');

      const targetedShort = Array.from(shorts).find((short) => short.id === targetId);
      if (evenType === 'click') {
        const newMutedState = !targetedShort.muted;
        targetedShort.muted = newMutedState;
        setIsMuted(!isMuted);
        return;
      }

    }

  }

  return (
    <div className="w-full h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)]">
          <div>
            {shortError && (
              <div className="text-center py-16 px-6">
                <div className="max-w-md mx-auto">
                  {/* Wifi Off Icon with animation */}
                  <div className="mb-6">
                    <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center relative">
                      <WifiOff className="w-12 h-12 text-red-400" />
                      <div className="absolute inset-0 rounded-full border-2 border-red-200 animate-pulse"></div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    No internet connection
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Please check your network connection and try again. Your feed will load once you're back online.
                  </p>

                  <div className="space-y-4">
                    <button
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
                    >
                      <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                      <span>{isRetrying ? 'Checking...' : 'Try Again'}</span>
                    </button>

                    <div className="text-sm text-gray-400">
                      <p>Make sure you're connected to Wi-Fi or mobile data</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {shortLoading === true ? (
            <div>
              {" "}
              <ShortSkeletonLoading />{" "}
            </div>
          ) : (
            <div className="h-full max-h-screen">
              <div
                className={`items-center flex ${showComment ? "justify-center" : "justify-evenly"} snap-y h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] max-sm:p-0 snap-mandatory max-sm:overflow-hidden scroll-smooth overflow-x-hidden overflow-y-auto`}
              >
                {/* Main video container with proper padding */}
                <div className="h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] overflow-y-auto snap-y snap-mandatory  scrollBar scroll-smooth">
                  <div className=" sm:pt-3 sm:pb-6 sm:space-y-3">
                    {short?.map((shortVideo) => (
                      <div
                        key={shortVideo._id}
                        className="snap-start"

                      >
                        <ShortCard
                          short={shortVideo}
                          id={shortVideo._id}
                          activeShort={setGetShortId}
                          showComment={showComment}
                          setShowComment={setShowComment}
                          fetchViewCounter={props.fetchViewCounter}
                          currentTime={currentTime}
                          setCurrentTime={setCurrentTime}
                          handleAllOverEvent={handleAllOverEvent}
                          isPlaying={isPlaying}
                          isMuted={isMuted}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments panels remain the same */}
                <div className={`${showComment ? "translate-x-[200%] absolute" : ""} ${window.innerWidth < 768 ? "hidden" : ""} z-22 bg-gray-100 shadow-2xl rounded-lg right-0 ml-2 transition-all w-96 duration-500 h-full`}>
                  <Comments whichContent={"shorts"} contentId={getShortId} toggle={{ showComment, setShowComment }} />
                </div>
              </div>

              <div className={`${showComment ? "" : "max-md:-translate-y-[70%]"} ${window.innerWidth >= 768 ? "hidden" : ""} z-22 bg-gray-100 shadow-2xl max-md:rounded-t-2xl transition-all duration-500 h-[70%] max-sm:mx-0`}>
                <Comments whichContent={"shorts"} contentId={getShortId} toggle={{ showComment, setShowComment }} />
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default Short;