import { Button } from "../ui/index";

function VideoControls({ state, controls }) {
    return (
        <div className="absolute bottom-0 w-full p-3 bg-linear-to-t from-black/70 to-transparent text-white">

            {/* Progress */}
            <input
                type="range"
                min={0}
                max={state.duration || 0}
                value={state.currentTime}
                onChange={(e) => controls.seek(Number(e.target.value))}
                className="w-full mb-2"
            />

            <div className="flex items-center justify-between gap-2">

                <div className="flex gap-2">
                    <Button onClick={controls.togglePlay}>
                        {state.playing ? "Pause" : "Play"}
                    </Button>

                    <Button onClick={controls.toggleMute}>
                        {state.muted ? "Unmute" : "Mute"}
                    </Button>

                    <Button onClick={controls.togglePiP}>
                        PiP
                    </Button>
                </div>

                <div className="flex gap-2">
                    <select
                        value={state.playbackRate}
                        onChange={(e) =>
                            controls.setPlaybackRate(Number(e.target.value))
                        }
                        className="bg-(--surface2) text-(--text) rounded px-2"
                    >
                        {[0.5, 1, 1.5, 2].map((r) => (
                            <option key={r} value={r}>
                                {r}x
                            </option>
                        ))}
                    </select>

                    <Button onClick={controls.toggleFullscreen}>
                        Fullscreen
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default VideoControls;