import { useState } from "react";
import { Button, Input, Card } from "../ui/index";
import CommentItem from "./CommentItem";
import {
    useComments,
    useAddComment,
    useDeleteComment,
} from "../../features/comment/useComment";
import { SendHorizontal } from "lucide-react";

function CommentsSection({
    contentId,
    onModel = "Video",
    contentCommentCount,
}) {
    const [newComment, setNewComment] = useState("");

    const {
        data: comments,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useComments(contentId, onModel);

    const addCommentMutation = useAddComment(contentId, onModel);
    const deleteCommentMutation = useDeleteComment(contentId, onModel);

    const commentsPage = comments?.pages?.flatMap((page) => page?.data || []) || [];

    const handleDeleteComment = (commentId) => {
        deleteCommentMutation.mutate({
            commentId,
            isReply: false,
        });
    };

    const handleAddComment = () => {
        const value = newComment.trim();
        if (!value) return;

        addCommentMutation.mutate(value, {
            onSuccess: () => setNewComment(""),
        });
    };

    const handleDeleteReply = (parentCommentId, replyId) => {
        deleteCommentMutation.mutate({
            commentId: replyId,
            parentCommentId,
            isReply: true,
        });
    };

    if (isLoading) {
        return (
            <Card className="space-y-4 border border-(--border) bg-(--surface) p-4 sm:rounded-(--radius-xl)">
                <p className="text-sm text-(--muted)">Loading comments...</p>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="space-y-4 border border-(--border) bg-(--surface) p-4 sm:rounded-(--radius-xl)">
                <p className="text-sm text-red-500">Failed to load comments.</p>
            </Card>
        );
    }

    return (
        <Card className="space-y-4 border border-(--border) bg-(--surface) p-4 sm:rounded-(--radius-xl)">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-(--text)">
                    Comments ({ contentCommentCount || 0})
                </h2>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddComment();
                    }}
                    placeholder="Add a comment..."
                    className="bg-(--surface2) border-(--border)"
                />
                <Button
                    onClick={handleAddComment}
                    disabled={addCommentMutation.isPending}
                >
                    {addCommentMutation.isPending ? "Posting..." : <SendHorizontal size={16} />}
                </Button>
            </div>

            {commentsPage.length === 0 ? (
                <div className="rounded-(--radius) border border-dashed border-(--border) bg-(--surface2) p-6 text-center text-sm text-(--muted)">
                    No comments yet. Start the conversation.
                </div>
            ) : (
                <div className="space-y-4">
                    {commentsPage.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            contentId={contentId}
                            onModel={onModel}
                            // onLike={handleToggleLike}
                            onDelete={handleDeleteComment}
                            onDeleteReply={handleDeleteReply}
                        />
                    ))}

                    {hasNextPage && (
                        <div className="flex justify-center pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? "Loading..." : "Load more"}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

export default CommentsSection;