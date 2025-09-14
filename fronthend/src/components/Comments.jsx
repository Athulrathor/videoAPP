import React, { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, MoreVertical, Heart, X, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddCommentReplies, fetchAddShortComment, fetchAddVideoComment, fetchCommentReplies, fetchVideoComment } from '../redux/features/comment';
import { fetchLikeToggleComment } from '../redux/features/likes';
import { isCommentLiked } from '../redux/features/likes';
// import { useAppearance } from '../hooks/appearances';

const Comments = ({
    whichContent,
    contentId,
    minimiseComment = true,
    setMinimiseComment,
    toggle = { shortComments: true, setShowComment: null }
}) => {
    // const { appearanceSettings } = useAppearance();
    const dispatch = useDispatch();

    const { videosComments, repliesOnComment, shortComments } = useSelector(state => state.comments);
    const { commentLiked } = useSelector(state => state.likes);
    const { user } = useSelector(state => state.user);

    const [localCommentData, setLocalCommentData] = useState({});
    const [newComment, setNewComment] = useState('');
    const [showCommentActions, setShowCommentActions] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [showRepliesFor, setShowRepliesFor] = useState(null);
    const [commentStatus, setCommentStatus] = useState({});

    // All your existing useEffects and handlers remain the same...
    useEffect(() => {
        if (videosComments && videosComments?.length > 0) {
            const initialData = {};
            videosComments.forEach(comment => {
                dispatch(isCommentLiked(comment._id));
                initialData[comment._id] = {
                    totalLikes: comment.totalLikes || 0,
                    totalReplies: comment.totalReplies || comment.totalComment,
                    isLiked: commentLiked
                };
            });
            setLocalCommentData(initialData);
        }
        if (shortComments && shortComments?.length > 0) {
            const initialData = {};
            shortComments.forEach(comment => {
                dispatch(isCommentLiked(comment._id));
                initialData[comment._id] = {
                    totalLikes: comment.totalLikes || 0,
                    totalReplies: comment.totalReplies || comment.totalComment,
                    isLiked: commentLiked
                };
            });
            setLocalCommentData(initialData);
        }
    }, [videosComments, shortComments, commentLiked, dispatch]);

    useEffect(() => {
        if (contentId && whichContent === "videos") {
            dispatch(fetchVideoComment(contentId));
        }
    }, [contentId, dispatch, whichContent]);

    // All your existing handlers remain the same, but I'll show a few key ones...
    const handleLikeToggleComment = (id) => {
        const currentLiked = localCommentData[id]?.isLiked || commentStatus[id]?.like || false;
        const currentLikes = localCommentData[id]?.totalLikes || 0;

        // Optimistic UI update
        setLocalCommentData(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                isLiked: !currentLiked,
                totalLikes: currentLiked ? currentLikes - 1 : currentLikes + 1
            }
        }));

        setCommentStatus((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                like: !currentLiked
            }
        }));

        dispatch(fetchLikeToggleComment(id))
            .unwrap()
            .then((response) => {
                if (response?.totalLikes !== undefined) {
                    setLocalCommentData(prev => ({
                        ...prev,
                        [id]: {
                            ...prev[id],
                            totalLikes: response.totalLikes,
                            isLiked: response.isLiked
                        }
                    }));
                }
            })
            .catch((error) => {
                setLocalCommentData(prev => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        isLiked: currentLiked,
                        totalLikes: currentLikes
                    }
                }));
                setCommentStatus((prev) => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        like: currentLiked
                    }
                }));
                console.error('Failed to toggle like:', error);
            });
    };

    const handleAddComment = () => {
        if (whichContent === "videos") {
            if (newComment.trim()) {
                dispatch(fetchAddVideoComment({ id: contentId, newComment: newComment.trim() }))
                    .unwrap()
                    .then(() => {
                        setNewComment('');
                        setShowCommentActions(false);
                    })
                    .catch((error) => {
                        console.error('Failed to add comment:', error);
                    });
            }
        } else {
            if (newComment.trim()) {
                dispatch(fetchAddShortComment({ id: contentId, newComment: newComment.trim() }))
                    .unwrap()
                    .then(() => {
                        setNewComment('');
                        setShowCommentActions(false);
                    })
                    .catch((error) => {
                        console.error('Failed to add comment:', error);
                    });
            }
        }
    };

    // Other handlers remain the same...
    const handleAddCommentReplies = (commentId, replied) => {
        if (replied?.trim()) {
            setLocalCommentData(prev => ({
                ...prev,
                [commentId]: {
                    ...prev[commentId],
                    totalReplies: (prev[commentId]?.totalReplies || 0) + 1
                }
            }));

            dispatch(fetchAddCommentReplies({ id: commentId, newComment: replied.trim() }))
                .unwrap()
                .then(() => {
                    setCommentStatus((prev) => ({
                        ...prev,
                        [commentId]: {
                            ...prev[commentId],
                            repliesInput: ""
                        }
                    }));
                    setReplyingTo(null);
                    setShowRepliesFor(commentId);
                })
                .catch((error) => {
                    setLocalCommentData(prev => ({
                        ...prev,
                        [commentId]: {
                            ...prev[commentId],
                            totalReplies: Math.max((prev[commentId]?.totalReplies || 1) - 1, 0)
                        }
                    }));
                    console.error('Failed to add reply:', error);
                });
        }
    };

    const handleCommentReplies = (commentId) => {
        if (showRepliesFor === commentId) {
            setShowRepliesFor(null);
        } else {
            setShowRepliesFor(commentId);
            dispatch(fetchCommentReplies(commentId));
        }
    };

    const handleReplyToggle = (commentId) => {
        setReplyingTo(replyingTo === commentId ? null : commentId);
    };

    const handleRepliesInputChange = (commentId, value) => {
        setCommentStatus((prev) => ({
            ...prev,
            [commentId]: {
                ...prev[commentId],
                repliesInput: value
            }
        }));
    };

    const Comment = ({ comment, isReply = false }) => {
        const currentLikes = localCommentData[comment._id]?.totalLikes ?? comment.totalLikes ?? 0;
        const isLiked = localCommentData[comment._id]?.isLiked ?? commentStatus[comment._id]?.like ?? comment.isLiked ?? false;

        return (
            <div
                className={`flex gap-2 ${isReply ? 'ml-6 max-sm:ml-0 max-sm:mt-1 mt-3' : 'mb-2 max-sm:mb-1'} transition-all`}
                style={{
                    gap: 'var(--spacing-unit)',
                    // marginBottom: isReply ? 'var(--spacing-unit)' : 'var(--section-gap)',
                    transitionDuration: 'var(--animation-duration)'
                }}
                role={isReply ? "listitem" : "article"}
                aria-label={`Comment by ${comment?.user_info?.username}`}
            >
                <div
                    className={`${isReply ? 'w-6 h-6' : 'w-10 h-10'} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-xs overflow-hidden`}
                    // style={{
                    //     background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))'
                    // }}
                >
                    <img
                        src={comment?.user_info?.avatar}
                        alt={`${comment?.user_info?.username}'s avatar`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                <div className="flex-1">
                    <div
                        className="flex items-center gap-2 mb-1"
                        style={{
                            gap: 'var(--spacing-unit)',
                            // marginBottom: 'var(--spacing-unit)'
                        }}
                    >
                        <span
                            className="font-medium"
                            style={{
                                color: 'var(--color-text-primary)',
                                fontSize: 'var(--font-size-sm)',
                                fontFamily: 'var(--font-family)'
                            }}
                        >
                            @{comment?.user_info?.username}
                        </span>
                        <span
                            className="text-xs"
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-xs)'
                            }}
                        >
                            {comment?.createdAt}
                        </span>
                    </div>

                    <div
                        className="text-sm leading-relaxed "
                        style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)',
                            fontFamily: 'var(--font-family)',
                            // marginBottom: 'var(--spacing-unit)'
                        }}
                    >
                        {comment?.content}
                    </div>

                    <div
                        className="flex items-center"
                        style={{ gap: 'var(--spacing-unit)' }}
                    >
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleLikeToggleComment(comment._id)}
                                className="flex items-center rounded-full transition-all p-2"
                                style={{
                                    color: isLiked ? 'var(--accent-color)' : 'var(--color-text-secondary)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--color-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                }}
                                aria-label={isLiked ? "Unlike this comment" : "Like this comment"}
                                aria-pressed={isLiked}
                                role="button"
                                tabIndex={0}
                            >
                                <ThumbsUp className="w-4 h-4" />
                                <span
                                    className='ml-1'
                                    style={{
                                        color: 'var(--color-text-primary)',
                                        fontSize: 'var(--font-size-xs)'
                                    }}
                                >
                                    {currentLikes === 0 ? "" : currentLikes}
                                </span>
                            </button>
                        </div>

                        <button
                            onClick={() => setCommentStatus((prev) => ({
                                ...prev,
                                [comment._id]: {
                                    ...prev[comment._id],
                                    dislike: !prev[comment._id]?.dislike
                                }
                            }))}
                            className="p-2 rounded-full transition-all"
                            style={{
                                color: commentStatus[comment?._id]?.dislike ? 'var(--color-error)' : 'var(--color-text-secondary)',
                                transitionDuration: 'var(--animation-duration)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'var(--color-hover)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                            aria-label={commentStatus[comment?._id]?.dislike ? "Remove dislike" : "Dislike this comment"}
                            aria-pressed={commentStatus[comment?._id]?.dislike}
                            role="button"
                            tabIndex={0}
                        >
                            <ThumbsDown className="w-4 h-4" />
                        </button>

                        {!isReply && (
                            <button
                                onClick={() => handleReplyToggle(comment._id)}
                                className="text-xs font-medium px-3 py-1 rounded-full transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-xs)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--color-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                                }}
                                aria-label={`Reply to ${comment?.user_info?.username}`}
                                role="button"
                                tabIndex={0}
                            >
                                Reply
                            </button>
                        )}

                        <button
                            className="p-2 rounded-full transition-all"
                            style={{
                                color: 'var(--color-text-secondary)',
                                transitionDuration: 'var(--animation-duration)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'var(--color-hover)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                            aria-label="More options for this comment"
                            role="button"
                            tabIndex={0}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment?._id && (
                        <div
                            className="mt-3 max-sm:mt-1.5 flex gap-2"
                            style={{
                                marginTop: 'var(--spacing-unit)',
                                gap: 'var(--spacing-unit)'
                            }}
                        >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs overflow-hidden">
                                <img
                                    src={user?.avatar}
                                    alt="Your avatar"
                                    className='w-full h-full aspect-square rounded-full object-cover'
                                />
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={commentStatus[comment._id]?.repliesInput || ''}
                                    onChange={(e) => handleRepliesInputChange(comment._id, e.target.value)}
                                    placeholder={`Reply to @${comment?.user_info?.username}...`}
                                    className="w-full bg-transparent border-b-2 focus:outline-none resize-none text-sm p-2 transition-all"
                                    style={{
                                        borderColor: 'var(--color-border)',
                                        color: 'var(--color-text-primary)',
                                        fontSize: 'var(--font-size-sm)',
                                        fontFamily: 'var(--font-family)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent-color)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--color-border)';
                                    }}
                                    rows="2"
                                    aria-label={`Reply to ${comment?.user_info?.username}'s comment`}
                                />
                                <div
                                    className="flex gap-2 mt-2"
                                    style={{
                                        gap: 'var(--spacing-unit)',
                                        marginTop: 'var(--spacing-unit)'
                                    }}
                                >
                                    <button
                                        onClick={() => handleAddCommentReplies(comment._id, commentStatus[comment._id]?.repliesInput)}
                                        className="px-4 py-2 text-white text-xs font-medium rounded-full transition-all"
                                        style={{
                                            backgroundColor: commentStatus[comment._id]?.repliesInput ? 'var(--accent-color)' : 'var(--color-text-secondary)',
                                            fontSize: 'var(--font-size-xs)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (commentStatus[comment._id]?.repliesInput) {
                                                e.target.style.opacity = '0.9';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.opacity = '1';
                                        }}
                                        disabled={!commentStatus[comment._id]?.repliesInput}
                                        aria-label="Submit reply"
                                    >
                                        Reply
                                    </button>
                                    <button
                                        onClick={() => {
                                            setReplyingTo(null);
                                            setCommentStatus((prev) => ({
                                                ...prev,
                                                [comment._id]: {
                                                    ...prev[comment._id],
                                                    repliesInput: ""
                                                }
                                            }));
                                        }}
                                        className="px-4 py-2 text-xs font-medium rounded-full transition-all"
                                        style={{
                                            backgroundColor: 'var(--color-bg-secondary)',
                                            color: 'var(--color-text-primary)',
                                            fontSize: 'var(--font-size-xs)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = 'var(--color-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                                        }}
                                        aria-label="Cancel reply"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show Replies Button */}
                    {!isReply && (
                        <button
                            onClick={() => handleCommentReplies(comment._id)}
                            className="my-1 px-4 py-1 rounded-2xl border transition-all"
                            style={{
                                backgroundColor: showRepliesFor === comment._id ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                                color: showRepliesFor === comment._id ? 'var(--accent-color)' : 'var(--color-text-primary)',
                                borderColor: showRepliesFor === comment._id ? 'var(--accent-color)' : 'var(--color-border)',
                                fontSize: 'var(--font-size-xs)',
                                transitionDuration: 'var(--animation-duration)'
                            }}
                            onMouseEnter={(e) => {
                                if (showRepliesFor !== comment._id) {
                                    e.target.style.backgroundColor = 'var(--color-hover)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (showRepliesFor !== comment._id) {
                                    e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                                }
                            }}
                            aria-expanded={showRepliesFor === comment._id}
                            aria-label={`${showRepliesFor === comment._id ? 'Hide' : 'Show'} ${comment?.totalReplies || comment?.totalComment || 0} replies`}
                        >
                            {showRepliesFor === comment._id ? 'Hide Replies' : 'Show Replies'}
                            <span className='ml-1'>
                                {(comment?.totalReplies || comment?.totalComment) === 0 ? "" : (comment?.totalReplies || comment?.totalComment)}
                            </span>
                        </button>
                    )}

                    {/* Replies List */}
                    {!isReply && showRepliesFor === comment._id && repliesOnComment?.data && (
                        <div
                            className="mt-3"
                            style={{ marginTop: 'var(--spacing-unit)' }}
                            role="list"
                            aria-label="Comment replies"
                        >
                            {repliesOnComment.data.map(reply => (
                                <Comment key={reply?._id || reply?.id} comment={reply} isReply={true} />
                            ))}
                            {repliesOnComment.data.length === 0 && (
                                <div
                                    className="ml-6 text-sm"
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: 'var(--font-size-sm)'
                                    }}
                                >
                                    No replies yet.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <div
                className={`${toggle.showComment ? "" : ""} ${!minimiseComment ? "h-[100px]" :
                        `${whichContent === "shorts" ? "h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)]" : "h-fit"}`
                    } p-3 transition-all`}
                style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    padding: 'var(--component-padding)',
                    transitionDuration: 'var(--animation-duration)'
                }}
                role="region"
                aria-label="Comments section"
            >
                <div className="max-w-4xl mx-auto">
                    {/* Comments Header */}
                    <div>
                        <div
                            className="flex items-center justify-between gap-6 mb-2 max-sm:mb-1"
                            style={{
                                gap: 'var(--section-gap)',
                                // marginBottom: 'var(--spacing-unit)'
                            }}
                        >
                            <div
                                className='flex space-x-2'
                                style={{ gap: 'var(--spacing-unit)' }}
                            >
                                <h3
                                    className="text-xl font-medium"
                                    style={{
                                        color: 'var(--color-text-primary)',
                                        fontSize: 'var(--font-size-xl)',
                                        fontFamily: 'var(--font-family)'
                                    }}
                                >
                                    Comments
                                </h3>
                                <button
                                    className="flex items-center gap-2 text-sm font-medium transition-colors"
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: 'var(--font-size-sm)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = 'var(--color-text-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = 'var(--color-text-secondary)';
                                    }}
                                    aria-label="Sort comments"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
                                    </svg>
                                    Sort by
                                </button>
                            </div>

                            <div className={`${whichContent === "videos" ? "hidden" : ""}`}>
                                <button
                                    onClick={() => toggle.setShowComment(true)}
                                    className="p-3 rounded-full transition-all"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: 'var(--color-text-primary)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = 'var(--color-hover)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                    }}
                                    aria-label="Close comments"
                                >
                                    <X />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Add Comment */}
                    <div
                        className={`flex gap-3 max-sm:gap-1.5 mb-3 max-sm:mb-1.5 ${whichContent === "shorts" ? "" : ""} bottom-0`}
                        style={{
                            gap: 'var(--spacing-unit)',
                            marginBottom: 'var(--spacing-unit)'
                        }}
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))'
                            }}
                        >
                            <img
                                src={user?.avatar}
                                alt="Your avatar"
                                className='w-full h-full aspect-square rounded-full object-cover'
                            />
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onFocus={() => setShowCommentActions(true)}
                                placeholder="Add a comment..."
                                className="w-full bg-transparent border-b-2 focus:outline-none resize-none text-sm pt-2 transition-all"
                                style={{
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-sm)',
                                    fontFamily: 'var(--font-family)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                                onFocusCapture={(e) => {
                                    e.target.style.borderColor = 'var(--accent-color)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--color-border)';
                                }}
                                rows="2"
                                aria-label="Write a comment"
                            />
                            {showCommentActions && (
                                <div
                                    className="flex gap-2 mt-3 max-sm:mt-1.5"
                                    style={{
                                        gap: 'var(--spacing-unit)',
                                        marginTop: 'var(--spacing-unit)'
                                    }}
                                >
                                    <button
                                        onClick={handleAddComment}
                                        className="px-4 py-2 text-white text-sm font-medium rounded-full transition-all"
                                        style={{
                                            backgroundColor: newComment.trim() ? 'var(--accent-color)' : 'var(--color-text-secondary)',
                                            fontSize: 'var(--font-size-sm)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (newComment.trim()) {
                                                e.target.style.opacity = '0.9';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.opacity = '1';
                                        }}
                                        disabled={!newComment.trim()}
                                        aria-label="Submit comment"
                                    >
                                        Comment
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCommentActions(false);
                                            setNewComment('');
                                        }}
                                        className="px-4 py-2 text-sm font-medium rounded-full transition-all"
                                        style={{
                                            backgroundColor: 'var(--color-bg-secondary)',
                                            color: 'var(--color-text-primary)',
                                            fontSize: 'var(--font-size-sm)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = 'var(--color-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                                        }}
                                        aria-label="Cancel comment"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments List */}
                    <div
                        className={`${minimiseComment ? "" : "h-16 overflow-hidden"} h-[calc(100vh_-_200px)] overflow-x-hidden max-sm:pb-7 scrollBar overflow-y-scroll`}
                        role="list"
                        aria-label="Comments list"
                    >
                        {(whichContent === "videos" ? videosComments : shortComments)?.map(comment => (
                            <Comment key={comment?._id} comment={comment} />
                        ))}
                    </div>
                </div>

                {/* Minimize Toggle */}
                <div
                    className={`${!minimiseComment ? "hidden" : ""} cursor-pointer transition-colors ${whichContent === "shorts" ? "hidden" : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setMinimiseComment(!minimiseComment);
                    }}
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)',
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
                    aria-label="Show fewer comments"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setMinimiseComment(!minimiseComment);
                        }
                    }}
                >
                    See Less
                </div>
            </div>
        </div>
    );
};

export default Comments;
