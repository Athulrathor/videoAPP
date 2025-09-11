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

// import React, { useState, useEffect } from "react";
// import favicon from "../../assets/favicon.png";
// import { useAppearance } from '../../hooks/appearances';

// const VidTube = () => {
//   const { appearanceSettings } = useAppearance();
//   const [progress, setProgress] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadingStage, setLoadingStage] = useState("Initializing");
//   const [faviconLoaded, setFaviconLoaded] = useState(false);

//   // Loading stages
//   const loadingStages = [
//     "Initializing VidTube",
//     "Loading components",
//     "Fetching content",
//     "Preparing interface",
//     "Almost ready",
//   ];

//   // Simulate favicon loading
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setFaviconLoaded(true);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, []);

//   // Simulate loading progress with stages
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         const increment = Math.random() * 8 + 2;
//         const newProgress = Math.min(prev + increment, 100);

//         // Update loading stage based on progress
//         if (newProgress >= 80) setLoadingStage(loadingStages[4]);
//         else if (newProgress >= 60) setLoadingStage(loadingStages[3]);
//         else if (newProgress >= 40) setLoadingStage(loadingStages[2]);
//         else if (newProgress >= 20) setLoadingStage(loadingStages[1]);
//         else setLoadingStage(loadingStages[0]);

//         if (newProgress >= 100) {
//           setTimeout(() => setIsLoading(false), 800);
//           return 100;
//         }
//         return newProgress;
//       });
//     }, 150);

//     return () => clearInterval(interval);
//   }, []);

//   const LoadingDots = () => {
//     const [dotCount, setDotCount] = useState(0);

//     useEffect(() => {
//       const interval = setInterval(() => {
//         setDotCount((prev) => (prev + 1) % 4);
//       }, 400);
//       return () => clearInterval(interval);
//     }, []);

//     return <span>{".".repeat(dotCount)}</span>;
//   };

//   // Main content after loading
//   if (!isLoading) {
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center"
//         style={{
//           background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
//           fontFamily: 'var(--font-family)'
//         }}
//       >
//         <div
//           className="text-center animate-fadeIn"
//           style={{
//             color: 'var(--color-text-primary)',
//             animation: appearanceSettings.reducedMotion ? 'none' : 'fadeIn 1s ease-in-out'
//           }}
//         >
//           <div
//             className="mb-8"
//             style={{ marginBottom: 'var(--section-gap)' }}
//             role="img"
//             aria-label="VidTube application icon"
//           >
//             <div
//               className="w-24 h-24 mx-auto mb-6 relative"
//               style={{ marginBottom: 'var(--section-gap)' }}
//             >
//               <div
//                 className="w-full h-full rounded-2xl flex items-center justify-center shadow-2xl"
//                 style={{
//                   background: 'linear-gradient(135deg, var(--color-error), var(--color-error-hover))',
//                   boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
//                 }}
//               >
//                 <svg
//                   className="w-14 h-14 text-white"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   <path d="M8 5v14l11-7z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//           <h1
//             className="text-6xl font-bold mb-4"
//             style={{
//               fontSize: 'var(--font-size-6xl)',
//               fontFamily: 'var(--font-family)',
//               background: 'linear-gradient(135deg, var(--color-error), var(--color-error-hover))',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//               marginBottom: 'var(--spacing-unit)'
//             }}
//           >
//             VidTube
//           </h1>
//           <p
//             className="text-xl mb-8"
//             style={{
//               fontSize: 'var(--font-size-xl)',
//               color: 'var(--color-text-secondary)',
//               marginBottom: 'var(--section-gap)',
//               opacity: 0.9
//             }}
//           >
//             Welcome to your video experience
//           </p>
//           <button
//             className="px-8 py-3 rounded-full font-semibold transition-all duration-300"
//             style={{
//               backgroundColor: 'var(--color-error)',
//               color: 'white',
//               fontSize: 'var(--font-size-base)',
//               fontFamily: 'var(--font-family)',
//               padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 2)',
//               transform: 'scale(1)',
//               transitionDuration: 'var(--animation-duration)'
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.backgroundColor = 'var(--color-error-hover)';
//               if (!appearanceSettings.reducedMotion) {
//                 e.target.style.transform = 'scale(1.05)';
//               }
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.backgroundColor = 'var(--color-error)';
//               e.target.style.transform = 'scale(1)';
//             }}
//             aria-label="Start using VidTube"
//           >
//             Get Started
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center overflow-hidden relative"
//       style={{
//         background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
//         fontFamily: 'var(--font-family)'
//       }}
//       role="main"
//       aria-label="Loading VidTube application"
//     >
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
//         {[...Array(15)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 rounded-full opacity-20"
//             style={{
//               backgroundColor: 'var(--color-error)',
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animation: appearanceSettings.reducedMotion
//                 ? 'none'
//                 : `pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
//               animationDelay: `${Math.random() * 3}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Main Loading Container */}
//       <div
//         className="text-center relative z-10 max-w-md mx-auto px-6"
//         style={{ padding: 'var(--component-padding)' }}
//       >
//         {/* Logo/Favicon Section */}
//         <div
//           className="mb-12"
//           style={{ marginBottom: 'var(--section-gap)' }}
//         >
//           <div
//             className="w-32 h-32 mx-auto mb-6 relative"
//             style={{ marginBottom: 'var(--section-gap)' }}
//             role="img"
//             aria-label="VidTube loading icon"
//           >
//             {/* Outer spinning ring */}
//             <div
//               className="absolute inset-0 rounded-full border-4 border-transparent"
//               style={{
//                 borderTopColor: 'var(--color-error)',
//                 animation: appearanceSettings.reducedMotion ? 'none' : 'spin 2s linear infinite'
//               }}
//             />

