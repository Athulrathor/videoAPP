// import { useVideos } from "../features/video/useVideos";
import VideoCard from "../components/video/VideoCard";
import { Card, SkeletonCard } from "../components/ui/index";
import { useFeed } from "../features/video/useFeed";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

function Home() {
  // const { data, isLoading, isError } = useVideos();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useFeed(query);

  const videos = data?.pages.flatMap((p) => p?.data?.videos) || [];
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);


  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3"
        aria-busy="true"
        aria-live="polite"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // ❌ Error State
  if (isError) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Card className="p-6 text-center max-w-sm">
          <p className="text-sm text-(--muted)">
            ❌ Failed to load videos
          </p>
        </Card>
      </div>
    );
  }

  // 📭 Empty State
  if (!videos.length) {
    return (
      <div
        className="flex justify-center items-center h-[60vh]"
        role="status"
      >
        <Card className="p-6 text-center max-w-sm">
          <p className="text-lg font-medium mb-2">
            {query ? "No videos found" : "No videos yet"}
          </p>
          <p className="text-sm text-(--muted)">
            {query ? `No results for "${query}"` : "Start by uploading your first video"}
          </p>
        </Card>
      </div>
    );
  }

  // ✅ Normal State
  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3"
        aria-live="polite"
      >
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {/* 🔥 Infinite scroll trigger */}
      <div
        ref={loadMoreRef}
        className="h-16 flex items-center justify-center"
      >
        {isFetchingNextPage && (
          <p className="text-sm text-(--muted)">
            Loading more...
          </p>
        )}

        {!hasNextPage && (
          <p className="text-xs text-(--muted)">
            🎉 You’re all caught up
          </p>
        )}
      </div>
    </>
  );
}

export default Home;
