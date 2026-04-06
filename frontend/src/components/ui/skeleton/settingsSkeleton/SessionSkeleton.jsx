
const SessionSkeleton = () => {
    return (
        <div className="animate-pulse border border-(--border) p-3 rounded-lg space-y-2">
            <div className="h-4 w-40 bg-(--border) rounded" />
            <div className="h-3 w-60 bg-(--border) rounded" />
            <div className="h-3 w-32 bg-(--border) rounded" />
        </div>
    );
}

export default SessionSkeleton;