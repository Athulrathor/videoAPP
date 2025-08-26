import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAVideoToPlaylist, createAPlayList, getUserPlayList } from '../redux/features/playList';
import { Camera, Film, Heart, Music, Play, Plus, Sparkles, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Playlist = ({ formatTime, timeAgo, userInfo }) => {

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { user } = useSelector(state => state.user);
  const { playlist,creating,createError } = useSelector(state => state.Playlists)

  const [counter, setCounter] = useState(0);
  const [toggleCreatePlaylist, setToggleCreatePlaylist] = useState(false);
  const [formData, setFormData] = useState({
    title: "user playlist",
    description: " ",
    privacy: "publick"
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
    // if (formData.title && formData.description) {
      
    // }
    setCounter(prev => prev + 1);

    if (counter < 0) return setCounter(0);
  };

  const handlePrev = (e) => {
    e.preventDefault();

    setCounter(prev => prev - 1);

    if (counter > 3) return setCounter(2);
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock video search function (replace with actual API call)
  const searchVideos = async (term) => {
    if (!term.trim()) return;

    setIsSearching(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock search results (replace with actual API)
      const mockResults = [
        {
          id: '1',
          title: 'Amazing Song - Official Music Video',
          channel: 'Music Channel',
          duration: '3:45',
          thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
          views: '1.2M views'
        },
        {
          id: '2',
          title: 'Cool Track - Lyric Video',
          channel: 'Artist Official',
          duration: '4:12',
          thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
          views: '856K views'
        },
        // Add more mock videos...
      ].filter(video =>
        video.title.toLowerCase().includes(term.toLowerCase()) ||
        video.channel.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchVideos(searchTerm);
  };

  const addToPlaylist = (video) => {
    if (!selectedVideos.find(v => v.id === video.id)) {
      setSelectedVideos(prev => [...prev, video]);
    }
  };

  const removeFromPlaylist = (videoId) => {
    setSelectedVideos(prev => prev.filter(v => v.id !== videoId));
  };

  console.log(playlist)

  const handlePlaylistAddVideo = (e, playlistId, VideoId) => {
    e.preventDefault();

    handleNext(e);

    dispatch(addAVideoToPlaylist({ playlistId, VideoId }));


  }

  const handleCreatePlaylist = (e) => {
    e.preventDefault();

    handleNext(e);

    dispatch(createAPlayList({ title: formData?.title, description: formData?.description,privacy:formData.privacy }));

  }



  return (
    <div className='max-w-6xl h-screen py-3 max-md:py-2 px-6 max-md:px-2'>
      <div className='flex items-center justify-between border-b-1 border-gray-200 py-1'>
        <h1 className='text-2xl max-md:text-lg max-sm:text-sm font-bold stroke-2 mb-2'>User Playlists</h1>
        <button onClick={() => setToggleCreatePlaylist(!toggleCreatePlaylist)} className='mr-4 px-4 py-1 stroke-2 bg-blue-300 hover:bg-blue-200 hover:opacity-85 active:bg-blue-300 rounded-lg '>
          Create
        </button>
      </div>

      <div className='w-full'>


        <div className={`${toggleCreatePlaylist ? "absolute z-30" : "hidden"} mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800`}>
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">🎵</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Playlist
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
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
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Playlist Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData?.title}
                    onChange={handleInputChange}
                    placeholder="My Awesome Playlist"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                {/* Playlist Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData?.description}
                    onChange={handleInputChange}
                    placeholder="Tell people what your playlist is about..."
                    rows="4"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                {/* Privacy Settings */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Privacy Setting
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
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
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Public</span>
                        </div>
                        <p className="text-xs text-gray-500">Everyone can see</p>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
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
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Unlisted</span>
                        </div>
                        <p className="text-xs text-gray-500">Link only</p>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
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
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Private</span>
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

                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Left Side: Search & Results */}
                  <div>
                    <div className="mb-6">
                      <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        Search Videos
                      </h3>

                      {/* Search Form */}
                      <form onSubmit={handleSearch} className="flex space-x-2">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search for videos..."
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                        <button
                          type="submit"
                          disabled={isSearching}
                          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSearching ? '🔍' : 'Search'}
                        </button>
                      </form>
                    </div>

                    {/* Search Results */}
                    <div className="max-h-96 overflow-y-auto">
                      {isSearching && (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <div className="animate-spin text-2xl">⚡</div>
                            <p className="mt-2 text-sm text-gray-500">Searching videos...</p>
                          </div>
                        </div>
                      )}

                      {searchResults.length > 0 && (
                        <div className="space-y-3">
                          {searchResults.map((video) => (
                            <div key={video.id} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="h-16 w-24 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                  {video.title}
                                </h4>
                                <p className="text-xs text-gray-500">{video?.channel}</p>
                                <p className="text-xs text-gray-400">{video?.views} • {video?.duration}</p>
                              </div>
                              <button
                                onClick={() => addToPlaylist(video)}
                                disabled={selectedVideos.find(v => v.id === video?.id)}
                                className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                              >
                                {selectedVideos.find(v => v.id === video?.id) ? '✓' : '+'}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {searchResults.length === 0 && !isSearching && searchTerm && (
                        <div className="py-8 text-center">
                          <div className="text-4xl mb-2">🔍</div>
                          <p className="text-gray-500">No videos found for "{searchTerm}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Selected Videos & Playlist Preview */}
                  <div>
                    <div className="mb-6">
                      <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        Playlist Preview
                      </h3>

                      {/* Playlist Info Card */}
                      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                        <div className="flex items-start space-x-3">
                          <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-2xl text-white">🎵</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {formData?.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {formData?.description}
                            </p>
                            <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                              <img
                                src={userInfo?.avatar || `https://ui-avatars.com/api/?name=${userInfo?.name}&background=0D8ABC&color=fff`}
                                alt={userInfo?.name}
                                className="h-5 w-5 rounded-full"
                              />
                              <span>{userInfo?.name}</span>
                              <span>•</span>
                              <span>{selectedVideos.length} videos</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selected Videos */}
                    <div className="max-h-80 overflow-y-auto">
                      <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Selected Videos ({selectedVideos.length})
                      </h4>

                      {selectedVideos.length === 0 && (
                        <div className="py-8 text-center">
                          <div className="text-4xl mb-2">📝</div>
                          <p className="text-gray-500">No videos selected yet</p>
                          <p className="text-xs text-gray-400">Search and add videos to your playlist</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        {selectedVideos.map((video, index) => (
                          <div key={video.id} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3 dark:border-gray-600">
                            <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-xs font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                              {index + 1}
                            </span>
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="h-12 w-16 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                {video.title}
                              </h5>
                              <p className="text-xs text-gray-500">{video.channel} • {video.duration}</p>
                            </div>
                            <button
                              onClick={() => removeFromPlaylist(video.id)}
                              className="rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={(e) => handlePrev(e)}
                className={`${counter === 0 ? "" : "hidden"} rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600`}
              >
                { "Cancel"}
              </button>
              <button
                type="button"
                onClick={(e) => handlePrev(e)}
                className={`${counter >= 1 && counter < 2 ? "" : "hidden"} flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600`}
              >
                <span>← Back</span>
              </button>
              <button
                type="submit"
                // disabled={!formData?.title || !formData?.description}
                onClick={(e) => handleCreatePlaylist(e)}
                className={`${counter === 1 ? "hidden" : ""}  rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Next: Add Videos →
              </button>
              <button
                onClick={(e) => handlePlaylistAddVideo(e)}
                className={`${counter === 1 ? "" : "hidden"} flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <span>Create Playlist</span>
                <span>🎉</span>
              </button>
            </div>
          </div>
        </div>

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


        <div className=" overflow-y-scroll scrollBar mt-1">
          <div className="w-screen space-y-3 h-[calc(113px - 100vh)]">
            {playlist &&
              playlist.map((video) => (
                <div
                  key={video?._id}
                  className="flex h-fit"
                  onClick={() => Navigate(`/video/${video?._id}`)}
                >
                  {/* video */}
                  <div
                    className="relative max-md:w-[36%] max-sm:w-[42%] w-64 h-fit"
                  >
                    <div className="relative aspect-video mt-4 ml-4">
                      {/* Stack Layers */}
                      <div className="absolute -left-3 -top-3 h-full w-full rounded-lg bg-gray-400 dark:bg-gray-700"></div>
                      <div className="absolute -left-2 -top-2 h-full w-full rounded-lg bg-gray-300 dark:bg-gray-600"></div>
                      <div className="absolute -left-1 -top-1 h-full w-full rounded-lg bg-gray-200 dark:bg-gray-500"></div>

                      {/* Main Thumbnail */}
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={playlist.thumbnail}
                          alt={playlist.title}
                          className="h-full w-full object-cover"
                        />

                        {/* Playlist Badge */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/80 px-2 py-1 text-xs text-white">
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
          </div>
        </div>

      </div>
    </div>
  )
}

export default Playlist
