import { useRef, useState, useEffect } from "react";

export const useVideoPlayer = () => {
    const videoRef = useRef(null);

    const [state, setState] = useState({
        playing: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        muted: false,
        playbackRate: 1,
        isFullscreen: false,
        showControls: true,
    });

    const hideTimer = useRef(null);

    const showControlsTemporarily = () => {
        setState((s) => ({ ...s, showControls: true }));

        clearTimeout(hideTimer.current);

        hideTimer.current = setTimeout(() => {
            setState((s) => ({ ...s, showControls: false }));
        }, 3000);
    };

    // ▶️ Play / Pause
    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setState((s) => ({ ...s, playing: true }));
        } else {
            video.pause();
            setState((s) => ({ ...s, playing: false }));
        }
    };

    // ⏩ Seek
    const seek = (time) => {
        videoRef.current.currentTime = time;
    };

    // 🔊 Volume
    const setVolume = (v) => {
        videoRef.current.volume = v;
        setState((s) => ({ ...s, volume: v }));
    };

    const toggleMute = () => {
        const video = videoRef.current;
        video.muted = !video.muted;
        setState((s) => ({ ...s, muted: video.muted }));
    };

    // ⚡ Speed
    const setSpeed = (rate) => {
        videoRef.current.playbackRate = rate;
        setState((s) => ({ ...s, playbackRate: rate }));
    };

    // 🖥 Fullscreen
    const toggleFullscreen = () => {
        const el = videoRef.current.parentElement;

        if (!document.fullscreenElement) {
            el.requestFullscreen();
            setState((s) => ({ ...s, isFullscreen: true }));
        } else {
            document.exitFullscreen();
            setState((s) => ({ ...s, isFullscreen: false }));
        }
    };

    // 🔥 PiP
    const togglePiP = async () => {
        const video = videoRef.current;
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            await video.requestPictureInPicture();
        }
    };

    // 🎯 Auto-hide controls
    const handleMouseMove = () => {
        setState((s) => ({ ...s, showControls: true }));

        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
            setState((s) => ({ ...s, showControls: false }));
        }, 3000);
    };

    // 🎧 Events
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onTime = () =>
            setState((s) => ({ ...s, currentTime: video.currentTime }));

        const onLoaded = () =>
            setState((s) => ({ ...s, duration: video.duration }));

        video.addEventListener("timeupdate", onTime);
        video.addEventListener("loadedmetadata", onLoaded);

        return () => {
            video.removeEventListener("timeupdate", onTime);
            video.removeEventListener("loadedmetadata", onLoaded);
        };
    }, []);

    return {
        videoRef,
        state,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        setSpeed,
        toggleFullscreen,
        togglePiP,
        handleMouseMove,
        showControlsTemporarily
    };
};