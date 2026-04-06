// useKeyboardShortcuts.js
import { useEffect } from "react";

export const useKeyboardShortcuts = ({
    onPlayPause,
    onForward,
    onBackward,
    onMute,
    onFullscreen,
}) => {
    useEffect(() => {
        const handleKey = (e) => {
            if (e.target.tagName === "INPUT") return;

            switch (e.key.toLowerCase()) {
                case " ":
                    e.preventDefault();
                    onPlayPause?.();
                    break;
                case "arrowright":
                    onForward?.();
                    break;
                case "arrowleft":
                    onBackward?.();
                    break;
                case "m":
                    onMute?.();
                    break;
                case "f":
                    onFullscreen?.();
                    break;
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);
};