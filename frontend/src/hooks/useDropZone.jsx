import { useState, useCallback } from "react";

export const useDropzone = ({
    onDrop,
    accept = ["image/*", "video/*"],
    multiple = false,
}) => {
    const [isDragging, setIsDragging] = useState(false);

    // 📥 handle drop
    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);

            const validFiles = files.filter((file) => {
                return accept.some((type) => {
                    if (type.endsWith("/*")) {
                        return file.type.startsWith(type.replace("/*", ""));
                    }
                    return file.type === type;
                });
            });

            if (!validFiles.length) return;

            if (multiple) {
                onDrop(validFiles);
            } else {
                onDrop(validFiles[0]);
            }
        },
        [onDrop, multiple, accept] // ✅ FIXED
    );

    // 🖱 drag events
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // ⌨️ keyboard accessibility (Enter/Space to open file picker)
    const handleKeyDown = (e, inputRef) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
        }
    };

    return {
        isDragging,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleKeyDown,
    };
};