import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearHistory, getWatchHistory, removingToWatchHistory } from '../redux/features/user';
import { useNavigate } from 'react-router-dom';
import { Delete, Trash, Trash2 } from 'lucide-react';

const History = (props) => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const {
        watchHistory,
        watchHistoryError,
        watchHistoryLoading
    } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getWatchHistory());
    }, [dispatch]);

    const handleDeletingHistoryId = (id) => {
        dispatch(removingToWatchHistory(id));
    }

    const handleClearhistory = () => {
        if (window.confirm('Are you sure you want to clear all watch history?')) {
            dispatch(clearHistory());
        }
    }

    console.log(watchHistory)

    const handleAllInOne = (e) => {
        const targetName = e.target.getAttribute("name");
        const targetId = e.target.id;
        const evenType = e.type;

        console.log(targetName, targetId, evenType);

        if ((targetName === "image" || targetName === "title") && evenType === 'click') {
            Navigate(`/video/${targetId}`);

            return;
        }

        if (targetName === "username" && evenType === 'click') {
            const username = e.target.getAttribute("data-username");
            Navigate(`/channel/${username}`);

            return;
        }

        if (targetName === "delete" && evenType === 'click') {

            handleDeletingHistoryId(targetId);
        }

        if (targetName === "clear" && evenType === 'click') {
            handleClearhistory();
        }
        
    }

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="animate-pulse">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-200">
                    <div className="w-full sm:w-48 h-32 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Error component
    const ErrorDisplay = ({ error, onRetry }) => (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
                <p className="text-red-600 mb-4 text-sm">{error || 'Failed to load watch history'}</p>
                <button
                    onClick={onRetry}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    // Empty state component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Watch History</h3>
                <p className="text-gray-500 max-w-sm">Start watching videos to see your history here. Your recently watched content will appear in this section.</p>
            </div>
        </div>
    );

    // Video item component
    const VideoItem = ({ video, index }) => (
        <div className="flex flex-row gap-4 max-sm:p-0 space-y-5 max-sm:space-y-2.5 hover:bg-gray-50 transition-colors duration-200">
            {/* Thumbnail */}
            <div name="body" id={video._id} className=" relative w-[30%] sm:w-[15%] aspect-video">
                <img
                    src={video.thumbnail || '/api/placeholder/320/180'}
                    alt={video.title}
                    className="object-cover aspect-video w-full rounded-lg max-sm:rounded-none"
                    loading={index < 3 ? 'eager' : 'lazy'}
                    id={video._id}
                    name='image'
                    data-username={video?.owner?.username}
                    onClick={handleAllInOne}
                />
                {video.duration && (
                    <span name='duration' id={video._id} onClick={handleAllInOne}  className="absolute bottom-2 max-sm:bottom-1 max-sm:right-1 right-2 bg-black bg-opacity-75 text-white text-xs max-sm:px-1 max-sm:py-0.5 max-sm:text-[6px] px-2 py-1 rounded">
                        {props.formatTime(video.duration)}
                    </span>
                )}
                {video.progress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 rounded-b-lg overflow-hidden">
                        <div
                            className="h-full bg-red-500 transition-all duration-300"
                            style={{ width: `${video.progress}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 w-[70%]">
                <h3 name="title" id={video._id} onClick={handleAllInOne} className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1 hover:text-blue-600 cursor-pointer transition-colors">
                    {video.title}
                </h3>

                <div name="body" id={video._id} onClick={handleAllInOne} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-2">
                    {video?.owner?.username && (
                        <span name='username' id={video._id} onClick={handleAllInOne} data-username={video?.owner?.username} className="hover:text-gray-900 cursor-pointer transition-colors">
                            {video?.owner?.username || "owner"}
                        </span>
                    )}
                    {video.views && (
                        <span className="hidden sm:inline">•</span>
                    )}
                    {video.views && (
                        <span>{video.views} views</span>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500">
                    {video.duration && (
                        <span>Watched {video.duration}</span>
                    )}
                    {video.duration && (
                        <>
                            <span className="hidden sm:inline">•</span>
                            <span>{video.duration}% watched</span>
                        </>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div name='body' id={video._id} className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
                <button name="more" id={video._id} onClick={handleAllInOne}  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200">
                    <svg name="more" id={video._id} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path name="more" id={video._id} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
                <button name="delete" id={video._id} onClick={handleAllInOne} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200">
                    <svg name="delete" id={video._id} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path name="delete" id={video._id} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );

    const handleRetry = () => {
        dispatch(getWatchHistory());
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-3">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Watch History</h1>
                        </div>

                        {!watchHistoryLoading && watchHistory?.length > 0 && (
                            <button
                                // onClick={clearAllHistory}
                                onClick={handleAllInOne}
                                name='clear'
                                className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="">
                    {watchHistoryLoading && <LoadingSkeleton />}

                    {watchHistoryError && (
                        <ErrorDisplay error={watchHistoryError} onRetry={handleRetry} />
                    )}

                    {!watchHistoryLoading && !watchHistoryError && watchHistory?.length === 0 && (
                        <EmptyState />
                    )}

                    {!watchHistoryLoading && !watchHistoryError && watchHistory?.length > 0 && (
                        <div className="bg-gray-50 ">
                            {watchHistory.map((video, index) => (
                                video ?  <VideoItem key={video._id || index} video={video} index={index} /> : "no video"
                            ))}
                        </div>
                    )}
                </div>

                {/* Load More Button (if pagination needed) */}
                {/* {!watchHistoryLoading && !watchHistoryError && watchHistory?.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <button className="bg-gray-100 hover:bg-white text-gray-700 font-medium py-2 px-6 border border-gray-300 rounded-lg transition-colors duration-200">
                            Load More
                        </button>
                    </div>
                )} */}
            </div>
        </div>
    );
}

export default History