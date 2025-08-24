import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShortCard from "../components/ShortCard";
import ShortSkeletonLoading from "../components/LoadingScreen/ShortSkeletonLoading";
import Comments from "../components/Comments";

const Short = (props) => {

  const [getShortId, setGetShortId] = useState(null);
  const [showComment, setShowComment] = useState(true);

  const [functionCalled, setFunctionCalled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);

  const { short,shortLoading,shortError } = useSelector((state) => state.shorts);
  const { loggedIn } = useSelector((state) => state.user);
  
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

  return (
    <div className="">
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
            <div className="">
              <div
                style={{ height: "calc(100vh - 65px)" }}
                className=" justify-center items-center w-full snap-y scrollBar max-md:w-screen snap-mandatory scroll-smooth overflow-y-scroll flex-col"
              >
                {short?.map((shortVideo) => (
                  <div
                    key={shortVideo._id}
                    className="py-1"
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
                    />
                  </div>
                ))}
              </div>
              {/* comments start hear */}
                <div className={`${showComment ? "" : ""} flex justify-center items-center z-30`}>
                    <Comments whichContent={"shorts"} contentId={getShortId} toggle={{showComment,setShowComment}} />
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default Short;