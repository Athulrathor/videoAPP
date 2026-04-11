import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";

function VideoCarousel({
    videos = [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    renderVideoCard,
}) {
    const containerRef = useRef(null);
    const slideRefs = useRef([]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const safeVideos = useMemo(() => videos || [], [videos]);

    const scrollToIndex = (targetIndex) => {
        const bounded = Math.max(0, Math.min(targetIndex, safeVideos.length - 1));
        const node = slideRefs.current[bounded];
        if (!node) return;

        setActiveIndex(bounded);

        node.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
        });
    };

    const goNext = () => scrollToIndex(activeIndex + 1);
    const goPrev = () => scrollToIndex(activeIndex - 1);

    // fullscreen
    const toggleFullscreen = async () => {
        const node = containerRef.current;
        if (!node) return;

        if (!document.fullscreenElement) {
            await node.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    // active slide detection
    useEffect(() => {
        const slides = slideRefs.current.filter(Boolean);
        if (!slides.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (!visible) return;

                const index = Number(visible.target.dataset.index);
                if (!Number.isNaN(index)) {
                    setActiveIndex(index);
                }
            },
            {
                root: containerRef.current,
                threshold: [0.6, 0.8, 1],
            }
        );

        slides.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [safeVideos.length]);

    // infinite scroll
    useEffect(() => {
        if (
            hasNextPage &&
            activeIndex >= safeVideos.length - 2 &&
            !isFetchingNextPage
        ) {
            fetchNextPage?.();
        }
    }, [activeIndex, safeVideos.length]);

    if (!safeVideos.length) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] text-(--muted)">
                No videos
            </div>
        );
    }

    return (
        <section className="w-full flex flex-col gap-3">

            {/* 🔘 Controls */}
            <div className="flex items-center justify-center gap-2 flex-wrap">

                <button
                    onClick={goPrev}
                    disabled={activeIndex === 0}
                    className="h-10 w-10 flex items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--text) disabled:opacity-40"
                >
                    <ChevronLeft size={18} />
                </button>

                <span className="text-sm text-(--muted) min-w-15 text-center">
                    {activeIndex + 1} / {safeVideos.length}
                </span>

                <button
                    onClick={goNext}
                    disabled={activeIndex === safeVideos.length - 1}
                    className="h-10 w-10 flex items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--text) disabled:opacity-40"
                >
                    <ChevronRight size={18} />
                </button>

                <button
                    onClick={toggleFullscreen}
                    className="h-10 w-10 flex items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--text)"
                >
                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
            </div>

            {/* 🎬 Carousel */}
            <div
                ref={containerRef}
                className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth px-1 pb-3"
            >
                {safeVideos.map((video, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <div
                            key={video._id || index}
                            ref={(node) => (slideRefs.current[index] = node)}
                            data-index={index}
                            className="shrink-0 w-full snap-center flex justify-center"
                        >
                            {/* 🎥 16:9 frame */}
                            <div
                                className={`relative w-full max-w-275 aspect-video overflow-hidden rounded-xl border border-(--border) bg-black transition ${isActive ? "scale-100 shadow-xl" : "scale-[0.96] opacity-80"
                                    }`}
                            >
                                {renderVideoCard ? (
                                    renderVideoCard(video, { isActive })
                                ) : (
                                    <video
                                        src={video.videoFile || video.url}
                                        poster={video.thumbnail}
                                        controls
                                        playsInline
                                        autoPlay={isActive}
                                        muted={!isActive}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* 📦 Status */}
                <div className="min-w-full flex justify-center items-center text-sm text-(--muted)">
                    {isFetchingNextPage
                        ? "Loading more..."
                        : hasNextPage
                            ? "Scroll for more"
                            : "You're all caught up"}
                </div>
            </div>
        </section>
    );
}

export default VideoCarousel;