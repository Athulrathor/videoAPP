import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Eye, Heart, MessageCircle, Share2, X } from "lucide-react";
import { Avatar, Button, Card, IconButton } from "../components/ui";
import ShortController from "../components/short/ShortController";
import CommentsSection from "../components/watch/CommentSection";
import { toggleShortLike } from "../apis/like.api";
import { useFeed } from "../features/short/useFeed";
import { useSubscribe } from "../features/subscribe/useSubscribe";

function Shorts() {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFeed();
  const containerRef = useRef(null);
  const [showTopState, setShowTopState] = useState(true);
  const [showBottomState, setShowBottomState] = useState(false);
  const [shortState, setShortState] = useState({});
  const [activeCommentShort, setActiveCommentShort] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const { user } = useSelector((state) => state.auth);
  const { mutate: toggleSubscribe, isPending: subscribePending } = useSubscribe();

  const shorts =
    data?.pages.flatMap((p) =>
      (p.data.shorts || []).map((short) => ({
        ...short,
        ...(shortState[short._id] || {}),
      }))
    ) || [];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const nearTop = scrollTop < 24;
      const nearBottom = scrollHeight - (scrollTop + clientHeight) < 120;

      setShowTopState(nearTop);
      setShowBottomState(nearBottom);

      if (nearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => container.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, shorts.length]);

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Card className="p-6 text-center max-w-sm">
          <p className="text-sm text-(--muted)">Failed to load shorts</p>
        </Card>
      </div>
    );
  }

  if (!shorts.length) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Card className="p-6 text-center max-w-sm">
          <p className="text-lg font-medium mb-2">No shorts yet</p>
          <p className="text-sm text-(--muted)">Upload a short to get started.</p>
        </Card>
      </div>
    );
  }

  const handleSubscribe = (ownerId) => {
    if (!ownerId || subscribePending) return;
    toggleSubscribe(ownerId);
  };

  const handleLike = async (short) => {
    if (!short?._id) return;

    const nextLiked = !short.isLiked;
    const nextCount = Math.max(0, (short.likeCount || 0) + (nextLiked ? 1 : -1));

    setShortState((current) => ({
      ...current,
      [short._id]: {
        ...current[short._id],
        isLiked: nextLiked,
        likeCount: nextCount,
      },
    }));

    try {
      const response = await toggleShortLike(short._id);
      setShortState((current) => ({
        ...current,
        [short._id]: {
          ...current[short._id],
          isLiked: response?.isLiked ?? nextLiked,
          likeCount: response?.count ?? nextCount,
        },
      }));
    } catch {
      setShortState((current) => ({
        ...current,
        [short._id]: {
          ...current[short._id],
          isLiked: short.isLiked,
          likeCount: short.likeCount || 0,
        },
      }));
    }
  };

  const handleShare = async (short) => {
    if (!short?.shortUrl) return;

    try {
      await navigator.clipboard.writeText(short.shortUrl);
    } catch {
      // ignore clipboard failures for now
    }
  };

  const toggleDescription = (shortId) => {
    setExpandedDescriptions((current) => ({
      ...current,
      [shortId]: !current[shortId],
    }));
  };

  return (
    <section className="relative h-full overflow-hidden bg-(--bg)">
      {/* {showTopState && (
        <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2">
          <div className="shorts-status-pill shorts-status-pill-top">
            Start of shorts
          </div>
        </div>
      )} */}

      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar overscroll-contain"
      >
        {shorts.map((short) => (
          <div
            key={short._id}
            className="flex h-full min-h-full items-center justify-center snap-start"
          >
            <div className="shorts-video-shell relative">
              <ShortController src={short.shortUrl} shortId={short._id} />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 pb-8 pr-20 sm:p-5 sm:pb-10 sm:pr-24">
                <div className="pointer-events-auto flex items-end justify-between gap-3">
                  <div className="min-w-0 flex-1 text-white">
                    <div className="mb-2 flex items-center gap-2">
                      <Avatar
                        src={short.owner?.avatar}
                        name={short.owner?.username || "User"}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          @{short.owner?.username || "unknown"}
                        </p>
                        <p className="text-xs text-white/75">
                          {short.owner?.subscriberCount || 0} subscribers
                        </p>
                      </div>
                      {/* <button onClick={() => toggleSubscribe(short?.owner?._id)} disabled={!short?.owner?._id || subscribePending} className="ml-auto sm:ml-3 rounded-full bg-black px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-800 shrink-0">
                        {short?.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
                      </button> */}

                      <Button
                        onClick={() => toggleSubscribe(short?.owner?._id)}
                        disabled={!short?.owner?._id || subscribePending}
                        variant={short?.owner?.isSubscribed ? "secondary" : "primary"}
                        className="inline-flex items-center gap-2"
                      >
                        {short?.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
                      </Button>
                    </div>

                    <h3 className="line-clamp-1 text-sm font-semibold">
                      {short.title}
                    </h3>
                    {short.description && (
                      <button
                        type="button"
                        className="mt-1 block text-left text-xs text-white/80"
                        onClick={() => toggleDescription(short._id)}
                      >
                        <span className={expandedDescriptions[short._id] ? "" : "line-clamp-2"}>
                          {short.description}
                        </span>
                        <span className="ml-1 text-white/95">
                          {expandedDescriptions[short._id] ? "Show less" : "More"}
                        </span>
                      </button>
                    )}
                  </div>

                  {user?._id !== short.owner?._id && (
                    <Button
                      variant={short.owner?.isSubscribed ? "secondary" : "primary"}
                      className={
                        short.owner?.isSubscribed
                          ? "shorts-subscribe-button shrink-0"
                          : "shorts-subscribe-button is-primary shrink-0"
                      }
                      onClick={() => handleSubscribe(short.owner?._id)}
                      disabled={subscribePending}
                    >
                      {short.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-6 right-3 z-10 sm:bottom-8">
                <div className="pointer-events-auto flex flex-col gap-2 sm:gap-3">
                  <button type="button" className="shorts-action-button">
                    <Eye size={22} />
                    <span>{short.views || 0}</span>
                  </button>

                  <button
                    type="button"
                    className={`shorts-action-button ${short.isLiked ? "is-active" : ""}`}
                    onClick={() => handleLike(short)}
                  >
                    <Heart
                      size={22}
                      fill={short.isLiked ? "currentColor" : "transparent"}
                    />
                    <span>{short.likeCount || 0}</span>
                  </button>

                  <button
                    type="button"
                    className="shorts-action-button"
                    onClick={() => setActiveCommentShort(short)}
                  >
                    <MessageCircle size={22} />
                    <span>{short.commentsCount || 0}</span>
                  </button>

                  <button
                    type="button"
                    className="shorts-action-button"
                    onClick={() => handleShare(short)}
                  >
                    <Share2 size={22} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pointer-events-none flex justify-center px-4 pb-6">
          <div className={`shorts-status-pill ${showBottomState ? "is-visible" : ""}`}>
            {isFetchingNextPage ? (
              <>
                <span className="shorts-status-spinner" />
                Loading next short...
              </>
            ) : hasNextPage ? (
              "Scroll down for more"
            ) : (
              "You are all caught up"
            )}
          </div>
        </div>
      </div>

      {activeCommentShort?._id && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 sm:items-stretch sm:justify-end">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close comments"
            onClick={() => setActiveCommentShort(null)}
          />

          <div className="relative z-10 h-[78vh] w-full overflow-y-auto rounded-none bg-[var(--bg)] text-[var(--text)] p-4 shadow-2xl sm:h-full sm:w-[28rem] sm:max-w-[28rem] sm:rounded-none sm:border-l sm:border-(--border)">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Comments</h2>
              <IconButton
                icon={<X size={18} />}
                label="Close comments"
                variant="soft"
                onClick={() => setActiveCommentShort(null)}
              />
            </div>

            <CommentsSection
              contentId={activeCommentShort._id}
              onModel="Short"
              contentCommentCount={activeCommentShort.commentsCount}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default Shorts;
