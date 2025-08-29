import React, { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, MoreVertical, Heart, X, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddCommentReplies, fetchAddShortComment, fetchAddVideoComment, fetchCommentReplies, fetchShortComment, fetchVideoComment } from '../redux/features/comment';
import { fetchLikeToggleComment } from '../redux/features/likes';
import { isCommentLiked } from '../redux/features/likes';

const Comments = ({ whichContent, contentId, minimiseComment=true, setMinimiseComment, toggle={shortComments:true,setShowComment:null} }) => {
    const dispatch = useDispatch();

    const { videosComments, repliesOnComment,shortComments } = useSelector(state => state.comments);
    const { commentLiked } = useSelector(state => state.likes);
    const { user } = useSelector(state => state.user);
    
    const [localCommentData, setLocalCommentData] = useState({});

    const [newComment, setNewComment] = useState('');
    const [showCommentActions, setShowCommentActions] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [showRepliesFor, setShowRepliesFor] = useState(null);

    const [commentStatus, setCommentStatus] = useState({});

    console.log(shortComments,videosComments)

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
            
    }, [videosComments,shortComments]);

    useEffect(() => {
        if (contentId && whichContent === "videos") {
            dispatch(fetchVideoComment(contentId));
        }
    }, [contentId, dispatch, whichContent]);

    console.log(shortComments,videosComments)
    // Handle functions
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

        // API call
        dispatch(fetchLikeToggleComment(id))
            .unwrap()
            .then((response) => {
                // Update with actual server response if available
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
                // Revert optimistic update on error
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

    const handleDisLike = (id) => {
        // Fixed: Similar structure for dislike
        setCommentStatus((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                dislike: !prev[id]?.dislike
            }
        }));
    };

    const handleAddComment = () => {
        if (whichContent === "videos") {
            if (newComment.trim()) {
                dispatch(fetchAddVideoComment({ id: contentId, newComment: newComment.trim() }))
                    .unwrap()
                    .then(() => {
                        setNewComment('');
                        setShowCommentActions(false);
                        // Refresh comments to get updated list
                        // dispatch(fetchVideoComment(contentId));
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
                        // Refresh comments to get updated list
                        // dispatch(fetchShortComment(contentId));
                    })
                    .catch((error) => {
                        console.error('Failed to add comment:', error);
                    });
            }
        }
    };

    const handleAddCommentReplies = (commentId, replied) => {
        if (replied?.trim()) {
            // Optimistically update reply count
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
                    // Refresh replies for the specific comment
                    // dispatch(fetchCommentReplies(commentId));
                    // Clear reply input and close reply form
                    setCommentStatus((prev) => ({
                        ...prev,
                        [commentId]: {
                            ...prev[commentId],
                            repliesInput: ""
                        }
                    }));
                    setReplyingTo(null);
                    // Keep replies visible after adding a new one
                    setShowRepliesFor(commentId);
                    
                    // Also refresh main comments to get updated reply counts
                    // dispatch(fetchVideoComment(contentId));
                })
                .catch((error) => {
                    // Revert optimistic update on error
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
        // Toggle replies visibility and fetch if not already loaded
        if (showRepliesFor === commentId) {
            setShowRepliesFor(null); // Hide replies if already showing
        } else {
            setShowRepliesFor(commentId); // Show replies for this comment
            dispatch(fetchCommentReplies(commentId)); // Fetch replies from API
        }
    };

    const handleReplyToggle = (commentId) => {
        setReplyingTo(replyingTo === commentId ? null : commentId);
    };

    // Fixed: Handle replies input change properly
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
        // Get current like status and counts from local state or fallback to comment data
        const currentLikes = localCommentData[comment._id]?.totalLikes ?? comment.totalLikes ?? 0;
        // const currentReplies = localCommentData[comment._id]?.totalReplies ?? comment.totalReplies ?? comment.repliesCount ?? 0;
        const isLiked = localCommentData[comment._id]?.isLiked ?? commentStatus[comment._id]?.like ?? comment.isLiked ?? false;

        return (
            <div className={`flex gap-3 ${isReply ? 'ml-6 max-sm:ml-0 max-sm:mt-1 mt-3' : 'mb-4 max-sm:mb-2'}`}>
                <div className={`${isReply ? 'w-6 h-6' : 'w-10 h-10'} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0 text-xs`}>
                    {comment?.user_info?.avatar}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                            @{comment?.user_info?.username}
                        </span>
                        <span className="text-gray-400 text-xs">{comment?.createdAt}</span>
                    </div>

                    <div className="text-sm leading-relaxed mb-2">
                        {comment?.content}
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleLikeToggleComment(comment._id)}
                                className={` flex items-center rounded-full transition-colors ${isLiked ? 'text-blue-500' : 'text-gray-400'}`}
                            >
                                <ThumbsUp className="w-4 h-4" />
                                <span className='ml-1 text-black'>{currentLikes === 0 ? "" : currentLikes}</span>
                            </button>
                        </div>

                        <button
                            onClick={() => handleDisLike(comment._id)}
                            className={`p-2 rounded-full transition-colors ${commentStatus[comment?._id]?.dislike ? 'text-red-500' : 'text-gray-400'}`}
                        >
                            <ThumbsDown className="w-4 h-4" />
                        </button>

                        {!isReply && (
                            <button
                                onClick={() => handleReplyToggle(comment._id)}
                                className="text-xs font-medium bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full  transition-colors"
                            >
                                Reply
                            </button>
                        )}

                        <button className="p-2 rounded-full transition-colors hover:bg-gray-100 active:bg-gray-300 text-gray-800">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>

                    {replyingTo === comment?._id && (
                        <div className="mt-3 max-sm:mt-1.5 flex gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs">
                                <img src={comment?.user_info?.avatar} className='w-full h-full aspect-square rounded-full object-fill' />
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={commentStatus[comment._id]?.repliesInput || ''}
                                    onChange={(e) => handleRepliesInputChange(comment._id, e.target.value)}
                                    placeholder={`Reply to @${comment?.user_info?.username}...`}
                                    className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 outline-none resize-none text-sm p-2"
                                    rows="2"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleAddCommentReplies(comment._id, commentStatus[comment._id]?.repliesInput)}
                                        className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 transition-colors"
                                        disabled={!commentStatus[comment._id]?.repliesInput}
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
                                        className="px-4 py-2 bg-gray-100 text-xs font-medium rounded-full active:opacity-75 active:bg-gray-300 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Updated: Show replies button for comments */}
                    {!isReply && (
                        <button 
                            onClick={() => handleCommentReplies(comment._id)} 
                            className={`border-1 my-1 px-4 py-1 rounded-2xl border-gray-300 ${
                                showRepliesFor === comment._id 
                                    ? 'bg-blue-100 text-blue-600 border-blue-300' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            } active:bg-gray-200 transition-colors`}
                        >
                            {showRepliesFor === comment._id ? 'Hide Replies' : 'Show Replies'} 
                            <span className='ml-1'>{(comment?.totalReplies || comment?.totalComment) === 0 ? "" : (comment?.totalReplies || comment?.totalComment)}</span>
                        </button>
                    )}

                    {/* Updated: Show replies only for the specific comment that's expanded */}
                    {!isReply && showRepliesFor === comment._id && repliesOnComment?.data && (
                        <div className="mt-3">
                            {repliesOnComment.data.map(reply => (
                                <Comment key={reply?._id || reply?.id} comment={reply} isReply={true} />
                            ))}
                            {repliesOnComment.data.length === 0 && (
                                <div className="ml-6 text-gray-500 text-sm">No replies yet.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className={`${toggle.showComment ? "" : ""} ${!minimiseComment ? "h-[100px]" : `${whichContent === "shorts" ? "h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)]" : "h-fit"}`} p-3`}>
                <div className={` max-w-4xl mx-auto`}>
                    {/* Comments Header */}
                    <div>
                        <div className="flex items-center justify-between gap-6 mb-2 max-sm:mb-1">
                            <div className='flex space-x-2'>
                                <h3 className="text-xl font-medium">Comments</h3>
                                <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
                                    </svg>
                                    Sort by
                                </button>
                            </div>
                            
                            <div className={`${whichContent === "videos" ? "hidden" : ""}`}>
                                {/* close button */}
                                <button
                                    onClick={() => toggle.setShowComment(true)}
                                    className="p-3 rounded-full hover:bg-gray-100 active:bg-gray-200"
                                >
                                    <X />
                                </button>
                            </div>
                        </div>
                        
                    </div>

                    {/* <div className={`${whichContent === "shorts" ? "flex-col-reverse" : "" } flex`}></div> */}
                    {/* Add Comment */}
                    <div className={`flex gap-3 max-sm:gap-1.5 mb-3 max-sm:mb-1.5 ${whichContent === "shorts" ? "" : ""} bottom-0`}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            <img src={user?.avatar || <User />} className='w-full h-full aspect-square rounded-full object-fill' />
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onFocus={() => setShowCommentActions(true)}
                                placeholder="Add a comment..."
                                className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 outline-none resize-none text-sm pt-2"
                                rows="2"
                            />
                            {showCommentActions && (
                                <div className="flex gap-2 mt-3 max-sm:mt-1.5">
                                    <button
                                        onClick={handleAddComment}
                                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
                                        disabled={!newComment.trim()}
                                    >
                                        Comment
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCommentActions(false);
                                            setNewComment('');
                                        }}
                                        className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-full hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className={`${minimiseComment ? "" : "h-16 overflow-hidden"} h-[calc(100vh_-_200px)] overflow-x-hidden max-sm:pb-7 scrollBar overflow-y-scroll`}>
                        {(whichContent === "videos" ? videosComments : shortComments )?.map(comment => (
                            <Comment key={comment?._id} comment={comment} />
                        ))}
                    </div>
                </div>
                <div className={`${!minimiseComment ? "hidden" : ""} cursor-pointer ${whichContent === "shorts" ? "hidden" : ""}`} onClick={(e) => { e.stopPropagation(); setMinimiseComment(!minimiseComment);}}>
                    see Less
                </div>
            </div>
        </div>
    );
};

export default Comments;