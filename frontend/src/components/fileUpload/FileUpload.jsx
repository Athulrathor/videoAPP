import { useEffect, useRef, useState } from "react";
import { useUpload } from "../../hooks/useUpload";
import { useDropzone } from "../../hooks/useDropzone";
import { Button, Input } from "../ui/index";
import { createShort } from "../../apis/short.api";
import { createVideo } from "../../apis/video.api";

const VIDEO_CATEGORIES = [
    "education",
    "entertainment",
    "music",
    "gaming",
    "sports",
    "news",
    "technology",
    "lifestyle",
    "other",
];

const VISIBILITY_OPTIONS = ["public", "private", "unlisted"];

function Label({ htmlFor, children, required = false }) {
    return (
        <label
            htmlFor={htmlFor}
            className="block text-sm font-medium text-(--foreground)"
        >
            {children}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>
    );
}

function FieldHint({ children }) {
    return <p className="mt-1 text-xs text-(--muted)">{children}</p>;
}

function FieldError({ id, children }) {
    if (!children) return null;
    return (
        <p id={id} className="mt-1 text-xs text-red-500" role="alert">
            {children}
        </p>
    );
}

function UploadType({ onSelect }) {
    const types = [
        {
            id: "video",
            label: "Upload Video",
            desc: "Standard long-form content",
        },
        {
            id: "short",
            label: "Upload Short",
            desc: "Vertical content under 60 seconds",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {types.map((t) => (
                <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelect(t.id)}
                    className="rounded-xl border border-(--border) bg-(--surface) p-4 text-left transition hover:bg-(--border) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary)"
                    aria-label={t.label}
                >
                    <p className="text-sm font-semibold">{t.label}</p>
                    <p className="mt-1 text-xs text-(--muted)">{t.desc}</p>
                </button>
            ))}
        </div>
    );
}

function UploadDrop({ type, onUploaded }) {
    const inputRef = useRef(null);
    const { uploadFile, progress, isUploading, error } = useUpload();
    const [localError, setLocalError] = useState("");

    const getVideoDuration = (file) =>
        new Promise((resolve, reject) => {
            const video = document.createElement("video");
            const objectUrl = URL.createObjectURL(file);

            video.preload = "metadata";
            video.src = objectUrl;

            video.onloadedmetadata = () => {
                const duration = video.duration;
                URL.revokeObjectURL(objectUrl);
                resolve(duration);
            };

            video.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error("Unable to read video metadata"));
            };
        });

    const onDrop = async (file) => {
        if (!file) return;

        try {
            setLocalError("");

            if (!file.type.startsWith("video/")) {
                setLocalError("Only video files are allowed.");
                return;
            }

            const duration = await getVideoDuration(file);

            if (type === "short" && duration > 60) {
                setLocalError("Short must be under 60 seconds.");
                return;
            }

            const res = await uploadFile(file);

            onUploaded({
                url: res.url,
                publicId: res.public_id,
                duration,
                mimeType: file.type,
                size: file.size,
                name: file.name,
            });
        } catch (err) {
            setLocalError(err?.message || "Failed to upload file.");
        }
    };

    const {
        isDragging,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleKeyDown,
    } = useDropzone({
        onDrop,
        accept: ["video/*"],
    });

    return (
        <div className="space-y-4">
            <div
                tabIndex={0}
                role="button"
                aria-label={`Upload ${type} file`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onKeyDown={(e) => handleKeyDown(e, inputRef)}
                onClick={() => inputRef.current?.click()}
                className={`rounded-2xl border-2 border-dashed p-5 sm:p-8 text-center transition outline-none ${isDragging
                        ? "border-(--primary) bg-(--border)"
                        : "border-(--border) bg-(--surface)"
                    } hover:bg-(--border) focus-visible:ring-2 focus-visible:ring-(--primary)`}
            >
                <p className="text-base font-semibold sm:text-lg">Upload your video</p>
                <p className="mt-2 text-sm text-(--muted)">
                    Drag and drop here, or click to browse
                </p>

                <div className="mt-4">
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            inputRef.current?.click();
                        }}
                        size="sm"
                    >
                        Select File
                    </Button>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => onDrop(e.target.files?.[0])}
                />
            </div>

            {isUploading && (
                <div
                    className="rounded-xl border border-(--border) bg-(--surface) p-3"
                    aria-live="polite"
                >
                    <p className="text-sm text-(--muted)">Uploading... {progress}%</p>
                    <div className="mt-2 h-2 w-full rounded bg-(--border)">
                        <div
                            className="h-2 rounded bg-(--primary) transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {(localError || error) && (
                <p className="text-sm text-red-500" role="alert">
                    {localError || "Upload failed. Please try again."}
                </p>
            )}

            <p className="text-xs text-(--muted)">
                Supported formats: MP4, WebM, MOV • Shorts must be under 60 seconds
            </p>
        </div>
    );
}

