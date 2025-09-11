import React, { useState, useEffect } from 'react';
import { FilePenLine, X, Check, Upload, Video, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpdateVideo, fetchVideoByOwner, fetchVideoDelete } from '../redux/features/videos';
import { fetchShortByOwner, fetchShortDelete, fetchUpdateShort } from '../redux/features/shorts';
import { uploadShort, uploadVideo, resetStatus } from '../redux/features/uploads';
import MobileContentManagerCardList from '../components/LoadingScreen/MobileContentManagerCardList';
import DesktopCardList from '../components/LoadingScreen/DesktopCardList';
import { useRef } from 'react';
// import { useAppearance } from '../hooks/appearances';

const ContentManager = () => {
    // const { appearanceSettings } = useAppearance();

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
                <div
                    className="flex items-center justify-between text-xs mb-1"
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)'
                    }}
                >
                    <span>{label}</span>
                    <span aria-live="polite">{safeValue}%</span>
                </div>
                <div
                    className="w-full h-2 rounded overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={safeValue}
                    aria-label={label}
                    style={{
                        backgroundColor: 'var(--color-border)',
                        opacity: '0.6'
                    }}
                >
                    <div
                        className="h-full transition-[width] duration-200 ease-out"
                        style={{
                            width: `${safeValue}%`,
                            backgroundColor: 'var(--accent-color)',
                            opacity: '0.7'
                        }}
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
                return setTimeout(() => { return "Upload completed successfully" }, 2000);
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
            }, 3000);

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

    // All your existing handler functions remain the same...
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
                await dispatch(fetchVideoDelete(id)).unwrap();
                await dispatch(fetchVideoByOwner(user?._id));
            } else {
                await dispatch(fetchShortDelete(id)).unwrap();
                await dispatch(fetchShortByOwner(user?._id));
            }

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

    const handlepublishVideos = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("title", updateData[user?._id]?.title);
            data.append("description", updateData[user?._id]?.description);
            data.append("isPublished", updateData[user?._id]?.isPublished);

            if (userSelected === "videos") {
                if (updateVideo) data.append("videoFile", updateVideo);
                if (updateImage) data.append("thumbnail", updateImage);
                await dispatch(uploadVideo(data)).unwrap();
                await dispatch(fetchVideoByOwner(user?._id));
            } else {
                if (updateVideo) data.append("shortFile", updateVideo);
                await dispatch(uploadShort(data)).unwrap();
                await dispatch(fetchShortByOwner(user?._id));
            }

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
        <div
            className="transition-all"
            style={{
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family)',
                transitionDuration: 'var(--animation-duration)'
            }}
        >
            <LiveRegion message={getStatusMessage()} />
            <div
                className="h-[calc(100vh-65px)] max-md:h-[calc(100vh-53px)] scrollBar overflow-y-scroll transition-all"
                style={{
                    color: 'var(--color-text-primary)',
                    transitionDuration: 'var(--animation-duration)'
                }}
            >
                {/* Top container which has title and add new button */}
                <div
                    className="max-md:w-screen max-w-7xl max-xl:w-full max-md:px-2 py-3 px-6 max-lg:px-3"
                    style={{ padding: 'var(--component-padding)' }}
                >
                    <div className="flex justify-baseline items-center">
                        <h2
                            className="text-2xl max-md:text-lg font-bold"
                            style={{
                                color: 'var(--color-text-primary)',
                                fontSize: 'var(--font-size-2xl)',
                                fontFamily: 'var(--font-family)'
                            }}
                        >
                            Manage Content
                        </h2>
                    </div>
                </div>

                {/* Shows list of content categories */}
                <ul
                    className="flex items-center justify-between max-xl:w-full max-sm:px-2 max-w-7xl mb-3 max-lg:px-3 max-md:w-screen max-md:px-2 py-3 px-6"
                    style={{ padding: 'var(--component-padding)' }}
                >
                    <div className='flex space-x-3 font-semibold max-sm:text-sm text-2xl'>
                        <li
                            className={`${userSelected === "videos" ? "border-b-2" : ""} py-2 mb-1 cursor-pointer transition-all`}
                            onClick={() => setUserSelected("videos")}
                            style={{
                                borderColor: userSelected === "videos" ? 'var(--accent-color)' : 'transparent',
                                color: userSelected === "videos" ? 'var(--accent-color)' : 'var(--color-text-primary)',
                                fontSize: 'var(--font-size-2xl)',
                                transitionDuration: 'var(--animation-duration)'
                            }}
                        >
                            Videos
                        </li>
                        <li
                            className={`${userSelected === "shorts" ? "border-b-2" : ""} py-2 mb-1 cursor-pointer transition-all`}
                            onClick={() => setUserSelected("shorts")}
                            style={{
                                borderColor: userSelected === "shorts" ? 'var(--accent-color)' : 'transparent',
                                color: userSelected === "shorts" ? 'var(--accent-color)' : 'var(--color-text-primary)',
                                fontSize: 'var(--font-size-2xl)',
                                transitionDuration: 'var(--animation-duration)'
                            }}
                        >
                            Shorts
                        </li>
                    </div>

                    <button
                        onClick={handleAddContent}
                        className="px-4 py-2 max-sm:px-2 max-sm:py-1 text-white max-sm:text-sm rounded transition-all flex items-center space-x-2"
                        style={{
                            backgroundColor: 'var(--color-success)',
                            fontSize: 'var(--font-size-sm)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.opacity = '0.9';
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.opacity = '1';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        <span>Add New {userSelected === "videos" ? "Video" : "Short"}</span>
                    </button>
                </ul>

                {/* Upload Status Messages */}
                {status === "loading" && (
                    <div
                        className="flex items-center justify-between max-xl:w-full max-sm:px-2 max-w-7xl mb-3 max-lg:px-3 max-md:w-screen max-md:px-2 py-3 px-6 transition-all"
                        style={{
                            backgroundColor: 'var(--color-accent-bg)',
                            borderLeft: '4px solid var(--accent-color)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                    >
                        <ProgressBar value={progress} label="Uploading content" />
                        <p
                            className="text-sm mt-2"
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-sm)'
                            }}
                        >
                            Please wait...
                        </p>
                    </div>
                )}

                {status === "succeeded" && (
                    <div
                        className="flex items-center justify-between max-xl:w-full max-sm:px-2 max-w-7xl mb-3 max-lg:px-3 max-md:w-screen max-md:px-2 py-3 px-6 transition-all"
                        style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderLeft: '4px solid var(--color-success)',
                            color: 'var(--color-success)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                    >
                        ✅ Upload completed successfully!
                    </div>
                )}

                {status === "failed" && (
                    <div
                        className="flex items-center justify-between max-xl:w-full max-sm:px-2 max-w-7xl mb-3 max-lg:px-3 max-md:w-screen max-md:px-2 py-3 px-6 transition-all"
                        style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderLeft: '4px solid var(--color-error)',
                            color: 'var(--color-error)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                    >
                        ❌ Upload failed: {error}
                    </div>
                )}

                {/* Mobile Card Layout */}
                <div className="block sm:hidden w-full space-y-2">
                    {/* Add New Content Form - Mobile */}
                    <div
                        className={`${userSelected === "videos" ? "space-y-2" : ""} ${addNewStatus ? "" : "hidden"} flex flex-col rounded-lg shadow p-4 border mx-2 space-x-2 transition-all`}
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            borderColor: 'var(--color-border)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                    >
                        <div className={`${userSelected === "videos" ? "flex-col" : ""} flex space-x-2 space-y-2 max-sm:text-sm`}>
                            <div className={`w-fit flex space-x-2`}>
                                {/* Video Upload Area */}
                                <div
                                    className="min-w-24 h-14 flex items-center justify-center border rounded relative focus-within:ring-2 transition-all"
                                    style={{
                                        borderColor: 'var(--color-border)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent-color)';
                                        e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--color-border)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <label
                                        htmlFor="5"
                                        className="w-fit h-fit border rounded-md flex items-center justify-center cursor-pointer relative transition-all"
                                        style={{
                                            borderColor: 'var(--color-border)',
                                            color: 'var(--color-text-secondary)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    >
                                        {videoPreview && (
                                            <button
                                                type="button"
                                                onClick={() => setVideoPreview(null)}
                                                disabled={status === "loading"}
                                                className="absolute top-0 right-0 z-10 cursor-pointer rounded-lg p-0.5 transition-all"
                                                style={{
                                                    backgroundColor: 'var(--color-bg-secondary)',
                                                    transitionDuration: 'var(--animation-duration)'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-bg-secondary)'}
                                            >
                                                <X size={15} />
                                            </button>
                                        )}

                                        {!videoPreview && <Upload />}
                                        {videoPreview && (
                                            <video src={videoPreview} className="max-h-14 rounded-md" />
                                        )}
                                    </label>

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

                                {/* Image Upload Area (for videos only) */}
                                <div
                                    style={
                                        imagePreview
                                            ? {
                                                backgroundImage: `url(${imagePreview})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center"
                                            }
                                            : {
                                                backgroundColor: 'var(--color-bg-secondary)',
                                                borderColor: 'var(--color-border)'
                                            }
                                    }
                                    className={`${userSelected === "shorts" ? "hidden" : ""} min-w-24 h-14 flex items-center justify-center border rounded relative focus-within:ring-2 transition-all`}
                                >
                                    <label
                                        htmlFor="6"
                                        className="relative w-full h-full border rounded-md flex items-center justify-center cursor-pointer transition-all"
                                        style={{
                                            borderColor: 'var(--color-border)',
                                            color: 'var(--color-text-secondary)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    >
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={() => setImagePreview(null)}
                                                disabled={status === "loading"}
                                                className="absolute top-0 right-0 z-10 rounded-lg p-1 transition-all"
                                                aria-label="Remove selected image"
                                                style={{
                                                    backgroundColor: 'var(--color-bg-secondary)',
                                                    transitionDuration: 'var(--animation-duration)'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-bg-secondary)'}
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

                            {/* Title Input */}
                            <div>
                                <input
                                    type="text"
                                    ref={firstInputRef}
                                    disabled={status === "loading"}
                                    value={updateData[user?._id]?.title ?? ""}
                                    onChange={(e) => setUpdateData((prev) => ({
                                        ...prev,
                                        [user?._id]: {
                                            ...prev[user?._id],
                                            title: e.target.value
                                        }
                                    }))}
                                    placeholder='Add a title...'
                                    className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} w-full p-1 border rounded focus:outline-none focus:ring-2 transition-all`}
                                    style={{
                                        backgroundColor: 'var(--color-bg-primary)',
                                        borderColor: 'var(--color-border)',
                                        color: 'var(--color-text-primary)',
                                        fontFamily: 'var(--font-family)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent-color)';
                                        e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--color-border)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 max-sm:text-xs w-full">
                            {/* Description Input */}
                            <div>
                                <input
                                    type="text"
                                    ref={firstInputRef}
                                    disabled={status === "loading"}
                                    value={updateData[user?._id]?.description ?? ""}
                                    placeholder='Add a descriptions..'
                                    onChange={(e) => setUpdateData(prev => ({
                                        ...prev,
                                        [user?._id]: {
                                            ...prev[user?._id],
                                            description: e.target.value
                                        }
                                    }))}
                                    className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} w-full p-1 border rounded focus:outline-none focus:ring-2 transition-all`}
                                    style={{
                                        backgroundColor: 'var(--color-bg-primary)',
                                        borderColor: 'var(--color-border)',
                                        color: 'var(--color-text-primary)',
                                        fontFamily: 'var(--font-family)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent-color)';
                                        e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--color-border)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                {/* Published Checkbox */}
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-2">
                                        <label
                                            htmlFor="7"
                                            style={{
                                                color: 'var(--color-text-primary)',
                                                fontSize: 'var(--font-size-sm)'
                                            }}
                                        >
                                            Published:
                                        </label>
                                        <input
                                            type="checkbox"
                                            id='7'
                                            ref={firstInputRef}
                                            disabled={status === "loading"}
                                            value={updateData[user?._id]?.isPublished ?? false}
                                            onChange={(e) => setUpdateData(prev => ({
                                                ...prev,
                                                [user?._id]: {
                                                    ...prev[user?._id],
                                                    isPublished: e.target.checked
                                                }
                                            }))}
                                            className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} p-1 border rounded focus:outline-none focus:ring-2 transition-all`}
                                            style={{
                                                accentColor: 'var(--accent-color)',
                                                borderColor: 'var(--color-border)',
                                                transitionDuration: 'var(--animation-duration)'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={(e) => handlepublishVideos(e)}
                                        className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} px-3 py-1 rounded text-white transition-all`}
                                        style={{
                                            backgroundColor: 'var(--color-success)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (status !== "loading") {
                                                e.target.style.opacity = '0.9';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (status !== "loading") {
                                                e.target.style.opacity = '1';
                                            }
                                        }}
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => setaddNewStatus(false)}
                                        className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} px-3 py-1 rounded text-white transition-all`}
                                        style={{
                                            backgroundColor: 'var(--color-text-secondary)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (status !== "loading") {
                                                e.target.style.opacity = '0.9';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (status !== "loading") {
                                                e.target.style.opacity = '1';
                                            }
                                        }}
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

                    {/* Empty State for Mobile */}
                    {(userSelected === "videos" ? videoByOwner.length : shortByOwner.length) === 0 && !addNewStatus && (
                        <div
                            className="text-center py-16 px-6 transition-all"
                            style={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--spacing-unit)',
                                margin: 'var(--spacing-unit)',
                                transitionDuration: 'var(--animation-duration)'
                            }}
                        >
                            <div className="max-w-lg mx-auto">
                                {/* Upload illustration */}
                                <div className="mb-8 relative">
                                    <div
                                        className="mx-auto w-32 h-32 bg-gradient-to-br rounded-full flex items-center justify-center"
                                        style={{
                                            background: `linear-gradient(135deg, var(--color-accent-bg), var(--accent-color))`
                                        }}
                                    >
                                        <Video
                                            className="w-16 h-16"
                                            style={{ color: 'var(--accent-color)' }}
                                        />
                                    </div>
                                    {/* Floating upload icons */}
                                    <div
                                        className="absolute top-4 right-8 w-10 h-10 rounded-full flex items-center justify-center animate-bounce"
                                        style={{ backgroundColor: 'var(--color-success)' }}
                                    >
                                        <Upload className="w-5 h-5 text-white" />
                                    </div>
                                    <div
                                        className="absolute bottom-6 left-6 w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
                                        style={{ backgroundColor: 'var(--accent-color)' }}
                                    >
                                        <Plus className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <h3
                                    className="text-2xl font-bold mb-4"
                                    style={{
                                        color: 'var(--color-text-primary)',
                                        fontSize: 'var(--font-size-2xl)'
                                    }}
                                >
                                    Share your story with the world
                                </h3>
                                <p
                                    className="mb-8 leading-relaxed"
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: 'var(--font-size-base)'
                                    }}
                                >
                                    Upload your first {userSelected === "videos" ? "video" : "short"} to start building your channel. Whether it's a tutorial, vlog, or creative content - every journey starts with one {userSelected === "videos" ? "video" : "short"}.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <button
                                        onClick={handleAddContent}
                                        className="w-full mx-auto sm:w-auto text-white px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold"
                                        style={{
                                            background: `linear-gradient(135deg, var(--accent-color), var(--color-success))`,
                                            fontSize: 'var(--font-size-lg)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <Upload className="w-6 h-6" />
                                        <span>Upload Your First {userSelected === "videos" ? "video" : "short"}</span>
                                    </button>
                                </div>

                                {/* Upload tips */}
                                <div
                                    className="rounded-xl p-6 text-center transition-all"
                                    style={{
                                        backgroundColor: 'var(--color-accent-bg)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                >
                                    <h4
                                        className="font-semibold mb-4"
                                        style={{
                                            color: 'var(--accent-color)',
                                            fontSize: 'var(--font-size-base)'
                                        }}
                                    >
                                        Tips for your first upload:
                                    </h4>
                                    <div
                                        className="grid md:grid-cols-2 gap-4 text-sm"
                                        style={{
                                            color: 'var(--accent-color)',
                                            fontSize: 'var(--font-size-sm)'
                                        }}
                                    >
                                        <div className="text-left">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: 'var(--accent-color)' }}
                                                />
                                                <span className="font-medium">Choose a catchy title</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: 'var(--accent-color)' }}
                                                />
                                                <span className="font-medium">Add a clear thumbnail</span>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: 'var(--accent-color)' }}
                                                />
                                                <span className="font-medium">Write a good description</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: 'var(--accent-color)' }}
                                                />
                                                <span className="font-medium">Use relevant tags</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading Cards for Mobile */}
                    {isListLoading ? (
                        <>
                            <MobileContentManagerCardList />
                            <MobileContentManagerCardList />
                            <MobileContentManagerCardList />
                            <MobileContentManagerCardList />
                            <MobileContentManagerCardList />
                            <MobileContentManagerCardList />
                        </>
                    ) : (
                        <>
                            {/* Content List for Mobile */}
                            {(userSelected === "videos" ? videoByOwner : shortByOwner).map((content) => (
                                <div
                                    key={content._id}
                                    className="flex flex-col rounded-lg shadow p-4 border mx-2 space-x-2 transition-all"
                                    style={{
                                        backgroundColor: editStatus[content._id]
                                            ? 'var(--color-accent-bg)'
                                            : 'var(--color-bg-primary)',
                                        borderColor: editStatus[content._id]
                                            ? 'var(--accent-color)'
                                            : 'var(--color-border)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                >
                                    <div className="flex space-x-2 space-y-2 max-sm:text-sm">
                                        <div className="w-fit flex space-x-2">
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

                                            <div
                                                className={`${editStatus[content?._id] ? "" : "hidden"} min-w-24 h-14 flex items-center justify-center border rounded focus:outline-none focus:ring-2 transition-all`}
                                                style={{
                                                    borderColor: 'var(--color-border)',
                                                    transitionDuration: 'var(--animation-duration)'
                                                }}
                                            >
                                                <label
                                                    htmlFor={content._id}
                                                    className='w-full h-full border rounded-md flex items-center justify-center cursor-pointer transition-all'
                                                    style={{
                                                        borderColor: 'var(--color-border)',
                                                        color: 'var(--color-text-secondary)',
                                                        transitionDuration: 'var(--animation-duration)'
                                                    }}
                                                >
                                                    <Upload />
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    name={userSelected === "videos" ? content?.videoFile : content?.shortFile}
                                                    id={content?._id}
                                                    onChange={(e) => handleVideoChange(e)}
                                                    className='appearance-none hidden'
                                                />
                                            </div>

                                            <div className="w-24 h-14 rounded flex items-center justify-center text-xs"
                                                style={{
                                                    backgroundColor: 'var(--color-bg-secondary)',
                                                    color: 'var(--color-text-secondary)'
                                                }}
                                            >
                                                No Image
                                            </div>
                                        </div>

                                        <div>
                                            <p
                                                className={`${editStatus[content?._id] ? "hidden" : ""}`}
                                                style={{ color: 'var(--color-text-primary)' }}
                                            >
                                                {content?.title}
                                            </p>
                                            <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                                <input
                                                    type="text"
                                                    value={updateData[content?._id]?.title ?? ""}
                                                    onChange={(e) => setUpdateData((prev) => ({
                                                        ...prev,
                                                        [content._id]: {
                                                            ...prev[content?._id],
                                                            title: e.target.value
                                                        }
                                                    }))}
                                                    className="w-full p-1 border rounded focus:outline-none focus:ring-2 transition-all"
                                                    placeholder={content.title}
                                                    style={{
                                                        backgroundColor: 'var(--color-bg-primary)',
                                                        borderColor: 'var(--color-border)',
                                                        color: 'var(--color-text-primary)',
                                                        fontFamily: 'var(--font-family)',
                                                        transitionDuration: 'var(--animation-duration)'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = 'var(--accent-color)';
                                                        e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'var(--color-border)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 max-sm:text-xs w-full">
                                        <div>
                                            <p
                                                className={`${editStatus[content?._id] ? "hidden" : ""}`}
                                                style={{ color: 'var(--color-text-secondary)' }}
                                            >
                                                {content?.description}
                                            </p>
                                            <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                                <input
                                                    type="text"
                                                    value={updateData[content?._id]?.description ?? ""}
                                                    onChange={(e) => setUpdateData(prev => ({
                                                        ...prev,
                                                        [content._id]: {
                                                            ...prev[content?._id],
                                                            description: e.target.value
                                                        }
                                                    }))}
                                                    className="w-full p-1 border rounded focus:outline-none focus:ring-2 transition-all"
                                                    placeholder={content?.description}
                                                    style={{
                                                        backgroundColor: 'var(--color-bg-primary)',
                                                        borderColor: 'var(--color-border)',
                                                        color: 'var(--color-text-primary)',
                                                        fontFamily: 'var(--font-family)',
                                                        transitionDuration: 'var(--animation-duration)'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = 'var(--accent-color)';
                                                        e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'var(--color-border)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <label
                                                    className="text-sm font-semibold"
                                                    style={{
                                                        color: 'var(--color-text-secondary)',
                                                        fontSize: 'var(--font-size-sm)'
                                                    }}
                                                >
                                                    Published:
                                                </label>
                                                <span
                                                    className={`${editStatus[content?._id] ? "hidden" : ""} font-semibold ${content?.isPublished ? "text-green-600" : "text-red-600"}`}
                                                    style={{
                                                        color: content?.isPublished ? 'var(--color-success)' : 'var(--color-error)'
                                                    }}
                                                >
                                                    {content.isPublished ? "Yes" : "No"}
                                                </span>
                                                <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                                    <input
                                                        type="checkbox"
                                                        value={updateData[content?._id]?.isPublished ?? false}
                                                        defaultChecked={content?.isPublished}
                                                        onChange={(e) => setUpdateData(prev => ({
                                                            ...prev,
                                                            [content._id]: {
                                                                ...prev[content?._id],
                                                                isPublished: e.target.checked
                                                            }
                                                        }))}
                                                        className="p-1 border rounded focus:outline-none focus:ring-2 transition-all"
                                                        style={{
                                                            accentColor: 'var(--accent-color)',
                                                            borderColor: 'var(--color-border)',
                                                            transitionDuration: 'var(--animation-duration)'
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <>
                                                    <button
                                                        onClick={() => handleSave(content?._id)}
                                                        className={`${editStatus[content?._id] ? "" : "hidden"} px-3 py-1 rounded text-white transition-all`}
                                                        style={{
                                                            backgroundColor: 'var(--color-success)',
                                                            transitionDuration: 'var(--animation-duration)'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(content?._id)}
                                                        className={`${editStatus[content?._id] ? "" : "hidden"} px-3 py-1 rounded text-white transition-all`}
                                                        style={{
                                                            backgroundColor: 'var(--color-text-secondary)',
                                                            transitionDuration: 'var(--animation-duration)'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(content?._id, content)}
                                                        className={`${editStatus[content?._id] ? "hidden" : ""} px-3 py-1 rounded text-white transition-all`}
                                                        style={{
                                                            backgroundColor: 'var(--color-warning)',
                                                            transitionDuration: 'var(--animation-duration)'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                                                    >
                                                        <FilePenLine size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(content?._id)}
                                                        className={`${editStatus[content?._id] ? "hidden" : ""} px-3 py-1 rounded text-white transition-all`}
                                                        style={{
                                                            backgroundColor: 'var(--color-error)',
                                                            transitionDuration: 'var(--animation-duration)'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Desktop Table Layout */}
                <div className="sm:flex max-md:w-screen max-sm:hidden max-w-7xl max-md:px-2 max-lg:text-sm max-xl:w-full py-3 px-6 max-lg:px-3">
                    <table
                        className="min-w-full table-auto rounded shadow transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                    >
                        <thead
                            className="text-white"
                            style={{ backgroundColor: 'var(--accent-color)' }}
                        >
                            <tr>
                                <th
                                    className="p-2 text-left"
                                    style={{ fontSize: 'var(--font-size-base)' }}
                                >
                                    {userSelected === "shorts" ? "Shorts" : "Video"} File
                                </th>
                                <th
                                    className={`${userSelected === "shorts" ? "hidden" : ""} p-2 text-left`}
                                    style={{ fontSize: 'var(--font-size-base)' }}
                                >
                                    Thumbnail
                                </th>
                                <th
                                    className="p-2 text-left"
                                    style={{ fontSize: 'var(--font-size-base)' }}
                                >
                                    Title
                                </th>
                                <th
                                    className="p-2 text-left"
                                    style={{ fontSize: 'var(--font-size-base)' }}
                                >
                                    Description
                                </th>
                                <th
                                    className="p-2 text-center"
                                    style={{ fontSize: 'var(--font-size-base)' }}
                                >
                                    Published
                                </th>
                                <th
                                    className="p-2 text-center"
                                    style={{ fontSize: 'var(--font-size-base)' }}
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            className='text-xl max-lg:text-lg z-30'
                            style={{ fontSize: 'var(--font-size-xl)' }}
                        >
                            {isListLoading ? (
                                <>
                                    <DesktopCardList showThumbnail={userSelected === "shorts" ? "hidden" : ""} />
                                </>
                            ) : (
                                <>
                                    {/* Add New Content Row - Desktop */}
                                    <tr
                                        className={`${addNewStatus ? "" : "hidden"} border-b transition-all`}
                                        style={{
                                            backgroundColor: 'var(--color-accent-bg)',
                                            borderColor: 'var(--accent-color)',
                                            borderWidth: '2px',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    >
                                        {/* Video Upload Column */}
                                        <td className="p-2 w-28">
                                            <div
                                                className="min-w-24 h-14 flex items-center justify-center border rounded relative focus-within:ring-2 transition-all"
                                                style={{
                                                    borderColor: 'var(--color-border)',
                                                    transitionDuration: 'var(--animation-duration)'
                                                }}
                                            >
                                                <label
                                                    htmlFor="5"
                                                    className="w-fit h-fit border rounded-md flex items-center justify-center cursor-pointer relative transition-all"
                                                    style={{
                                                        borderColor: 'var(--color-border)',
                                                        color: 'var(--color-text-secondary)',
                                                        transitionDuration: 'var(--animation-duration)'
                                                    }}
                                                >
                                                    {videoPreview && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setVideoPreview(null)}
                                                            disabled={status === "loading"}
                                                            className="absolute top-0 right-0 z-10 cursor-pointer rounded-lg p-0.5 transition-all"
                                                            style={{
                                                                backgroundColor: 'var(--color-bg-secondary)',
                                                                transitionDuration: 'var(--animation-duration)'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-bg-secondary)'}
                                                        >
                                                            <X size={15} />
                                                        </button>
                                                    )}

                                                    {!videoPreview && <Upload />}
                                                    {videoPreview && (
                                                        <video src={videoPreview} className="max-h-14 rounded-md" />
                                                    )}
                                                </label>

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

                                        {/* Thumbnail Upload Column (Videos Only) */}
                                        <td
                                            className={`${userSelected === "shorts" ? "hidden" : ""} p-2 w-28`}
                                        >
                                            <div
                                                style={
                                                    imagePreview
                                                        ? {
                                                            backgroundImage: `url(${imagePreview})`,
                                                            backgroundSize: "cover",
                                                            backgroundPosition: "center"
                                                        }
                                                        : {
                                                            backgroundColor: 'var(--color-bg-secondary)',
                                                            borderColor: 'var(--color-border)'
                                                        }
                                                }
                                                className="min-w-24 h-14 flex items-center justify-center border rounded relative focus-within:ring-2 transition-all"
                                            >
                                                <label
                                                    htmlFor="1"
                                                    className="relative w-full h-full border rounded-md flex items-center justify-center cursor-pointer transition-all"
                                                    style={{
                                                        borderColor: 'var(--color-border)',
                                                        color: 'var(--color-text-secondary)',
                                                        transitionDuration: 'var(--animation-duration)'
                                                    }}
                                                >
                                                    {imagePreview && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setImagePreview(null)}
                                                            disabled={status === "loading"}
                                                            className="absolute top-0 right-0 z-10 rounded-lg p-0.5 transition-all"
                                                            aria-label="Remove selected image"
                                                            style={{
                                                                backgroundColor: 'var(--color-bg-secondary)',
                                                                transitionDuration: 'var(--animation-duration)'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-bg-secondary)'}
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

                                        {/* Title Input Column */}
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                ref={firstInputRef}
                                                name='title'
                                                disabled={status === "loading"}
                                                placeholder='Add a title'
                                                value={updateData[user?._id]?.title}
                                                onChange={(e) => setUpdateData(prev => ({
                                                    ...prev,
                                                    [user?._id]: {
                                                        ...prev[user?._id],
                                                        title: e.target.value
                                                    }
                                                }))}
                                                className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 transition-all`}
                                                style={{
                                                    backgroundColor: 'var(--color-bg-primary)',
                                                    borderColor: 'var(--color-border)',
                                                    color: 'var(--color-text-primary)',
                                                    fontFamily: 'var(--font-family)',
                                                    fontSize: 'var(--font-size-sm)',
                                                    transitionDuration: 'var(--animation-duration)'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'var(--accent-color)';
                                                    e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'var(--color-border)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </td>

                                        {/* Description Input Column */}
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                ref={firstInputRef}
                                                name='description'
                                                disabled={status === "loading"}
                                                placeholder='Add a descriptions'
                                                value={updateData[user._id]?.description}
                                                onChange={(e) => setUpdateData(prev => ({
                                                    ...prev,
                                                    [user?.data?.user?._id]: {
                                                        ...prev[user?._id],
                                                        description: e.target.value
                                                    }
                                                }))}
                                                className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} w-full p-1 border text-sm rounded focus:outline-none focus:ring-2 transition-all`}
                                                style={{
                                                    backgroundColor: 'var(--color-bg-primary)',
                                                    borderColor: 'var(--color-border)',
                                                    color: 'var(--color-text-primary)',
                                                    fontFamily: 'var(--font-family)',
                                                    fontSize: 'var(--font-size-sm)',
                                                    transitionDuration: 'var(--animation-duration)'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'var(--accent-color)';
                                                    e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'var(--color-border)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </td>

                                        {/* Published Checkbox Column */}
                                        <td className="p-2 text-center max-w-28">
                                            <input
                                                type="checkbox"
                                                ref={firstInputRef}
                                                disabled={status === "loading"}
                                                name='isPublished'
                                                value={updateData[user?._id]?.isPublished || false}
                                                onChange={(e) => setUpdateData(prev => ({
                                                    ...prev,
                                                    [user?._id]: {
                                                        ...prev[user?._id],
                                                        isPublished: e.target.checked
                                                    }
                                                }))}
                                                className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} p-1 border rounded focus:outline-none focus:ring-2 transition-all`}
                                                style={{
                                                    accentColor: 'var(--accent-color)',
                                                    borderColor: 'var(--color-border)',
                                                    transitionDuration: 'var(--animation-duration)'
                                                }}
                                            />
                                        </td>

                                        {/* Action Buttons Column */}
                                        <td className="p-2 text-center space-x-2 sm:w-28">
                                            <button
                                                onClick={(e) => handlepublishVideos(e)}
                                                className={`${status === "loading" ? " opacity-60 cursor-not-allowed" : ""} p-2 rounded transition-all`}
                                                disabled={status === "loading"}
                                                title="Save"
                                                style={{
                                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                                    transitionDuration: 'var(--animation-duration)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (status !== "loading") {
                                                        e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (status !== "loading") {
                                                        e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                                                    }
                                                }}
                                            >
                                                <Check
                                                    size={16}
                                                    style={{ color: 'var(--color-success)' }}
                                                />
                                            </button>
                                            <button
                                                onClick={() => setaddNewStatus(false)}
                                                disabled={status === "loading"}
                                                className={`${status === "loading" ? "opacity-60 cursor-not-allowed" : ""} p-2 rounded transition-all`}
                                                title="Cancel"
                                                style={{
                                                    backgroundColor: 'var(--color-bg-secondary)',
                                                    transitionDuration: 'var(--animation-duration)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (status !== "loading") {
                                                        e.target.style.backgroundColor = 'var(--color-hover)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (status !== "loading") {
                                                        e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                                                    }
                                                }}
                                            >
                                                <X
                                                    size={16}
                                                    style={{ color: 'var(--color-text-secondary)' }}
                                                />
                                            </button>
                                        </td>

                                        {status === "loading" && typeof progress === "number" && (
                                            <div className="mt-2 z-17">
                                                <ProgressBar value={Math.max(0, Math.min(100, Number.isFinite(progress)))} label="Uploading" />
                                            </div>
                                        )}
                                    </tr>

                                    {/* Empty State for Desktop */}
                                    {(userSelected === "videos" ? videoByOwner : shortByOwner).length === 0 && !addNewStatus && (
                                        <tr>
                                            <td colSpan={'6'} className="text-center p-6 italic">
                                                <div
                                                    className="text-center py-16 px-6 transition-all"
                                                    style={{
                                                        color: 'var(--color-text-secondary)',
                                                        transitionDuration: 'var(--animation-duration)'
                                                    }}
                                                >
                                                    <div className="max-w-lg mx-auto">
                                                        {/* Upload illustration */}
                                                        <div className="mb-8 relative">
                                                            <div
                                                                className="mx-auto w-32 h-32 bg-gradient-to-br rounded-full flex items-center justify-center"
                                                                style={{
                                                                    background: `linear-gradient(135deg, var(--color-accent-bg), var(--accent-color))`
                                                                }}
                                                            >
                                                                <Video
                                                                    className="w-16 h-16"
                                                                    style={{ color: 'var(--accent-color)' }}
                                                                />
                                                            </div>
                                                            {/* Floating upload icons */}
                                                            <div
                                                                className="absolute top-4 right-8 w-10 h-10 rounded-full flex items-center justify-center animate-bounce"
                                                                style={{ backgroundColor: 'var(--color-success)' }}
                                                            >
                                                                <Upload className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div
                                                                className="absolute bottom-6 left-6 w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
                                                                style={{ backgroundColor: 'var(--accent-color)' }}
                                                            >
                                                                <Plus className="w-4 h-4 text-white" />
                                                            </div>
                                                        </div>

                                                        <h3
                                                            className="text-2xl font-bold mb-4"
                                                            style={{
                                                                color: 'var(--color-text-primary)',
                                                                fontSize: 'var(--font-size-2xl)'
                                                            }}
                                                        >
                                                            Share your story with the world
                                                        </h3>
                                                        <p
                                                            className="mb-8 leading-relaxed"
                                                            style={{
                                                                color: 'var(--color-text-secondary)',
                                                                fontSize: 'var(--font-size-base)'
                                                            }}
                                                        >
                                                            Upload your first {userSelected === "videos" ? "video" : "short"} to start building your channel. Whether it's a tutorial, vlog, or creative content - every journey starts with one {userSelected === "videos" ? "video" : "short"}.
                                                        </p>

                                                        <div className="space-y-4 mb-8">
                                                            <button
                                                                onClick={handleAddContent}
                                                                className="w-full mx-auto sm:w-auto text-white px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold"
                                                                style={{
                                                                    background: `linear-gradient(135deg, var(--accent-color), var(--color-success))`,
                                                                    fontSize: 'var(--font-size-lg)'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.transform = 'translateY(-2px)';
                                                                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.transform = 'translateY(0)';
                                                                    e.target.style.boxShadow = 'none';
                                                                }}
                                                            >
                                                                <Upload className="w-6 h-6" />
                                                                <span>Upload Your First {userSelected === "videos" ? "video" : "short"}</span>
                                                            </button>
                                                        </div>

                                                        {/* Upload tips */}
                                                        <div
                                                            className="rounded-xl p-6 text-center transition-all"
                                                            style={{
                                                                backgroundColor: 'var(--color-accent-bg)',
                                                                transitionDuration: 'var(--animation-duration)'
                                                            }}
                                                        >
                                                            <h4
                                                                className="font-semibold mb-4"
                                                                style={{
                                                                    color: 'var(--accent-color)',
                                                                    fontSize: 'var(--font-size-base)'
                                                                }}
                                                            >
                                                                Tips for your first upload:
                                                            </h4>
                                                            <div
                                                                className="grid md:grid-cols-2 gap-4 text-sm"
                                                                style={{
                                                                    color: 'var(--accent-color)',
                                                                    fontSize: 'var(--font-size-sm)'
                                                                }}
                                                            >
                                                                <div className="text-left">
                                                                    <div className="flex items-center space-x-2 mb-2">
                                                                        <div
                                                                            className="w-2 h-2 rounded-full"
                                                                            style={{ backgroundColor: 'var(--accent-color)' }}
                                                                        />
                                                                        <span className="font-medium">Choose a catchy title</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2 mb-2">
                                                                        <div
                                                                            className="w-2 h-2 rounded-full"
                                                                            style={{ backgroundColor: 'var(--accent-color)' }}
                                                                        />
                                                                        <span className="font-medium">Add a clear thumbnail</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="flex items-center space-x-2 mb-2">
                                                                        <div
                                                                            className="w-2 h-2 rounded-full"
                                                                            style={{ backgroundColor: 'var(--accent-color)' }}
                                                                        />
                                                                        <span className="font-medium">Write a good description</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2 mb-2">
                                                                        <div
                                                                            className="w-2 h-2 rounded-full"
                                                                            style={{ backgroundColor: 'var(--accent-color)' }}
                                                                        />
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

                                    {/* Content Rows for Desktop */}
                                    {(userSelected === "videos" ? videoByOwner : shortByOwner).map((content) => (
                                        <tr
                                            key={content._id}
                                            className="border-b transition-all"
                                            style={{
                                                backgroundColor: editStatus[content._id]
                                                    ? 'var(--color-accent-bg)'
                                                    : 'transparent',
                                                borderColor: editStatus[content._id]
                                                    ? 'var(--accent-color)'
                                                    : 'var(--color-border)',
                                                borderWidth: editStatus[content._id] ? '2px' : '1px',
                                                transitionDuration: 'var(--animation-duration)'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!editStatus[content._id]) {
                                                    e.target.style.backgroundColor = 'var(--color-hover)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!editStatus[content._id]) {
                                                    e.target.style.backgroundColor = 'transparent';
                                                }
                                            }}
                                        >
                                            {/* Video File Column */}
                                            <td className="p-2 w-28">
                                                <div
                                                    className={`${editStatus[content?._id] ? "" : "hidden"} min-w-24 h-14 flex items-center justify-center border rounded focus:outline-none focus:ring-2 transition-all`}
                                                    style={{
                                                        borderColor: 'var(--color-border)',
                                                        transitionDuration: 'var(--animation-duration)'
                                                    }}
                                                >
                                                    <label
                                                        htmlFor="3"
                                                        className='w-full h-full border rounded-md flex items-center justify-center cursor-pointer transition-all'
                                                        style={{
                                                            borderColor: 'var(--color-border)',
                                                            color: 'var(--color-text-secondary)',
                                                            transitionDuration: 'var(--animation-duration)'
                                                        }}
                                                    >
                                                        <Upload />
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        id='3'
                                                        name={userSelected === "videos" ? content?.videoFile : content?.shortFile}
                                                        onChange={(e) => handleVideoChange(e)}
                                                        className='appearance-none hidden'
                                                    />
                                                </div>

                                                <video
                                                    src={userSelected === "videos" ? content?.videoFile : content?.shortFile}
                                                    loading="lazy"
                                                    className={`${editStatus[content?._id] ? "hidden" : ""} w-24 h-14 rounded object-cover`}
                                                />

                                                <span
                                                    className="hidden italic"
                                                    style={{ color: 'var(--color-text-secondary)' }}
                                                >
                                                    No Image
                                                </span>
                                            </td>

                                            {/* Thumbnail Column (Videos Only) */}
                                            <td
                                                className={`${userSelected === "shorts" ? "hidden" : ""} p-2 w-28`}
                                                style={{
                                                    backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            >
                                                <div
                                                    className={`${editStatus[content._id] ? "" : "hidden"} min-w-24 h-14 flex items-center justify-center border rounded focus:outline-none focus:ring-2 transition-all`}
                                                    style={{
                                                        borderColor: 'var(--color-border)',
                                                        transitionDuration: 'var(--animation-duration)'
                                                    }}
                                                >
                                                    <label
                                                        htmlFor="1"
                                                        className='w-full h-full border rounded-md flex items-center justify-center cursor-pointer transition-all'
                                                        style={{
                                                            borderColor: 'var(--color-border)',
                                                            color: 'var(--color-text-secondary)',
                                                            transitionDuration: 'var(--animation-duration)'
                                                        }}
                                                    >
                                                        <Upload />
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id='1'
                                                        name="newThumbnail"
                                                        onChange={(e) => handleImageChange(e)}
                                                        className='appearance-none hidden'
                                                    />
                                                </div>

                                                <img
                                                    src={content?.thumbnail}
                                                    loading="lazy"
                                                    alt={`${content?.title} thumbnail`}
                                                    className={`${editStatus[content?._id] ? "hidden" : ""} w-24 h-14 rounded object-cover`}
                                                />

                                                <span
                                                    className="hidden italic"
                                                    style={{ color: 'var(--color-text-secondary)' }}
                                                >
                                                    No Image
                                                </span>
                                            </td>

                                            {/* Title Column */}
                                            <td className="p-2">
                                                <span
                                                    className={`${editStatus[content?._id] ? "hidden" : ""} max-lg:line-clamp-2 max-lg:text-sm line-clamp-1`}
                                                    style={{ color: 'var(--color-text-primary)' }}
                                                >
                                                    {content.title}
                                                </span>
                                                <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                                    <input
                                                        type="text"
                                                        name={content?.title}
                                                        value={updateData[content?._id]?.title ?? ""}
                                                        onChange={(e) => setUpdateData(prev => ({
                                                            ...prev,
                                                            [content._id]: {
                                                                ...prev[content?._id],
                                                                title: e.target.value
                                                            }
                                                        }))}
                                                        className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 transition-all"
                                                        placeholder={content.title}
                                                        style={{
                                                            backgroundColor: 'var(--color-bg-primary)',
                                                            borderColor: 'var(--color-border)',
                                                            color: 'var(--color-text-primary)',
                                                            fontFamily: 'var(--font-family)',
                                                            fontSize: 'var(--font-size-sm)',
                                                            transitionDuration: 'var(--animation-duration)'
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = 'var(--accent-color)';
                                                            e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'var(--color-border)';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </td>

                                            {/* Description Column */}
                                            <td className="p-2">
                                                <span
                                                    className={`${editStatus[content?._id] ? "hidden" : ""} line-clamp-1 max-lg:text-sm max-lg:line-clamp-2 overflow-hidden`}
                                                    style={{ color: 'var(--color-text-secondary)' }}
                                                >
                                                    {content.description}
                                                </span>
                                                <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                                    <input
                                                        type="text"
                                                        name={content?.description}
                                                        value={updateData[content?._id]?.description ?? ""}
                                                        onChange={(e) => setUpdateData(prev => ({
                                                            ...prev,
                                                            [content?._id]: {
                                                                ...prev[content?._id],
                                                                description: e.target.value
                                                            }
                                                        }))}
                                                        className="w-full p-1 border text-sm rounded focus:outline-none focus:ring-2 transition-all"
                                                        placeholder={content.description}
                                                        style={{
                                                            backgroundColor: 'var(--color-bg-primary)',
                                                            borderColor: 'var(--color-border)',
                                                            color: 'var(--color-text-primary)',
                                                            fontFamily: 'var(--font-family)',
                                                            fontSize: 'var(--font-size-sm)',
                                                            transitionDuration: 'var(--animation-duration)'
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = 'var(--accent-color)';
                                                            e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'var(--color-border)';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </td>

                                            {/* Published Status Column */}
                                            <td className="p-2 text-center w-28">
                                                <div className={`${editStatus[content?._id] ? "hidden" : ""}`}>
                                                    {content?.isPublished ? (
                                                        <span
                                                            className="px-3 py-1 rounded-full text-xs font-semibold"
                                                            style={{
                                                                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                                                color: 'var(--color-success)'
                                                            }}
                                                        >
                                                            Yes
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="px-3 py-1 rounded-full text-xs font-semibold"
                                                            style={{
                                                                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                                                color: 'var(--color-error)'
                                                            }}
                                                        >
                                                            No
                                                        </span>
                                                    )}
                                                </div>

                                                <div className={`${editStatus[content?._id] ? "" : "hidden"}`}>
                                                    <input
                                                        type="checkbox"
                                                        value={updateData[content?._id]?.isPublished ?? false}
                                                        defaultChecked={content?.isPublished}
                                                        onChange={(e) => setUpdateData(prev => ({
                                                            ...prev,
                                                            [content._id]: {
                                                                ...prev[content?._id],
                                                                isPublished: e.target.checked
                                                            }
                                                        }))}
                                                        className="p-1 border rounded focus:outline-none focus:ring-2 transition-all"
                                                        style={{
                                                            accentColor: 'var(--accent-color)',
                                                            borderColor: 'var(--color-border)',
                                                            transitionDuration: 'var(--animation-duration)'
                                                        }}
                                                    />
                                                </div>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="p-2 text-center space-x-2 sm:w-28">
                                                {editStatus[content?._id] ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSave(content?._id)}
                                                            className="p-2 rounded transition-all"
                                                            title="Save"
                                                            style={{
                                                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                                                transitionDuration: 'var(--animation-duration)'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                                                            }}
                                                        >
                                                            <Check
                                                                size={16}
                                                                style={{ color: 'var(--color-success)' }}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(content?._id)}
                                                            className="p-2 rounded transition-all"
                                                            title="Cancel"
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
                                                            <X
                                                                size={16}
                                                                style={{ color: 'var(--color-text-secondary)' }}
                                                            />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(content?._id, content)}
                                                            className="p-2 rounded transition-all"
                                                            title="Edit"
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
                                                            <FilePenLine
                                                                size={16}
                                                                style={{ color: 'var(--color-text-primary)' }}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(content?._id)}
                                                            className="p-2 rounded transition-all"
                                                            title="Delete"
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
                                                            <X
                                                                size={16}
                                                                style={{ color: 'var(--color-error)' }}
                                                            />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ContentManager;
