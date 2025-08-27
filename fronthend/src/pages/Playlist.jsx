import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAVideoToPlaylist, createAPlayList, getUserPlayList } from '../redux/features/playList';
import { Camera, Film, Heart, Music, Play, PlayIcon, Plus, Sparkles, Video, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVideoByOwner } from '../redux/features/videos';

const Playlist = ({ formatTime, timeAgo }) => {

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { user } = useSelector(state => state.user);
  const { playlist, creating, createError, createdId } = useSelector(state => state.Playlists)
  const { videoByOwner } = useSelector(state => state.videos);

  const [counter, setCounter] = useState(0);
  const [toggleCreatePlaylist, setToggleCreatePlaylist] = useState(false);
  const [formData, setFormData] = useState({
    title: "user playlist",
    description: " ",
    privacy: "public"
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

  return (
    <div className='max-md:w-screen max-w-screen h-screen overflow-y-scroll scrollBar py-3 max-md:py-2 px-6 max-md:px-2'>
      <div className='flex items-center justify-between border-b-1 py-1'>
        <h1 className='text-2xl max-md:text-lg max-sm:text-sm font-bold stroke-2 mb-2'>User Playlists</h1>
        <button onClick={() => setToggleCreatePlaylist(true)} className='mr-4 px-4 py-1 stroke-2 bg-blue-300 hover:bg-blue-200 hover:opacity-85 active:bg-blue-300 rounded-lg '>
          Create
        </button>
      </div>

      <div className='w-full'>
        <div className={`${toggleCreatePlaylist ? "" : "hidden"} md:mx-auto max-sm:mb-8 bg-gray-100 z-30 w-full max-w-6xl rounded-xl bg-ggray-100 p-8 max-sm:p-0  shadow-lg mt-1`}>
          {/* cancel button */}
          <div className='w-full flex items-center justify-end'>
            <button onClick={() => setToggleCreatePlaylist(false)} className='p-2 hover:bg-gray-100 rounded-full active:opacity-85 active:bg-gray-200'>
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
            <div className="h-2 w-full rounded-full bg-gray-200">
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
          <div className="hidden flex flex-col items-center justify-center w-full p-8 max-md:p-4 max-sm:p-0 mt-30 max-md:mt-16">
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
          <div className="w-full space-y-3 h-[calc(113px - 100vh)]">
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
                      <div className="absolute -left-3 -top-3 h-full w-full rounded-lg overflow-hidden bg-gray-400 dark:bg-gray-700">
                        <img
                          src={video?.video[0]?.thumbnail || video?.thumbnail}
                          alt={video?.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute -left-2 -top-2 h-full w-full overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-600">
                        <img
                          src={video?.video[0]?.thumbnail || video?.thumbnail}
                          alt={video?.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute -left-1 -top-1 h-full w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-500">
                        <img
                          src={video?.video[1]?.thumbnail || video?.thumbnail}
                          alt={video?.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Main Thumbnail */}
                      <div className="relative overflow-hidden rounded-xl">
                        {/* <img
                          src={video?.video[0]?.thumbnail || video?.thumbnail}
                          alt={video?.title}
                          className="h-full w-full object-cover"
                        /> */}

                        {/* Playlist Badge */}
                        <div className="absolute z-30 bottom-2 right-2 flex items-center gap-1 rounded bg-black/80 px-2 py-1 text-xs text-white">
                          <span>📋</span>
                          <span>Mix</span>
                        </div>

                        {/* Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <button className="flex h-15 w-15 items-center justify-center rounded-full bg-white/90 text-xl text-red-600">
                            ▶
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="max-md:w-[60%] max-w-96   flex-col flex py-1 pl-2">
                    {/* title */}
                    <div className="line-clamp-2 w-full font-medium text-xl pb-2 max-md:text-lg">
                      <h2>{video?.title}</h2>
                    </div>
                    <div className="flex">
                      <div className="flex items-baseline ">
                        <img
                          src={video?.owner?.avatar}
                          alt=""
                          className="w-6 mr-3 max-sm:w-6 max-md:w-10 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                        />
                      </div>
                      <div className="flex flex-col leading-tight">
                        {/* user name */}
                        <div className="mb-1  text-xs font-normal text-gray-500 max-md:text-xs">
                          <h3>{video?.owner?.fullname}</h3>
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
          </div>
        </div>

      </div>
    </div>
  )
}

export default Playlist
