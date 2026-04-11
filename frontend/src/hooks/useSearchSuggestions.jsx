import { useEffect, useRef, useState } from "react";
import { useDebouncedValues } from "../hooks/useDebouncingValues";

export function useSearchSuggestions({
    query,
    fetchSuggestions,
    minLength = 1,
    delay = 300,
}) {
    const debouncedQuery = useDebouncedValues(query, delay);

    const controllerRef = useRef(null);
    const requestIdRef = useRef(0);

    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const q = debouncedQuery.trim();

        if (q.length < minLength) {
            requestIdRef.current += 1;
            controllerRef.current?.abort();
            return;
        }

        requestIdRef.current += 1;
        const currentRequestId = requestIdRef.current;

        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        queueMicrotask(() => {
            if (currentRequestId !== requestIdRef.current || controller.signal.aborted) {
                return;
            }
            setLoading(true);
            setError("");
        });

        fetchSuggestions(q, controller.signal)
            .then((data) => {
                if (currentRequestId !== requestIdRef.current) return;
                setSuggestions(Array.isArray(data) ? data : []);
                setIsOpen(true);
            })
            .catch((err) => {
                if (err?.name === "AbortError") return;
                if (currentRequestId !== requestIdRef.current) return;
                setError(err?.message || "Failed to fetch suggestions");
                setSuggestions([]);
                setIsOpen(true);
            })
            .finally(() => {
                if (currentRequestId === requestIdRef.current) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [debouncedQuery, fetchSuggestions, minLength]);

    return {
        suggestions: debouncedQuery.trim().length >= minLength ? suggestions : [],
        loading: debouncedQuery.trim().length >= minLength && loading,
        error: debouncedQuery.trim().length >= minLength ? error : "",
        isOpen: debouncedQuery.trim().length >= minLength && isOpen,
        setIsOpen,
        clearSuggestions: () => {
            controllerRef.current?.abort();
            setSuggestions([]);
            setError("");
            setLoading(false);
            setIsOpen(false);
        },
    };
}
