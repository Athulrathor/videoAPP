import { useEffect, useRef } from "react";
import { addToWatchHistory } from "../apis/user.api";

export function useWatchHistoryTracker({
    contentId,
    onModel,
    progressSeconds = 0,
    thresholdSeconds = 10,
    enabled = true,
}) {
    const trackedRef = useRef(false);
    const lastIdRef = useRef(null);

    useEffect(() => {
        if (lastIdRef.current !== contentId) {
            trackedRef.current = false;
            lastIdRef.current = contentId;
        }
    }, [contentId]);

    useEffect(() => {
        if (!enabled) return;
        if (!contentId) return;
        if (!["Video", "Short"].includes(onModel)) return;
        if (trackedRef.current) return;
        if (progressSeconds < thresholdSeconds) return;

        trackedRef.current = true;

        addToWatchHistory({ contentId, onModel }).catch(() => {
            trackedRef.current = false;
        });
    }, [contentId, onModel, progressSeconds, thresholdSeconds, enabled]);
}