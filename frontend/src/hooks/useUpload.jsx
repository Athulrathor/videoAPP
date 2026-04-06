import { useState, useRef } from "react";
import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

export const useUpload = () => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const controller = useRef(null);

    // 🔍 detect resource type
    const getResourceType = (file) => {
        if (file.type.startsWith("video")) return "video";
        if (file.type.startsWith("image")) return "image";
        return "auto";
    };

    // 💾 persist progress
    const saveProgress = (data) => {
        localStorage.setItem("upload-progress", JSON.stringify(data));
    };

    const clearProgress = () => {
        localStorage.removeItem("upload-progress");
    };

    // 🚀 MAIN UPLOAD
    const uploadFile = async (file) => {
        setIsUploading(true);
        setError(null);

        const resourceType = getResourceType(file);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        controller.current = new AbortController();

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
                formData,
                {
                    signal: controller.current.signal,

                    // 🔥 chunk upload
                    headers: {
                        "X-Unique-Upload-Id": `${Date.now()}`,
                    },
                    params: {
                        chunk_size: 3000000, // 6MB chunks
                    },

                    onUploadProgress: (e) => {
                        if (!e.total) return;

                        const percent = Math.round((e.loaded * 100) / e.total);
                        setProgress(percent);

                        saveProgress({
                            fileName: file.name,
                            progress: percent,
                        });
                    },
                }
            );

            clearProgress();

            return {
                url: res.data.secure_url,
                public_id: res.data.public_id,
                type: resourceType,
            };
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log("Upload cancelled");
            } else {
                setError(err);
            }
            throw err;
        } finally {
            setIsUploading(false);
        }
    };

    // ❌ cancel upload
    const cancelUpload = () => {
        controller.current?.abort();
        setIsUploading(false);
    };

    // 🔄 resume (UX only, not real resume)
    const getSavedProgress = () => {
        return JSON.parse(localStorage.getItem("upload-progress"));
    };

    return {
        uploadFile,
        cancelUpload,
        progress,
        isUploading,
        error,
        getSavedProgress,
    };
};