import React, { useState, useRef } from "react";
import {
  Upload,
  Play,
  X,
  FileVideo,
  AlertCircle,
  Image,
  Save,
  Eye,
  EyeOff,
  Clock,
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

const ShortUploadContainer = (props) => {
  // const { appearanceSettings } = useAppearance();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublished: false,
    shortFile: null,
  });

  const [selectedShort, setSelectedShort] = useState(null);
  const [shortDragging, setShortDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [shortPreviewUrl, setShortPreviewUrl] = useState("");

  const { toggleShortUploading, setToggleShortUploading } = props;

  const shortInputRef = useRef(null);

  const videoFormats = [
    "video/mp4",
    "video/mov",
    "video/avi",
    "video/wmv",
    "video/webm",
  ];
  const maxShortSize = 150 * 1024 * 1024; // 150MB for shorts
  const maxShortDuration = 180; // 180 seconds for shorts

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

    if (!selectedShort) {
      newErrors.short = "Short video file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => {
        resolve(null);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleShortSelect = async (file) => {
    setErrors((prev) => ({ ...prev, short: "" }));

    if (!videoFormats.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        short: "Please select a valid video file (MP4, MOV, AVI, WMV, WebM)",
      }));
      return;
    }

    if (file.size > maxShortSize) {
      setErrors((prev) => ({
        ...prev,
        short: "Short video must be less than 150MB",
      }));
      return;
    }

    const duration = await checkVideoDuration(file);
    if (duration && duration > maxShortDuration) {
      setErrors((prev) => ({
        ...prev,
        short: `Short video must be ${maxShortDuration} seconds or less`,
      }));
      return;
    }

    setSelectedShort(file);
    setFormData({ ...formData, shortFile: file });
    const url = URL.createObjectURL(file);
    setShortPreviewUrl(url);
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    if (type === "short") setShortDragging(true);
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    if (type === "short") setShortDragging(false);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    if (type === "short") setShortDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (type === "short") handleShortSelect(files[0]);
    }
  };

  const handleShortInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleShortSelect(file);
  };

  const handleRemoveShort = () => {
    setSelectedShort(null);
    setShortPreviewUrl("");
    if (shortInputRef.current) shortInputRef.current.value = "";
    setErrors((prev) => ({ ...prev, short: "" }));
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

      if (formData.shortFile) data.append("shortFile", formData.shortFile);

      const apiPromise = await axiosInstance.post("short/publish-short", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            if (percentCompleted >= 99) percentCompleted = 99;
            setUploadProgress(percentCompleted);
          }
        },
      });

      await apiPromise;
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setFormData({
          title: "",
          description: "",
          isPublished: false,
          shortFile: null,
        });
        setToggleShortUploading(true);
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
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
      className={`flex justify-center items-center absolute inset-0 z-10 transition-all ${toggleShortUploading === true ? "hidden" : ""
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
          className="max-w-4xl max-md:w-full mx-auto max-md:m-0 p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto scrollBar transition-all"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderRadius: 'var(--spacing-unit)',
            padding: 'var(--component-padding)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          {/* Header */}
          <div className="text-center flex justify-between items-center mb-4">
            <h2
              className="text-3xl font-bold mb-2"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-3xl)',
                fontFamily: 'var(--font-family)'
              }}
            >
              Upload Short Video
            </h2>
            <div>
              <button
                onClick={() => setToggleShortUploading(true)}
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

          <div className="space-y-6" style={{ gap: 'var(--section-gap)' }}>
            {/* Title and Published Status */}
            <div className="grid grid-cols-1 max-md:w-full max-md:gap-4 md:grid-cols-2 gap-6">
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
                  placeholder="Enter short video title"
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
                <div className="flex items-center space-x-3 mt-3">
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

            {/* Short Video and Preview Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Short Video Upload */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  Short Video <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer`}
                  onDragOver={(e) => handleDragOver(e, "short")}
                  onDragLeave={(e) => handleDragLeave(e, "short")}
                  onDrop={(e) => handleDrop(e, "short")}
                  onClick={() => !selectedShort && shortInputRef.current?.click()}
                  style={{
                    borderColor: shortDragging
                      ? 'var(--accent-color)'
                      : selectedShort
                        ? 'var(--color-success)'
                        : errors.short
                          ? 'var(--color-error)'
                          : 'var(--color-border)',
                    backgroundColor: shortDragging
                      ? 'var(--color-accent-bg)'
                      : selectedShort
                        ? 'rgba(16, 185, 129, 0.1)'
                        : errors.short
                          ? 'rgba(239, 68, 68, 0.1)'
                          : 'transparent',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedShort && !shortDragging) {
                      e.target.style.borderColor = 'var(--color-text-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedShort && !shortDragging) {
                      e.target.style.borderColor = errors.short ? 'var(--color-error)' : 'var(--color-border)';
                    }
                  }}
                >
                  <input
                    ref={shortInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleShortInputChange}
                    className="hidden"
                  />

                  {!selectedShort ? (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="relative">
                          <FileVideo
                            className="w-10 h-10"
                            style={{ color: 'var(--color-text-secondary)' }}
                          />
                          <Clock
                            className="w-4 h-4 absolute -top-1 -right-1"
                            style={{ color: 'var(--accent-color)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          Drop short video or click to browse
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)'
                          }}
                        >
                          MP4, MOV, AVI, WMV, WebM
                        </p>
                        <p
                          className="text-xs font-medium mt-1"
                          style={{
                            color: 'var(--accent-color)',
                            fontSize: 'var(--font-size-xs)'
                          }}
                        >
                          Max 180 seconds • Max 150MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="relative">
                          <FileVideo
                            className="w-10 h-10"
                            style={{ color: 'var(--color-success)' }}
                          />
                          <Clock
                            className="w-4 h-4 absolute -top-1 -right-1"
                            style={{ color: 'var(--color-success)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          {selectedShort.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)'
                          }}
                        >
                          {formatFileSize(selectedShort.size)}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedShort && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveShort();
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
                {errors.short && (
                  <p
                    className="mt-2 text-sm flex items-center"
                    style={{
                      color: 'var(--color-error)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.short}
                  </p>
                )}
              </div>

              {/* Short Video Preview */}
              {shortPreviewUrl && (
                <div>
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-lg)'
                    }}
                  >
                    Short Video Preview
                  </h3>
                  <div className="flex justify-center">
                    <video
                      src={shortPreviewUrl}
                      controls
                      className="max-w-sm h-96 rounded-lg border object-cover"
                      style={{
                        aspectRatio: "9/16",
                        borderColor: 'var(--color-border)'
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
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
                placeholder="Enter short video description"
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
                    Uploading short video...
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
                className={`px-8 mt-2 py-3 rounded-md font-medium flex items-center space-x-2 transition-all ${isUploading ? "cursor-not-allowed" : ""
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
                <span>{isUploading ? "Uploading..." : "Publish Short"}</span>
              </button>
            </div>

            {/* Success Message */}
            {uploadProgress === 100 && !isUploading && (
              <div
                className="p-4 border rounded-md"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderColor: 'rgba(16, 185, 129, 0.3)'
                }}
              >
                <div
                  className="flex items-center justify-center space-x-2"
                  style={{ color: 'var(--color-success)' }}
                >
                  <Play className="w-5 h-5" />
                  <span className="font-medium">
                    Short video published successfully!
                  </span>
                </div>
              </div>
            )}
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
                ? "Please wait while we process your short video"
                : "Your short video has been uploaded successfully!"}
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

export default ShortUploadContainer;
