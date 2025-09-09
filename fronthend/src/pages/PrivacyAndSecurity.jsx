
import React, { useCallback, useEffect, useState } from 'react';
import {
  Shield,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  Trash2,
  Pause,
  Play,
  MapPin,
  Clock,
  AlertTriangle,
  X,
  Save,
  Lock,
  ArrowBigRight,
  ChevronRight
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearHistory, getWatchHistory, removingToWatchHistory, setWatchHistoryPaused, verifyPassword } from '../redux/features/user';

const PrivacyAndSecurity = () => {

  const dispatch = useDispatch();

  const { watchHistory, activeSession, watchHistoryPaused } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  // const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [watchHistoryPause, setWatchHistoryPause] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toggleNew, setToggleNew] = useState(false);

  const [step, SetStep] = useState(1);

  const [activeDevices] = useState([...activeSession]);

  useEffect(() => {
    dispatch(getWatchHistory());
  }, [dispatch]);

  const validatePassword = useCallback((password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return null;
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  const handleNext = () => {}

  const handleWatchHistoryPauseBtn = async () => {
    setWatchHistoryPause(!watchHistoryPause);

    if (watchHistoryPause) {
      await dispatch(setWatchHistoryPaused(true));
    } else {
      await dispatch(setWatchHistoryPaused(false));
    }
  }

  const handleValidatePassword = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await dispatch(verifyPassword(passwordData.currentPassword));
    setToggleNew(true);
  }

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordError = validatePassword(passwordData.newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    return newErrors;
  }, [passwordData, validatePassword]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Password updated successfully');

      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsEditing(false);
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      setErrors({ submit: 'Failed to update password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [passwordData, validateForm]);

  const handleCancel = useCallback(() => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setIsEditing(false);
    setShowPassword({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false
    });
  }, []);

  const getPasswordStrength = useCallback((password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-300'
    };
  }, []);

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  const handleDeviceLogout = (deviceId) => {
    console.log('Logging out device:', deviceId);
    // Add device logout logic here
  };

  const handleDeleteWatchHistory = async (itemId) => {
    console.log('Deleting watch history item:', itemId);
    await dispatch(removingToWatchHistory(itemId));
  };

  const handleClearAllHistory = async () => {
    console.log('Clearing all watch history...');
    await dispatch(clearHistory());
  };


  function timeAgo(createdAt) {
    const now = new Date();
    const created = new Date(createdAt);
    const difference = Math.floor((now - created) / 1000);

    if (difference < 60) {
      return `${difference} seconds ago`;
    } else if (difference < 3600) {
      const minutes = Math.floor(difference / 60);
      return `${minutes} minutes ago`;
    } else if (difference < 86400) {
      const hours = Math.floor(difference / 3600);
      return `${hours} hours ago`;
    } else if (difference < 2419200) {
      const days = Math.floor(difference / 86400);
      return `${days} days ago`;
    } else if (difference / 31536000) {
      const month = Math.floor(difference / 2419200);
      return `${month} month ago`;
    } else {
      const year = Math.floor(difference / 31536000);
      return `${year} year ago`;
    }
  }

  return (
    <div className='flex w-full pl-4 pt-3 scrollBar max-md:p-0 bg-white overflow-y-auto h-[calc(100vh-57px)] max-md:h-[calc(100vh-41px)] max-md:max-w-full sm:px-3 sm:pt-2 max-[400px]:pl-2'>
      <div className="flex-col max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:hidden max-md:pt-4 max-md:pl-4 max-md:mb-4 max-sm:mb-2 max-[400px]:pl-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 max-md:text-[18px] max-sm:text-lg max-[400px]:text-base">
            Privacy & Security
          </h1>
          <p className="text-gray-600 max-md:text-sm max-[400px]:text-xs">
            Manage your account security and privacy settings
          </p>
        </div>

        <div className="flex lg:flex-row flex-col gap-8 max-lg:gap-4 max-md:gap-2">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Password Change Section */}


            <div className=" mx-auto p-6 bg-gray-50 rounded-lg shadow-xs my-4 max-md:my-3 max-sm:my-2">
              <div className="mb-6">
                <h2 className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold text-gray-900 mb-6 flex items-center">
                  <Lock className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
                  Change Password
                </h2>
                {/* <p className="text-gray-600 text-sm">
                Update your password to keep your account secure
              </p> */}
              </div>

              {step === 1 && (
                <div className="text-base">
                  <div
                    className=" text-white transition-colors flex items-center"
                  >
                    {/* <Key className="mr-2 h-4 w-4" /> */}
                    <div className="relative w-fit">
                      <input
                        type={'password'}
                        name="currentPasswordCover"
                        value={"password!password!password"}
                        disabled
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 pr-10 text-black border border-gray-300 rounded-lg ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter current password"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className=" ml-2 border px-3 py-2 border-gray-300 rounded-lg hover:bg-gray-400 text-black flex items-center hover:text-blue-600 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password */}
                {step === 2 && (
                  <div>
                    <div className=''>
                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.newPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                              }`}
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('newPassword')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                          >
                            {showPassword.newPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {passwordData.newPassword && (
                          <div className="mt-2">
                            <div className="flex space-x-1 mb-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`h-2 flex-1 rounded ${level <= passwordStrength.strength
                                    ? passwordStrength.color
                                    : 'bg-gray-200'
                                    }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-600">
                              Password strength: <span className="font-medium">{passwordStrength.label}</span>
                            </p>
                          </div>
                        )}

                        {errors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.confirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                              }`}
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                          >
                            {showPassword.confirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                      </div>



                      {/* Password Requirements */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li className={passwordData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                            • At least 8 characters long
                          </li>
                          <li className={/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : ''}>
                            • One uppercase letter
                          </li>
                          <li className={/[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : ''}>
                            • One lowercase letter
                          </li>
                          <li className={/\d/.test(passwordData.newPassword) ? 'text-green-600' : ''}>
                            • One number
                          </li>
                          <li className={/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'text-green-600' : ''}>
                            • One special character
                          </li>
                        </ul>
                      </div>

                      {/* Submit Error */}
                      {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                      )}


                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Password
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className='flex'>
                        <div className={`w-fit relative flex justify-end items-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                          }`}>
                          <input
                            type={showPassword.currentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-2 py-2 pr-1 outline-none focus:ring-0 focus:outline-none`}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('currentPassword')}
                            className="pr-2 flex items-center justify-center hover:text-blue-600 transition-colors"
                          >
                            {!showPassword.currentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <button onClick={handleValidatePassword} className='flex justify-center hover:bg-gray-50 active:bg-gray-100 active:opacity-60 items-center p-2 aspect-square'>
                          <ChevronRight />
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                      )}

                    </div>
                  </div>
                )}
                  


              </form>
            </div>

            {/* 2FA Section */}
            {/* <div className="bg-gray-50 rounded-lg p-6 mb-4 max-sm:px-3 max-sm:py-3 max-sm:mb-2 max-[400px]:px-1.5">
            <h2 className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
              Two-Factor Authentication
            </h2>
            <div className="space-y-6 max-sm:space-y-3">

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                <div>
                  <h3 className="font-medium text-gray-900 text-base max-[400px]:text-xs">SMS Authentication</h3>
                  <p className="text-sm text-gray-600 max-[400px]:text-xs">Receive codes via text message</p>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors text-xs ${twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                <h3 className="font-medium text-gray-900 mb-2 text-base max-[400px]:text-xs">Authenticator App</h3>
                <p className="text-sm text-gray-600 mb-3 max-[400px]:text-xs">Use an authenticator app for more secure 2FA</p>
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-base max-[400px]:px-2 max-[400px]:py-1 max-[400px]:text-xs">
                  Set Up Authenticator
                </button>
              </div>
            </div>
            </div> */}

            {/* Active Devices */}
            <div className="bg-gray-50 rounded-lg p-6 mb-4 max-md:rounded-none max-sm:px-3 max-sm:py-3 max-sm:mb-2">
              <h2 className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold text-gray-900 mb-6 flex items-center">
                <Monitor className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
                Active Devices
              </h2>
              <div className="space-y-4 max-sm:space-y-2">
                <div>
                  {activeDevices.length === 0 && (
                    <p>No active device found.</p>
                  )}
                </div>
                {activeDevices.map((device) => (
                  <div key={device?._id} className="p-4 bg-white border border-gray-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 max-sm:space-x-1">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {device?.os === "android" || device?.os === 'iphone' ? (
                            <Smartphone className="h-5 w-5 max-sm:w-4 text-gray-600" />
                          ) : (
                            <Monitor className="h-5 w-5 max-sm:w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 xa-msm:space-x-1">
                            <h3 className="font-medium max-sm:text-sm text-gray-900">{device?.deviceName}</h3>
                            {device?.isActive && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-sm max-sm:text-[10px] text-gray-600 space-x-4 max-sm:space-x-1.5">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 max-sm:w-2" />
                              {device?.location || 'New delhi INDIA'}
                            </span>
                            <span>Last active: {timeAgo(device?.lastActivity)}</span>
                            <span >{device?.browser}</span>
                          </div>
                        </div>
                      </div>
                      {!device?.isActive && (
                        <button
                          onClick={() => handleDeviceLogout(device?.id)}
                          className="px-3 py-1 max-sm:px-1.5 max-sm:py-0.5 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors max-sm:text-xs"
                        >
                          Sign Out
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 max-sm:h-4 max-[400px]:h-3" />
                  <div>
                    <h3 className="font-medium text-amber-800 text-base max-[400px]:text-xs">Security Tip</h3>
                    <p className="text-amber-700 text-sm mt-1 max-[400px]:text-xs">
                      If you see any unfamiliar devices, sign them out immediately and change your password.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Watch History */}
            <div className="bg-gray-50 rounded-lg p-6 mb-4 max-sm:px-3 max-sm:py-3 max-sm:mb-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 max-sm:mb-3">
                <h2 className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold text-gray-900 flex items-center">
                  <Clock className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
                  Watch History
                </h2>
                <div className="flex items-center space-x-3 max-sm:space-x-2 mt-2 sm:mt-0">
                  <button
                    onClick={handleWatchHistoryPauseBtn}
                    className={`flex items-center max-sm:text-xs px-4 py-2 max-sm:px-2 max-sm:py-1 rounded-lg transition-colors ${watchHistoryPause
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                      }`}
                  >
                    {watchHistoryPause ? (
                      <>
                        <Play className="mr-2 max-sm:mr-1 h-4 w-4 max-sm:w-3 stroke-2" />
                        Resume Tracking
                      </>
                    ) : (
                      <>
                        <Pause className="mr-2 h-4 max-sm:mr-1 w-4 max-sm:w-3 stroke-2" />
                        Pause Tracking
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClearAllHistory}
                    className="flex items-center px-4 py-2 max-sm:text-xs max-sm:px-2 max-sm:py-1 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="mr-2 h-4 w-4 max-sm:mr-1 max-sm:w-3 stroke-2" />
                    Clear All
                  </button>
                </div>
              </div>
              <div className="space-y-4 max-sm:space-y-2">
                {watchHistory?.map((item) => (
                  <div key={item?._id} className="p-4 bg-white border border-gray-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 max-sm:text-sm">{item?.title}</h3>
                        <div className="flex items-center text-sm max-sm:text-xs text-gray-600 space-x-4 max-sm:space-x-2 mt-1">
                          <span>Duration: {item?.duration}</span>
                          <span>Watched: {item?.watchedAt}</span>
                          <span>Progress: {item?.progress}%</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item?.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteWatchHistory(item._id)}
                        className="ml-4 max-sm:ml-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                <h3 className="font-medium text-blue-800 mb-2 text-base max-[400px]:text-xs">Privacy Controls</h3>
                <p className="text-blue-700 text-sm mb-3 max-[400px]:text-xs">
                  Control how your watch history is used for recommendations and personalization.
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-blue-800 max-[400px]:text-xs">Use watch history for recommendations</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-blue-800 max-[400px]:text-xs">Include in search suggestions</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyAndSecurity;
