import { useEffect } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useVideoPlayer } from "../../hooks/useVideoPlayer";
import { useWatchHistoryTracker } from "../../hooks/useWatchHistoryTracker";

function ShortController({ src, className = "",shortId }) {
  const {
    videoRef,
    state,
    togglePlay,
    seek,
    toggleMute,
    handleMouseMove,
    showControlsTemporarily,
  } = useVideoPlayer();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const playAttempt = video.play();
    if (playAttempt?.catch) {
      playAttempt.catch(() => {});
    }
  }, [videoRef]);

  const progress =
    state.duration > 0 ? Math.min((state.currentTime / state.duration) * 100, 100) : 0;

  useWatchHistoryTracker({
    contentId: shortId,
    onModel: "Short",
    progressSeconds: state.currentTime,
    thresholdSeconds: 10,
    enabled: !!shortId,
  });


  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onTouchStart={showControlsTemporarily}
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-cover"
        onClick={togglePlay}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 bg-linear-to-b from-black/55 via-black/15 to-transparent px-3 pb-8 pt-3 sm:px-4 sm:pt-4">
        <div className="pointer-events-auto flex items-center gap-2 text-white">
          <button
            type="button"
            className="short-control-button"
            onClick={togglePlay}
            aria-label={state.playing ? "Pause short" : "Play short"}
          >
            {state.playing ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            type="button"
            className="short-control-button"
            onClick={toggleMute}
            aria-label={state.muted ? "Unmute short" : "Mute short"}
          >
            {state.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-1 sm:px-4 sm:pb-2">
        <div className="pointer-events-auto">
          <div className="short-progress-shell">
            <div className="short-progress-track" />
            <div
              className="short-progress-fill"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={state.duration || 0}
              value={state.currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="short-progress-range"
              aria-label="Video progress"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortController;
