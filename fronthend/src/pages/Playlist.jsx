import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAVideoToPlaylist, createAPlayList, getUserPlayList } from '../redux/features/playList';
import { Camera, Film, Heart, Music, Play, PlayCircle, PlayIcon, Plus, Sparkles, Video, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVideoByOwner } from '../redux/features/videos';
import { useAppearance } from '../hooks/appearances';

const Playlist = ({ timeAgo }) => {
  const { appearanceSettings } = useAppearance();
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { user } = useSelector(state => state.user);
  const { playlist, creating, createError } = useSelector(state => state.Playlists)
  const { videoByOwner } = useSelector(state => state.videos);

  const [counter, setCounter] = useState(0);
  const [toggleCreatePlaylist, setToggleCreatePlaylist] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: " ",
    privacy: ""
  });

  useEffect(() => {
    dispatch(getUserPlayList(user?._id));
  }, [dispatch, user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCounter(prev => prev + 1);
    if (counter < 0) return setCounter(0);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setCounter(prev => prev - 1);
    if (counter > 3) return setCounter(2);
  }

  const [selectedVideos, setSelectedVideos] = useState([]);

  useEffect(() => {
    if (!playlist.video) {
      dispatch(fetchVideoByOwner(user._id));
    }
  }, [playlist,user,dispatch]);

  const handleAddRemoveVideos = (e, index, id) => {
    const { checked } = e.target;

    if (!checked) {
      setSelectedVideos(selectedVideos.filter(idx => idx !== id));
    } else {
      setSelectedVideos([...selectedVideos, id]);
    }
  }

  // const handlePlaylistAddVideo = (e, createdId, VideoId) => {
  //   e.preventDefault();
  //   handleNext(e);
  //   dispatch(addAVideoToPlaylist({ playlistId: createdId, arrayVideoId: VideoId }));
  // }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    handleNext(e);
    await dispatch(createAPlayList({ title: formData?.title, description: formData?.description, privacy: formData.privacy }));

    setSelectedVideos([]);
    setTimeout(() => {
      setToggleCreatePlaylist(false);
    }, 2000)
  }

  const handleAllOverOne = (e) => {
    const targetName = e.target.getAttribute('name');
    const targetId = e.target.id;
    const evenType = e.type;

    if ((targetName === "detailBox" || targetName === "title") && evenType === 'click') {
      const idx = e.target.getAttribute('data-video');
      Navigate(`/video/${idx}`);
    }

    if ((targetName === "avatar" || targetName === 'username') && evenType === 'click') {
      const username = e.target.getAttribute('data-username');
      Navigate(`/channel/${username}`);
    }
  }

  return (
    <div
      className='py-3 max-md:py-2 sm:p-2 md:p-5 w-full h-full max-md:px-2 overflow-y-scroll scrollBar'
      style={{
        backgroundColor: appearanceSettings.customBackground ? 'transparent' : "var(--color-bg-primary)",
        fontFamily: 'var(--font-family)',
        // padding: 'var(--component-padding)'
      }}
      role="main"
      aria-label="Playlist management"
    >
      {/* Header */}
      <div
        className='flex items-center justify-between border-b-1 py-1 sticky'
        style={{
          borderColor: 'var(--color-border)',
          paddingBottom: 'var(--spacing-unit)',
          marginBottom: 'var(--spacing-unit)'
        }}
      >
        <h1
          className='text-2xl max-md:text-lg max-sm:text-sm font-bold stroke-2 mb-2'
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-2xl)',
            fontFamily: 'var(--font-family)',
            marginBottom: 'var(--spacing-unit)'
          }}
        >
          User Playlists
        </h1>
        <button
          onClick={() => setToggleCreatePlaylist(true)}
          className='cursor-pointer mr-4 px-4 py-1 stroke-2 rounded-lg transition-all'
          style={{
            backgroundColor: 'var(--accent-color)',
            color: 'white',
            padding: 'calc(var(--spacing-unit) * 0.5) var(--spacing-unit)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family)',
            transitionDuration: 'var(--animation-duration)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--color-accent-hover)';
            e.target.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--accent-color)';
            e.target.style.opacity = '1';
          }}
          aria-label="Create new playlist"
        >
          Create
        </button>
      </div>

      <div className='w-full'>
        {/* Create Playlist Modal */}
        <div
          className={`${toggleCreatePlaylist ? "" : "hidden"} md:mx-auto max-sm:mb-8 z-30 w-full max-w-6xl rounded-xl p-8 max-sm:p-0 shadow-lg mt-1`}
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border)',
            border: '1px solid',
            padding: 'var(--section-gap)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="playlist-title"
        >
          {/* Cancel button */}
          <div className='w-full flex items-center justify-end'>
            <button
              onClick={() => setToggleCreatePlaylist(false)}
              className='p-2 cursor-pointer rounded-full transition-all'
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-hover)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              aria-label="Close playlist creation modal"
            >
              <X />
            </button>
          </div>

          {/* Header */}
          <div
            className="mb-8 text-center"
            style={{ marginBottom: 'var(--section-gap)' }}
          >
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor: 'var(--accent-color)',
                marginBottom: 'var(--spacing-unit)'
              }}
            >
              <PlayIcon color='white' />
            </div>
            <h2
              id="playlist-title"
              className="text-3xl font-bold"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-3xl)',
                fontFamily: 'var(--font-family)'
              }}
            >
              Create Playlist
            </h2>
            <p
              className="mt-2"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-base)',
                marginTop: 'var(--spacing-unit)'
              }}
            >
              Step {counter + 1} of 2: {counter === 0 ? 'Basic Information' : 'Add Videos'}
            </p>
          </div>

          {/* Progress Bar */}
          <div
            className="mb-8"
            style={{ marginBottom: 'var(--section-gap)' }}
            role="progressbar"
            aria-valuenow={counter + 1}
            aria-valuemin={1}
            aria-valuemax={2}
            aria-label={`Step ${counter + 1} of 2`}
          >
            <div
              className="flex items-center justify-between mb-2"
              style={{ marginBottom: 'var(--spacing-unit)' }}
            >
              <span
                className="text-sm font-medium"
                style={{
                  color: counter === 0 ? 'var(--accent-color)' : 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Playlist Info
              </span>
              <span
                className="text-sm"
                style={{
                  color: counter === 1 ? 'var(--accent-color)' : 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Add Videos
              </span>
            </div>
            <div
              className="h-2 w-full rounded-full cursor-pointer"
              style={{ backgroundColor: 'var(--color-bg-secondary)' }}
            >
              <div
                className={`h-2 rounded-full transition-all duration-500`}
                style={{
                  width: counter === 0 ? '10%' : counter === 1 ? '50%' : '100%',
                  backgroundColor: counter === 2 ? 'var(--color-success)' : 'var(--accent-color)',
                  transitionDuration: appearanceSettings.reducedMotion ? '0s' : '0.5s'
                }}
              />
            </div>
          </div>

          <div
            className="space-y-6"
            style={{ gap: 'var(--section-gap)' }}
          >
            {/* Step 1: Basic Info */}
            {counter === 0 && (
              <div
                style={{ gap: 'var(--section-gap)' }}
                role="form"
                aria-label="Playlist basic information"
              >
                {/* Playlist Title */}
                <div style={{ marginBottom: 'var(--section-gap)' }}>
                  <label
                    htmlFor="playlist-title-input"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    Playlist Title *
                  </label>
                  <input
                    id="playlist-title-input"
                    type="text"
                    name="title"
                    value={formData?.title}
                    onChange={handleInputChange}
                    placeholder="My Awesome Playlist"
                    className="w-full rounded-lg border px-4 py-3 focus:ring-1 focus:outline-2 transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderColor: 'var(--color-border)',
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
                    required
                    aria-describedby="title-help"
                  />
                  <p
                    id="title-help"
                    className="text-xs mt-1"
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-xs)',
                      marginTop: 'calc(var(--spacing-unit) * 0.5)'
                    }}
                  >
                    Choose a descriptive title for your playlist
                  </p>
                </div>

                {/* Playlist Description */}
                <div style={{ marginBottom: 'var(--section-gap)' }}>
                  <label
                    htmlFor="playlist-description-input"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    Description *
                  </label>
                  <textarea
                    id="playlist-description-input"
                    name="description"
                    value={formData?.description}
                    onChange={handleInputChange}
                    placeholder="Tell people what your playlist is about..."
                    rows="4"
                    className="w-full rounded-lg border px-4 py-3 focus:ring-1 focus:outline-2 transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      padding: 'var(--spacing-unit)',
                      transitionDuration: 'var(--animation-duration)',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent-color)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                {/* Privacy Settings */}
                <div>
                  <fieldset>
                    <legend
                      className="mb-3 block text-sm font-medium"
                      style={{
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-sm)',
                        fontFamily: 'var(--font-family)',
                        marginBottom: 'var(--spacing-unit)'
                      }}
                    >
                      Privacy Setting
                    </legend>
                    <div
                      className="grid gap-3 sm:grid-cols-3"
                      style={{ gap: 'var(--spacing-unit)' }}
                      role="radiogroup"
                      aria-label="Playlist privacy options"
                    >
                      {['public', 'unlisted', 'private'].map((privacy) => (
                        <label
                          key={privacy}
                          className="flex cursor-pointer items-center space-x-3 rounded-lg border max-sm:p-2 p-4 transition-colors"
                          style={{
                            borderColor: formData?.privacy === privacy ? 'var(--accent-color)' : 'var(--color-border)',
                            backgroundColor: formData?.privacy === privacy ? 'var(--color-accent-hover)' : 'var(--color-bg-secondary)',
                            gap: 'var(--spacing-unit)',
                            padding: 'var(--spacing-unit)',
                            transitionDuration: 'var(--animation-duration)'
                          }}
                          // onMouseEnter={(e) => {
                          //   if (formData?.privacy !== privacy) {
                          //     e.target.style.backgroundColor = 'var(--color-hover)';
                          //   }
                          // }}
                          // onMouseLeave={(e) => {
                          //   if (formData?.privacy !== privacy) {
                          //     e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                          //   }
                          // }}
                        >
                          <input
                            type="radio"
                            name="privacy"
                            value={privacy}
                            checked={formData?.privacy === privacy}
                            onChange={handleInputChange}
                            className="h-4 w-4 focus:outline-2 rounded-full"
                            style={{
                              accentColor: 'var(--accent-color)',
                              outlineColor: 'var(--color-accent-hover)',
                            }}
                            aria-describedby={`${privacy}-description`}
                          />
                          <div>
                            <div
                              className="flex items-center space-x-2"
                              style={{
                                // gap: 'var(--spacing-unit)',
                                // backgroundColor: 'var(--color-bg-secondary)'
                               }}
                            >
                              <span className="text-lg">
                                {privacy === 'public' ? '🌍' : privacy === 'unlisted' ? '🔗' : '🔒'}
                              </span>
                              <span
                                className="text-sm font-medium"
                                style={{
                                  // backgroundColor:'var(--color-bg-secondary)',
                                  color: 'var(--color-text-primary)',
                                  fontSize: 'var(--font-size-sm)'
                                }}
                              >
                                {privacy === 'public' ? 'Public' : privacy === 'unlisted' ? 'Unlisted' : 'Private'}
                              </span>
                            </div>
                            <p
                              id={`${privacy}-description`}
                              className="text-xs"
                              style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-xs)'
                              }}
                            >
                              {privacy === 'public' ? 'Everyone can see' : privacy === 'unlisted' ? 'Link only' : 'Only you'}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
            )}

            {/* Step 2: Add Videos */}
            {counter === 1 && (
              <div
                role="form"
                aria-label="Select videos for playlist"
              >
                <h3
                  className="text-lg font-medium mb-4"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-lg)',
                    fontFamily: 'var(--font-family)',
                    marginBottom: 'var(--spacing-unit)'
                  }}
                >
                  Select Videos to Add
                </h3>
                <ul
                  className='w-full'
                  style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    backgroundColor: 'var(--color-bg-secondary)',
                    padding: 'var(--spacing-unit)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)'
                  }}
                  role="group"
                  aria-label="Available videos"
                >
                  {videoByOwner.map((video, index) => (
                    <li
                      key={video._id}
                      className='px-2 py-1 overflow-hidden line-clamp-1 flex items-center transition-colors'
                      style={{
                        padding: 'calc(var(--spacing-unit) * 0.5) var(--spacing-unit)',
                        borderRadius: '6px',
                        marginBottom: 'calc(var(--spacing-unit) * 0.5)',
                        backgroundColor: 'transparent',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <input
                        type="checkbox"
                        value={video._id}
                        id={`video-${video._id}`}
                        onChange={(e) => handleAddRemoveVideos(e, index, video._id)}
                        className='mr-2'
                        style={{
                          marginRight: 'var(--spacing-unit)',
                          accentColor: 'var(--accent-color)'
                        }}
                        aria-describedby={`video-title-${video._id}`}
                      />
                      <label
                        htmlFor={`video-${video._id}`}
                        id={`video-title-${video._id}`}
                        className="cursor-pointer flex-1"
                        style={{
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-sm)'
                        }}
                      >
                        {video.title}
                      </label>
                    </li>
                  ))}
                </ul>
                <p
                  className="text-xs mt-2"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-xs)',
                    marginTop: 'var(--spacing-unit)'
                  }}
                >
                  {selectedVideos.length} video{selectedVideos.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div
              className="flex justify-end space-x-4 max-sm:space-x-2 max-sm:py-3 py-6"
              style={{
                gap: 'var(--spacing-unit)',
                paddingTop: 'var(--section-gap)'
              }}
            >
              {counter > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center space-x-2 rounded-lg border max-sm:py-1 max-sm:px-4 px-6 py-3 transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    gap: 'calc(var(--spacing-unit) * 0.5)',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-family)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                  }}
                  aria-label="Go back to previous step"
                >
                  <span>← Back</span>
                </button>
              )}

              {counter === 0 ? (
                <button
                  type="submit"
                  onClick={handleNext}
                  disabled={!formData?.title || !formData?.description || !formData?.privacy}
                  className="rounded-lg px-6 py-3 text-white max-sm:py-1 max-sm:px-4 transition-all"
                  style={{
                    backgroundColor: (!formData?.title || !formData?.description || !formData?.privacy)
                      ? 'var(--color-text-secondary)'
                      : 'var(--accent-color)',
                    opacity: (!formData?.title || !formData?.description || !formData?.privacy) ? 0.5 : 1,
                    cursor: (!formData?.title || !formData?.description || !formData?.privacy) ? 'not-allowed' : 'pointer',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-family)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    if (formData?.title && formData?.description && formData?.privacy) {
                      e.target.style.backgroundColor = 'var(--color-accent-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData?.title && formData?.description && formData?.privacy) {
                      e.target.style.backgroundColor = 'var(--accent-color)';
                    }
                  }}
                  aria-label="Continue to video selection"
                >
                  Next: Add Videos →
                </button>
              ) : (
                <button
                  onClick={handleCreatePlaylist}
                  className="flex items-center space-x-2 rounded-lg max-sm:py-1 max-sm:px-4 px-6 py-3 text-white transition-all"
                  style={{
                    backgroundColor: 'var(--color-success)',
                    gap: 'calc(var(--spacing-unit) * 0.5)',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-family)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-success)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--color-success)';
                  }}
                  aria-label="Create playlist with selected videos"
                >
                  <span>Create Playlist</span>
                  <span>🎉</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {playlist.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center w-full p-8 max-md:p-4 max-sm:p-0 mt-30 max-md:mt-16"
            style={{
              padding: 'var(--section-gap)',
              color: 'var(--color-text-primary)'
            }}
            role="region"
            aria-label="No playlists created"
          >
            {/* Animated Video Icon Container */}
            <div
              className="relative mb-6"
              style={{
                marginBottom: 'var(--section-gap)',
                animation: appearanceSettings.reducedMotion ? 'none' : 'bounce 2s infinite'
              }}
            >
              {/* Background Pulse Effect */}
              <div
                className="absolute inset-0 w-28 h-28 rounded-2xl opacity-75"
                style={{
                  backgroundColor: 'var(--color-accent-bg)',
                  animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s infinite'
                }}
              />

              {/* Main Video Icon */}
              <div
                className="relative flex items-center justify-center w-28 h-28 rounded-2xl shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, var(--color-error), var(--accent-color), var(--color-accent-hover))'
                }}
              >
                <Video className="w-14 h-14 text-white" />
              </div>

              {/* Floating Play Button */}
              <div
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: 'var(--color-success)',
                  animation: appearanceSettings.reducedMotion ? 'none' : 'ping 2s infinite'
                }}
              >
                <Play className="w-5 h-5 text-white fill-current" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center max-w-md">
              <h2
                className="text-2xl font-bold mb-3"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-2xl)',
                  fontFamily: 'var(--font-family)',
                  marginBottom: 'var(--spacing-unit)'
                }}
              >
                Ready to Create Your First Video Playlist?
              </h2>

              <p
                className="mb-8 leading-relaxed"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-base)',
                  marginBottom: 'var(--section-gap)',
                  lineHeight: '1.6'
                }}
              >
                Organize your favorite videos, create themed collections, and build the perfect viewing experience
              </p>

              {/* Primary Action Button */}
              <button
                onClick={() => setToggleCreatePlaylist(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 mb-6"
                style={{
                  background: 'linear-gradient(135deg, var(--color-error), var(--accent-color))',
                  padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 2)',
                  gap: 'var(--spacing-unit)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  marginBottom: 'var(--section-gap)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  if (!appearanceSettings.reducedMotion) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!appearanceSettings.reducedMotion) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }
                }}
                aria-label="Create your first video playlist"
              >
                <Plus
                  className="w-5 h-5 transition-transform duration-200"
                  style={{
                    transform: 'rotate(0deg)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                />
                Create Video Playlist
              </button>

              {/* Secondary Actions */}
              <div
                className="flex flex-wrap justify-center gap-3 text-sm"
                style={{
                  gap: 'var(--spacing-unit)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200"
                  style={{
                    color: 'var(--color-error)',
                    backgroundColor: 'transparent',
                    gap: 'calc(var(--spacing-unit) * 0.5)',
                    padding: 'calc(var(--spacing-unit) * 0.5) var(--spacing-unit)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-error-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                  aria-label="Browse available videos"
                >
                  <Film className="w-4 h-4" />
                  Browse Videos
                </button>

                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200"
                  style={{
                    color: 'var(--accent-color)',
                    backgroundColor: 'transparent',
                    gap: 'calc(var(--spacing-unit) * 0.5)',
                    padding: 'calc(var(--spacing-unit) * 0.5) var(--spacing-unit)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-accent-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                  aria-label="Upload a new video"
                >
                  <Camera className="w-4 h-4" />
                  Upload Video
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Playlist Grid */}
        <div
          className={`${toggleCreatePlaylist ? "hidden" : ""} mt-1`}
          style={{ marginTop: 'var(--spacing-unit)' }}
        >
          <div
            className="w-full space-y-3"
            style={{ gap: 'var(--spacing-unit)' }}
            role="list"
            aria-label="Your playlists"
          >
            {playlist &&
              playlist.map((playlistItem) => (
                <div
                  key={playlistItem?._id}
                  className="flex h-fit transition-all"
                  style={{
                    transitionDuration: 'var(--animation-duration)',
                    // padding: 'var(--spacing-unit)',
                    borderRadius: '12px',
                    backgroundColor: 'transparent'
                  }}
                  // onMouseEnter={(e) => {
                  //   e.target.style.backgroundColor = 'var(--color-hover)';
                  // }}
                  // onMouseLeave={(e) => {
                  //   e.target.style.backgroundColor = 'transparent';
                  // }}
                  role="listitem"
                  aria-label={`Playlist: ${playlistItem?.title}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const firstVideoId = playlistItem?.video[0]?._id;
                      if (firstVideoId) {
                        Navigate(`/video/${firstVideoId}`);
                      }
                    }
                  }}
                >
                  {/* Playlist Thumbnail Stack */}
                  <div className="relative max-md:w-[50%] w-64 h-fit">
                    <div className="relative aspect-video mt-4 ml-4">
                      {/* Stack Layers */}
                      <div
                        className="absolute -left-3 -top-3 h-full w-full rounded-lg overflow-hidden opacity-66"
                        style={{ opacity: 0.66 }}
                      >
                        <img
                          src={playlistItem?.video[0]?.thumbnail || playlistItem?.thumbnail}
                          alt=""
                          name="image"
                          id={playlistItem._id}
                          onClick={handleAllOverOne}
                          className="h-full w-full object-cover cursor-pointer"
                          tabIndex={0}
                          aria-label={`View playlist ${playlistItem?.title}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              const firstVideoId = playlistItem?.video[0]?._id;
                              if (firstVideoId) {
                                Navigate(`/video/${firstVideoId}`);
                              }
                            }
                          }}
                        />
                      </div>
                      <div
                        className="absolute -left-2 -top-2 h-full w-full overflow-hidden rounded-lg opacity-75"
                        style={{ opacity: 0.75 }}
                      >
                        <img
                          src={playlistItem?.video[0]?.thumbnail || playlistItem?.thumbnail}
                          alt=""
                          name="image"
                          id={playlistItem._id}
                          onClick={handleAllOverOne}
                          className="h-full w-full object-cover cursor-pointer"
                        />
                      </div>
                      <div className="absolute -left-1 -top-1 h-full w-full rounded-lg overflow-hidden">
                        <div className='w-full h-full relative'>
                          <img
                            src={playlistItem?.video[1]?.thumbnail || playlistItem?.thumbnail}
                            alt=""
                            name="image"
                            id={playlistItem._id}
                            onClick={handleAllOverOne}
                            className="h-full w-full z-1 object-cover cursor-pointer"
                          />

                          <div
                            name="detailBox"
                            id={playlistItem._id}
                            data-video={playlistItem?.video[0]?._id}
                            onClick={handleAllOverOne}
                            className='absolute z-2 inset-0 cursor-pointer'
                            role="button"
                            tabIndex={0}
                            aria-label={`Play playlist ${playlistItem?.title}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                const firstVideoId = playlistItem?.video[0]?._id;
                                if (firstVideoId) {
                                  Navigate(`/video/${firstVideoId}`);
                                }
                              }
                            }}
                          >
                            <span
                              name="length"
                              id={playlistItem._id}
                              onClick={handleAllOverOne}
                              className='absolute bottom-1 px-2 rounded-2xl py-1 text-xs text-gray-50 right-1'
                              style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                fontSize: 'var(--font-size-xs)'
                              }}
                            >
                              {(playlistItem?.video?.length === 0 ? "" : playlistItem?.video?.length) + " videos"}
                            </span>
                            <span
                              name="privacy"
                              id={playlistItem._id}
                              onClick={handleAllOverOne}
                              className='absolute bottom-1 left-1 px-2 rounded-2xl py-1 text-xs text-gray-50'
                              style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                fontSize: 'var(--font-size-xs)'
                              }}
                            >
                              {playlistItem?.privacy || 'public'}
                            </span>
                            <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                              <button
                                name='play'
                                id={playlistItem._id}
                                onClick={handleAllOverOne}
                                className="cursor-pointer flex items-center justify-center rounded-full text-xl text-white p-2 transition-all"
                                style={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                  transitionDuration: 'var(--animation-duration)'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                                  e.target.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                                  e.target.style.transform = 'scale(1)';
                                }}
                                aria-label={`Play playlist ${playlistItem?.title}`}
                              >
                                <PlayIcon />
                              </button>
                            </span>
                            <span
                              name="mix"
                              id={playlistItem._id}
                              onClick={handleAllOverOne}
                              className='absolute top-1 right-1 px-2 rounded-2xl py-1 text-xs text-gray-50'
                              style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                fontSize: 'var(--font-size-xs)'
                              }}
                            >
                              <span name="mix" id={playlistItem._id} onClick={handleAllOverOne}>📋</span>
                              <span name="mix" id={playlistItem._id} onClick={handleAllOverOne}>Mix</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Playlist Details */}
                  <div
                    className="max-md:w-[50%] max-w-96 flex-col flex py-1 pl-2"
                    // style={{ padding: 'var(--spacing-unit)' }}
                  >
                    {/* Title */}
                    <div
                      name="title"
                      id={playlistItem._id}
                      data-video={playlistItem?.video[0]?._id}
                      onClick={handleAllOverOne}
                      className="line-clamp-2 cursor-pointer w-full max-sm:leading-tight font-semibold text-xl pb-2 max-sm:pb-0 max-md:text-lg max-w-3xs transition-colors"
                      style={{
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-xl)',
                        fontFamily: 'var(--font-family)',
                        // paddingBottom: 'var(--spacing-unit)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      // onMouseEnter={(e) => {
                      //   e.target.style.color = 'var(--accent-color)';
                      // }}
                      // onMouseLeave={(e) => {
                      //   e.target.style.color = 'var(--color-text-primary)';
                      // }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Play playlist: ${playlistItem?.title}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          const firstVideoId = playlistItem?.video[0]?._id;
                          if (firstVideoId) {
                            Navigate(`/video/${firstVideoId}`);
                          }
                        }
                      }}
                    >
                      <h2 name="title" id={playlistItem._id} data-video={playlistItem?.video[0]?._id} onClick={handleAllOverOne}>
                        {playlistItem?.title}
                      </h2>
                    </div>
                    <div className="flex">
                      <div
                        name="avatar"
                        id={playlistItem._id}
                        onClick={handleAllOverOne}
                        data-username={playlistItem?.owner?.username}
                        className=" items-baseline cursor-pointer hidden"
                        role="button"
                        tabIndex={0}
                        aria-label={`Visit ${playlistItem?.owner?.username}'s channel`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            Navigate(`/channel/${playlistItem?.owner?.username}`);
                          }
                        }}
                      >
                        <img
                          src={playlistItem?.owner?.avatar}
                          alt={`${playlistItem?.owner?.username}'s avatar`}
                          name="avatar"
                          id={playlistItem._id}
                          data-username={playlistItem?.owner?.username}
                          onClick={handleAllOverOne}
                          className="w-8 mr-3 max-sm:w-5 max-md:w-7 max-md:mr-2 aspect-square rounded-full drop-shadow-lg"
                          // style={{ marginRight: 'var(--spacing-unit)' }}
                        />
                      </div>
                      <div className="flex flex-col cursor-pointer">
                        {/* User name */}
                        <div
                          name="username"
                          id={playlistItem._id}
                          data-username={playlistItem?.owner?.username}
                          onClick={handleAllOverOne}
                          className="mb-1 text-xs pt-0.5 font-normal max-md:text-xs flex transition-colors"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)',
                            // marginBottom: 'calc(var(--spacing-unit) * 0.5)',
                            transitionDuration: 'var(--animation-duration)'
                          }}
                          // onMouseEnter={(e) => {
                          //   e.target.style.color = 'var(--accent-color)';
                          // }}
                          // onMouseLeave={(e) => {
                          //   e.target.style.color = 'var(--color-text-secondary)';
                          // }}
                          role="button"
                          tabIndex={0}
                          aria-label={`Visit ${playlistItem?.owner?.username}'s channel`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              Navigate(`/channel/${playlistItem?.owner?.username}`);
                            }
                          }}
                        >
                          <h3 name="username" id={playlistItem._id} data-username={playlistItem?.owner?.username} onClick={handleAllOverOne}>
                            {playlistItem?.owner?.username}
                          </h3>
                        </div>
                        {/* View and time ago */}
                        <div
                          className="text-xs font-normal leading-1 max-md:text-[11px] flex items-center"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)',
                            // gap: 'calc(var(--spacing-unit) * 0.75)'
                          }}
                        >
                          <span aria-label={`${playlistItem?.views || 0} views`}>{playlistItem?.views || 0} views</span>
                          <span className="mx-1" aria-hidden="true">•</span>
                          <time dateTime={playlistItem?.createdAt}>
                            {timeAgo(playlistItem?.createdAt) || "12 year ago"}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Live Region for Status Updates */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {creating && "Creating playlist..."}
        {createError && `Error creating playlist: ${createError}`}
        {counter === 2 && "Playlist created successfully!"}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-10px); }
          70% { transform: translateY(-5px); }
          90% { transform: translateY(-2px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
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
  )
}

export default Playlist;
