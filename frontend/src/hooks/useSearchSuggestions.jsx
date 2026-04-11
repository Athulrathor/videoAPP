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
            controllerRef.current?.abort();
            setSuggestions([]);
            setLoading(false);
            setError("");
            setIsOpen(false);
            return;
        }

        requestIdRef.current += 1;
        const currentRequestId = requestIdRef.current;

        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setError("");

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
        suggestions,
        loading,
        error,
        isOpen,
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