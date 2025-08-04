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
} from "lucide-react";

const LiveStreamingSetup = (props) => {
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
        className={`flex justify-center items-center absolute inset-0 z-10 ${
          toggleLiveUploading === true ? "hidden" : ""
        }`}
      >
        {!set ? (
          <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center mb-8  flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
                <Radio className="w-8 h-8 mr-3 text-red-500" />
                Live Streaming Setup
              </h2>
              <div>
                <button
                  onClick={() => setToggleLiveUploading(true)}
                  className="p-3 rounded-full bg-gray-300 hover:bg-gray-400"
                >
                  <X />
                </button>
              </div>
            </div>

            {/* Stream Status Banner */}
            {isLive && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-700 font-medium">LIVE</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{viewerCount} viewers</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(duration)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleStopStream}
                    disabled={streamStatus === "stopping"}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                  >
                    {streamStatus === "stopping" ? "Stopping..." : "End Stream"}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Stream Settings */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stream Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      disabled={isLive}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      } ${isLive ? "bg-gray-100" : ""}`}
                      placeholder="What's your stream about?"
                      maxLength={100}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.title.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isLive}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      } ${isLive ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option
                          key={cat}
                          value={cat}
                        >
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stream Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isLive}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } ${isLive ? "bg-gray-100" : ""}`}
                    placeholder="Tell viewers what to expect from your stream"
                    maxLength={500}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Stream Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stream Key
                  </label>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type={keyVisible ? "text" : "password"}
                        value={formData.streamKey}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setKeyVisible(!keyVisible)}
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
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
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                      className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Use this key in your streaming software (OBS, Streamlabs,
                    etc.)
                  </p>
                </div>

                {/* Stream Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Viewers
                    </label>
                    <input
                      type="number"
                      name="maxViewers"
                      value={formData.maxViewers}
                      onChange={handleInputChange}
                      disabled={isLive}
                      min="1"
                      max="10000"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isLive ? "bg-gray-100" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleInputChange}
                      disabled={isLive}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isLive ? "bg-gray-100" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Stream Options */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          published: !prev.published,
                        }))
                      }
                      disabled={isLive}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.published ? "bg-blue-600" : "bg-gray-200"
                      } ${isLive ? "opacity-50" : ""}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.published ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-700">
                      {formData.published ? "Public Stream" : "Private Stream"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          chatEnabled: !prev.chatEnabled,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.chatEnabled ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.chatEnabled
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-700">Enable Chat</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          recordStream: !prev.recordStream,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.recordStream ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.recordStream
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-700">Record Stream</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Thumbnail and Controls */}
              <div className="space-y-6">
                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stream Thumbnail <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                      thumbnailDragging
                        ? "border-blue-500 bg-blue-50"
                        : selectedThumbnail
                        ? "border-green-500 bg-green-50"
                        : errors.thumbnail
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() =>
                      !selectedThumbnail &&
                      !isLive &&
                      thumbnailInputRef.current?.click()
                    }
                  >
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailInputChange}
                      disabled={isLive}
                      className="hidden"
                    />

                    {!selectedThumbnail ? (
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <Image className="w-10 h-10 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Drop thumbnail or click to browse
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPEG, PNG, WebP (Max 5MB)
                          </p>
                          <p className="text-xs text-blue-600 font-medium mt-1">
                            Recommended: 1920x1080 (16:9)
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <img
                            src={thumbnailPreviewUrl}
                            alt="Stream thumbnail"
                            className="w-full max-w-48 h-28 object-cover rounded-md border-2 border-green-200"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {selectedThumbnail.name}
                          </p>
                          <p className="text-xs text-gray-500">
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
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                  {errors.thumbnail && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.thumbnail}
                    </p>
                  )}
                </div>

                {/* Stream Controls */}
                <div className="space-y-4">
                  {!isLive ? (
                    <button
                      type="button"
                      onClick={handleStartStream}
                      disabled={streamStatus === "starting"}
                      className={`w-full px-6 py-3 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors ${
                        streamStatus === "starting"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      <Radio className="w-5 h-5" />
                      <span>
                        {streamStatus === "starting"
                          ? "Starting Stream..."
                          : "Go Live"}
                      </span>
                    </button>
                  ) : (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center justify-center space-x-2 text-green-700">
                        <Wifi className="w-5 h-5" />
                        <span className="font-medium">Stream is live!</span>
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Use OBS, Streamlabs, or other streaming software with your
                      stream key
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center mb-8 bg-white  flex justify-between items-center">
              <h2 className="text-3xl m-2 font-bold text-gray-800 mb-2 flex items-center justify-center">
                <Radio className="w-8 h-8 mr-3 text-red-500" />
                This feature is not available
                <span>right now</span>
              </h2>
              <div>
                <button
                  onClick={() => setToggleLiveUploading(true)}
                  className="p-3 rounded-full bg-gray-300 hover:bg-gray-400"
                >
                  <X />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default LiveStreamingSetup;
