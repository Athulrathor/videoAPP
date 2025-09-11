import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  X,
  AlertCircle,
  Image,
  Save,
  Eye,
  EyeOff,
  Radio,
  Settings,
  Users,
  Calendar,
  Clock,
  Copy,
  Check,
  Wifi,
  WifiOff,
  Monitor,
  RefreshCw
} from "lucide-react";
import { useAppearance } from '../hooks/appearances';

const LiveStreamingSetup = (props) => {
  const { appearanceSettings } = useAppearance();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    published: true,
    streamKey: "live_" + Math.random().toString(36).substr(2, 9),
    category: "",
    scheduledTime: "",
    maxViewers: 1000,
    chatEnabled: true,
    recordStream: true,
  });

  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [thumbnailDragging, setThumbnailDragging] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [streamStatus, setStreamStatus] = useState("idle"); // idle, starting, live, stopping
  const [viewerCount, setViewerCount] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errors, setErrors] = useState({});
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");
  const [keyVisible, setKeyVisible] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const set = true;

  const thumbnailInputRef = useRef(null);
  const streamTimer = useRef(null);

  const { toggleLiveUploading, setToggleLiveUploading } = props;

  const imageFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxImageSize = 5 * 1024 * 1024; // 5MB

  const categories = [
    "Gaming",
    "Music",
    "Education",
    "Entertainment",
    "Sports",
    "Technology",
    "Lifestyle",
    "News",
    "Art",
    "Cooking",
    "Other",
  ];

  useEffect(() => {
    if (isLive) {
      streamTimer.current = setInterval(() => {
        setDuration((prev) => prev + 1);
        setViewerCount((prev) =>
          Math.max(0, prev + Math.floor(Math.random() * 10) - 4)
        );
      }, 1000);
    } else {
      if (streamTimer.current) {
        clearInterval(streamTimer.current);
      }
    }

    return () => {
      if (streamTimer.current) {
        clearInterval(streamTimer.current);
      }
    };
  }, [isLive]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Stream title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Stream description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!selectedThumbnail) {
      newErrors.thumbnail = "Stream thumbnail is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setThumbnailDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setThumbnailDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setThumbnailDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleThumbnailSelect(files[0]);
    }
  };

  const handleThumbnailInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleThumbnailSelect(file);
  };

  const handleRemoveThumbnail = () => {
    setSelectedThumbnail(null);
    setThumbnailPreviewUrl("");
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
  };

  const generateNewKey = () => {
    setFormData((prev) => ({
      ...prev,
      streamKey: "live_" + Math.random().toString(36).substr(2, 9),
    }));
  };

  const copyStreamKey = () => {
    navigator.clipboard.writeText(formData.streamKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const handleStartStream = () => {
    if (!validateForm()) return;

    setStreamStatus("starting");

    setTimeout(() => {
      setIsLive(true);
      setStreamStatus("live");
      setViewerCount(Math.floor(Math.random() * 50) + 10);
      setDuration(0);
    }, 2000);
  };

  const handleStopStream = () => {
    setStreamStatus("stopping");

    setTimeout(() => {
      setIsLive(false);
      setStreamStatus("idle");
      setViewerCount(0);
      setDuration(0);
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
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
      className={`flex justify-center items-center absolute inset-0 z-10 ${toggleLiveUploading === true ? "hidden" : ""
        }`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        fontFamily: 'var(--font-family)'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stream-setup-title"
    >
      {!set ? (
        <div
          className="max-w-5xl mx-auto p-6 rounded-lg shadow-lg"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            padding: 'var(--section-gap)',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div
            className="text-center mb-8 flex justify-between items-center"
            style={{
              marginBottom: 'var(--section-gap)',
              gap: 'var(--spacing-unit)'
            }}
          >
            <h2
              id="stream-setup-title"
              className="text-3xl font-bold mb-2 flex items-center justify-center"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-3xl)',
                fontFamily: 'var(--font-family)',
                marginBottom: 'var(--spacing-unit)',
                gap: 'var(--spacing-unit)'
              }}
            >
              <Radio
                className="w-8 h-8"
                style={{ color: 'var(--color-error)' }}
              />
              Live Streaming Setup
            </h2>
            <button
              onClick={() => setToggleLiveUploading(true)}
              className="p-3 rounded-full transition-colors"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text-secondary)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-hover)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-bg-secondary)';
              }}
              aria-label="Close streaming setup"
            >
              <X />
            </button>
          </div>

          {/* Stream Status Banner */}
          {isLive && (
            <div
              className="mb-6 p-4 border rounded-lg"
              style={{
                backgroundColor: 'var(--color-error-bg)',
                borderColor: 'var(--color-error)',
                padding: 'var(--spacing-unit)',
                marginBottom: 'var(--section-gap)'
              }}
              role="status"
              aria-live="polite"
            >
              <div
                className="flex items-center justify-between"
                style={{ gap: 'var(--spacing-unit)' }}
              >
                <div
                  className="flex items-center space-x-4"
                  style={{ gap: 'var(--spacing-unit)' }}
                >
                  <div
                    className="flex items-center space-x-2"
                    style={{ gap: 'calc(var(--spacing-unit) * 0.5)' }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: 'var(--color-error)',
                        animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s infinite'
                      }}
                    />
                    <span
                      className="font-medium"
                      style={{
                        color: 'var(--color-error)',
                        fontFamily: 'var(--font-family)'
                      }}
                    >
                      LIVE
                    </span>
                  </div>
                  <div
                    className="flex items-center space-x-2"
                    style={{
                      color: 'var(--color-text-secondary)',
                      gap: 'calc(var(--spacing-unit) * 0.5)'
                    }}
                  >
                    <Users className="w-4 h-4" />
                    <span>{viewerCount} viewers</span>
                  </div>
                  <div
                    className="flex items-center space-x-2"
                    style={{
                      color: 'var(--color-text-secondary)',
                      gap: 'calc(var(--spacing-unit) * 0.5)'
                    }}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(duration)}</span>
                  </div>
                </div>
                <button
                  onClick={handleStopStream}
                  disabled={streamStatus === "stopping"}
                  className="px-4 py-2 text-white rounded-md transition-colors"
                  style={{
                    backgroundColor: streamStatus === "stopping" ? 'var(--color-text-secondary)' : 'var(--color-error)',
                    opacity: streamStatus === "stopping" ? 0.5 : 1,
                    cursor: streamStatus === "stopping" ? 'not-allowed' : 'pointer',
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'var(--font-family)',
                    padding: 'calc(var(--spacing-unit) * 0.75) var(--spacing-unit)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    if (streamStatus !== "stopping") {
                      e.target.style.backgroundColor = 'var(--color-error-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (streamStatus !== "stopping") {
                      e.target.style.backgroundColor = 'var(--color-error)';
                    }
                  }}
                  aria-label={streamStatus === "stopping" ? "Stopping stream..." : "End stream"}
                >
                  {streamStatus === "stopping" ? "Stopping..." : "End Stream"}
                </button>
              </div>
            </div>
          )}

          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            style={{ gap: 'var(--section-gap)' }}
          >
            {/* Left Column - Stream Settings */}
            <div
              className="lg:col-span-2 space-y-6"
              style={{ gap: 'var(--section-gap)' }}
            >
              {/* Title and Category */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                style={{ gap: 'var(--spacing-unit)' }}
              >
                <div>
                  <label
                    htmlFor="stream-title"
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    Stream Title <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <input
                    id="stream-title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={isLive}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: errors.title ? 'var(--color-error)' : 'var(--color-border)',
                      backgroundColor: isLive ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      padding: 'var(--spacing-unit)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onFocus={(e) => {
                      if (!errors.title) {
                        e.target.style.borderColor = 'var(--accent-color)';
                        e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.title) {
                        e.target.style.borderColor = 'var(--color-border)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                    placeholder="What's your stream about?"
                    maxLength={100}
                    aria-describedby={errors.title ? "title-error" : "title-help"}
                    aria-invalid={!!errors.title}
                  />
                  {errors.title && (
                    <p
                      id="title-error"
                      className="mt-1 text-sm flex items-center"
                      style={{
                        color: 'var(--color-error)',
                        fontSize: 'var(--font-size-sm)',
                        marginTop: 'calc(var(--spacing-unit) * 0.5)',
                        gap: 'calc(var(--spacing-unit) * 0.5)'
                      }}
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                  <p
                    id="title-help"
                    className="mt-1 text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-sm)',
                      marginTop: 'calc(var(--spacing-unit) * 0.5)'
                    }}
                  >
                    {formData.title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="stream-category"
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    Category <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <select
                    id="stream-category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={isLive}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: errors.category ? 'var(--color-error)' : 'var(--color-border)',
                      backgroundColor: isLive ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      padding: 'var(--spacing-unit)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onFocus={(e) => {
                      if (!errors.category) {
                        e.target.style.borderColor = 'var(--accent-color)';
                        e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.category) {
                        e.target.style.borderColor = 'var(--color-border)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                    aria-describedby={errors.category ? "category-error" : undefined}
                    aria-invalid={!!errors.category}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p
                      id="category-error"
                      className="mt-1 text-sm flex items-center"
                      style={{
                        color: 'var(--color-error)',
                        fontSize: 'var(--font-size-sm)',
                        marginTop: 'calc(var(--spacing-unit) * 0.5)',
                        gap: 'calc(var(--spacing-unit) * 0.5)'
                      }}
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="stream-description"
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'var(--font-family)',
                    marginBottom: 'var(--spacing-unit)'
                  }}
                >
                  Stream Description <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <textarea
                  id="stream-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isLive}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.description ? 'var(--color-error)' : 'var(--color-border)',
                    backgroundColor: isLive ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-family)',
                    padding: 'var(--spacing-unit)',
                    transitionDuration: 'var(--animation-duration)',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => {
                    if (!errors.description) {
                      e.target.style.borderColor = 'var(--accent-color)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.description) {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                  placeholder="Tell viewers what to expect from your stream"
                  maxLength={500}
                  aria-describedby={errors.description ? "description-error" : "description-help"}
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p
                    id="description-error"
                    className="mt-1 text-sm flex items-center"
                    style={{
                      color: 'var(--color-error)',
                      fontSize: 'var(--font-size-sm)',
                      marginTop: 'calc(var(--spacing-unit) * 0.5)',
                      gap: 'calc(var(--spacing-unit) * 0.5)'
                    }}
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
                <p
                  id="description-help"
                  className="mt-1 text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                    marginTop: 'calc(var(--spacing-unit) * 0.5)'
                  }}
                >
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Stream Key */}
              <div>
                <label
                  htmlFor="stream-key"
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'var(--font-family)',
                    marginBottom: 'var(--spacing-unit)'
                  }}
                >
                  Stream Key
                </label>
                <div
                  className="flex space-x-2"
                  style={{ gap: 'var(--spacing-unit)' }}
                >
                  <div className="flex-1 relative">
                    <input
                      id="stream-key"
                      type={keyVisible ? "text" : "password"}
                      value={formData.streamKey}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                      style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-sm)',
                        fontFamily: 'monospace',
                        padding: 'var(--spacing-unit)'
                      }}
                      aria-label="Stream key for broadcasting software"
                    />
                    <button
                      type="button"
                      onClick={() => setKeyVisible(!keyVisible)}
                      className="absolute right-2 top-2 transition-colors"
                      style={{
                        color: 'var(--color-text-secondary)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--color-text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--color-text-secondary)';
                      }}
                      aria-label={keyVisible ? "Hide stream key" : "Show stream key"}
                    >
                      {keyVisible ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={copyStreamKey}
                    className="px-3 py-2 text-white rounded-md transition-colors"
                    style={{
                      backgroundColor: 'var(--accent-color)',
                      padding: 'var(--spacing-unit)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-accent-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--accent-color)';
                    }}
                    aria-label={keyCopied ? "Stream key copied!" : "Copy stream key"}
                  >
                    {keyCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={generateNewKey}
                    disabled={isLive}
                    className="px-3 py-2 text-white rounded-md transition-colors"
                    style={{
                      backgroundColor: isLive ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                      opacity: isLive ? 0.5 : 1,
                      cursor: isLive ? 'not-allowed' : 'pointer',
                      padding: 'var(--spacing-unit)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLive) {
                        e.target.style.backgroundColor = 'var(--color-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLive) {
                        e.target.style.backgroundColor = 'var(--color-text-primary)';
                      }
                    }}
                    aria-label="Generate new stream key"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                <p
                  className="mt-1 text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                    marginTop: 'calc(var(--spacing-unit) * 0.5)'
                  }}
                >
                  Use this key in your streaming software (OBS, Streamlabs, etc.)
                </p>
              </div>

              {/* Stream Settings */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                style={{ gap: 'var(--spacing-unit)' }}
              >
                <div>
                  <label
                    htmlFor="max-viewers"
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    Max Viewers
                  </label>
                  <input
                    id="max-viewers"
                    type="number"
                    name="maxViewers"
                    value={formData.maxViewers}
                    onChange={handleInputChange}
                    disabled={isLive}
                    min="1"
                    max="10000"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: 'var(--color-border)',
                      backgroundColor: isLive ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      padding: 'var(--spacing-unit)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent-color)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="scheduled-time"
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    Scheduled Time (Optional)
                  </label>
                  <input
                    id="scheduled-time"
                    type="datetime-local"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                    disabled={isLive}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: 'var(--color-border)',
                      backgroundColor: isLive ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      padding: 'var(--spacing-unit)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent-color)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Stream Options */}
              <fieldset
                className="space-y-4"
                style={{ gap: 'var(--spacing-unit)' }}
              >
                <legend
                  className="text-sm font-medium mb-4"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'var(--font-family)',
                    marginBottom: 'var(--spacing-unit)'
                  }}
                >
                  Stream Options
                </legend>

                {/* Toggle switches with theme integration */}
                {[
                  { key: 'published', label: formData.published ? 'Public Stream' : 'Private Stream' },
                  { key: 'chatEnabled', label: 'Enable Chat' },
                  { key: 'recordStream', label: 'Record Stream' }
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex items-center space-x-3"
                    style={{ gap: 'var(--spacing-unit)' }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                      disabled={isLive && key === 'published'}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                      style={{
                        backgroundColor: formData[key] ? 'var(--accent-color)' : 'var(--color-bg-tertiary)',
                        opacity: (isLive && key === 'published') ? 0.5 : 1,
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      role="switch"
                      aria-checked={formData[key]}
                      aria-label={label}
                    >
                      <span
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        style={{
                          transform: formData[key] ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                      />
                    </button>
                    <span
                      className="text-sm"
                      style={{
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-sm)'
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </fieldset>
            </div>

            {/* Right Column - Thumbnail and Controls */}
            <div
              className="space-y-6"
              style={{ gap: 'var(--section-gap)' }}
            >
              {/* Thumbnail Upload */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'var(--font-family)',
                    marginBottom: 'var(--spacing-unit)'
                  }}
                >
                  Stream Thumbnail <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <div
                  className="relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer"
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
                        ? 'var(--color-success-bg)'
                        : errors.thumbnail
                          ? 'var(--color-error-bg)'
                          : 'transparent',
                    padding: 'var(--section-gap)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() =>
                    !selectedThumbnail &&
                    !isLive &&
                    thumbnailInputRef.current?.click()
                  }
                  role="button"
                  tabIndex={0}
                  aria-label={selectedThumbnail ? "Change stream thumbnail" : "Upload stream thumbnail"}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !selectedThumbnail && !isLive) {
                      e.preventDefault();
                      thumbnailInputRef.current?.click();
                    }
                  }}
                >
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailInputChange}
                    disabled={isLive}
                    className="hidden"
                    aria-describedby={errors.thumbnail ? "thumbnail-error" : "thumbnail-help"}
                  />

                  {!selectedThumbnail ? (
                    <div
                      className="space-y-3"
                      style={{ gap: 'var(--spacing-unit)' }}
                    >
                      <div className="flex justify-center">
                        <Image
                          className="w-10 h-10"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)',
                            fontFamily: 'var(--font-family)'
                          }}
                        >
                          Drop thumbnail or click to browse
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)',
                            marginTop: 'calc(var(--spacing-unit) * 0.5)'
                          }}
                        >
                          JPEG, PNG, WebP (Max 5MB)
                        </p>
                        <p
                          className="text-xs font-medium mt-1"
                          style={{
                            color: 'var(--accent-color)',
                            fontSize: 'var(--font-size-xs)',
                            marginTop: 'calc(var(--spacing-unit) * 0.5)'
                          }}
                        >
                          Recommended: 1920x1080 (16:9)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="space-y-3"
                      style={{ gap: 'var(--spacing-unit)' }}
                    >
                      <div className="flex justify-center">
                        <img
                          src={thumbnailPreviewUrl}
                          alt="Stream thumbnail preview"
                          className="w-full max-w-48 h-28 object-cover rounded-md border-2"
                          style={{ borderColor: 'var(--color-success)' }}
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

                  {selectedThumbnail && !isLive && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveThumbnail();
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full transition-colors"
                      style={{
                        backgroundColor: 'var(--color-error-bg)',
                        color: 'var(--color-error)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-error)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'var(--color-error-bg)';
                        e.target.style.color = 'var(--color-error)';
                      }}
                      aria-label="Remove thumbnail"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {errors.thumbnail && (
                  <p
                    id="thumbnail-error"
                    className="mt-2 text-sm flex items-center"
                    style={{
                      color: 'var(--color-error)',
                      fontSize: 'var(--font-size-sm)',
                      marginTop: 'var(--spacing-unit)',
                      gap: 'calc(var(--spacing-unit) * 0.5)'
                    }}
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.thumbnail}
                  </p>
                )}
              </div>

              {/* Stream Controls */}
              <div
                className="space-y-4"
                style={{ gap: 'var(--spacing-unit)' }}
              >
                {!isLive ? (
                  <button
                    type="button"
                    onClick={handleStartStream}
                    disabled={streamStatus === "starting"}
                    className="w-full px-6 py-3 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
                    style={{
                      backgroundColor: streamStatus === "starting" ? 'var(--color-text-secondary)' : 'var(--color-error)',
                      color: 'white',
                      cursor: streamStatus === "starting" ? 'not-allowed' : 'pointer',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 1.5)',
                      gap: 'var(--spacing-unit)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      if (streamStatus !== "starting") {
                        e.target.style.backgroundColor = 'var(--color-error-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (streamStatus !== "starting") {
                        e.target.style.backgroundColor = 'var(--color-error)';
                      }
                    }}
                    aria-label={streamStatus === "starting" ? "Starting stream..." : "Go live"}
                  >
                    <Radio className="w-5 h-5" />
                    <span>
                      {streamStatus === "starting"
                        ? "Starting Stream..."
                        : "Go Live"}
                    </span>
                  </button>
                ) : (
                  <div
                    className="p-4 border rounded-md"
                    style={{
                      backgroundColor: 'var(--color-success-bg)',
                      borderColor: 'var(--color-success)',
                      padding: 'var(--spacing-unit)'
                    }}
                    role="status"
                    aria-live="polite"
                  >
                    <div
                      className="flex items-center justify-center space-x-2"
                      style={{
                        color: 'var(--color-success)',
                        gap: 'var(--spacing-unit)'
                      }}
                    >
                      <Wifi className="w-5 h-5" />
                      <span className="font-medium">Stream is live!</span>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <p
                    className="text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    Use OBS, Streamlabs, or other streaming software with your
                    stream key
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="max-w-5xl mx-auto p-6 rounded-lg shadow-lg"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            padding: 'var(--section-gap)',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div
            className="text-center mb-8 flex justify-between items-center"
            style={{
              marginBottom: 'var(--section-gap)',
              gap: 'var(--spacing-unit)'
            }}
          >
            <h2
              className="text-3xl m-2 font-bold mb-2 flex items-center justify-center"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-3xl)',
                fontFamily: 'var(--font-family)',
                marginBottom: 'var(--spacing-unit)',
                gap: 'var(--spacing-unit)'
              }}
            >
              <Radio
                className="w-8 h-8"
                style={{ color: 'var(--color-error)' }}
              />
              This feature is not available right now
            </h2>
            <button
              onClick={() => setToggleLiveUploading(true)}
              className="p-3 rounded-full transition-colors"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text-secondary)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-hover)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-bg-secondary)';
              }}
              aria-label="Close streaming setup"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {/* Live Region for Status Updates */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {streamStatus === "starting" && "Starting stream..."}
        {streamStatus === "live" && "Stream is now live!"}
        {streamStatus === "stopping" && "Stopping stream..."}
        {keyCopied && "Stream key copied to clipboard"}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveStreamingSetup;
