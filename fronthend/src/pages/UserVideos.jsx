import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Video, Volume2, VolumeX } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import UploadVideo from '../components/UploadVideo';

const UserVideos = ({toggleVideoUploading,setToggleVideoUploading,timeAgo,formatTime}) => {
  
  const { user } = useSelector((state) => state.user);
  const { videoByOwner } = useSelector(state => state.videos);

  const Navigate = useNavigate();

    const [videoStatus, setVideoStatus] = useState({
      isPlaying: false,
      isMuted: false,
      showControl: false,
      duration: 0,
    });
  
  const videoRef = useRef({});
  
    const togglePlay = (videoId2) => {
      const video = videoRef.current[videoId2];
      if (video) {
        setVideoStatus((prev) => ({
          ...prev,
          [videoId2]: { ...prev[videoId2], isPlaying: true },
        }));
        video.play();
      }
    };

    const togglePause = (videoId2) => {
      const video = videoRef.current[videoId2];
      if (video) {
        setVideoStatus((prev) => ({
          ...prev,
          [videoId2]: { ...prev[videoId2], isPlaying: false },
        }));
        video.pause();
      }
    };

    const toggleMute = (e, videoId2) => {
      e.stopPropagation();

      const video = videoRef.current[videoId2];
      if (video) {
        const currentMuteState = videoStatus[videoId2]?.isMuted;
        const newMuteState = !currentMuteState;

        setVideoStatus((prev) => ({
          ...prev,
          [videoId2]: { ...prev[videoId2], isMuted: newMuteState },
        }));

        video.muted = newMuteState;
      }
    };

    const handleOnTimeUpdate = (videoId2) => {
      const video = videoRef.current[videoId2];
      if (video) {
        setVideoStatus((prev) => ({
          ...prev,
          [videoId2]: { ...prev[videoId2], duration: video.currentTime },
        }));
      }
  };

  return (
    <>
      <UploadVideo toggleVideoUploading={toggleVideoUploading} setToggleVideoUploading={setToggleVideoUploading} />
    <div className="h-[90vh] w-screen overflow-y-scroll scrollBar ">
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

                {/* <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Record New Video</span>
                </button> */}
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
              key={video?._id}
              className="flex h-fit"
              onClick={() => Navigate(`/video/${video?._id}`)}
            >
              {/* video */}
              <div
              className="relative max-md:w-[36%] max-sm:w-[42%] w-64  h-fit"
                onMouseEnter={() => {
                  setVideoStatus((prev) => ({
                    ...prev,
                    [video._id]: { ...prev[video?._id], showControl: true },
                  }));
                  togglePlay(video._id);
                }}
                onMouseLeave={() => {
                  setVideoStatus((prev) => ({
                    ...prev,
                    [video._id]: { ...prev[video?._id], showControl: false },
                  }));
                  togglePause(video?._id);
                }}
              >
                <video
                  src={video?.videoFile}
                  ref={(el) => {
                    if (el) {
                      videoRef.current[video?._id] = el;
                    }
                  }}
                  muted={videoStatus[video?._id]?.isMuted}
                  poster={video?.thumbnail}
                  onTimeUpdate={() => handleOnTimeUpdate(video?._id)}
                  preload="metadata"
                  className="bg-black aspect-video rounded-lg"
                ></video>
                <div
                  className={`${
                    videoStatus[video?._id]?.showControl ? "" : "hidden"
                  } absolute inset-0 p-2`}
                >
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => toggleMute(e, video?._id)}
                      className={` z-13 p-2 rounded-full hover:bg-black/30 active:bg-black/50 active:border-1 active:border-gray-600 transition-all duration-75`}
                    >
                      {videoStatus[video?._id]?.isMuted === true ? (
                        <VolumeX
                          size={16}
                          color="white"
                        />
                      ) : (
                        <Volume2
                          size={16}
                          color="white"
                        />
                      )}
                    </button>
                  </div>
                  <div className="absolute inset-0 flex items-end justify-end bottom-0 p-2 rounded-[10px] max-lg:text-[2vw] text-lg">
                    <h1 className="text-white rounded-md bg-black/30 px-1 py-0.1">
                      {formatTime(videoStatus[video?._id]?.duration || 0)}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="max-md:w-[60%] max-w-96  flex-col flex py-1 pl-2">
                {/* title */}
                {/* <div className="line-clamp-2 w-full font-medium text-sm">
                  <h2>{video?.title}</h2>
                </div> */}
                {/* user name */}
                {/* <div className="font-medium opacity-75 leading-tight mb-1">
                  <h3>{video?.owner?.username}</h3>
                </div> */}
                {/* view and month ago */}
                {/* <div className="text-xs font-light space-x-1.5">
                  <span>{video?.views} views</span>
                  <span>{timeAgo(video?.createdAt) || "12 year ago"}</span>
                </div> */}
                {/* title */}
              <div className="line-clamp-2 w-full font-medium text-3xl pb-2 max-md:text-2xl">
                  <h2>{video?.title}</h2>
                </div>
                <div className="flex">
                  <div className="flex items-baseline ">
                    <img
                      src={video?.userInfo?.avatar}
                      alt=""
                      className="w-6 mr-3 max-sm:w-6 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    {/* user name */}
                    <div className="mb-1  text-xs font-normal text-gray-500 max-md:text-xs">
                      <h3>{video?.userInfo?.username}</h3>
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


// const NoVideosDisplay = () => {
//   const [activeTab, setActiveTab] = useState('gallery');

//   // Simulate different scenarios
  // const EmptyGalleryState = () => (
  //   <div className="text-center py-16 px-6">
  //     <div className="max-w-md mx-auto">
  //       {/* Icon */}
  //       <div className="mb-6">
  //         <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
  //           <Video className="w-12 h-12 text-gray-400" />
  //         </div>
  //       </div>

  //       {/* Main Message */}
  //       <h3 className="text-xl font-semibold text-gray-700 mb-3">
  //         No videos yet
  //       </h3>
  //       <p className="text-gray-500 mb-8">
  //         Start building your video collection by uploading your first video
  //       </p>

  //       {/* Action Button */}
  //       <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto">
  //         <Upload className="w-5 h-5" />
  //         <span>Upload Your First Video</span>
  //       </button>

  //       {/* Additional Help */}
  //       <div className="mt-8 text-sm text-gray-400">
  //         <p>Supported formats: MP4, WebM, MOV • Max size: 100MB</p>
  //       </div>
  //     </div>
  //   </div>
  // );

//   const EmptySearchState = () => (
//     <div className="text-center py-16 px-6">
//       <div className="max-w-md mx-auto">
//         <div className="mb-6">
//           <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//             <Search className="w-12 h-12 text-gray-400" />
//           </div>
//         </div>

//         <h3 className="text-xl font-semibold text-gray-700 mb-3">
//           No videos found
//         </h3>
//         <p className="text-gray-500 mb-6">
//           We couldn't find any videos matching your search criteria
//         </p>

//         <div className="space-y-3">
//           <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200">
//             Clear Filters
//           </button>
//           <p className="text-sm text-gray-400">
//             Try adjusting your search terms or filters
//           </p>
//         </div>
//       </div>
//     </div>
//   );

//   const EmptyPlaylistState = () => (
//     <div className="text-center py-16 px-6">
//       <div className="max-w-md mx-auto">
//         <div className="mb-6">
//           <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//             <Play className="w-12 h-12 text-gray-400" />
//           </div>
//         </div>

//         <h3 className="text-xl font-semibold text-gray-700 mb-3">
//           This playlist is empty
//         </h3>
//         <p className="text-gray-500 mb-8">
//           Add videos to this playlist to start watching
//         </p>

//         <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto">
//           <Plus className="w-5 h-5" />
//           <span>Browse Videos to Add</span>
//         </button>
//       </div>
//     </div>
//   );

//   const EmptyRecentState = () => (
//     <div className="text-center py-16 px-6">
//       <div className="max-w-md mx-auto">
//         <div className="mb-6">
//           <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//             <Eye className="w-12 h-12 text-gray-400" />
//           </div>
//         </div>

//         <h3 className="text-xl font-semibold text-gray-700 mb-3">
//           No recent videos
//         </h3>
//         <p className="text-gray-500 mb-8">
//           Videos you watch will appear here for quick access
//         </p>

//         <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto">
//           <Film className="w-5 h-5" />
//           <span>Explore Videos</span>
//         </button>
//       </div>
//     </div>
//   );

//   // Illustration-style empty state
//   const IllustratedEmptyState = () => (
//     <div className="text-center py-16 px-6">
//       <div className="max-w-lg mx-auto">
//         {/* Custom SVG illustration */}
//         <div className="mb-8">
//           <svg className="mx-auto w-48 h-32" viewBox="0 0 200 120" fill="none">
//             {/* Video player frame */}
//             <rect x="20" y="20" width="160" height="80" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />

//             {/* Play button */}
//             <circle cx="100" cy="60" r="15" fill="#e5e7eb" />
//             <path d="M95 55 L105 60 L95 65 Z" fill="#9ca3af" />

//             {/* Dashed upload area */}
//             <rect x="35" y="35" width="130" height="50" rx="4" fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="5,5" />

//             {/* Upload icon */}
//             <path d="M95 45 L100 40 L105 45 M100 40 L100 55 M90 52 L110 52" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
//           </svg>
//         </div>

//         <h3 className="text-2xl font-bold text-gray-700 mb-4">
//           Your video library awaits
//         </h3>
//         <p className="text-gray-500 mb-8 leading-relaxed">
//           Upload videos to create your personal collection. Share, organize, and enjoy your content all in one place.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2">
//             <Upload className="w-5 h-5" />
//             <span>Upload Video</span>
//           </button>
//           <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200">
//             Learn More
//           </button>
//         </div>

//         {/* Feature highlights */}
//         <div className="grid grid-cols-3 gap-6 mt-12 text-sm">
//           <div className="space-y-2">
//             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
//               <Upload className="w-4 h-4 text-blue-600" />
//             </div>
//             <p className="text-gray-600">Easy Upload</p>
//           </div>
//           <div className="space-y-2">
//             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//               <Play className="w-4 h-4 text-green-600" />
//             </div>
//             <p className="text-gray-600">Instant Playback</p>
//           </div>
//           <div className="space-y-2">
//             <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
//               <Film className="w-4 h-4 text-purple-600" />
//             </div>
//             <p className="text-gray-600">Organize</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderEmptyState = () => {
//     switch (activeTab) {
//       case 'gallery': return <EmptyGalleryState />;
//       case 'search': return <EmptySearchState />;
//       case 'playlist': return <EmptyPlaylistState />;
//       case 'recent': return <EmptyRecentState />;
//       case 'illustrated': return <IllustratedEmptyState />;
//       default: return <EmptyGalleryState />;
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//       {/* Tab Navigation */}
//       <div className="border-b border-gray-200">
//         <div className="flex overflow-x-auto">
//           {[
//             { id: 'gallery', label: 'Empty Gallery' },
//             { id: 'search', label: 'No Search Results' },
//             { id: 'playlist', label: 'Empty Playlist' },
//             { id: 'recent', label: 'No Recent Videos' },
//             { id: 'illustrated', label: 'Illustrated Style' }
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${activeTab === tab.id
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//                 }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Empty State Content */}
//       <div className="min-h-96">
//         {renderEmptyState()}
//       </div>
//     </div>
//   );
// };

// export default NoVideosDisplay