//             {/* Favicon container */}
//             <div
//               className="w-full h-full rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500"
//               style={{
//                 background: 'linear-gradient(135deg, var(--color-error), var(--color-error-hover))',
//                 transform: faviconLoaded ? 'scale(1)' : 'scale(0.75)',
//                 opacity: faviconLoaded ? 1 : 0.5,
//                 transitionDuration: 'var(--animation-duration)',
//                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
//               }}
//             >
//               <img
//                 src={favicon}
//                 alt="VidTube application icon"
//                 className="w-16 h-16 object-contain"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                   e.target.nextSibling.style.display = "block";
//                 }}
//               />
//               <svg
//                 className="w-16 h-16 text-white hidden"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//               >
//                 <path d="M8 5v14l11-7z" />
//               </svg>
//             </div>

//             {/* Pulsing effect */}
//             <div
//               className="absolute inset-0 rounded-2xl opacity-20"
//               style={{
//                 backgroundColor: 'var(--color-error)',
//                 animation: appearanceSettings.reducedMotion ? 'none' : 'ping 2s infinite'
//               }}
//             />
//           </div>

//           {/* Brand Name */}
//           <h1
//             className="text-4xl font-bold mb-2 tracking-wide"
//             style={{
//               color: 'var(--color-text-primary)',
//               fontSize: 'var(--font-size-4xl)',
//               fontFamily: 'var(--font-family)',
//               marginBottom: 'var(--spacing-unit)'
//             }}
//           >
//             VidTube
//           </h1>
//           <p
//             className="text-sm"
//             style={{
//               color: 'var(--color-text-secondary)',
//               fontSize: 'var(--font-size-sm)'
//             }}
//           >
//             Video Streaming Platform
//           </p>
//         </div>

//         {/* Loading Progress Section */}
//         <div
//           className="mb-8"
//           style={{ marginBottom: 'var(--section-gap)' }}
//         >
//           {/* Loading Stage Text */}
//           <div
//             className="text-lg mb-4 h-6"
//             style={{
//               color: 'var(--color-text-primary)',
//               fontSize: 'var(--font-size-lg)',
//               marginBottom: 'var(--spacing-unit)',
//               height: '1.5rem'
//             }}
//             role="status"
//             aria-live="polite"
//             aria-atomic="true"
//           >
//             {loadingStage}
//             <LoadingDots />
//           </div>

