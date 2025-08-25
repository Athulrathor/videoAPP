import React from 'react'

const videoCardDetailsMobile = ({video,formatTimeAgo}) => {
  return (
      <div>
          <div className="flex mt-3 mx-3 gap-3">
              {/* Channel Avatar */}
              <div
                  // onClick={(e) => handleChannelClick(e, playlist.owner.username)}
                  className="flex-shrink-0"
              >
                  <img
                      src={video?.userInfo?.avatar}
                      alt={video?.userInfo?.username}
                      loading="lazy"
                      className="w-9 h-9 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                  />
              </div>

              {/* Playlist Details */}
              <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-5 group-hover:text-gray-700">
                      {video?.title}
                  </h3>

                  <div className="mt-1">
                      <div className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                          {video?.userInfo?.username}
                      </div>

                      <div className="text-sm text-gray-600 mt-0.5 flex items-center gap-1">
                          {/* <Eye className="w-3 h-3" /> */}
                          <span>{video.views}<span className="ml-0.5">views</span></span>
                          <span className="mx-1">•</span>
                          <span>{formatTimeAgo(video?.createdAt)}</span>
                      </div>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default videoCardDetailsMobile