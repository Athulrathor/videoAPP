import { useVideoPlayer } from "../../hooks/useVideoPlayer";
import { useWatchHistoryTracker } from "../../hooks/useWatchHistoryTracker";
import VideoControls from "./VideoControls";

function VideoPlayer({ src,thumbnail,videoId }) {
    const player = useVideoPlayer();

    const {
        videoRef,
        state,
        togglePlay,
        seek,
        toggleMute,
        setSpeed,
        toggleFullscreen,
        togglePiP,
        handleMouseMove,
        showControlsTemporarily,
    } = player;

    const controls = {
        togglePlay,
        seek,
        toggleMute,
        setPlaybackRate: setSpeed,
        toggleFullscreen,
        togglePiP,
    };

    useWatchHistoryTracker({
        contentId: videoId,
        onModel: "Video",
        progressSeconds: state.currentTime,
        thresholdSeconds: 10,
        enabled: !!videoId,
    });

    return (
        <div
            className="video-player aspect-video group"
            onMouseMove={handleMouseMove}
            onTouchStart={showControlsTemporarily}
        >
            <video
                ref={videoRef}
                src={src} // ✅ IMPORTANT
                className="w-full"
                onClick={togglePlay}
                poster={thumbnail}
            />

            {state.showControls && (
                <VideoControls
                    state={state}
                    controls={controls}
                />
            )}
        </div>
    );
}

export default VideoPlayer;
