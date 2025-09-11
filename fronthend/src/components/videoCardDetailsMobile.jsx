import React from 'react'
// import { useAppearance } from '../hooks/appearances';

const VideoCardDetailsMobile = ({ video, formatTimeAgo, onChannelClick, onVideoClick }) => {
    // const { appearanceSettings } = useAppearance();

    return (
        <article
            className="transition-all"
            style={{
                backgroundColor: 'var(--color-bg-primary)',
                transitionDuration: 'var(--animation-duration)'
            }}
            role="listitem"
            aria-label={`Video: ${video?.title} by ${video?.userInfo?.username}`}
        >
            <div
                className="flex mt-3 mx-3 gap-3 transition-all"
                style={{
                    marginTop: 'var(--spacing-unit)',
                    gap: 'var(--spacing-unit)',
                    padding: 'var(--spacing-unit)',
                    transitionDuration: 'var(--animation-duration)'
                }}
            >
                {/* Channel Avatar */}
                <div
                    onClick={(e) => onChannelClick?.(e, video?.userInfo?.username)}
                    className="flex-shrink-0 cursor-pointer transition-all"
                    style={{
                        transitionDuration: 'var(--animation-duration)'
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Visit ${video?.userInfo?.username}'s channel`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onChannelClick?.(e, video?.userInfo?.username);
                        }
                    }}
                >
                    <img
                        src={video?.userInfo?.avatar}
                        alt={`${video?.userInfo?.username}'s profile picture`}
                        loading="lazy"
                        className="w-9 h-9 rounded-full transition-all"
                        style={{
                            transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = `0 0 0 2px var(--accent-color)`;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                {/* Video Details */}
                <div className="flex-1 min-w-0">
                    <h3
                        className="text-sm font-medium line-clamp-2 leading-5 cursor-pointer transition-all"
                        style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)',
                            fontFamily: 'var(--font-family)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                        onClick={(e) => onVideoClick?.(e, video?._id)}
                        onMouseEnter={(e) => {
                            e.target.style.color = 'var(--accent-color)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = 'var(--color-text-primary)';
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Play video: ${video?.title}`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onVideoClick?.(e, video?._id);
                            }
                        }}
                    >
                        {video?.title}
                    </h3>

                    <div
                        className="mt-1"
                        style={{ marginTop: 'var(--spacing-unit)' }}
                    >
                        {/* Channel Name */}
                        <div
                            className="text-sm cursor-pointer transition-all"
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-sm)',
                                fontFamily: 'var(--font-family)',
                                transitionDuration: 'var(--animation-duration)'
                            }}
                            onClick={(e) => onChannelClick?.(e, video?.userInfo?.username)}
                            onMouseEnter={(e) => {
                                e.target.style.color = 'var(--accent-color)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = 'var(--color-text-secondary)';
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Visit ${video?.userInfo?.username}'s channel`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onChannelClick?.(e, video?.userInfo?.username);
                                }
                            }}
                        >
                            {video?.userInfo?.username}
                        </div>

                        {/* Video Metadata */}
                        <div
                            className="text-sm mt-0.5 flex items-center gap-1"
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-sm)',
                                fontFamily: 'var(--font-family)',
                                marginTop: 'calc(var(--spacing-unit) * 0.5)',
                                gap: 'calc(var(--spacing-unit) * 0.5)'
                            }}
                        >
                            <span
                                aria-label={`${video.views} views`}
                            >
                                {video.views}
                                <span className="ml-0.5">views</span>
                            </span>
                            <span
                                className="mx-1"
                                style={{ color: 'var(--color-text-secondary)' }}
                                aria-hidden="true"
                            >
                                •
                            </span>
                            <time
                                dateTime={video?.createdAt}
                                aria-label={`Published ${formatTimeAgo(video?.createdAt)}`}
                            >
                                {formatTimeAgo(video?.createdAt)}
                            </time>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default VideoCardDetailsMobile
