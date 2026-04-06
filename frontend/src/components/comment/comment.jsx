function Comment({ comment }) {
    return (
        <div className="ml-4 mt-2">
            <p>{comment.content}</p>

            {/* Replies */}
            {comment.replies?.map((reply) => (
                <Comment key={reply._id} comment={reply} />
            ))}
        </div>
    );
}

export default Comment;