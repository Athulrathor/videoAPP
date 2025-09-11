import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearHistory, getWatchHistory, removingToWatchHistory } from '../redux/features/user';
import { useNavigate } from 'react-router-dom';
import { Delete, Trash, Trash2, Clock, AlertTriangle, MoreVertical, Video, RefreshCw } from 'lucide-react';
import { useAppearance } from '../hooks/appearances';

const History = (props) => {
    const { appearanceSettings } = useAppearance();
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

    const handleAllInOne = (e) => {
        const targetName = e.target.getAttribute("name");
        const targetId = e.target.id;
        const evenType = e.type;

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
        <div
            className="animate-pulse"
            style={{
                animationDuration: appearanceSettings.reducedMotion ? '0s' : '2s'
            }}
        >
            {[...Array(6)].map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 p-4 border-b"
                    style={{
                        borderColor: 'var(--color-border)',
                        padding: 'var(--spacing-unit)',
                        gap: 'var(--spacing-unit)'
                    }}
                >
                    <div
                        className="w-full sm:w-48 h-32 rounded-lg"
                        style={{
                            backgroundColor: 'var(--color-bg-tertiary)',
                            borderRadius: '12px'
                        }}
                    />
                    <div
                        className="flex-1 space-y-2"
                        style={{ gap: 'var(--spacing-unit)' }}
                    >
                        <div
                            className="h-4 rounded w-3/4"
                            style={{
                                backgroundColor: 'var(--color-bg-tertiary)',
                                borderRadius: '4px'
                            }}
                        />
                        <div
                            className="h-3 rounded w-1/2"
                            style={{
                                backgroundColor: 'var(--color-bg-tertiary)',
                                borderRadius: '4px'
                            }}
                        />
                        <div
                            className="h-3 rounded w-1/4"
                            style={{
                                backgroundColor: 'var(--color-bg-tertiary)',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );

    // Error component
    const ErrorDisplay = ({ error, onRetry }) => (
        <div
            className="flex flex-col items-center justify-center py-16 px-4"
            style={{
                padding: 'var(--section-gap) var(--component-padding)',
                color: 'var(--color-text-primary)'
            }}
            role="alert"
            aria-live="assertive"
        >
            <div
                className="border rounded-lg p-6 max-w-md w-full text-center"
                style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    borderColor: 'var(--color-error)',
                    padding: 'var(--section-gap)'
                }}
            >
                <div
                    className="flex justify-center mb-4"
                    style={{ marginBottom: 'var(--spacing-unit)' }}
                >
                    <AlertTriangle
                        className="w-12 h-12"
                        style={{ color: 'var(--color-error)' }}
                    />
                </div>
                <h3
                    className="text-lg font-semibold mb-2"
                    style={{
                        color: 'var(--color-error)',
                        fontSize: 'var(--font-size-lg)',
                        fontFamily: 'var(--font-family)',
                        marginBottom: 'var(--spacing-unit)'
                    }}
                >
                    Something went wrong
                </h3>
                <p
                    className="mb-4 text-sm"
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)',
                        marginBottom: 'var(--spacing-unit)'
                    }}
                >
                    {error || 'Failed to load watch history'}
                </p>
                <button
                    onClick={onRetry}
                    className="px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2 mx-auto"
                    style={{
                        backgroundColor: 'var(--color-error)',
                        color: 'white',
                        padding: 'calc(var(--spacing-unit) * 0.75) var(--spacing-unit)',
                        fontSize: 'var(--font-size-sm)',
                        fontFamily: 'var(--font-family)',
                        gap: 'calc(var(--spacing-unit) * 0.5)',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-error-hover)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'var(--color-error)';
                    }}
                    aria-label="Retry loading watch history"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        </div>
    );

    // Empty state component
    const EmptyState = () => (
        <div
            className="flex flex-col items-center justify-center py-16 px-4"
            style={{
                padding: 'var(--section-gap) var(--component-padding)',
                color: 'var(--color-text-primary)'
            }}
            role="region"
            aria-label="No watch history"
        >
            <div className="text-center">
                <div
                    className="flex justify-center mb-4"
                    style={{
                        marginBottom: 'var(--spacing-unit)',
                        animation: appearanceSettings.reducedMotion ? 'none' : 'float 3s ease-in-out infinite'
                    }}
                >
                    <Video
                        className="w-16 h-16"
                        style={{ color: 'var(--color-text-tertiary)' }}
                    />
                </div>
                <h3
                    className="text-xl font-semibold mb-2"
                    style={{
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-xl)',
                        fontFamily: 'var(--font-family)',
                        marginBottom: 'var(--spacing-unit)'
                    }}
                >
                    No Watch History
                </h3>
                <p
                    className="max-w-sm"
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-base)',
                        lineHeight: '1.6'
                    }}
                >
                    Start watching videos to see your history here. Your recently watched content will appear in this section.
                </p>
            </div>
        </div>
    );

    // Video item component
    const VideoItem = ({ video, index }) => (
        <div
            className="flex flex-row gap-4 max-sm:p-0 space-y-5 max-sm:space-y-2.5 transition-colors duration-200"
            style={{
                padding: 'var(--spacing-unit)',
                gap: 'var(--spacing-unit)',
                backgroundColor: 'transparent',
                transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-hover)';
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
            }}
            role="listitem"
            aria-label={`Video: ${video.title}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    Navigate(`/video/${video._id}`);
                }
            }}
        >
            {/* Thumbnail */}
            <div
                name="body"
                id={video._id}
                className="relative w-[30%] sm:w-[15%] aspect-video cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Play video: ${video.title}`}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        Navigate(`/video/${video._id}`);
                    }
                }}
            >
                <img
                    src={video.thumbnail || '/api/placeholder/320/180'}
                    alt={video.title}
                    className="object-cover aspect-video w-full rounded-lg max-sm:rounded-none"
                    style={{ borderRadius: '12px' }}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    id={video._id}
                    name='image'
                    data-username={video?.owner?.username}
                    onClick={handleAllInOne}
                />
                {video.duration && (
                    <span
                        name='duration'
                        id={video._id}
                        onClick={handleAllInOne}
                        className="absolute bottom-2 max-sm:bottom-1 max-sm:right-1 right-2 text-white text-xs max-sm:px-1 max-sm:py-0.5 max-sm:text-[6px] px-2 py-1 rounded"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            fontSize: 'var(--font-size-xs)',
                            padding: 'calc(var(--spacing-unit) * 0.25) calc(var(--spacing-unit) * 0.5)'
                        }}
                    >
                        {props.formatTime(video.duration)}
                    </span>
                )}
                {video.progress && (
                    <div
                        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg overflow-hidden"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
                    >
                        <div
                            className="h-full transition-all duration-300"
                            style={{
                                width: `${video.progress}%`,
                                backgroundColor: 'var(--color-error)',
                                transitionDuration: 'var(--animation-duration)'
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 w-[70%]">
                <h3
                    name="title"
                    id={video._id}
                    onClick={handleAllInOne}
                    className="font-semibold text-sm sm:text-base line-clamp-2 mb-1 cursor-pointer transition-colors"
                    style={{
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-base)',
                        fontFamily: 'var(--font-family)',
                        marginBottom: 'calc(var(--spacing-unit) * 0.5)',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.color = 'var(--accent-color)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = 'var(--color-text-primary)';
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Play video: ${video.title}`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            Navigate(`/video/${video._id}`);
                        }
                    }}
                >
                    {video.title}
                </h3>

                <div
                    name="body"
                    id={video._id}
                    onClick={handleAllInOne}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm mb-2"
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)',
                        gap: 'calc(var(--spacing-unit) * 0.75)',
                        marginBottom: 'var(--spacing-unit)'
                    }}
                >
                    {video?.owner?.username && (
                        <span
                            name='username'
                            id={video._id}
                            onClick={handleAllInOne}
                            data-username={video?.owner?.username}
                            className="cursor-pointer transition-colors"
                            style={{
                                transitionDuration: 'var(--animation-duration)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = 'var(--accent-color)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = 'var(--color-text-secondary)';
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Visit ${video?.owner?.username}'s channel`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    Navigate(`/channel/${video?.owner?.username}`);
                                }
                            }}
                        >
                            {video?.owner?.username || "owner"}
                        </span>
                    )}
                    {video.views && (
                        <>
                            <span
                                className="hidden sm:inline"
                                aria-hidden="true"
                                style={{ color: 'var(--color-text-tertiary)' }}
                            >
                                •
                            </span>
                            <span aria-label={`${video.views} views`}>{video.views} views</span>
                        </>
                    )}
                </div>

                <div
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs"
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)',
                        gap: 'calc(var(--spacing-unit) * 0.75)'
                    }}
                >
                    {video.duration && (
                        <>
                            <span>Watched {video.duration}</span>
                            <span
                                className="hidden sm:inline"
                                aria-hidden="true"
                                style={{ color: 'var(--color-text-tertiary)' }}
                            >
                                •
                            </span>
                            <span>{video.duration}% watched</span>
                        </>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div
                name='body'
                id={video._id}
                className="flex sm:flex-col gap-2 mt-2 sm:mt-0"
                style={{
                    gap: 'calc(var(--spacing-unit) * 0.5)',
                    marginTop: 'var(--spacing-unit)'
                }}
            >
                <button
                    name="more"
                    id={video._id}
                    onClick={handleAllInOne}
                    className="p-2 rounded-full transition-colors duration-200"
                    style={{
                        color: 'var(--color-text-tertiary)',
                        backgroundColor: 'transparent',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.color = 'var(--color-text-secondary)';
                        e.target.style.backgroundColor = 'var(--color-hover)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = 'var(--color-text-tertiary)';
                        e.target.style.backgroundColor = 'transparent';
                    }}
                    aria-label={`More options for ${video.title}`}
                >
                    <MoreVertical className="w-4 h-4" />
                </button>
                <button
                    name="delete"
                    id={video._id}
                    onClick={handleAllInOne}
                    className="p-2 rounded-full transition-colors duration-200"
                    style={{
                        color: 'var(--color-text-tertiary)',
                        backgroundColor: 'transparent',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.color = 'var(--color-error)';
                        e.target.style.backgroundColor = 'var(--color-error-bg)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = 'var(--color-text-tertiary)';
                        e.target.style.backgroundColor = 'transparent';
                    }}
                    aria-label={`Remove ${video.title} from history`}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    const handleRetry = () => {
        dispatch(getWatchHistory());
    };

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: 'var(--color-bg-primary)',
                fontFamily: 'var(--font-family)'
            }}
            role="main"
            aria-label="Watch history"
        >
            {/* Header */}
            <div
                className="shadow-sm border-b"
                style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: 'var(--color-border)'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="flex items-center justify-between py-4"
                        style={{
                            padding: 'var(--spacing-unit) 0',
                            gap: 'var(--spacing-unit)'
                        }}
                    >
                        <div
                            className="flex items-center space-x-3"
                            style={{ gap: 'var(--spacing-unit)' }}
                        >
                            <Clock
                                className="w-6 h-6"
                                style={{ color: 'var(--color-text-primary)' }}
                            />
                            <h1
                                className="text-xl sm:text-2xl font-bold"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-2xl)',
                                    fontFamily: 'var(--font-family)'
                                }}
                            >
                                Watch History
                            </h1>
                        </div>

                        {!watchHistoryLoading && watchHistory?.length > 0 && (
                            <button
                                onClick={handleAllInOne}
                                name='clear'
                                className="text-sm font-medium transition-colors duration-200"
                                style={{
                                    color: 'var(--color-error)',
                                    fontSize: 'var(--font-size-sm)',
                                    fontFamily: 'var(--font-family)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = 'var(--color-error-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = 'var(--color-error)';
                                }}
                                aria-label="Clear all watch history"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
                style={{
                    padding: 'var(--section-gap) var(--component-padding)'
                }}
            >
                <div>
                    {watchHistoryLoading && <LoadingSkeleton />}

                    {watchHistoryError && (
                        <ErrorDisplay error={watchHistoryError} onRetry={handleRetry} />
                    )}

                    {!watchHistoryLoading && !watchHistoryError && watchHistory?.length === 0 && (
                        <EmptyState />
                    )}

                    {!watchHistoryLoading && !watchHistoryError && watchHistory?.length > 0 && (
                        <div
                            role="list"
                            aria-label="Your watch history"
                            style={{
                                backgroundColor: 'var(--color-bg-primary)'
                            }}
                        >
                            {watchHistory.map((video, index) => (
                                video ? (
                                    <VideoItem key={video._id || index} video={video} index={index} />
                                ) : null
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Live Region for Status Updates */}
            <div
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
            >
                {watchHistoryLoading && "Loading watch history..."}
                {watchHistoryError && `Error loading history: ${watchHistoryError}`}
                {!watchHistoryLoading && !watchHistoryError && watchHistory?.length === 0 && "No watch history found"}
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
        </div>
    );
}

export default History;
