import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  FileVideo,
  AlertCircle,
  Image,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { axiosInstance } from "../libs/axios";
// import { useAppearance } from '../hooks/appearances';

const CircularProgressBar = ({ percentage, size = 120, strokeWidth = 8 }) => {
  // const { appearanceSettings } = useAppearance();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          style={{ stroke: 'var(--color-border)' }}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-in-out"
          style={{
            stroke: 'var(--accent-color)',
            transitionDuration: 'var(--animation-duration)'
          }}
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-2xl font-bold"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-2xl)',
            fontFamily: 'var(--font-family)'
          }}
        >
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

const VideoUploadContainer = (props) => {
  // const { appearanceSettings } = useAppearance();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublished: false,
    videoFile: "",
    thumbnail: ''
  });

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [videoDragging, setVideoDragging] = useState(false);
  const [thumbnailDragging, setThumbnailDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);

  const { toggleVideoUploading, setToggleVideoUploading } = props;

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const formRef = useRef(null);

  const videoFormats = [
    "video/mp4",
    "video/mov",
    "video/avi",
    "video/wmv",
    "video/webm",
  ];
  const imageFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxVideoSize = 500 * 1024 * 1024; // 500MB
  const maxImageSize = 5 * 1024 * 1024; // 5MB

  // All your existing handler functions remain the same...
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!selectedVideo) {
      newErrors.video = "Video file is required";
    }

    if (!selectedThumbnail) {
      newErrors.thumbnail = "Thumbnail image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVideoSelect = (file) => {
    setErrors((prev) => ({ ...prev, video: "" }));

    if (!videoFormats.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        video: "Please select a valid video file (MP4, MOV, AVI, WMV, WebM)",
      }));
      return;
    }

    if (file.size > maxVideoSize) {
      setErrors((prev) => ({
        ...prev,
        video: "Video file must be less than 500MB",
      }));
      return;
    }

    setSelectedVideo(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
  };

  const handleThumbnailSelect = (file) => {
    setErrors((prev) => ({ ...prev, thumbnail: "" }));

    if (!imageFormats.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Please select a valid image file (JPEG, PNG, WebP)",
      }));
      return;
    }

    if (file.size > maxImageSize) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Thumbnail must be less than 5MB",
      }));
      return;
    }

    setSelectedThumbnail(file);
    const url = URL.createObjectURL(file);
    setThumbnailPreviewUrl(url);
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    if (type === "video") setVideoDragging(true);
    else setThumbnailDragging(true);
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    if (type === "video") setVideoDragging(false);
    else setThumbnailDragging(false);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    if (type === "video") setVideoDragging(false);
    else setThumbnailDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (type === "video") handleVideoSelect(files[0]);
      else handleThumbnailSelect(files[0]);
    }
  };

  const handleVideoInputChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, videoFile: file })
    if (file) handleVideoSelect(file);
  };

  const handleThumbnailInputChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, thumbnail: file });
    if (file) handleThumbnailSelect(file);
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
    setVideoPreviewUrl("");
    if (videoInputRef.current) videoInputRef.current.value = "";
    setErrors((prev) => ({ ...prev, video: "" }));
  };

  const handleRemoveThumbnail = () => {
    setSelectedThumbnail(null);
    setThumbnailPreviewUrl("");
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleSubmitWithSimulation = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("isPublished", formData.isPublished);

      if (formData.videoFile) data.append("videoFile", formData.videoFile);
      if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);

      const apiPromise = await axiosInstance.post("videos/publish-video", data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onDownloadProgress: (ProgressEvent) => {
            const percent = Math.round((ProgressEvent.loaded * 90) / ProgressEvent.total);
            setUploadProgress(percent)
          }
        });

      setUploadProgress(90);
      await apiPromise;
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setFormData({
          title: "",
          description: "",
          isPublished: false,
          videoFile: "",
          thumbnail: "",
        });
        setToggleVideoUploading(true)
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className={`flex justify-center items-center absolute inset-0 z-10 transition-all ${toggleVideoUploading === true ? "hidden" : ""
        }`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        transitionDuration: 'var(--animation-duration)'
      }}
    >
      {isUploading === false ? (
        <form
          onSubmit={handleSubmitWithSimulation}
          ref={formRef}
          className="mt-3 mb-3 max-w-4xl mx-auto p-6 rounded-lg shadow-lg transition-all max-h-[90vh] overflow-y-auto scrollBar"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderRadius: 'var(--spacing-unit)',
            padding: 'var(--component-padding)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-3xl font-bold mb-4"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-3xl)',
                fontFamily: 'var(--font-family)'
              }}
            >
              Upload Video Content
            </h2>
            <div>
              <button
                onClick={() => setToggleVideoUploading(true)}
                className="p-3 rounded-full transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-hover)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
              >
                <X style={{ color: 'var(--color-text-primary)' }} />
              </button>
            </div>
          </div>

          {/* Video Preview */}
          {videoPreviewUrl && (
            <div
              className="mb-6"
              style={{ marginBottom: 'var(--section-gap)' }}
            >
              <h3
                className="text-lg font-medium mb-3"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-lg)',
                  marginBottom: 'var(--component-padding)'
                }}
              >
                Video Preview
              </h3>
              <video
                src={videoPreviewUrl}
                controls
                className="w-full max-h-64 rounded-lg border mb-2"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="space-y-6" style={{ gap: 'var(--section-gap)' }}>
            {/* Title and Published Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  Title <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all"
                  placeholder="Enter video title"
                  maxLength={100}
                  style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: errors.title ? 'var(--color-error)' : 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-color)';
                    e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.title ? 'var(--color-error)' : 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.title && (
                  <p
                    className="mt-1 text-sm flex items-center"
                    style={{
                      color: 'var(--color-error)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
                <p
                  className="mt-1 text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  {formData.title.length}/100 characters
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  Published Status
                </label>
                <div className="flex items-center mt-3 space-x-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isPublished: !prev.isPublished,
                      }))
                    }
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    style={{
                      backgroundColor: formData.isPublished ? 'var(--accent-color)' : 'var(--color-border)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                  >
                    <span
                      className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      style={{
                        transform: formData.isPublished ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                    />
                  </button>
                  <span
                    className="flex items-center text-sm"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    {formData.isPublished ? (
                      <Eye className="w-4 h-4 mr-1" />
                    ) : (
                      <EyeOff className="w-4 h-4 mr-1" />
                    )}
                    {formData.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>

            {/* Video and Thumbnail Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Video Upload */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  Video File <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${videoDragging || selectedVideo || errors.video ? "" : ""
                    }`}
                  onDragOver={(e) => handleDragOver(e, "video")}
                  onDragLeave={(e) => handleDragLeave(e, "video")}
                  onDrop={(e) => handleDrop(e, "video")}
                  onClick={() => !selectedVideo && videoInputRef.current?.click()}
                  style={{
                    borderColor: videoDragging
                      ? 'var(--accent-color)'
                      : selectedVideo
                        ? 'var(--color-success)'
                        : errors.video
                          ? 'var(--color-error)'
                          : 'var(--color-border)',
                    backgroundColor: videoDragging
                      ? 'var(--color-accent-bg)'
                      : selectedVideo
                        ? 'rgba(16, 185, 129, 0.1)'
                        : errors.video
                          ? 'rgba(239, 68, 68, 0.1)'
                          : 'transparent',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedVideo && !videoDragging) {
                      e.target.style.borderColor = 'var(--color-text-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedVideo && !videoDragging) {
                      e.target.style.borderColor = errors.video ? 'var(--color-error)' : 'var(--color-border)';
                    }
                  }}
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    id="videoFile-upload"
                    accept="video/*"
                    onChange={handleVideoInputChange}
                    className="hidden"
                  />

                  {!selectedVideo ? (
                    <div>
                      <div className="flex justify-center">
                        <Upload
                          className="w-10 h-10"
                          style={{ color: 'var(--color-text-secondary)' }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          Drop video or click to browse
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)'
                          }}
                        >
                          MP4, MOV, AVI, WMV, WebM (Max 500MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-center">
                        <FileVideo
                          className="w-10 h-10"
                          style={{ color: 'var(--color-success)' }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          {selectedVideo.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)'
                          }}
                        >
                          {formatFileSize(selectedVideo.size)}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedVideo && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveVideo();
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full transition-colors"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                    >
                      <X
                        className="w-4 h-4"
                        style={{ color: 'var(--color-error)' }}
                      />
                    </button>
                  )}
                </div>
                {errors.video && (
                  <p
                    className="mt-2 text-sm flex items-center"
                    style={{
                      color: 'var(--color-error)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.video}
                  </p>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  Thumbnail Image <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${selectedThumbnail ? "p-2" : ""
                    }`}
                  onDragOver={(e) => handleDragOver(e, "thumbnail")}
                  onDragLeave={(e) => handleDragLeave(e, "thumbnail")}
                  onDrop={(e) => handleDrop(e, "thumbnail")}
                  onClick={() => !selectedThumbnail && thumbnailInputRef.current?.click()}
                  style={{
                    borderColor: thumbnailDragging
                      ? 'var(--accent-color)'
                      : selectedThumbnail
                        ? 'var(--color-success)'
                        : errors.thumbnail
                          ? 'var(--color-error)'
                          : 'var(--color-border)',
                    backgroundColor: thumbnailDragging
                      ? 'var(--color-accent-bg)'
                      : selectedThumbnail
                        ? 'rgba(16, 185, 129, 0.1)'
                        : errors.thumbnail
                          ? 'rgba(239, 68, 68, 0.1)'
                          : 'transparent',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedThumbnail && !thumbnailDragging) {
                      e.target.style.borderColor = 'var(--color-text-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedThumbnail && !thumbnailDragging) {
                      e.target.style.borderColor = errors.thumbnail ? 'var(--color-error)' : 'var(--color-border)';
                    }
                  }}
                >
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    id="thumbnail-upload"
                    accept="image/*"
                    onChange={handleThumbnailInputChange}
                    className="hidden"
                  />

                  {!selectedThumbnail ? (
                    <div>
                      <div className="flex justify-center">
                        <Image
                          className="w-10 h-10"
                          style={{ color: 'var(--color-text-secondary)' }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          Drop image or click to browse
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)'
                          }}
                        >
                          JPEG, PNG, WebP (Max 5MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-center">
                        <img
                          src={thumbnailPreviewUrl}
                          alt="Thumbnail preview"
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          {selectedThumbnail.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)'
                          }}
                        >
                          {formatFileSize(selectedThumbnail.size)}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedThumbnail && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveThumbnail();
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full transition-colors z-10"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                    >
                      <X
                        className="w-4 h-4"
                        style={{ color: 'var(--color-error)' }}
                      />
                    </button>
                  )}
                </div>
                {errors.thumbnail && (
                  <p
                    className="mt-2 text-sm flex items-center"
                    style={{
                      color: 'var(--color-error)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.thumbnail}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Description <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all"
                placeholder="Enter video description"
                maxLength={500}
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: errors.description ? 'var(--color-error)' : 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-family)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-color)';
                  e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.description ? 'var(--color-error)' : 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.description && (
                <p
                  className="mt-1 text-sm flex items-center"
                  style={{
                    color: 'var(--color-error)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
              <p
                className="mt-1 text-sm"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    Uploading...
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    {uploadProgress}%
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2"
                  style={{ backgroundColor: 'var(--color-border)' }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                      backgroundColor: 'var(--accent-color)'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isUploading}
                className={`px-8 py-3 rounded-md font-medium flex items-center space-x-2 transition-all ${isUploading ? "cursor-not-allowed" : ""
                  }`}
                style={{
                  backgroundColor: isUploading ? 'var(--color-text-secondary)' : 'var(--accent-color)',
                  color: 'white',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  opacity: isUploading ? '0.6' : '1',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  if (!isUploading) {
                    e.target.style.opacity = '0.9';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isUploading) {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <Save className="w-5 h-5" />
                <span>{isUploading ? "Uploading..." : "Save Video"}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div
          className="flex flex-col p-6 items-center justify-center space-y-6 rounded-lg"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderRadius: 'var(--spacing-unit)',
            padding: 'var(--component-padding)'
          }}
        >
          <CircularProgressBar percentage={uploadProgress} />

          <div className="text-center">
            <h3
              className="text-xl font-semibold mb-2"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-xl)',
                fontFamily: 'var(--font-family)'
              }}
            >
              {uploadProgress < 100 ? "Uploading..." : "Success!"}
            </h3>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-base)'
              }}
            >
              {uploadProgress < 100
                ? "Please wait while we process your video"
                : "Your video has been uploaded successfully!"}
            </p>
          </div>

          {uploadProgress < 100 && (
            <div
              className="w-full rounded-full h-2"
              style={{ backgroundColor: 'var(--color-border)' }}
            >
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${uploadProgress}%`,
                  backgroundColor: 'var(--accent-color)'
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUploadContainer;
