import { useState } from "react";
import { Avatar, Button, Input } from "../ui/index";
import { useSelector } from "react-redux";
import {
    useReplies,
    useAddReplies,
    useUpdateComment,
} from "../../features/comment/useComment";
import { Heart, Pencil, Reply, SendHorizonal, Trash2, X } from "lucide-react";
import { useToggleCommentLike } from "../../features/like/useLike";

function CommentItem({
    comment,
    // onLike,
    onDelete,
    onDeleteReply,
    contentId,
    onModel,
    depth = 0,
}) {
    const { user } = useSelector((state) => state.auth);

    const [showReplyBox, setShowReplyBox] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState("");

    const [isEditingComment, setIsEditingComment] = useState(false);
    const [editedCommentText, setEditedCommentText] = useState(comment.content || "");

    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editedReplyText, setEditedReplyText] = useState("");

    const toggleCommentLikeMutation = useToggleCommentLike(contentId, "Video");

    const {
        data: replies,
        isLoading: repliesLoading,
    } = useReplies(showReplies ? comment._id : null);

    const onLike = (commentId) => {
        // console.log(commentId)
        toggleCommentLikeMutation.mutate(commentId);
    };

    const repliesPage = replies?.pages?.flatMap((page) => page?.data || []) || [];

    const addReplyMutation = useAddReplies(contentId, onModel);
    const updateCommentMutation = useUpdateComment(comment._id, contentId, onModel);

    const hasReplies = (comment.replyCount || 0) > 0;

    const handleReplySubmit = () => {
        const value = replyText.trim();
        if (!value) return;

        addReplyMutation.mutate(
            {
                commentId: comment._id,
                content: value,
            },
            {
                onSuccess: () => {
                    setReplyText("");
                    setShowReplyBox(false);
                    setShowReplies(true);
                },
            }
        );
    };

    const handleEditComment = () => {
        const value = editedCommentText.trim();
        if (!value) return;

        updateCommentMutation.mutate(value, {
            onSuccess: () => {
                setIsEditingComment(false);
            },
        });
    };

    const handleEditReply = (replyId) => {
        const value = editedReplyText.trim();
        if (!value) return;

        updateCommentMutation.mutate(
            { commentId: replyId, content: value },
            {
                onSuccess: () => {
                    setEditingReplyId(null);
                    setEditedReplyText("");
                },
            }
        );
    };

    return (
        <div
            className="space-y-3 rounded-(--radius-lg) border border-(--border) bg-(--surface) p-3"
            style={{ marginLeft: depth > 0 ? `${Math.min(depth * 20, 40)}px` : 0 }}
        >
            <div className="flex gap-3">
                <div className="shrink-0">
                    <Avatar
                        src={comment.owner?.avatar}
                        name={comment.owner?.username || "User"}
                        size="sm"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-(--text)">
                                {comment.owner?.username === user.username
                                    ? "You"
                                    : comment.owner?.username || "Unknown user"}
                            </p>

                            {isEditingComment ? (
                                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                                    <Input
                                        value={editedCommentText}
                                        onChange={(e) => setEditedCommentText(e.target.value)}
                                        className="bg-(--surface2) border-(--border)"
                                    />
                                    <div className="flex gap-2">
                                        <Button onClick={handleEditComment}><SendHorizonal size={16} /></Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setIsEditingComment(false);
                                                setEditedCommentText(comment.content || "");
                                            }}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-1 wrap-break-words text-sm text-(--muted)">
                                    {comment.content}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button
                            variant="ghost"
                            className={
                                comment.isLiked
                                    ? "bg-(--primary) text-white flex items-center justify-center gap-2"
                                    : "text-(--muted) hover:bg-(--surface2) flex items-center justify-center gap-2"
                            }
                            onClick={() => onLike(comment._id)}
                        >
                            <Heart
                                size={16}
                                className={comment.isLiked ? "icon-liked" : "icon-unliked"}
                            /> {comment.likeCount || 0}
                        </Button>

                        <Button
                            variant="ghost"
                            className="text-(--muted) hover:bg-(--surface2)"
                            onClick={() => setShowReplyBox((prev) => !prev)}
                        >
                            <Reply size={16} />
                        </Button>

                        <Button
                            variant="ghost"
                            className="text-(--muted) hover:bg-(--surface2)"
                            onClick={() => setIsEditingComment((prev) => !prev)}
                        >
                            <Pencil size={16} />
                        </Button>

                        <Button
                            variant="ghost"
                            className="shrink-0 text-(--danger) hover:bg-(--surface2)"
                            onClick={() => onDelete(comment._id)}
                        >
                            <Trash2 size={16} />
                        </Button>

                        {hasReplies && (
                            <Button
                                variant="ghost"
                                className="text-(--muted) hover:bg-(--surface2)"
                                onClick={() => setShowReplies((prev) => !prev)}
                            >
                                {showReplies
                                    ? "Hide replies"
                                    : `Show ${comment.replyCount} repl${comment.replyCount === 1 ? "y" : "ies"}`}
                            </Button>
                        )}
                    </div>

                    {showReplyBox && (
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                            <Input
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="bg-(--surface2) border-(--border)"
                            />
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleReplySubmit}
                                    disabled={addReplyMutation.isPending}
                                >
                                    {addReplyMutation.isPending ? "Replying..." : <Reply size={16} />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowReplyBox(false);
                                        setReplyText("");
                                    }}
                                >
                                    <X size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showReplies && (
                <div className="space-y-3">
                    {repliesLoading ? (
                        <p className="ml-4 text-sm text-(--muted)">Loading replies...</p>
                    ) : repliesPage.length === 0 ? (
                        <p className="ml-4 text-sm text-(--muted)">No replies yet.</p>
                    ) : (
                        repliesPage.map((reply) => (
                            <div
                                key={reply._id}
                                className="ml-4 rounded-(--radius) border border-(--border) bg-(--surface2) p-3"
                            >
                                <div className="flex gap-3">
                                    <Avatar
                                        src={reply.owner?.avatar}
                                        name={reply.owner?.username || "User"}
                                        size="sm"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-(--text)">
                                                    {reply.owner?.username === user.username
                                                        ? "You"
                                                        : reply.owner?.username || "Unknown user"}
                                                </p>

                                                {editingReplyId === reply._id ? (
                                                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                                                        <Input
                                                            value={editedReplyText}
                                                            onChange={(e) => setEditedReplyText(e.target.value)}
                                                            className="bg-(--surface) border-(--border)"
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button onClick={() => handleEditReply(reply._id)}>
                                                                <SendHorizonal size={16} />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setEditingReplyId(null);
                                                                    setEditedReplyText("");
                                                                }}
                                                            >
                                                                <X size={16} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="mt-1 wrap-break-words text-sm text-(--muted)">
                                                        {reply.content}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                className={
                                                    reply.isLiked
                                                        ? "bg-(--primary) text-white flex items-center justify-center gap-2"
                                                        : "text-(--muted) hover:bg-(--surface) flex items-center justify-center gap-2"
                                                }
                                                onClick={() => onLike(reply._id)}
                                            >
                                                <Heart
                                                    size={16}
                                                    className={reply.isLiked ? "icon-liked" : "icon-unliked"}
                                                /> {reply.likeCount || 0}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                className="text-(--muted) hover:bg-(--surface)"
                                                onClick={() => {
                                                    setEditingReplyId(reply._id);
                                                    setEditedReplyText(reply.content || "");
                                                }}
                                            >
                                                <Pencil size={16} />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                className="shrink-0 text-(--danger) hover:bg-(--surface)"
                                                onClick={() => onDeleteReply(comment._id, reply._id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default CommentItem;