function UploadDetails({ type, form, setForm, fileData, onNext }) {
    const { uploadFile } = useUpload();
    const [thumbUploading, setThumbUploading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        localStorage.setItem(
            "upload-draft",
            JSON.stringify({ type, form, fileData })
        );
    }, [type, form, fileData]);

    const validate = () => {
        const nextErrors = {};

        if (!form.title?.trim()) nextErrors.title = "Title is required.";
        if (!form.description?.trim())
            nextErrors.description = "Description is required.";
        if (!form.category?.trim()) nextErrors.category = "Category is required.";
        if (!form.visibility?.trim())
            nextErrors.visibility = "Visibility is required.";
        if (!fileData?.url) nextErrors.video = "Video file is required.";
        if (type === "short" && fileData?.duration > 60) {
            nextErrors.video = "Short must be under 60 seconds.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleThumbnailUpload = async (e) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            setThumbUploading(true);
            const res = await uploadFile(file);

            setForm((prev) => ({
                ...prev,
                thumbnail: res.url,
                thumbnailPublicId: res.public_id,
            }));
        } finally {
            setThumbUploading(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="overflow-hidden rounded-2xl border border-(--border) bg-black">
                <video
                    src={fileData?.url}
                    controls
                    className="aspect-video w-full object-contain"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title" required>
                            Title
                        </Label>
                        <Input
                            id="title"
                            placeholder="Enter video title"
                            value={form.title || ""}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, title: e.target.value }))
                            }
                            aria-invalid={!!errors.title}
                            aria-describedby={errors.title ? "title-error" : undefined}
                        />
                        <FieldError id="title-error">{errors.title}</FieldError>
                    </div>

                    <div>
                        <Label htmlFor="description" required>
                            Description
                        </Label>
                        <textarea
                            id="description"
                            rows={5}
                            placeholder="Describe your content"
                            value={form.description || ""}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--primary)"
                            aria-invalid={!!errors.description}
                            aria-describedby={
                                errors.description ? "description-error" : "description-hint"
                            }
                        />
                        <FieldHint>
                            Add context so viewers understand what this content is about.
                        </FieldHint>
                        <FieldError id="description-error">{errors.description}</FieldError>
                    </div>

                    <div>
                        <Label htmlFor="category" required>
                            Category
                        </Label>
                        <select
                            id="category"
                            value={form.category || "other"}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, category: e.target.value }))
                            }
                            className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--primary)"
                            aria-invalid={!!errors.category}
                            aria-describedby={errors.category ? "category-error" : undefined}
                        >
                            {VIDEO_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat} className="text-black">
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                        <FieldError id="category-error">{errors.category}</FieldError>
                    </div>

                    <div>
                        <Label htmlFor="visibility" required>
                            Visibility
                        </Label>
                        <select
                            id="visibility"
                            value={form.visibility || "public"}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, visibility: e.target.value }))
                            }
                            className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--primary)"
                            aria-invalid={!!errors.visibility}
                            aria-describedby={
                                errors.visibility ? "visibility-error" : "visibility-hint"
                            }
                        >
                            {VISIBILITY_OPTIONS.map((item) => (
                                <option key={item} value={item} className="text-black">
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </option>
                            ))}
                        </select>
                        <FieldHint>
                            Public is visible to everyone. Unlisted is link-only. Private is
                            only for you.
                        </FieldHint>
                        <FieldError id="visibility-error">{errors.visibility}</FieldError>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-(--border) p-3">
                        <input
                            id="isPublished"
                            type="checkbox"
                            checked={form.isPublished ?? true}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    isPublished: e.target.checked,
                                }))
                            }
                            className="h-4 w-4"
                        />
                        <div>
                            <Label htmlFor="isPublished">Publish immediately</Label>
                            <FieldHint>
                                Turn this off to save as unpublished content.
                            </FieldHint>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="thumbnail">Thumbnail</Label>
                        <input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="block w-full text-sm"
                        />
                        <FieldHint>
                            Upload a custom thumbnail for better presentation.
                        </FieldHint>
                    </div>

                    {thumbUploading && (
                        <p className="text-sm text-(--muted)">Uploading thumbnail...</p>
                    )}

                    {form.thumbnail ? (
                        <div className="overflow-hidden rounded-2xl border border-(--border)">
                            <img
                                src={form.thumbnail}
                                alt="Uploaded thumbnail preview"
                                className="aspect-video w-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-(--border) bg-(--surface) text-sm text-(--muted)">
                            No thumbnail uploaded yet
                        </div>
                    )}

                    <div className="rounded-2xl border border-(--border) bg-(--surface) p-4">
                        <h3 className="text-sm font-semibold">File details</h3>
                        <div className="mt-3 space-y-2 text-sm text-(--muted)">
                            <p>
                                <span className="font-medium text-(--foreground)">Name:</span>{" "}
                                {fileData?.name || "Unknown"}
                            </p>
                            <p>
                                <span className="font-medium text-(--foreground)">
                                    Duration:
                                </span>{" "}
                                {fileData?.duration ? `${Math.round(fileData.duration)} sec` : "-"}
                            </p>
                            <p>
                                <span className="font-medium text-(--foreground)">Type:</span>{" "}
                                {type}
                            </p>
                            <p>
                                <span className="font-medium text-(--foreground)">
                                    Visibility:
                                </span>{" "}
                                {form.visibility || "public"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {errors.video && (
                <p className="text-sm text-red-500" role="alert">
                    {errors.video}
                </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    onClick={() => {
                        if (validate()) onNext();
                    }}
                >
                    Review and Continue
                </Button>
            </div>
        </div>
    );
}

function UploadPublish({ type, form, fileData, onDone, onBack }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");

            const payload = {
                title: form.title?.trim(),
                description: form.description?.trim(),
                duration: fileData.duration,
                visibility: form.visibility || "public",
                category: form.category || "other",
                thumbnail: form.thumbnail || "",
                thumbnailPublicId: form.thumbnailPublicId || "",
                isPublished: form.isPublished ?? true,
            };

            if (type === "video") {
                payload.videoUrl = fileData.url;
                payload.videoPublicId = fileData.publicId;
            } else {
                payload.shortUrl = fileData.url;
                payload.shortPublicId = fileData.publicId;
            }

            // createdAt should be server-generated, not sent from client

            if (type === "short") {
                await createShort(payload);
            } else {
                await createVideo(payload);
            }

            localStorage.removeItem("upload-draft");
            onDone();
        } catch (err) {
            setError(err?.message || "Upload failed. Retry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-(--border) bg-black">
                    <video
                        src={fileData?.url}
                        controls
                        className="aspect-video w-full object-contain"
                    />
                </div>

                <div className="space-y-4 rounded-2xl border border-(--border) bg-(--surface) p-4">
                    <h3 className="text-base font-semibold">Review details</h3>

                    <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Title:</span> {form.title}</p>
                        <p>
                            <span className="font-medium">Description:</span>{" "}
                            {form.description}
                        </p>
                        <p>
                            <span className="font-medium">Category:</span> {form.category}
                        </p>
                        <p>
                            <span className="font-medium">Visibility:</span> {form.visibility}
                        </p>
                        <p>
                            <span className="font-medium">Published:</span>{" "}
                            {form.isPublished ?? true ? "Yes" : "No"}
                        </p>
                        <p>
                            <span className="font-medium">
                                {type === "video" ? "Video URL" : "Short URL"}:
                            </span>{" "}
                            <span className="break-all">{fileData?.url}</span>
                        </p>
                        <p>
                            <span className="font-medium">Thumbnail:</span>{" "}
                            {form.thumbnail ? "Uploaded" : "Not provided"}
                        </p>
                    </div>

                    {form.thumbnail && (
                        <img
                            src={form.thumbnail}
                            alt="Thumbnail preview"
                            className="aspect-video w-full rounded-xl object-cover"
                        />
                    )}
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500" role="alert">
                    {error}
                </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" onClick={onBack}>
                    Back
                </Button>
                <Button type="button" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Publishing..." : "Publish"}
                </Button>
            </div>
        </div>
    );
}

function FileUpload({ onClose }) {
    const [step, setStep] = useState(1);
    const [type, setType] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "other",
        visibility: "public",
        isPublished: true,
        thumbnail: "",
        thumbnailPublicId: "",
    });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("upload-draft"));

        if (saved) {
            setType(saved.type || null);
            setForm((prev) => ({ ...prev, ...(saved.form || {}) }));
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
    }, [onClose]);

    const handleClose = () => {
        localStorage.removeItem("upload-draft");
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-51 flex items-center justify-center bg-black/60 p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-modal-title"
        >
            <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-(--surface) shadow-xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-(--border) bg-(--surface) px-4 py-3 sm:px-6">
                    <div>
                        <h2 id="upload-modal-title" className="text-lg font-semibold">
                            Upload Content
                        </h2>
                        <p className="text-xs text-(--muted)">
                            Step {step} of 4
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-md p-2 hover:bg-(--border) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary)"
                        aria-label="Close upload modal"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4 sm:p-6">
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
                            onBack={() => setStep(3)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default FileUpload;