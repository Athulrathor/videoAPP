import { useEffect, useRef, useState } from "react";
import { useUpload } from "../../hooks/useUpload";
import { useDropzone } from "../../hooks/useDropzone";
import { Button, Input } from "../ui/index";
import { createShort } from "../../apis/short.api";
import { createVideo } from "../../apis/video.api";

//  Step 1: Select type (video/short)
function UploadType({ onSelect }) {
    const types = [
        { id: "video", label: "Upload Video" },
        { id: "short", label: "Upload Short" },
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {types.map((t) => (
                <button
                    key={t.id}
                    onClick={() => onSelect(t.id)}
                    className="border p-4 rounded hover:bg-(--border)"
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}

//  Step 2: Upload file (drag & drop or click)
function UploadDrop({ type, onUploaded }) {
    const inputRef = useRef();
    const { uploadFile, progress, isUploading,error } = useUpload();

    const getVideoDuration = (file) =>
        new Promise((resolve) => {
            const video = document.createElement("video");
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => resolve(video.duration);
        });

    const onDrop = async (file) => {
        // 🎯 allow only video
        if (!file.type.startsWith("video")) {
            alert("Only video files allowed");
            return;
        }

        const duration = await getVideoDuration(file);

        // ⏱ optional: validate shorts (< 60 sec)
        if (type === "short" && duration > 60) {
            alert("Short must be under 60 seconds");
            return;
        }

        const res = await uploadFile(file);

        onUploaded({
            url: res.url,
            publicId: res.public_id,
            duration,
        });
    };

    const {
        isDragging,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleKeyDown,
    } = useDropzone({
        onDrop,
        accept: ["video/*"], // ✅ only video
    });

    return (
        <div className="space-y-3">

            {/* 📦 DROP AREA */}
            <div
                tabIndex={0}
                role="button"
                aria-label="Upload video file"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onKeyDown={(e) => handleKeyDown(e, inputRef)}
                onClick={() => inputRef.current.click()}
                className={`
      border-2 border-dashed rounded-lg p-6 text-center
      transition cursor-pointer outline-none
      bg-(--surface)
      ${isDragging ? "border-(--primary) bg-(--border)" : "border-(--border)"}
      hover:bg-(--border)
      focus-visible:ring-2 ring-(--primary)
    `}
            >

                {/* 🎬 ICON / TITLE */}
                <p className="text-sm font-medium">
                    Upload your video
                </p>

                {/* 🧠 GUIDANCE */}
                <p className="text-xs text-(--muted) mt-1">
                    Drag & drop your file here or click to browse
                </p>

                {/* 🔘 BUTTON */}
                <div className="mt-3">
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            inputRef.current.click();
                        }}
                        size="sm"
                    >
                        Select File
                    </Button>
                </div>

                {/* 📂 INPUT */}
                <input
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => onDrop(e.target.files[0])}
                />
            </div>

            {/* 📊 PROGRESS */}
            {isUploading && (
                <div className="space-y-1">
                    <p className="text-xs text-(--muted)">
                        Uploading... {progress}%
                    </p>

                    <div className="w-full h-1 bg-(--border) rounded">
                        <div
                            className="h-1 bg-(--primary) rounded"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* ❌ ERROR */}
            {error && (
                <p className="text-xs text-red-500">
                    Upload failed. Please try again.
                </p>
            )}

            {/* 💡 HELP TEXT */}
            <p className="text-xs text-(--muted)">
                Supported formats: MP4, WebM • Max size: 100MB
            </p>
        </div>
    );
}

//  Step 3: Add details & publish
function UploadDetails({ type, form, setForm, fileData, onNext }) {

    const { uploadFile} = useUpload();

    useEffect(() => {
        localStorage.setItem(
            "upload-draft",
            JSON.stringify({ type, form, fileData })
        );
    }, [form, fileData, type]);

    const isValid =
        form.title?.trim() &&
        fileData?.url &&
        (type === "short" ? fileData.duration <= 60 : true);

    return (
        <div className="space-y-3">

            {/* 🎬 PREVIEW */}
            <video
                src={fileData?.url}
                controls
                className="w-full rounded"
            />

            {/* 🖼 THUMB */}
            <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                    const file = e.target.files[0];
                    const res = await uploadFile(file);

                    setForm((prev) => ({
                        ...prev,
                        thumbnail: res.url,
                        thumbnailPublicId: res.public_id,
                    }));
                }}
            />

            {form.thumbnail && (
                <img src={form.thumbnail} className="rounded" />
            )}

            {/* INPUTS */}
            <input
                placeholder="Title"
                value={form.title || ""}
                onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                }
            />

            <textarea
                placeholder="Description"
                value={form.description || ""}
                onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                }
            />

            <button disabled={!isValid} onClick={onNext}>
                Next
            </button>
        </div>
    );
}

//  Step 4: Review & publish
function UploadPublish({ type, form, fileData, onDone }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");

            const payload = {
                title: form.title,
                description: form.description,
                duration: fileData.duration,
                visibility: form.visibility || "public",
                category: form.category || "other",
                thumbnail: form.thumbnail,
                thumbnailPublicId: form.thumbnailPublicId,
                isPublished: true,
            };

            if (type === "video") {
                payload.videoUrl = fileData.url;
                payload.videoPublicId = fileData.publicId;
            } else {
                payload.shortUrl = fileData.url;
                payload.shortPublicId = fileData.publicId;
            }

            if (type === "short") {
                await createShort(payload);
                return;
            } else if (type === "video") {
                await createVideo(payload);
                return;
            }

            localStorage.removeItem("upload-draft");

            onDone();
        } catch (err) {
            setError("Upload failed. Retry.", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            {error && <p className="text-red-500">{error}</p>}

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Publishing..." : "Publish"}
            </button>

            {error && (
                <button onClick={handleSubmit}>
                    Retry
                </button>
            )}
        </div>
    );
}

function FileUpload({ onClose }) {
    const [step, setStep] = useState(1);
    const [type, setType] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [form, setForm] = useState({});

    // ✅ RESTORE DRAFT
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("upload-draft"));

        if (saved) {
            setType(saved.type);
            setForm(saved.form || {});
            setFileData(saved.fileData || null);
            setStep(saved.fileData ? 3 : 2);
        }
    }, []);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    // ❌ CLEAR ON CLOSE
    const handleClose = () => {
        localStorage.removeItem("upload-draft");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-51">
            <div className="bg-(--surface) w-full max-w-xl p-4 rounded-lg space-y-4">

                <div className="flex justify-between">
                    <h2 className="font-semibold">Upload</h2>
                    <button onClick={handleClose}>✕</button>
                </div>

                {step === 1 && (
                    <UploadType
                        onSelect={(t) => {
                            setType(t);
                            setStep(2);
                        }}
                    />
                )}

                {step === 2 && (
                    <UploadDrop
                        type={type}
                        onUploaded={(data) => {
                            setFileData(data);
                            setStep(3);
                        }}
                    />
                )}

                {step === 3 && (
                    <UploadDetails
                        type={type}
                        form={form}
                        setForm={setForm}
                        fileData={fileData}
                        onNext={() => setStep(4)}
                    />
                )}

                {step === 4 && (
                    <UploadPublish
                        type={type}
                        form={form}
                        fileData={fileData}
                        onDone={handleClose}
                    />
                )}
            </div>
        </div>
    );
}

export default FileUpload;