//           {/* Progress Bar Container */}
//           <div className="relative mb-4" style={{ marginBottom: 'var(--spacing-unit)' }}>
//             <div
//               className="w-full h-2 rounded-full overflow-hidden"
//               style={{
//                 backgroundColor: 'var(--color-bg-tertiary)',
//                 height: '8px'
//               }}
//             >
//               <div
//                 className="h-full rounded-full transition-all duration-300 ease-out relative"
//                 style={{
//                   width: `${progress}%`,
//                   background: 'linear-gradient(135deg, var(--color-error), var(--color-error-hover))',
//                   transitionDuration: 'var(--animation-duration)'
//                 }}
//                 role="progressbar"
//                 aria-valuemin={0}
//                 aria-valuemax={100}
//                 aria-valuenow={Math.round(progress)}
//                 aria-label={`Loading progress: ${Math.round(progress)} percent`}
//               >
//                 {/* Shimmer effect */}
//                 <div
//                   className="absolute inset-0 rounded-full"
//                   style={{
//                     background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
//                     animation: appearanceSettings.reducedMotion ? 'none' : 'shimmer 2s ease-in-out infinite'
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Progress percentage */}
//             <div
//               className="flex justify-between items-center mt-2"
//               style={{
//                 marginTop: 'var(--spacing-unit)',
//                 gap: 'var(--spacing-unit)'
//               }}
//             >
//               <span
//                 className="text-sm"
//                 style={{
//                   color: 'var(--color-text-secondary)',
//                   fontSize: 'var(--font-size-sm)'
//                 }}
//               >
//                 Loading...
//               </span>
//               <span
//                 className="text-sm font-semibold"
//                 style={{
//                   color: 'var(--color-text-primary)',
//                   fontSize: 'var(--font-size-sm)',
//                   fontFamily: 'var(--font-family)'
//                 }}
//                 aria-label={`${Math.round(progress)} percent complete`}
//               >
//                 {Math.round(progress)}%
//               </span>
//             </div>
//           </div>

//           {/* Loading Animation */}
//           <div
//             className="flex justify-center space-x-2 mt-6"
//             style={{
//               gap: 'calc(var(--spacing-unit) * 0.5)',
//               marginTop: 'var(--section-gap)'
//             }}
//             aria-hidden="true"
//           >
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="w-3 h-3 rounded-full"
//                 style={{
//                   backgroundColor: 'var(--color-error)',
//                   animation: appearanceSettings.reducedMotion
//                     ? 'none'
//                     : `bounce 1s infinite`,
//                   animationDelay: `${i * 0.2}s`,
//                 }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Additional Info */}
//         <div
//           className="text-xs"
//           style={{
//             color: 'var(--color-text-tertiary)',
//             fontSize: 'var(--font-size-xs)'
//           }}
//         >
//           <p>Powered by VidTube Engine v2.0</p>
//         </div>
//       </div>

//       {/* Live Region for Screen Reader Updates */}
//       <div
//         className="sr-only"
//         aria-live="polite"
//         aria-atomic="true"
//       >
//         {`${loadingStage} - ${Math.round(progress)}% complete`}
//       </div>

//       {/* Custom Styles */}
//       <style>{`
//         @keyframes shimmer {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(100%);
//           }
//         }

//         @keyframes fadeIn {
//           0% {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         @keyframes bounce {
//           0%, 20%, 53%, 80%, 100% {
//             transform: translateY(0);
//           }
//           40%, 43% {
//             transform: translateY(-10px);
//           }
//           70% {
//             transform: translateY(-5px);
//           }
//           90% {
//             transform: translateY(-2px);
//           }
//         }

//         @keyframes pulse {
//           0%, 100% {
//             opacity: 0.2;
//           }
//           50% {
//             opacity: 0.6;
//           }
//         }

//         @keyframes ping {
//           75%, 100% {
//             transform: scale(2);
//             opacity: 0;
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           * {
//             animation-duration: 0.01ms !important;
//             animation-iteration-count: 1 !important;
//             transition-duration: 0.01ms !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default VidTube;
