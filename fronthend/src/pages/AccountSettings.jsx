import { Calendar, ImageUp, Mail, MapPin, Phone, Save, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { accountDeleted, currentUpdatedUser, updateAccountDetails, updateAvatar, updateCoverImage } from '../redux/features/user';

const AccountSettings = () => {

  const dispatch = useDispatch();

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

  console.log(updateAvatarProgress, updateCoverImageProgress, updateAvatarStatus, updateCoverImageStatus, updateAccountLoading)

  const [ImagesSend, setImagesSend] = useState({})

  const [previewImages, setPreviewImages] = useState({})

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
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    dispatch(accountDeleted(user?._id));
    setShowDeleteConfirm(false);
  };

  const handleAvatarImageInput = (e) => {
    const { name, files } = e.target;
    
    // Check if files were selected
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }
 
    setImagesSend((prev) => ({ ...prev, [name]: files[0] }))

    setImagesSend((prev) => ({ ...prev, [name]: files[0] }))

    const url = URL.createObjectURL(files[0]);

    setPreviewImages((prev) => ({ ...prev, [name]: url }));

    setIsEditing(true);
  }

  const handleCoverImageInput = (e) => {
    const { name, files } = e.target;

    // Check if files were selected
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    setImagesSend((prev) => ({ ...prev, [name]: files[0] }))

    const url = URL.createObjectURL(files[0]);

    setPreviewImages((prev) => ({ ...prev, [name]: url }));

    setIsEditing(true);
  }

  const handleSubmitData = () => {

    if (ImagesSend["avatar"]) {
      dispatch(updateAvatar(ImagesSend.avatar)).unwrap();
      console.log("avatar updated started")
    }

    if (ImagesSend["coverImage"]) {
      dispatch(updateCoverImage(ImagesSend.coverImage)).unwrap();
      console.log("coverImage updated started")
    }

    if (formData) {
      dispatch(updateAccountDetails({ username: formData.username, fullname: formData.fullname, email: formData.email })).unwrap();
      console.log("account details updated started")
    }

    dispatch(currentUpdatedUser());
    setIsEditing(false);
  }

  return (
    <div>
      <div className="w-4xl pl-4 pt-3  max-md:p-4 bg-white overflow-y-auto scrollBar h-[calc(100vh-65px)] max-md:h-[calc(100vh-53px)] max-xl:w-2xl max-md:w-screen max-[1040px]:w-2xl">
        {/* Header */}
        <div className="mb-8 max-md:mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 max-md:text-[18px]">Account Settings</h1>
          <p className="text-gray-600 max-md:text-sm">Manage your profile information</p>
        </div>

        {/* Profile Section */}
        <div className="mx-4 max-md:mx-0 p-6 max-lg:p-0 mb-8 ">
          <div>
            <div>
              {/* Cover Image Container */}
              <div>
                <div className='relative w-full h-[200px] bg-gray-100 border-2 border-gray-200  my-3 flex items-center justify-center rounded-lg shadow-2xs overflow-hidden'>
                  <img
                    src={previewImages.coverImage ? previewImages.coverImage : user?.coverImage}
                    alt="Cover"
                    loading='lazy'
                    className='w-full h-full object-cover overflow-hidden'
                    style={{ imageRendering: 'auto' }}
                  />
                  <div className='absolute bottom-2 right-2 p-2 rounded-full bg-gray-100 active:bg-gray-200 hover:bg-gray-200 cursor-pointer'>
                    <label htmlFor="1" className='cursor-pointer'>
                      <ImageUp />
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
              </div>
              
              </div>

              {/* Avatar Container */}
              <div>
                <div className='relative bg-gray-100 border-2 border-gray-200 mt-2 h-[180px] w-[180px] flex items-center justify-center rounded-full shadow-2xs '>
                  <img
                    src={previewImages.avatar ? previewImages.avatar : user?.avatar}
                    alt="Avatar"
                    loading='lazy'
                    className='w-full h-full object-cover z-20 rounded-full overflow-hidden'
                    style={{ imageRendering: 'auto' }}
                  />
                  <div className='absolute z-30 bottom-2 right-2 p-2 rounded-full bg-gray-100 active:bg-gray-200 hover:bg-gray-200 cursor-pointer'>
                    <label htmlFor="2" className='cursor-pointer'>
                      <ImageUp />
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
                </div>
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Name
              </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                 {/* <p className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900">
                   {formData.username}
                 </p> */}

            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* <p className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900">
                    {formData.fullName}
                </p> */}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                <Mail className="mr-1 h-4 w-4" />
                Email Address
              </label>
 
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* <p className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900">
                  {formData.email}
                </p> */}

            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                <Phone className="mr-1 h-4 w-4" />
                Phone Number
              </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              {/* <p className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900">
                  {formData.phone}
                </p> */}

            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                <MapPin className="mr-1 h-4 w-4" />
                Location
              </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* <p className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900">
                  {formData.location}
                </p> */}

            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Birth Date
              </label>

                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />

              {/* <p className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900">
                {formData.bio}
              </p> */}

          </div>

          {/* Edit Mode Actions */}

          <div className={`${isEditing ? "" : "hidden"} flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200`}>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitData}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      
        {/* Danger Zone */}
        <div className="bg-red-50 border max-lg:p-3 lg:mx-0 max-md:p-2 mx-8 max-md:mx-0 border-red-200 rounded-lg p-6">
          <h3 className="text-lg max-md:text-sm font-semibold text-red-800 mb-2">Danger Zone</h3>
          <p className="text-red-700 mb-4 text-sm max-md:text-xs">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center px-4 py-2 max-md:px-2 max-md:py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="mr-2 h-4 w-4 max-md:w-3 max-md:h-3 max-md:mr-1" />
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Account Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountSettings;
