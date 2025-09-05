import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAVideoToPlaylist, createAPlayList, getUserPlayList } from '../redux/features/playList';
import { Camera, Film, Heart, Music, Play, PlayCircle, PlayIcon, Plus, Sparkles, Video, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVideoByOwner } from '../redux/features/videos';

const Playlist = ({ timeAgo }) => {

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { user } = useSelector(state => state.user);
  const { playlist, creating, createError, createdId } = useSelector(state => state.Playlists)
  const { videoByOwner } = useSelector(state => state.videos);

  const [counter, setCounter] = useState(0);
  const [toggleCreatePlaylist, setToggleCreatePlaylist] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: " ",
    privacy: ""
  });

  useEffect(() => {
    dispatch(getUserPlayList(user?._id));
  }, [dispatch, user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();

    setCounter(prev => prev + 1);

    if (counter < 0) return setCounter(0);
  };

  const handlePrev = (e) => {
    e.preventDefault();

    setCounter(prev => prev - 1);

    if (counter > 3) return setCounter(2);
  }

  const [selectedVideos, setSelectedVideos] = useState([]);

  useEffect(() => {
    if (!playlist.video) {
      dispatch(fetchVideoByOwner(user._id));
    }
  }, []);

  const handleAddRemoveVideos = (e,index,id) => {
    const { checked } = e.target;

    if (!checked) {
      setSelectedVideos(selectedVideos.filter(idx => idx !== id));
    } else {

        setSelectedVideos([...selectedVideos, id]);
    }
  }

  const handlePlaylistAddVideo = (e, createdId, VideoId) => {
    e.preventDefault();

    handleNext(e);
    dispatch(addAVideoToPlaylist({ playlistId: createdId, arrayVideoId:VideoId }));
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();

    handleNext(e);
    await dispatch(createAPlayList({ title: formData?.title, description: formData?.description, privacy: formData.privacy }));

    setSelectedVideos([]);
    setTimeout(() => {
      setToggleCreatePlaylist(false);
    },2000)
  }

  const handleAllOverOne = (e) => {
    const targetName = e.target.getAttribute('name');
    const targetId = e.target.id;
    const evenType = e.type;

    console.log(targetName, targetId, evenType);

    if ((targetName === "detailBox" || targetName === "title") && evenType === 'click') {
      const idx = e.target.getAttribute('data-video');
      Navigate(`/video/${idx}`);
    }

    if ((targetName === "avatar" || targetName === 'username') && evenType === 'click') {
      const username = e.target.getAttribute('data-username');
      Navigate(`/channel/${username}`);
    }

  }

  return (
    <div className='py-3 max-md:py-2 w-full h-full px-6 max-md:px-2 overflow-y-scroll'>
      <div className='flex items-center justify-between border-b-1 py-1 sticky'>
        <h1 className='text-2xl max-md:text-lg max-sm:text-sm font-bold stroke-2 mb-2'>User Playlists</h1>
        <button onClick={() => setToggleCreatePlaylist(true)} className='cursor-pointer mr-4 px-4 py-1 stroke-2 bg-blue-300 hover:bg-blue-200 hover:opacity-85 active:bg-blue-300 rounded-lg '>
          Create
        </button>
      </div>

      <div className='w-full'>
        <div className={`${toggleCreatePlaylist ? "" : "hidden"} md:mx-auto max-sm:mb-8 bg-gray-100 z-30 w-full max-w-6xl rounded-xl bg-ggray-100 p-8 max-sm:p-0  shadow-lg mt-1`}>
          {/* cancel button */}
          <div className='w-full flex items-center justify-end'>
            <button onClick={() => setToggleCreatePlaylist(false)} className='p-2 cursor-pointer hover:bg-gray-100 rounded-full active:opacity-85 active:bg-gray-200'>
              <X />
            </button>
          </div>
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl"><PlayIcon color='white' /></span>
            </div>
            <h2 className="text-3xl font-bold ">
              Create Playlist
            </h2>
            <p className="mt-2 text-gray-500">
              Step 1 of 2: Basic Information
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Playlist Info</span>
              <span className="text-sm text-gray-500">Add Videos</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 cursor-pointer">
              <div className={`h-2 ${ counter === 0 ? "w-0.5" : ""} ${counter === 1 ? 'w-1/2' : ""} ${counter === 2 ? "w-full bg-green-600" : ""} rounded-full bg-blue-600 transition-all duration-500`}></div>
            </div>
          </div>

          <div className="space-y-6">
            {counter === 0 && (
              <>
                {/* Playlist Title */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Playlist Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData?.title}
                    onChange={handleInputChange}
                    placeholder="My Awesome Playlist"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3  placeholder-gray-500 focus:ring-1 focus:outline-2 focus:outline-blue-600 focus:ring-blue-600"
                    required
                  />
                </div>

                {/* Playlist Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData?.description}
                    onChange={handleInputChange}
                    placeholder="Tell people what your playlist is about..."
                    rows="4"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:ring-1 focus:outline-2 focus:outline-blue-600 focus:ring-blue-600"
                    required
                  />
                </div>

                {/* Privacy Settings */}
                <div>
                  <label className="mb-3 block text-sm font-medium">
                    Privacy Setting
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="flex cursor-pointer items-center space-x-3 rounded-lg border max-sm:p-2 border-gray-200 p-4 hover:bg-gray-50 focus:ring-blue-600">
                      <input
                        type="radio"
                        name="privacy"
                        value="public"
                        checked={formData?.privacy === 'public'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🌍</span>
                          <span className="text-sm font-medium text-gray-900">Public</span>
                        </div>
                        <p className="text-xs text-gray-500">Everyone can see</p>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center space-x-3 rounded-lg border max-sm:p-2 border-gray-200 p-4 hover:bg-gray-50">
                      <input
                        type="radio"
                        name="privacy"
                        value="unlisted"
                        checked={formData?.privacy === 'unlisted'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🔗</span>
                          <span className="text-sm font-medium">Unlisted</span>
                        </div>
                        <p className="text-xs text-gray-500">Link only</p>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 p-4 max-sm:p-2 hover:bg-gray-50">
                      <input
                        type="radio"
                        name="privacy"
                        value="private"
                        checked={formData?.privacy === 'private'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🔒</span>
                          <span className="text-sm font-medium">Private</span>
                        </div>
                        <p className="text-xs text-gray-500">Only you</p>
                      </div>
                    </label>
                  </div>
                </div>
              </>
            )}

            {counter === 1 && (
              <>
                  <ul className='w-full'>
                    {videoByOwner.map((video,index) => (
                      <li key={video._id} onChange={(e) => handleAddRemoveVideos(e,index,video._id)} className='px-2 py-1 overflow-hidden line-clamp-1'><span><input type="checkbox" value={video._id} className='mr-2' /></span>{ video.title }</li>
                  ))}
                  </ul>
              </>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-4 max-sm:space-x-2 max-sm:py-3 py-6">
              <button
                type="button"
                onClick={(e) => handlePrev(e)}
                className={`${counter === 0 ? "" : "hidden"} rounded-lg border border-gray-300 bg-white max-sm:py-1 max-sm:px-4 px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600`}
              >
                { "Cancel"}
              </button>
              <button
                type="button"
                onClick={(e) => handlePrev(e)}
                className={`${counter >= 1 && counter < 2 ? "" : "hidden"} flex items-center space-x-2 rounded-lg border max-sm:py-1 max-sm:px-4 border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600`}
              >
                <span>← Back</span>
              </button>
              <button
                type="submit"
                // disabled={!formData?.title || !formData?.description}
                onClick={(e) => handleCreatePlaylist(e)}
                className={`${counter === 1 ? "hidden" : ""}  rounded-lg bg-blue-600 px-6 py-3 text-white max-sm:py-1 max-sm:px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Next: Add Videos →
              </button>
              <button
                onClick={(e) => handlePlaylistAddVideo(e,playlist[1]._id,selectedVideos)}
                className={`${counter === 1 ? "" : "hidden"} flex items-center space-x-2 rounded-lg max-sm:py-1 max-sm:px-4 bg-green-600 px-6 py-3 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <span>Create Playlist</span>
                <span>🎉</span>
              </button>
            </div>
          </div>
        </div>

        {playlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full p-8 max-md:p-4 max-sm:p-0 mt-30 max-md:mt-16">
            {/* Animated Video Icon Container */}
            <div className="relative mb-6">
              {/* Background Pulse Effect */}
              <div className="absolute inset-0 w-28 h-28 bg-red-100 rounded-2xl animate-pulse opacity-75"></div>

              {/* Main Video Icon with Bounce Animation */}
              <div className="relative flex items-center justify-center w-28 h-28 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-2xl shadow-xl animate-bounce">
                <Video className="w-14 h-14 text-white" />
              </div>

              {/* Floating Play Button */}
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-ping">
                <Play className="w-5 h-5 text-white fill-current" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Ready to Create Your First Video Playlist?
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Organize your favorite videos, create themed collections, and build the perfect viewing experience
              </p>

              {/* Primary Action Button */}
              <button
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mb-6"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                Create Video Playlist
              </button>

              {/* Secondary Actions */}
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200">
                  <Film className="w-4 h-4" />
                  Browse Videos
                </button>

                <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                  <Camera className="w-4 h-4" />
                  Upload Video
                </button>
              </div>
            </div>
          </div>
        ) : (<div></div>)}
        

        <div className={`${toggleCreatePlaylist ? "hidden" : ""} mt-1`} >
          <div className="w-full space-y-3">
            {playlist &&
              playlist.map((video) => (
                <div
                  key={video?._id}
                  className="flex h-fit"
                >
                  {/* video */}
                  <div
                    className="relative max-md:w-[36%] max-sm:w-[42%] w-64 h-fit"
                  >
                    <div className="relative aspect-video mt-4 ml-4">
                      {/* Stack Layers */}
                      <div className="absolute -left-3 -top-3 h-full w-full rounded-lg overflow-hidden opacity-66">
                        <img
                          src={video?.video[0]?.thumbnail || video?.thumbnail}
                          // alt={video?.title}
                          name="image"
                          id={video._id}
                          onClick={handleAllOverOne}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute -left-2 -top-2 h-full w-full overflow-hidden rounded-lg opacity-75">
                        <img
                          src={video?.video[0]?.thumbnail || video?.thumbnail}
                          // alt={video?.title}
                          name="image"
                          id={video._id}
                          onClick={handleAllOverOne}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute -left-1 -top-1 h-full w-full rounded-lg overflow-hidden">
                        <div className='w-full h-full relative'>
                          <img
                            src={video?.video[1]?.thumbnail || video?.thumbnail}
                            // alt={video?.title}
                            name="image"
                            id={video._id}
                            onClick={handleAllOverOne}
                            className="h-full w-full z-1 object-cover"
                          />

                          <div name="detailBox" id={video._id} data-video={video?.video[0]?._id} onClick={handleAllOverOne} className='absolute z-2 inset-0 cursor-pointer'> 
                            <span name="length" id={video._id} onClick={handleAllOverOne} className=' absolute bottom-1 px-2 bg-black/40 rounded-2xl py-1 text-xs text-gray-50 right-1'>{(video?.video?.length === 0 ? "" : video?.video?.length) + " videos"}</span>
                            <span name="privacy" id={video._id} onClick={handleAllOverOne} className='absolute bottom-1 left-1  px-2 bg-black/40 rounded-2xl py-1 text-xs text-gray-50 '>privacy</span>
                            <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                              <button name='play' id={video._id} onClick={handleAllOverOne} className="cursor-pointer flex items-center justify-center rounded-full text-xl text-white bg-black/40 p-2">
                                <PlayIcon />
                              </button>
                            </span>
                            <span name="mix" id={video._id} onClick={handleAllOverOne} className='absolute top-1 right-1  px-2 bg-black/40 rounded-2xl py-1 text-xs text-gray-50 '>
                              <span name="mix" id={video._id} onClick={handleAllOverOne} >📋</span>
                              <span name="mix" id={video._id} onClick={handleAllOverOne}>Mix</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="max-md:w-[60%] max-w-96   flex-col flex py-1 pl-2">
                    {/* title */}
                    <div name="title" id={video._id} data-video={video?.video[0]?._id} onClick={handleAllOverOne} className="line-clamp-2 cursor-pointer w-full max-sm:leading-tight font-semibold text-xl pb-2 max-sm:pb-0 max-md:text-lg max-w-3xs">
                      <h2 name="title" id={video._id} data-video={video?.video[0]?._id} onClick={handleAllOverOne}>{video?.title}</h2>
                    </div>
                    <div className="flex">
                      <div name="avatar" id={video._id} onClick={handleAllOverOne} data-username={video?.owner?.username} className="flex items-baseline cursor-pointer">
                        <img
                          src={video?.owner?.avatar}
                          alt=""
                          name="avatar"
                          id={video._id}
                          data-username={video?.owner?.username}
                          onClick={handleAllOverOne}
                          className="w-8 mr-3 max-sm:w-5 max-md:w-7 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                        />
                      </div>
                      <div className="flex flex-col cursor-pointer">
                        {/* user name */}
                        <div name="username" id={video._id} data-username={video?.owner?.username} onClick={handleAllOverOne} className="mb-1 text-xs pt-0.5 font-normal text-gray-500 max-md:text-xs flex">
                          <h3 name="username" id={video._id} data-username={video?.owner?.username} onClick={handleAllOverOne}>{video?.owner?.fullname}</h3>
                        </div>
                        {/* view and month ago */}
                        <div className="text-xs font-normal leading-1  text-gray-500 max-md:text-[11px] flex items-center">
                          <span>{video?.views || 0} views</span>
                          <span className="mx-1">•</span>
                          <span>
                            {timeAgo(video?.createdAt) || "12 year ago"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Playlist;

// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import {
//   addAVideoToPlaylist,
//   createAPlayList,
//   getUserPlayList
// } from '../redux/features/playList';
// import { fetchVideoByOwner } from '../redux/features/videos';
// import {
//   Camera,
//   Film,
//   Heart,
//   Music,
//   Play,
//   PlayCircle,
//   Plus,
//   Sparkles,
//   Video,
//   X,
//   Loader,
//   AlertCircle,
//   CheckCircle,
//   ArrowLeft,
//   ArrowRight,
//   Globe,
//   Link2,
//   Lock,
//   Eye,
//   EyeOff
// } from 'lucide-react';

// // Constants
// const PRIVACY_OPTIONS = [
//   {
//     value: 'public',
//     label: 'Public',
//     icon: '🌍',
//     description: 'Everyone can see'
//   },
//   {
//     value: 'unlisted',
//     label: 'Unlisted',
//     icon: '🔗',
//     description: 'Link only'
//   },
//   {
//     value: 'private',
//     label: 'Private',
//     icon: '🔒',
//     description: 'Only you'
//   }
// ];

// // Custom hook for playlist management
// const usePlaylistManager = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector(state => state.user);
//   const { playlist, creating, createError, createdId } = useSelector(
//     state => state.Playlists
//   );
//   const { videoByOwner, loading: videosLoading } = useSelector(
//     state => state.videos
//   );

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     privacy: 'public'
//   });
//   const [selectedVideos, setSelectedVideos] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [errors, setErrors] = useState({});

//   // Fetch user playlists
//   const fetchPlaylists = useCallback(() => {
//     if (user?._id) {
//       dispatch(getUserPlayList(user._id));
//     }
//   }, [dispatch, user?._id]);

//   // Fetch user videos
//   const fetchVideos = useCallback(() => {
//     if (user?._id && !videoByOwner?.length) {
//       dispatch(fetchVideoByOwner(user._id));
//     }
//   }, [dispatch, user?._id, videoByOwner?.length]);

//   // Validate form
//   const validateForm = useCallback(() => {
//     const newErrors = {};

//     if (!formData.title.trim()) {
//       newErrors.title = 'Title is required';
//     } else if (formData.title.length < 3) {
//       newErrors.title = 'Title must be at least 3 characters';
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'Description is required';
//     }

//     if (!formData.privacy) {
//       newErrors.privacy = 'Privacy setting is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData]);

//   return {
//     // State
//     playlist,
//     videoByOwner,
//     creating,
//     createError,
//     videosLoading,
//     formData,
//     selectedVideos,
//     currentStep,
//     errors,
//     // Actions
//     setFormData,
//     setSelectedVideos,
//     setCurrentStep,
//     fetchPlaylists,
//     fetchVideos,
//     validateForm
//   };
// };

// // Playlist Item Component
// const PlaylistItem = React.memo(({ playlist, onNavigate, timeAgo }) => {
//   const handleClick = useCallback(
//     (e) => {
//       const targetName = e.target.getAttribute('name');
//       const videoId = e.target.getAttribute('data-video');
//       const username = e.target.getAttribute('data-username');

//       if (targetName === 'detailBox' || targetName === 'title') {
//         onNavigate(`/video/${videoId}`);
//       } else if (targetName === 'avatar' || targetName === 'username') {
//         onNavigate(`/channel/${username}`);
//       }
//     },
//     [onNavigate]
//   );

//   return (
//     <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
//       <div className="flex p-4">
//         {/* Thumbnail Stack */}
//         <div className="relative w-48 h-28 flex-shrink-0">
//           <div className="absolute -left-2 -top-2 w-full h-full rounded-lg opacity-40 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
//           <div className="absolute -left-1 -top-1 w-full h-full rounded-lg opacity-60 bg-gradient-to-r from-purple-500 to-pink-500"></div>
//           <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
//             <img
//               src={playlist?.video[0]?.thumbnail || '/api/placeholder/192/112'}
//               alt={playlist?.title}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors">
//               <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
//                 {playlist?.video?.length || 0} videos
//               </div>
//               <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs capitalize">
//                 {playlist?.privacy}
//               </div>
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                 <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer">
//                   <Play className="w-6 h-6 text-white fill-current" />
//                 </div>
//               </div>
//               <div className="absolute top-2 right-2 bg-indigo-500 text-white px-2 py-1 rounded text-xs font-medium">
//                 📋 Mix
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 ml-4">
//           <h3
//             className="text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors mb-2"
//             onClick={handleClick}
//             name="title"
//             data-video={playlist?.video[0]?._id}
//           >
//             {playlist?.title}
//           </h3>

//           <div className="flex items-center mb-3">
//             <img
//               src={playlist?.owner?.avatar || '/api/placeholder/32/32'}
//               alt={playlist?.owner?.fullname}
//               className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all"
//               onClick={handleClick}
//               name="avatar"
//               data-username={playlist?.owner?.username}
//             />
//             <div className="ml-3">
//               <p
//                 className="text-sm font-medium text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors"
//                 onClick={handleClick}
//                 name="username"
//                 data-username={playlist?.owner?.username}
//               >
//                 {playlist?.owner?.fullname}
//               </p>
//               <div className="flex items-center text-xs text-gray-500">
//                 <span>{playlist?.views || 0} views</span>
//                 <span className="mx-1">•</span>
//                 <span>{timeAgo(playlist?.createdAt) || 'Recently'}</span>
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <p className="text-sm text-gray-600 line-clamp-2">
//             {playlist?.description}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// });

// // Create Playlist Form Component
// const CreatePlaylistForm = React.memo(({ isVisible, onClose, onSubmit }) => {
//   const {
//     formData,
//     selectedVideos,
//     currentStep,
//     errors,
//     videoByOwner,
//     videosLoading,
//     creating,
//     setFormData,
//     setSelectedVideos,
//     setCurrentStep,
//     validateForm
//   } = usePlaylistManager();

//   const handleInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   }, [errors, setFormData]);

//   const handleVideoToggle = useCallback((videoId, isSelected) => {
//     setSelectedVideos(prev =>
//       isSelected
//         ? [...prev, videoId]
//         : prev.filter(id => id !== videoId)
//     );
//   }, [setSelectedVideos]);

//   const handleNext = () => {
//     if (currentStep === 0 && validateForm()) {
//       setCurrentStep(1);
//     } else if (currentStep === 1) {
//       handleCreatePlaylist();
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     } else {
//       onClose();
//     }
//   };

//   const handleCreatePlaylist = async () => {
//     try {
//       const result = await onSubmit({
//         ...formData,
//         selectedVideos
//       });

//       if (result.success) {
//         toast.success('🎉 Playlist created successfully!');
//         onClose();
//       } else {
//         toast.error('Failed to create playlist');
//       }
//     } catch (error) {
//       toast.error('An error occurred while creating playlist');
//       console.error('Playlist creation error:', error);
//     }
//   };

//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                 <Plus className="w-6 h-6" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold">Create Playlist</h2>
//                 <p className="text-indigo-100 text-sm">
//                   Step {currentStep + 1} of 2: {currentStep === 0 ? 'Basic Information' : 'Add Videos'}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white/10 rounded-full transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <div className="px-6 py-4 bg-gray-50">
//           <div className="flex justify-between text-xs text-gray-500 mb-2">
//             <span className={currentStep >= 0 ? 'text-indigo-600 font-medium' : ''}>
//               Playlist Info
//             </span>
//             <span className={currentStep >= 1 ? 'text-indigo-600 font-medium' : ''}>
//               Add Videos
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
//               style={{ width: `${((currentStep + 1) / 2) * 100}%` }}
//             />
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="p-6 overflow-y-auto max-h-[50vh]">
//           {currentStep === 0 && (
//             <div className="space-y-6">
//               {/* Title */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Playlist Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   placeholder="My Awesome Playlist"
//                   className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all ${errors.title
//                       ? 'border-red-300 focus:border-red-500'
//                       : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300'
//                     }`}
//                 />
//                 {errors.title && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.title}
//                   </p>
//                 )}
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Description *
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   placeholder="Tell people what your playlist is about..."
//                   rows="4"
//                   className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none ${errors.description
//                       ? 'border-red-300 focus:border-red-500'
//                       : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300'
//                     }`}
//                 />
//                 {errors.description && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.description}
//                   </p>
//                 )}
//               </div>

//               {/* Privacy Settings */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">
//                   Privacy Setting
//                 </label>
//                 <div className="grid gap-3 sm:grid-cols-3">
//                   {PRIVACY_OPTIONS.map((option) => (
//                     <label
//                       key={option.value}
//                       className={`flex cursor-pointer items-center space-x-3 rounded-xl border-2 p-4 hover:bg-gray-50 transition-all ${formData.privacy === option.value
//                           ? 'border-indigo-500 bg-indigo-50'
//                           : 'border-gray-200'
//                         }`}
//                     >
//                       <input
//                         type="radio"
//                         name="privacy"
//                         value={option.value}
//                         checked={formData.privacy === option.value}
//                         onChange={handleInputChange}
//                         className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
//                       />
//                       <div>
//                         <div className="flex items-center space-x-2">
//                           <span className="text-lg">{option.icon}</span>
//                           <span className="text-sm font-medium text-gray-900">
//                             {option.label}
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-500">{option.description}</p>
//                       </div>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {currentStep === 1 && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold">Select Videos</h3>
//                 <p className="text-sm text-gray-500">
//                   {selectedVideos.length} videos selected
//                 </p>
//               </div>

//               {videosLoading ? (
//                 <div className="flex items-center justify-center py-12">
//                   <Loader className="w-8 h-8 animate-spin text-indigo-600" />
//                   <span className="ml-2 text-gray-600">Loading your videos...</span>
//                 </div>
//               ) : videoByOwner?.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">No videos found. Upload some videos first!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3 max-h-60 overflow-y-auto">
//                   {videoByOwner?.map((video) => (
//                     <label
//                       key={video._id}
//                       className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedVideos.includes(video._id)}
//                         onChange={(e) => handleVideoToggle(video._id, e.target.checked)}
//                         className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
//                       />
//                       <img
//                         src={video.thumbnail || '/api/placeholder/80/45'}
//                         alt={video.title}
//                         className="w-20 h-12 object-cover rounded ml-3"
//                       />
//                       <div className="ml-3 flex-1">
//                         <p className="text-sm font-medium text-gray-900 line-clamp-1">
//                           {video.title}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {video.duration || 'Unknown duration'}
//                         </p>
//                       </div>
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Footer Actions */}
//         <div className="px-6 py-4 bg-gray-50 flex justify-between">
//           <button
//             onClick={handlePrevious}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             {currentStep === 0 ? 'Cancel' : 'Back'}
//           </button>

//           <button
//             onClick={handleNext}
//             disabled={creating || (currentStep === 0 && Object.keys(errors).length > 0)}
//             className="flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//           >
//             {creating ? (
//               <>
//                 <Loader className="w-4 h-4 animate-spin mr-2" />
//                 Creating...
//               </>
//             ) : currentStep === 0 ? (
//               <>
//                 Next: Add Videos
//                 <ArrowRight className="w-4 h-4 ml-2" />
//               </>
//             ) : (
//               <>
//                 Create Playlist
//                 <CheckCircle className="w-4 h-4 ml-2" />
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// });

// // Empty State Component
// const EmptyPlaylistState = React.memo(() => (
//   <div className="flex flex-col items-center justify-center py-20">
//     <div className="relative mb-8">
//       <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl animate-pulse opacity-75"></div>
//       <div className="relative flex items-center justify-center w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl animate-bounce">
//         <Video className="w-16 h-16 text-white" />
//       </div>
//       <div className="absolute -top-3 -right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-ping">
//         <Play className="w-6 h-6 text-white fill-current" />
//       </div>
//     </div>

//     <div className="text-center max-w-md">
//       <h2 className="text-3xl font-bold text-gray-800 mb-4">
//         Ready to Create Your First Playlist?
//       </h2>
//       <p className="text-gray-600 mb-8 text-lg leading-relaxed">
//         Organize your favorite videos, create themed collections, and build the perfect viewing experience
//       </p>

//       <div className="flex flex-wrap justify-center gap-4">
//         <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
//           <Plus className="w-5 h-5" />
//           Create Playlist
//         </button>

//         <button className="flex items-center gap-2 px-4 py-3 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all duration-200">
//           <Film className="w-5 h-5" />
//           Browse Videos
//         </button>
//       </div>
//     </div>
//   </div>
// ));

// // Main Playlist Component
// const Playlist = ({ timeAgo }) => {
//   const navigate = useNavigate();
//   const {
//     playlist,
//     creating,
//     createError,
//     fetchPlaylists,
//     fetchVideos
//   } = usePlaylistManager();

//   const [showCreateForm, setShowCreateForm] = useState(false);

//   // Effects
//   useEffect(() => {
//     fetchPlaylists();
//   }, [fetchPlaylists]);

//   useEffect(() => {
//     fetchVideos();
//   }, [fetchVideos]);

//   // Handlers
//   const handleNavigate = useCallback((path) => {
//     navigate(path);
//   }, [navigate]);

//   const handleCreatePlaylist = useCallback(async (data) => {
//     try {
//       const result = await createAPlayList({
//         title: data.title,
//         description: data.description,
//         privacy: data.privacy
//       });

//       if (data.selectedVideos.length > 0) {
//         await addAVideoToPlaylist({
//           playlistId: result.data._id,
//           arrayVideoId: data.selectedVideos
//         });
//       }

//       fetchPlaylists(); // Refresh playlists
//       return { success: true };
//     } catch (error) {
//       console.error('Error creating playlist:', error);
//       return { success: false, error };
//     }
//   }, [fetchPlaylists]);

//   const toggleCreateForm = useCallback(() => {
//     setShowCreateForm(prev => !prev);
//   }, []);

//   // Error state
//   if (createError) {
//     return (
//       <div className="flex items-center justify-center min-h-96">
//         <div className="text-center">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
//           <p className="text-gray-600 mb-4">Failed to load playlists. Please try again.</p>
//           <button
//             onClick={fetchPlaylists}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Playlists</h1>
//             <p className="text-gray-600">Organize and manage your video collections</p>
//           </div>
//           <button
//             onClick={toggleCreateForm}
//             disabled={creating}
//             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {creating ? (
//               <>
//                 <Loader className="w-5 h-5 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               <>
//                 <Plus className="w-5 h-5" />
//                 Create Playlist
//               </>
//             )}
//           </button>
//         </div>

//         {/* Create Playlist Form */}
//         <CreatePlaylistForm
//           isVisible={showCreateForm}
//           onClose={toggleCreateForm}
//           onSubmit={handleCreatePlaylist}
//         />

//         {/* Content */}
//         {playlist?.length === 0 ? (
//           <EmptyPlaylistState />
//         ) : (
//           <div className="space-y-4">
//             {playlist?.map((playlistItem) => (
//               <PlaylistItem
//                 key={playlistItem._id}
//                 playlist={playlistItem}
//                 onNavigate={handleNavigate}
//                 timeAgo={timeAgo}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Playlist;

