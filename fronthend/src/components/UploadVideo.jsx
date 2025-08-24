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

const CircularProgressBar = ({ percentage, size = 120, strokeWidth = 8 }) => {
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
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

const VideoUploadContainer = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublished: false,
    videoFile: "",
    thumbnail:''
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

  const { toggleVideoUploading, setToggleVideoUploading } =
    props;

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
    setFormData({...formData,videoFile:file})
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

      // Make API call
      const apiPromise = await axiosInstance.post("videos/publish-video", data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onDownloadProgress: (ProgressEvent) => {
            const percent = Math.round((ProgressEvent.loaded * 90) / ProgressEvent.total);
            setUploadProgress(percent)
          }
        });
      
      setUploadProgress(90);

      const response = await apiPromise;

      console.log("Upload complete!", response);

      setUploadProgress(100);

      // Reset after showing success
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
      className={`flex justify-center items-center absolute inset-0 z-10 ${
        toggleVideoUploading === true ? "hidden" : ""
      }`}
    >
      {isUploading === false ? (
        <form
          onSubmit={handleSubmitWithSimulation}
          ref={formRef}
          className="mt-3 mb-3 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
        >
          <div className=" flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 ">
              Upload Video Content
            </h2>
            <div>
              <button
                onClick={() => setToggleVideoUploading(true)}
                className="p-3 rounded-full bg-gray-300 hover:bg-gray-400"
              >
                <X />
              </button>
            </div>
          </div>

          {/* Video Previews */}
          {videoPreviewUrl && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Video Preview
              </h3>
              <video
                src={videoPreviewUrl}
                controls
                className="w-full max-h-64 rounded-lg border border-gray-300 mb-2"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="">
            {/* Title and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter video title"
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
                  Published Status
                </label>
                <div className="flex items-center mt-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isPublished: !prev.isPublished,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isPublished ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isPublished ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="flex items-center text-sm text-gray-700">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File <span className="text-red-500">*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                    videoDragging
                      ? "border-blue-500 bg-blue-50"
                      : selectedVideo
                      ? "border-green-500 bg-green-50"
                      : errors.video
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={(e) => handleDragOver(e, "video")}
                  onDragLeave={(e) => handleDragLeave(e, "video")}
                  onDrop={(e) => handleDrop(e, "video")}
                  onClick={() =>
                    !selectedVideo && videoInputRef.current?.click()
                  }
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
                    <div className="">
                      <div className="flex justify-center">
                        <Upload className="w-10 h-10 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Drop video or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          MP4, MOV, AVI, WMV, WebM (Max 500MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="">
                      <div className="flex justify-center">
                        <FileVideo className="w-10 h-10 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {selectedVideo.name}
                        </p>
                        <p className="text-xs text-gray-500">
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
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
                {errors.video && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.video}
                  </p>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail Image <span className="text-red-500">*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                    thumbnailDragging
                      ? "border-blue-500 bg-blue-50"
                      : selectedThumbnail
                      ? "border-green-500 p-0"
                      : errors.thumbnail
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={(e) => handleDragOver(e, "thumbnail")}
                  onDragLeave={(e) => handleDragLeave(e, "thumbnail")}
                  onDrop={(e) => handleDrop(e, "thumbnail")}
                  onClick={() =>
                    !selectedThumbnail && thumbnailInputRef.current?.click()
                  }
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
                    <div className="">
                      <div className="flex justify-center">
                        <Image className="w-10 h-10 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Drop image or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPEG, PNG, WebP (Max 5MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={``}>
                      <div className="flex justify-center">
                        <img
                          src={thumbnailPreviewUrl}
                          alt="Thumbnail preview"
                          className="w-20 h-20 object-cover rounded-md"
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

                  {selectedThumbnail && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveThumbnail();
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors z-11"
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
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter video description"
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

            {/* Upload Progress */}
            {isUploading && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Uploading...
                  </span>
                  <span className="text-sm text-gray-500">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isUploading}
                className={`px-8 py-3 rounded-md font-medium flex items-center space-x-2 transition-colors ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Save className="w-5 h-5" />
                <span>{isUploading ? "Uploading..." : "Save Video"}</span>
              </button>
            </div>

            {/* Success Message */}
            {/* {uploadProgress === 100 && !isUploading && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <Play className="w-5 h-5" />
                <span className="font-medium">
                  Video uploaded successfully!
                </span>
              </div>
            </div> */}
            {/* )} */}
          </div>
        </form>
      ) : (
        <div className="flex flex-col bg-white p-6 items-center justify-center space-y-6">
          <CircularProgressBar percentage={uploadProgress} />

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {uploadProgress < 100 ? "Sending..." : "Success!"}
            </h3>
            <p className="text-gray-600">
              {uploadProgress < 100
                ? "Please wait while we process your message"
                : "Your message has been sent successfully!"}
            </p>
          </div>

          {uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUploadContainer;
