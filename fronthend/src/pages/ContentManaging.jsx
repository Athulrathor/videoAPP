
import React, { useState, useEffect } from 'react';
import { FilePenLine, X, Check, Upload, Video, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpdateVideo, fetchVideoByOwner, fetchVideoDelete } from '../redux/features/videos';
import { fetchShortByOwner, fetchShortDelete, fetchUpdateShort } from '../redux/features/shorts';
import { uploadShort, uploadVideo, resetStatus } from '../redux/features/uploads';
import MobileContentManagerCardList from '../components/LoadingScreen/MobileContentManagerCardList';
import DesktopCardList from '../components/LoadingScreen/DesktopCardList';
import { useRef } from 'react';

const ContentManager = () => {

    const [userSelected, setUserSelected] = useState("videos");
    const [editStatus, setEditStatus] = useState(false);
    const [updateData, setUpdateData] = useState({});

    const [updateImage, setUpdateImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [updateVideo, setUpdateVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const [addNewStatus, setaddNewStatus] = useState(false);

    const firstInputRef = useRef(null)

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.user);
    const { videoByOwner, videoByOownerLoading } = useSelector(state => state.videos);
    const { shortByOwner, shortByOwnerLoading } = useSelector(state => state.shorts);
    const { progress, status, error } = useSelector(state => state.uploads);

    useEffect(() => {
        console.log('Upload Status Changed:', { status, progress, error });
    }, [status, progress, error]);

    const ProgressBar = ({ value, label = "Uploading" }) => {
        const safeValue = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

        return (
            <div className="w-full">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>{label}</span>
                    <span aria-live="polite">{safeValue}%</span>
                </div>
                <div
                    className="w-full h-2 bg-gray-200/60 rounded overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={safeValue}
                    aria-label={label}
                >
                    <div
                        className="h-full bg-blue-500/70 transition-[width] duration-200 ease-out"
                        style={{ width: `${safeValue}%` }}
                    />
                </div>
            </div>
        );
    };

    const getStatusMessage = () => {
        switch (status) {
            case "loading":
                return "Uploading started";
            case "succeeded":
                return setTimeout(() => {return "Upload completed successfully"},2000);
            case "failed":
                return setTimeout(() => { return `Upload failed: ${error || "Unknown error"}` }, 2000);
            default:
                return "";
        }
    };

    useEffect(() => {
        if (status === "succeeded" || status === "failed") {
            const timer = setTimeout(() => {
                dispatch(resetStatus());
            }, 3000); // Reset after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [status, dispatch]);

    const isListLoading = userSelected === "videos" ? videoByOownerLoading : shortByOwnerLoading;

    const LiveRegion = ({ message }) => {
        return (
            <div
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {message}
            </div>
        );
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpdateVideo(file);
            const videoURL = URL.createObjectURL(file);
            setVideoPreview(videoURL);
        }
    };

    const handleAddContent = () => {
        setaddNewStatus(!addNewStatus);
    }

    const handleEdit = (id, content) => {
        if (editStatus[id] === true) {
            setEditStatus((prev) => ({ ...prev, [id]: false }));
        }
        setEditStatus((prev) => ({ ...prev, [id]: true }));

        setTimeout(() => firstInputRef.current?.focus(), 0);

        setUpdateData(prev => ({
            ...prev,
            [id]: {
                title: content?.title,
                description: content?.description,
                isPublished: content?.isPublished,
            }
        }));
    }

    const handleCancel = (id) => {
        setEditStatus((prev) => ({ ...prev, [id]: !editStatus[id] }));

        setUpdateData(prev => ({
            ...prev,
            [id]: {
                title: "",
                description: "",
                isPublished: false,
            }
        }));
    }



    const handleDelete = async (id) => {

        if (!id) {
            console.error('No content ID provided');
            return;
        }

        try {

            if (userSelected === "videos") {
                console.log('🗑 Calling fetchVideoDelete with:', id);
                const result = await dispatch(fetchVideoDelete(id)).unwrap();
                console.log('🗑 fetchVideoDelete result:', result);

                await dispatch(fetchVideoByOwner(user?._id));
                console.log('🗑 After re-fetch videos:', videoByOwner);
            } else {
                console.log('🗑 Calling fetchShortDelete with:', id);
                const result = await dispatch(fetchShortDelete(id)).unwrap();
                console.log('🗑 fetchShortDelete result:', result);

                await dispatch(fetchShortByOwner(user?._id));
                console.log('🗑 After re-fetch shorts:', shortByOwner);
            }

            // Clean up any related state
            setEditStatus(prev => {
                const newStatus = { ...prev };
                delete newStatus[id];
                return newStatus;
            });

            setUpdateData(prev => {
                const newData = { ...prev };
                delete newData[id];
                return newData;
            });
        } catch (err) {
            console.error(err.message)
        }
    }

    const handleSave = async (id) => {
        try {
            if (userSelected === "videos") {
                await dispatch(fetchUpdateVideo({ id, formData: updateData[id], newThumbnail: updateImage })).unwrap();
                await dispatch(fetchVideoByOwner(user?._id));
            } else {
                await dispatch(fetchUpdateShort({ id, formData: updateData[id] })).unwrap();
                await dispatch(fetchShortByOwner(user?._id));
            }

            if (status === "succeeded" || status === "failed") setEditStatus(prev => ({ ...prev, [id]: false }));
        } catch (err) {
            console.error(err.message)
        }
    }

    const handleImageChange = (event) => {

        const file = event.target.files[0];

        if (!file) return;

        const imagePreview = URL.createObjectURL(file);

        setImagePreview(imagePreview);

        setUpdateImage(file);
    }

    console.log(user)

    const handlepublishVideos = async (e) => {
        e.preventDefault();

        try {

            const data = new FormData();
            data.append("title", updateData[user?._id]?.title);
            data.append("description", updateData[user?._id]?.description);
            data.append("isPublished", updateData[user?._id]?.isPublished );

            console.log(data.isPublished,typeof(data.isPublished))

            let uploadResult;

            if (userSelected === "videos") {
                if (updateVideo) data.append("videoFile", updateVideo);
                if (updateImage) data.append("thumbnail", updateImage);
                uploadResult = await dispatch(uploadVideo(data)).unwrap();
                await dispatch(fetchVideoByOwner(user?._id));
            } else {
                if (updateVideo) data.append("shortFile", updateVideo);
                uploadResult = await dispatch(uploadShort(data)).unwrap();
                await dispatch(fetchShortByOwner(user?._id));
            }

            console.log('Upload completed:', uploadResult);

            setaddNewStatus(false);
            setUpdateVideo(null);
            setVideoPreview(null);
            setUpdateImage(null);
            setImagePreview(null);

            setUpdateData(prev => {
                const newData = { ...prev };
                delete newData[user?._id];
                return newData;
            });

        } catch (err) {
            console.log(err.message)
        } finally {
            dispatch(resetStatus());
        }
    };

    useEffect(() => {
        if (user?._id) {
            if (userSelected === "videos") {
                dispatch(fetchVideoByOwner(user?._id));
            } else {
                dispatch(fetchShortByOwner(user?._id));
            }
        }
    }, [userSelected, user, dispatch]);

    return (
        <div>
            <LiveRegion message={getStatusMessage()} />
            <div className="h-[calc(100vh-65px)] max-md:h-[calc(100vh-53px)]  scrollBar overflow-y-scroll text-gray-800">
                {/* Top container which has title and add new button */}
                <div className="max-md:w-screen max-w-7xl max-xl:w-full max-md:px-2 py-3 px-6 max-lg:px-3">
                    <div className="flex justify-baseline items-center">
                        <h2 className="text-2xl max-md:text-lg font-bold">Manage Content</h2>
                    </div>
                </div>

                {/* Shows list of content categories */}
                <ul className=" flex items-center justify-between  max-xl:w-full max-sm:px-2 max-w-7xl  mb-3 max-lg:px-3 max-md:w-screen max-md:px-2 py-3 px-6">
                    <div className='flex space-x-3 font-semibold max-sm:text-sm text-2xl'>
                        <li
                            className={`${userSelected === "videos" ? "border-b-2 border-black/60" : ""} py-2 mb-1 cursor-pointer`}
                            onClick={() => setUserSelected("videos")}
                        >
                            Videos
                        </li>
                        <li
                            className={`${userSelected === "shorts" ? "border-b-2 border-black/60" : ""} py-2 mb-1 cursor-pointer`}
                            onClick={() => setUserSelected("shorts")}
                        >
                            Shorts
                        </li>
                    </div>

                    <button
                        onClick={handleAddContent}
                        className="px-4 py-2 max-sm:px-2 max-sm:py-1 bg-green-600 hover:bg-green-700 text-white max-sm:text-sm rounded transition flex items-center space-x-2"
                    >
                        <span>Add New {userSelected === "videos" ? "Video" : "Short"}</span>
                    </button>
                </ul>

                {status === "loading" && (
                    <div className="flex items-center justify-between  max-xl:w-full max-sm:px-2 max-w-7xl  mb-3 max-lg:px-3 max-md:w-screen max-md:px-2 py-3 px-6">
                        <ProgressBar value={progress} label="Uploading content" />
                        <p className="text-sm text-gray-600 mt-2">Please wait...</p>
                    </div>
                )}

                {status === "succeeded" && (
                    <div className="flex items-center justify-between  max-xl:w-full max-sm:px-2 max-w-7xl  mb-3 max-lg:px-3 max-md:w-screen max-md:px-2 py-3 px-6">
                        ✅ Upload completed successfully!
                    </div>
                )}

                {status === "failed" && (
                    <div className="flex items-center justify-between  max-xl:w-full max-sm:px-2 max-w-7xl  mb-3 max-lg:px-3 max-md:w-screen max-md:px-2 py-3 px-6">
                        ❌ Upload failed: {error}
                    </div>
                )}

                {status === "loading" && (
                    <div className="flex items-center justify-between  max-xl:w-full max-sm:px-2 max-w-7xl  mb-3 max-lg:px-3 max-md:w-screen max-md:px-2 py-3 px-6">
                        <ProgressBar value={progress} label="Uploading" />
                    </div>
                )}

                {/* Mobile Card Layout */}
                <div className="block sm:hidden w-full space-y-2">
                    <div
                        className={`${userSelected === "videos" ? "space-y-2" : ""} ${addNewStatus ? "" : "hidden"} flex flex-col bg-white rounded-lg shadow p-4 border mx-2 space-x-2`}
                    >
                        <div className={`${userSelected === "videos" ? "flex-col" : ""} flex space-x-2 space-y-2 max-sm:text-sm`}>
                            <div className={`w-fit flex space-x-2`}>
                                <div className="min-w-24 h-14 flex items-center justify-center border border-gray-300 rounded relative focus-within:ring-2 focus-within:ring-blue-300">

                                    <label
                                        htmlFor="5"
                                        className="w-fit h-fit border border-gray-300 rounded-md text-gray-700 flex items-center justify-center cursor-pointer relative"
                                    >
                                        {/* Close Button */}
                                        {videoPreview && (
                                            <button
                                                type="button"
                                                onClick={() => setVideoPreview(null)}
                                                disabled={status === "loading"}
                                                className="absolute top-0 right-0 z-10 cursor-pointer rounded-lg p-0.5 hover:bg-gray-100 active:bg-gray-200"
                                            >
                                                <X size={15} />
                                            </button>
                                        )}

                                        {/* Upload Icon / Video */}
                                        {!videoPreview && <Upload />}
                                        {videoPreview && (
                                            <video src={videoPreview} className="max-h-14 rounded-md" />
                                        )}
                                    </label>

                                    {/* File Input */}
                                    <input
                                        type="file"
                                        ref={firstInputRef}
                                        accept="video/*"
                                        id="5"
                                        disabled={status === "loading"}
                                        name={userSelected === "videos" ? "videoFile" : "shortFile"}
                                        onChange={handleVideoChange}
                                        className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} hidden`}
                                    />
                                </div>
                                <div
                                    style={
                                        imagePreview
                                            ? {
                                                backgroundImage: `url(${imagePreview})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center"
                                            }
                                            : {}
                                    }
                                    className={`${userSelected === "shorts" ? "hidden" : ""} min-w-24 h-14 flex items-center justify-center border border-gray-300 rounded relative focus-within:ring-2 focus-within:ring-blue-300`}
                                >
                                    <label
                                        htmlFor="6"
                                        className="relative w-full h-full border border-gray-300 rounded-md text-gray-700 flex items-center justify-center cursor-pointer"
                                    >
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={() => setImagePreview(null)}
                                                disabled={status === "loading"}
                                                className="absolute top-0 right-0 z-10 rounded-lg p-1 hover:bg-gray-100 active:bg-gray-200"
                                                aria-label="Remove selected image"
                                            >
                                                <X size={15} />
                                            </button>
                                        )}

                                        {!imagePreview && <Upload />}
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="6"
                                        disabled={status === "loading"}
                                        ref={firstInputRef}
                                        name="newThumbnail"
                                        onChange={handleImageChange}
                                        className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} sr-only`}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className={``}>
                                    <input type="text" ref={firstInputRef} disabled={status === "loading"} value={updateData[user?._id]?.title ?? ""} onChange={(e) => setUpdateData((prev) => ({
                                        ...prev,
                                        [user?._id]: {
                                            ...prev[user?._id],
                                            title: e.target.value
                                        }
                                    }))} placeholder='Add a title...' className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 max-sm:text-xs w-full">
                            <div>
                                <div className={``}>
                                    <input type="text" ref={firstInputRef} disabled={status === "loading"} value={updateData[user?._id]?.description ?? ""} placeholder='Add a descriptions..' onChange={(e) => setUpdateData(prev => ({
                                        ...prev,
                                        [user?._id]: {
                                            ...prev[user?._id],
                                            description: e.target.value
                                        }
                                    }))} className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className={`flex space-x-2`}>
                                        <label htmlFor="7">Published:</label>
                                        <input type="checkbox" id='7' ref={firstInputRef} disabled={status === "loading"} value={updateData[user?._id]?.isPublished ?? false} onChange={(e) => setUpdateData(prev => ({
                                            ...prev,
                                            [user?._id]: {
                                                ...prev[user?._id],
                                                isPublished: e.target.checked
                                            }
                                        }))} className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} />
                                    </div>
                                </div>

                                <div className="flex space-x-2">

                                    <button
                                        onClick={(e) => handlepublishVideos(e)}
                                        className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white transition`}
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => setaddNewStatus(false)}
                                        className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} px-3 py-1 rounded bg-gray-400 hover:bg-gray-500 text-white transition`}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {status === "loading" && typeof progress === "number" && (
                            <div className="mt-2 z-17">
                                <ProgressBar value={Math.max(0, Math.min(100, Number.isFinite(progress)))} label="Uploading" />
                            </div>
                        )}
                    </div>
                    {(userSelected === "videos" ? videoByOwner.length : shortByOwner.length) === 0 && !addNewStatus && (
                        <div className="text-center py-16 px-6">
                                    <div className="max-w-lg mx-auto">
                                      {/* Upload illustration */}
                                      <div className="mb-8 relative">
                                        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                          <Video className="w-16 h-16 text-blue-500" />
                                        </div>
                                        {/* Floating upload icons */}
                                        <div className="absolute top-4 right-8 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center animate-bounce">
                                          <Upload className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="absolute bottom-6 left-6 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center animate-pulse">
                                          <Plus
                                            className="w-4 h-4 text-white" />
                                        </div>
                                      </div>
                        
                                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                        Share your story with the world
                                      </h3>
                                      <p className="text-gray-600 mb-8 leading-relaxed">
                                    Upload your first {userSelected === "videos" ? "video" : "short"} to start building your channel. Whether it's a tutorial, vlog, or creative content - every journey starts with one {userSelected === "videos" ? "video" : "short"}.
                                      </p>
                        
                                      <div className="space-y-4 mb-8">
                                        <button onClick={handleAddContent} className="w-full mx-auto sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold">
                                          <Upload className="w-6 h-6" />
                                        <span>Upload Your First {userSelected === "videos" ? "video" : "short"}</span>
                                        </button>
                        
                                        {/* <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2">
                                          <Camera className="w-5 h-5" />
                                          <span>Record New Video</span>
                                        </button> */}
                                      </div>
                        
                                      {/* Upload tips */}
                                      <div className="bg-blue-50 rounded-xl p-6 text-center">
                                        <h4 className="font-semibold text-blue-900 mb-4">Tips for your first upload:</h4>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                                          <div className="text-left">
                                            <div className="flex items-center space-x-2 mb-2">
                                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                              <span className="font-medium">Choose a catchy title</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                              <span className="font-medium">Add a clear thumbnail</span>
                                            </div>
                                          </div>
                                          <div className="text-left">
                                            <div className="flex items-center space-x-2 mb-2">
                                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                              <span className="font-medium">Write a good description</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                              <span className="font-medium">Use relevant tags</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                    )}
                    {isListLoading ? (<>

                        <MobileContentManagerCardList />
                        <MobileContentManagerCardList />
                        <MobileContentManagerCardList />
                        <MobileContentManagerCardList />
                        <MobileContentManagerCardList />
                        <MobileContentManagerCardList />
                    </>) : (<>
                       

                        {(userSelected === "videos" ? videoByOwner : shortByOwner).map((content) => (
                            <div
                                key={content._id}
                                className={`flex flex-col bg-white rounded-lg shadow p-4 border mx-2 space-x-2`}
                            >
                                <div className={` flex space-x-2 space-y-2 max-sm:text-sm`}>
                                    <div className={`w-fit flex space-x-2`}>
                                        {editStatus[content?._id] ? (
                                            <video
                                                src={userSelected === "videos" ? content?.videoFile : content?.shortFile}
                                                loading="lazy"
                                                className={`${editStatus[content?._id] ? "hidden" : ""} w-24 h-14 rounded object-cover`}
                                            >
                                            </video>
                                        ) : (
                                            <img
                                                src={content?.thumbnail}
                                                alt={`${content?.title} thumbnail`}
                                                loading="lazy"
                                                className={`${editStatus[content?._id] ? "hidden" : ""} ${userSelected === "shorts" ? "hidden" : ""} w-24 h-14 rounded object-cover`}
                                            />
                                        )}

                                        <div className={`${editStatus[content?._id] ? "" : "hidden"} min-w-24  h-14 flex items-center justify-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`}>
                                            <label id={content._id} className='w-full h-full   border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-center'><Upload /></label>
                                            <input type="file" accept="video/*" name={userSelected === "videos" ? content?.videoFile : content?.shortFile} id={content?._id} onChange={(e) => handleVideoChange(e)} className='appearance-none hidden' />
                                        </div>
                                        {/* <div className={`${editStatus[content._id] ? "" : "hidden"} ${userSelected === "shorts" ? "hidden" : ""} min-w-24  h-14 flex items-center justify-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`}>
                                        <label id={content._id} className='w-full h-full   border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-center'><Upload /></label>
                                        <input type="file" name={ userSelected === "videos" ? content.videoFile : content.shortFile} id={content._id} className='appearance-none hidden' />
                                    </div> */}

                                        <div className="hidden w-24 h-14 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                            No Image
                                        </div>
                                    </div>

                                    <div>
                                        {/* <label className="text-sm font-semibold text-gray-600">Title:</label> */}
                                        <p className={`${editStatus[content?._id] ? "hidden" : ""}`}>{content?.title}</p>
                                        <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                            <input type="text" value={updateData[content?._id]?.title ?? ""} onChange={(e) => setUpdateData((prev) => ({
                                                ...prev,
                                                [content._id]: {
                                                    ...prev[content?._id],
                                                    title: e.target.value
                                                }
                                            }))} className={`w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} placeholder={content.title} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 max-sm:text-xs w-full">

                                    <div>
                                        {/* <label className="text-sm font-semibold text-gray-600">Description:</label> */}
                                        <p className={`${editStatus[content?._id] ? "hidden" : ""}`}>{content?.description}</p>
                                        <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                            <input type="text" value={updateData[content?._id]?.description ?? ""} onChange={(e) => setUpdateData(prev => ({
                                                ...prev,
                                                [content._id]: {
                                                    ...prev[content?._id],
                                                    description: e.target.value
                                                }
                                            }))} className={`w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} placeholder={content?.description} />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <label className="text-sm font-semibold text-gray-600">Published:</label>
                                            <span className={`${editStatus[content?._id] ? "hidden" : ""} font-semibold ${content?.isPublished ? "text-green-600" : "text-red-600"}`}>
                                                {content.isPublished ? "Yes" : "No"}
                                            </span>
                                            <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                                <input type="checkbox" value={updateData[content?._id]?.isPublished ?? false} defaultChecked={content?.isPublished} onChange={(e) => setUpdateData(prev => ({
                                                    ...prev,
                                                    [content._id]: {
                                                        ...prev[content?._id],
                                                        isPublished: e.target.checked
                                                    }
                                                }))} className={`w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} />
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <>
                                                <button
                                                    onClick={() => handleSave(content?._id)}
                                                    className={`${editStatus[content?._id] ? "" : "hidden"} px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white transition`}
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(content?._id)}
                                                    className={`${editStatus[content?._id] ? "" : "hidden"} px-3 py-1 rounded bg-gray-400 hover:bg-gray-500 text-white transition`}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                            <>
                                                <button
                                                    onClick={() => handleEdit(content?._id, content)}
                                                    className={`${editStatus[content?._id] ? "hidden" : ""} px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white transition`}
                                                >
                                                    <FilePenLine size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(content?._id)}
                                                    className={`${editStatus[content?._id] ? "hidden" : ""} px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition`}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>)}
                </div>

                {/* for higher resolutions */}
                <div className="sm:flex max-md:w-screen max-sm:hidden max-w-7xl max-md:px-2 max-lg:text-sm max-xl:w-full py-3 px-6 max-lg:px-3">
                    <table className="min-w-full table-auto bg-white rounded shadow">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="p-2 text-left">{userSelected === "shorts" ? "Shorts" : "Video"} File</th>
                                <th className={`${userSelected === "shorts" ? "hidden" : ""} p-2 text-left`}>Thumbnail</th>
                                <th className="p-2 text-left">Title</th>
                                <th className="p-2 text-left">Description</th>
                                <th className="p-2 text-center">Published</th>
                                <th className="p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className='text-xl max-lg:text-lg z-30'>
                            {isListLoading ? (<>
                                <DesktopCardList showThumbnail={userSelected === "shorts" ? "hidden" : ""} />
                            </>) : (<>

                                <tr
                                    className={`${addNewStatus ? "" : "hidden"} border-b transition-colorsbg-blue-50 ring-2 ring-blue-200`}
                                >
                                    <td className="p-2 w-28">
                                        <div className="min-w-24 h-14 flex items-center justify-center border border-gray-300 rounded relative focus-within:ring-2 focus-within:ring-blue-300">

                                            <label
                                                htmlFor="5"
                                                className="w-fit h-fit border border-gray-300 rounded-md text-gray-700 flex items-center justify-center cursor-pointer relative"
                                            >
                                                {/* Close Button */}
                                                {videoPreview && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setVideoPreview(null)}
                                                        disabled={status === "loading"}
                                                        className="absolute top-0 right-0 z-10 cursor-pointer rounded-lg p-0.5 hover:bg-gray-100 active:bg-gray-200"
                                                    >
                                                        <X size={15} />
                                                    </button>
                                                )}

                                                {/* Upload Icon / Video */}
                                                {!videoPreview && <Upload />}
                                                {videoPreview && (
                                                    <video src={videoPreview} className="max-h-14 rounded-md" />
                                                )}
                                            </label>

                                            {/* File Input */}
                                            <input
                                                type="file"
                                                accept="video/*"
                                                ref={firstInputRef}
                                                id="5"
                                                disabled={status === "loading"}
                                                name={userSelected === "videos" ? "videoFile" : "shortFile"}
                                                onChange={handleVideoChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </td>
                                    <td className={`${userSelected === "shorts" ? "hidden" : ""} p-2 w-28`}
                                    >
                                        <div
                                            style={
                                                imagePreview
                                                    ? {
                                                        backgroundImage: `url(${imagePreview})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center"
                                                    }
                                                    : {}
                                            }
                                            className="min-w-24 h-14 flex items-center justify-center border border-gray-300 rounded relative focus-within:ring-2 focus-within:ring-blue-300"
                                        >
                                            <label
                                                htmlFor="1"
                                                className="relative w-full h-full border border-gray-300 rounded-md text-gray-700 flex items-center justify-center cursor-pointer"
                                            >
                                                {imagePreview && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setImagePreview(null)}
                                                        disabled={status === "loading"}
                                                        className="absolute top-0 right-0 z-10 rounded-lg p-0.5 hover:bg-gray-100 active:bg-gray-200"
                                                        aria-label="Remove selected image"
                                                    >
                                                        <X size={15} />
                                                    </button>
                                                )}

                                                {!imagePreview && <Upload />}
                                            </label>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="1"
                                                ref={firstInputRef}
                                                disabled={status === "loading"}
                                                name="newThumbnail"
                                                onChange={handleImageChange}
                                                className="sr-only"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className={``}>
                                            <input type="text" ref={firstInputRef} name='title' disabled={status === "loading"} placeholder='Add a title' value={updateData[user?._id]?.title} onChange={(e) => setUpdateData(prev => ({
                                                ...prev,
                                                [user?._id]: {
                                                    ...prev[user?._id],
                                                    title: e.target.value
                                                }
                                            }))} className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} />
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className={``}>
                                            <input type="text" ref={firstInputRef} name='description' disabled={status === "loading"} placeholder='Add a descriptions' value={updateData[user._id]?.description} onChange={(e) => setUpdateData(prev => ({
                                                ...prev,
                                                [user?.data?.user?._id]: {
                                                    ...prev[user?._id],
                                                    description: e.target.value
                                                }
                                            }))} className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} w-full p-1 border text-sm border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} />
                                        </div>
                                    </td>
                                    <td className="p-2 text-center max-w-28">
                                        <div className={``}>
                                            <input type="checkbox" ref={firstInputRef} disabled={status === "loading"} name='isPublished' value={updateData[user?._id]?.isPublished || false} onChange={(e) => setUpdateData(prev => ({
                                                ...prev,
                                                [user?._id]: {
                                                    ...prev[user?._id],
                                                    isPublished: e.target.checked
                                                }
                                            }))} className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} />
                                        </div>
                                    </td>
                                    <td className="p-2 text-center space-x-2 sm:w-28">

                                        <button
                                            onClick={(e) => handlepublishVideos(e)}
                                            className={`${status === "loading" ? " opacity-60 cursor-not-allowed" : ""} p-2 bg-green-100 hover:bg-green-200 rounded transition`}
                                            disabled={status === "loading"}
                                            title="Save"
                                        >
                                            <Check size={16} className="text-green-600" />
                                        </button>
                                        <button
                                            onClick={() => setaddNewStatus(false)}
                                            disabled={status === "loading"}
                                            className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} p-2 bg-gray-100 hover:bg-gray-200 rounded transition`}
                                            title="Cancel"
                                        >
                                            <X size={16} className="text-gray-600" />
                                        </button>
                                    </td>
                                    {status === "loading" && typeof progress === "number" && (
                                        <div className="mt-2 z-17">
                                            <ProgressBar value={Math.max(0, Math.min(100, Number.isFinite(progress)))} label="Uploading" />
                                        </div>
                                    )}
                                </tr>
                            {(userSelected === "videos" ? videoByOwner : shortByOwner).length == 0 && !addNewStatus && (
                                <tr>
                                    <td colSpan={'6'} className=" text-center p-6 text-gray-500 italic">
                                        <div className="text-center py-16 px-6">
                                            <div className="max-w-lg mx-auto">
                                                {/* Upload illustration */}
                                                <div className="mb-8 relative">
                                                    <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                                        <Video className="w-16 h-16 text-blue-500" />
                                                    </div>
                                                    {/* Floating upload icons */}
                                                    <div className="absolute top-4 right-8 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center animate-bounce">
                                                        <Upload className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="absolute bottom-6 left-6 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center animate-pulse">
                                                        <Plus
                                                            className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>

                                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                                    Share your story with the world
                                                </h3>
                                                <p className="text-gray-600 mb-8 leading-relaxed">
                                                            Upload your first {userSelected === "videos" ? "video" : "short"} to start building your channel. Whether it's a tutorial, vlog, or creative content - every journey starts with one {userSelected === "videos" ? "video" : "short"}.
                                                </p>

                                                <div className="space-y-4 mb-8">
                                                    <button onClick={handleAddContent} className="w-full mx-auto sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold">
                                                        <Upload className="w-6 h-6" />
                                                                <span>Upload Your First {userSelected === "videos" ? "video" : "short"}</span>
                                                    </button>

                                                    {/* <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2">
                                                         <Camera className="w-5 h-5" />
                                                         <span>Record New Video</span>
                                                    </button> */}
                                                </div>

                                                {/* Upload tips */}
                                                <div className="bg-blue-50 rounded-xl p-6 text-center">
                                                    <h4 className="font-semibold text-blue-900 mb-4">Tips for your first upload:</h4>
                                                    <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                                                        <div className="text-left">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                                <span className="font-medium">Choose a catchy title</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                                <span className="font-medium">Add a clear thumbnail</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                                <span className="font-medium">Write a good description</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                                 <span className="font-medium">Use relevant tags</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            

                                {(userSelected === "videos" ? videoByOwner : shortByOwner).map((content) => (
                                    <tr
                                        key={content._id}
                                        className={`border-b transition-colors ${editStatus[content._id]
                                            ? 'bg-blue-50 ring-2 ring-blue-200'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <td className="p-2 w-28">

                                            <div className={`${editStatus[content?._id] ? "" : "hidden"} min-w-24  h-14 flex items-center justify-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`}>
                                                <label htmlFor="3" className='w-full h-full   border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-center'><Upload /></label>
                                                <input type="file" accept="video/*" id='3' name={userSelected === "videos" ? content?.videoFile : content?.shortFile} onChange={(e) => handleVideoChange(e)} className='appearance-none hidden' />
                                            </div>

                                            <video
                                                src={userSelected === "videos" ? content?.videoFile : content?.shortFile}
                                                loading="lazy"
                                                className={`${editStatus[content?._id] ? "hidden" : ""} w-24 h-14 rounded object-cover`}
                                            ></video>

                                            <span className="hidden text-gray-400 italic">No Image</span>

                                            <span className="hidden font-mono text-sm">{ }</span>

                                        </td>
                                        <td className={`${userSelected === "shorts" ? "hidden" : ""} ${imagePreview ? `bg-[${imagePreview}] z-16` : ""}  p-2 w-28`}>

                                            <div className={`${editStatus[content._id] ? "" : "hidden"} min-w-24  h-14 flex items-center justify-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`}>
                                                <label htmlFor="1" className='w-full h-full   border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-center'><Upload /></label>
                                                <input type="file" accept="image/*" id='1' name="newThumbnail" onChange={(e) => handleImageChange(e)} className='appearance-none hidden' />
                                            </div>

                                            <img
                                                src={content?.thumbnail}
                                                loading="lazy"
                                                alt={`${content?.title} thumbnail`}
                                                className={`${editStatus[content?._id] ? "hidden" : ""} w-24 h-14 rounded object-cover`}
                                            />

                                            <span className="hidden text-gray-400 italic">No Image</span>

                                        </td>
                                        <td className="p-2">


                                            <span className={`${editStatus[content?._id] ? "hidden" : ""} max-lg:line-clamp-2 max-lg:text-sm line-clamp-1`}>{content.title}</span>
                                            <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                                <input type="text" name={content?.title} value={updateData[content?._id]?.title ?? ""} onChange={(e) => setUpdateData(prev => ({
                                                    ...prev,
                                                    [content._id]: {
                                                        ...prev[content?._id],
                                                        title: e.target.value
                                                    }
                                                }))} className={`w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} placeholder={content.title} />
                                            </div>

                                        </td>
                                        <td className="p-2">
                                            <span className={`${editStatus[content?._id] ? "hidden" : ""} line-clamp-1 max-lg:text-sm max-lg:line-clamp-2 overflow-hidden`}>{content.description}</span>
                                            <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                                <input type="text" name={content?.description} value={updateData[content?._id]?.description ?? ""} onChange={(e) => setUpdateData(prev => ({
                                                    ...prev,
                                                    [content?._id]: {
                                                        ...prev[content?._id],
                                                        description: e.target.value
                                                    }
                                                }))} className={`w-full p-1 border text-sm border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} placeholder={content.description} />
                                            </div>

                                        </td>
                                        <td className="p-2 text-center w-28">
                                            <div className={`${editStatus[content?._id] ? "hidden" : ""}`}>
                                                {content?.isPublished ? (
                                                    <span className=" bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                        Yes
                                                    </span>
                                                ) : (
                                                    <span className=" bg-red-200 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                        No
                                                    </span>
                                                )}
                                            </div>

                                            <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                                <input type="checkbox" value={updateData[content?._id]?.isPublished ?? false} defaultChecked={content?.isPublished} onChange={(e) => setUpdateData(prev => ({
                                                    ...prev,
                                                    [content._id]: {
                                                        ...prev[content?._id],
                                                        isPublished: e.target.checked
                                                    }
                                                }))} className={` p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300`} />
                                            </div>

                                        </td>
                                        <td className="p-2 text-center space-x-2 sm:w-28">
                                            {editStatus[content?._id] ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(content?._id)}
                                                        className="p-2 bg-green-100 hover:bg-green-200 rounded transition"
                                                        title="Save"
                                                    >
                                                        <Check size={16} className="text-green-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(content?._id)}
                                                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                                                        title="Cancel"
                                                    >
                                                        <X size={16} className="text-gray-600" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(content?._id, content)}
                                                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                                                        title="Edit"
                                                    >
                                                        <FilePenLine size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(content?._id)}
                                                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                                                        title="Delete"
                                                    >
                                                        <X size={16} className="text-red-500" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </>)}
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    )
};

export default ContentManager;