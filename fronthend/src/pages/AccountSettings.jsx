import { Calendar, ImageUp, Mail, MapPin, Phone, Save, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { accountDeleted, currentUpdatedUser, updateAccountDetails, updateAvatar, updateCoverImage } from '../redux/features/user';
// import { useAppearance } from '../hooks/appearances';

const AccountSettings = () => {
  const dispatch = useDispatch();
  // const { appearanceSettings } = useAppearance();

  const { user, updateAvatarProgress, updateCoverImageProgress, updateAvatarStatus, updateCoverImageStatus, updateAccountLoading } = useSelector(state => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username,
    fullname: user?.fullname,
    email: user?.email,
    phone: user?.phoneNumber || '+1 (555) 123-4567',
    location: user?.location || 'New York, NY',
    birthDate: user?.dateOfBirth || '1990-01-15',
    bio: user?.bio || 'Software developer passionate about creating amazing user experiences.'
  });

  const [ImagesSend, setImagesSend] = useState({})
  const [previewImages, setPreviewImages] = useState({})

  console.log(updateAvatarProgress, updateCoverImageProgress, updateAvatarStatus, updateCoverImageStatus, updateAccountLoading)

  // Cleanup object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      Object.values(previewImages).forEach(url => {
        if (typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewImages]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username,
      fullname: user?.fullname,
      email: user?.email,
      phone: user?.phoneNumber || '+1 (555) 123-4567',
      location: user?.location || 'New York, NY',
      birthDate: user?.dateOfBirth || '1990-01-15',
      bio: user?.bio || 'Software developer passionate about creating amazing user experiences.'
    })
    setIsEditing(false);

    // Clear preview images and uploaded files
    setPreviewImages({});
    setImagesSend({});
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    dispatch(accountDeleted(user?._id));
    setShowDeleteConfirm(false);
  };

  const handleAvatarImageInput = (e) => {
    const { name, files } = e.target;

    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    // Clean up previous preview URL
    if (previewImages[name]) {
      URL.revokeObjectURL(previewImages[name]);
    }

    setImagesSend((prev) => ({ ...prev, [name]: files[0] }))

    const url = URL.createObjectURL(files[0]);
    setPreviewImages((prev) => ({ ...prev, [name]: url }));
    setIsEditing(true);
  }

  const handleCoverImageInput = (e) => {
    const { name, files } = e.target;

    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    // Clean up previous preview URL
    if (previewImages[name]) {
      URL.revokeObjectURL(previewImages[name]);
    }

    setImagesSend((prev) => ({ ...prev, [name]: files[0] }))

    const url = URL.createObjectURL(files[0]);
    setPreviewImages((prev) => ({ ...prev, [name]: url }));
    setIsEditing(true);
  }

  const handleSubmitData = async () => {
    try {
      if (ImagesSend["avatar"]) {
        await dispatch(updateAvatar(ImagesSend.avatar)).unwrap();
        console.log("avatar updated started")
      }

      if (ImagesSend["coverImage"]) {
        await dispatch(updateCoverImage(ImagesSend.coverImage)).unwrap();
        console.log("coverImage updated started")
      }

      if (formData) {
        await dispatch(updateAccountDetails({
          username: formData.username,
          fullname: formData.fullname,
          email: formData.email
        })).unwrap();
        console.log("account details updated started")
      }

      dispatch(currentUpdatedUser());
      setIsEditing(false);
      setPreviewImages({});
      setImagesSend({});
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  return (
    <div
      className="w-4xl pl-4 pt-3 max-md:p-4 overflow-y-auto scrollBar h-[calc(100vh-65px)] max-md:h-[calc(100vh-53px)] max-xl:w-2xl max-md:w-screen max-[1040px]:w-2xl transition-all"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family)',
        transitionDuration: 'var(--animation-duration)'
      }}
    >
      {/* Header */}
      <div
        className="mb-8 max-md:mb-4"
        style={{ marginBottom: 'var(--section-gap)' }}
      >
        <h1
          className="text-3xl font-bold mb-2 max-md:text-[18px]"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-3xl)',
            fontFamily: 'var(--font-family)'
          }}
        >
          Account Settings
        </h1>
        <p
          className="max-md:text-sm"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)'
          }}
        >
          Manage your profile information
        </p>
      </div>

      {/* Profile Section */}
      <div
        className="mx-4 max-md:mx-0 p-6 max-lg:p-0 mb-8 transition-all"
        style={{
          padding: 'var(--component-padding)',
          marginBottom: 'var(--section-gap)',
          transitionDuration: 'var(--animation-duration)'
        }}
      >
        <div>
          <div>
            {/* Cover Image Container */}
            <div>
              <div
                className='relative w-full h-[200px] border-2 my-3 flex items-center justify-center rounded-lg overflow-hidden shadow-sm transition-all'
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border)',
                  transitionDuration: 'var(--animation-duration)'
                }}
              >
                <img
                  src={previewImages.coverImage ? previewImages.coverImage : user?.coverImage}
                  alt="Cover"
                  loading='lazy'
                  className='w-full h-full object-cover overflow-hidden'
                  style={{ imageRendering: 'auto' }}
                />
                <div
                  className='absolute bottom-2 right-2 p-2 rounded-full cursor-pointer transition-all'
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-bg-secondary)'}
                  onMouseDown={(e) => e.target.style.backgroundColor = 'var(--color-active)'}
                  onMouseUp={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                >
                  <label htmlFor="1" className='cursor-pointer'>
                    <ImageUp style={{ color: 'var(--color-text-primary)' }} />
                    <input
                      type="file"
                      accept='image/*'
                      name="coverImage"
                      id="1"
                      onChange={(e) => handleCoverImageInput(e)}
                      className='hidden'
                    />
                  </label>
                </div>

                {/* Upload Progress for Cover Image */}
                {updateCoverImageStatus === 'loading' && (
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: 'rgba(var(--color-bg-primary), 0.8)',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-2"
                        style={{
                          borderColor: 'var(--accent-color)',
                          borderTopColor: 'transparent'
                        }}
                      />
                      <p
                        style={{
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-sm)'
                        }}
                      >
                        Uploading... {updateCoverImageProgress}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar Container */}
            <div>
              <div
                className='relative border-2 mt-2 h-[180px] w-[180px] flex items-center justify-center rounded-full shadow-sm transition-all'
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border)',
                  transitionDuration: 'var(--animation-duration)'
                }}
              >
                <img
                  src={previewImages.avatar ? previewImages.avatar : user?.avatar}
                  alt="Avatar"
                  loading='lazy'
                  className='w-full h-full object-cover z-20 rounded-full overflow-hidden'
                  style={{ imageRendering: 'auto' }}
                />
                <div
                  className='absolute z-30 bottom-2 right-2 p-2 rounded-full cursor-pointer transition-all'
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-bg-secondary)'}
                  onMouseDown={(e) => e.target.style.backgroundColor = 'var(--color-active)'}
                  onMouseUp={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                >
                  <label htmlFor="2" className='cursor-pointer'>
                    <ImageUp style={{ color: 'var(--color-text-primary)' }} />
                    <input
                      type="file"
                      accept='image/*'
                      name="avatar"
                      id="2"
                      onChange={(e) => handleAvatarImageInput(e)}
                      className='hidden'
                    />
                  </label>
                </div>

                {/* Upload Progress for Avatar */}
                {updateAvatarStatus === 'loading' && (
                  <div
                    className="absolute inset-0 rounded-full flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: 'rgba(var(--color-bg-primary), 0.8)',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-1"
                        style={{
                          borderColor: 'var(--accent-color)',
                          borderTopColor: 'transparent'
                        }}
                      />
                      <p
                        className="text-xs"
                        style={{
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-xs)'
                        }}
                      >
                        {updateAvatarProgress}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
            {/* User Name */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                User Name
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
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

            {/* Full Name */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
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

            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-2 items-center"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                <Mail className="mr-1 h-4 w-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
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

            {/* Phone */}
            <div>
              <label
                className="block text-sm font-medium mb-2 items-center"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                <Phone className="mr-1 h-4 w-4" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
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

            {/* Location */}
            <div>
              <label
                className="block text-sm font-medium mb-2 items-center"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                <MapPin className="mr-1 h-4 w-4" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
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

            {/* Birth Date */}
            <div>
              <label
                className="block text-sm font-medium mb-2 items-center"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                <Calendar className="mr-1 h-4 w-4" />
                Birth Date
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)',
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

          {/* Bio */}
          <div className="mt-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)'
              }}
            >
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              placeholder="Tell us about yourself..."
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-base)',
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

          {/* Edit Mode Actions */}
          <div
            className={`${isEditing ? "" : "hidden"} flex items-center justify-end space-x-3 mt-6 pt-6 border-t transition-all`}
            style={{
              borderColor: 'var(--color-border)',
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            <button
              onClick={handleCancel}
              className="px-4 py-2 border rounded-lg transition-all"
              style={{
                color: 'var(--color-text-secondary)',
                borderColor: 'var(--color-border)',
                backgroundColor: 'transparent',
                fontSize: 'var(--font-size-base)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-hover)';
                e.target.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--color-text-secondary)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitData}
              disabled={updateAccountLoading || updateAvatarStatus === 'loading' || updateCoverImageStatus === 'loading'}
              className="flex items-center px-4 py-2 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-success)',
                fontSize: 'var(--font-size-base)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              {updateAccountLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div
        className="border max-lg:p-3 lg:mx-0 max-md:p-2 mx-8 max-md:mx-0 rounded-lg p-6 transition-all"
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          transitionDuration: 'var(--animation-duration)'
        }}
      >
        <h3
          className="text-lg max-md:text-sm font-semibold mb-2"
          style={{
            color: 'var(--color-error)',
            fontSize: 'var(--font-size-lg)'
          }}
        >
          Danger Zone
        </h3>
        <p
          className="mb-4 text-sm max-md:text-xs"
          style={{
            color: 'var(--color-error)',
            fontSize: 'var(--font-size-sm)',
            opacity: '0.8'
          }}
        >
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center px-4 py-2 max-md:px-2 max-md:py-1 text-white rounded-lg transition-all"
          style={{
            backgroundColor: 'var(--color-error)',
            fontSize: 'var(--font-size-base)',
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
          <Trash2 className="mr-2 h-4 w-4 max-md:w-3 max-md:h-3 max-md:mr-1" />
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <div
            className="rounded-lg p-6 max-w-md mx-4 shadow-2xl transition-all"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)'
            }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-lg)'
              }}
            >
              Confirm Account Deletion
            </h3>
            <p
              className="mb-6"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-base)'
              }}
            >
              Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border rounded-lg transition-all"
                style={{
                  color: 'var(--color-text-secondary)',
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'transparent',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-hover)';
                  e.target.style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--color-text-secondary)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 text-white rounded-lg transition-all"
                style={{
                  backgroundColor: 'var(--color-error)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountSettings;
