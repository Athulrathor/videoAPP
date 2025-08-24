import React, { useState, useEffect } from "react";
import favicon from "../../assets/favicon.png";

const VidTube = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState("Initializing");
  const [faviconLoaded, setFaviconLoaded] = useState(false);

  // Loading stages
  const loadingStages = [
    "Initializing VidTube",
    "Loading components",
    "Fetching content",
    "Preparing interface",
    "Almost ready",
  ];

  // Simulate favicon loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFaviconLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate loading progress with stages
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 8 + 2;
        const newProgress = Math.min(prev + increment, 100);

        // Update loading stage based on progress
        if (newProgress >= 80) setLoadingStage(loadingStages[4]);
        else if (newProgress >= 60) setLoadingStage(loadingStages[3]);
        else if (newProgress >= 40) setLoadingStage(loadingStages[2]);
        else if (newProgress >= 20) setLoadingStage(loadingStages[1]);
        else setLoadingStage(loadingStages[0]);

        if (newProgress >= 100) {
          setTimeout(() => setIsLoading(false), 800);
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const LoadingDots = () => {
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 4);
      }, 400);
      return () => clearInterval(interval);
    }, []);

    return <span>{".".repeat(dotCount)}</span>;
  };

  // Main content after loading
  if (!isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center text-white animate-fadeIn">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              {/* Favicon placeholder - replace with actual favicon */}
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl">
                <svg
                  className="w-14 h-14 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            VidTube
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Welcome to your video experience
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-500 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Loading Container */}
      <div className="text-center relative z-10 max-w-md mx-auto px-6">
        {/* Logo/Favicon Section */}
        <div className="mb-12">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin"></div>

            {/* Favicon container */}
            <div
              className={`w-full h-full rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl transition-all duration-500 ${
                faviconLoaded ? "scale-100 opacity-100" : "scale-75 opacity-50"
              }`}
            >
              {/* Replace this with actual favicon */}
              <img
                src={favicon}
                alt="VidTube Favicon"
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  // Fallback to SVG play button if favicon fails to load
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <svg
                className="w-16 h-16 text-white hidden"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* Pulsing effect */}
            <div className="absolute inset-0 rounded-2xl bg-red-500 opacity-20 animate-ping"></div>
          </div>

          {/* Brand Name */}
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
            VidTube
          </h1>
          <p className="text-gray-400 text-sm">Video Streaming Platform</p>
        </div>

        {/* Loading Progress Section */}
        <div className="mb-8">
          {/* Loading Stage Text */}
          <div className="text-white text-lg mb-4 h-6">
            {loadingStage}
            <LoadingDots />
          </div>

          {/* Progress Bar Container */}
          <div className="relative mb-4">
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-30 to-transparent animate-shimmer"></div>
              </div>
            </div>

            {/* Progress percentage */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-400 text-sm">Loading...</span>
              <span className="text-white text-sm font-semibold">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center space-x-2 mt-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-gray-500 text-xs">
          <p>Powered by VidTube Engine v2.0</p>
        </div>
      </div>

      {/* Custom Styles */}
      <style >{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VidTube;
