import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserPlayList } from '../redux/features/playList';
import { Camera, Film, Heart, Music, Play, Plus, Sparkles, Video } from 'lucide-react';

const Playlist = () => {

  const dispatch = useDispatch();

  const { user } = useSelector(state => state.user);
  const { playlist } = useSelector(state => state.Playlists)

  useEffect(() => {
    dispatch(getUserPlayList(user?._id));
  }, [dispatch, user?._id]);

  console.log(playlist)

  return (
    <div className='w-screen h-screen py-3 max-md:py-2 px-6 max-md:px-2'>
      <h1 className='text-2xl max-md:text-lg max-sm:text-sm font-bold stroke-2 mb-2'>User Playlists</h1>
      <div className='w-full'>

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
      </div>
    </div>
  )
}

export default Playlist
