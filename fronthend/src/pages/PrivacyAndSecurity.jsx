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
  ChevronRight
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { activeSessions, clearHistory, getWatchHistory, removingToWatchHistory, setWatchHistoryPaused, updatePassword, verifyPassword } from '../redux/features/user';
import { toast } from 'react-toastify';
import { Tooltip } from '@mui/material';
import { useAppearance } from '../hooks/appearances';

const PrivacyAndSecurity = () => {
  const dispatch = useDispatch();
  const { appearanceSettings } = useAppearance();

  const { user, watchHistory, activeSession } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [watchHistoryPause, setWatchHistoryPause] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, SetStep] = useState(1);

  const activeDevices = activeSession;

  useEffect(() => {
    dispatch(getWatchHistory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(activeSessions())
  }, [dispatch])

  // All your existing validation, form handling, and other functions remain the same...
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

  const handleNext = () => {
    SetStep(prev => prev + 1);
  }

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

  const handleWatchHistoryPauseBtn = async () => {
    setWatchHistoryPause(!watchHistoryPause);

    if (watchHistoryPause) {
      await dispatch(setWatchHistoryPaused(true));
    } else {
      await dispatch(setWatchHistoryPaused(false));
    }
  }

  const handleValidatePassword = async (e) => {
    e.preventDefault();
    await new Promise(resolve => setTimeout(resolve, 2000));
    const response = await dispatch(verifyPassword(passwordData.currentPassword));
    if (response.payload) {
      handleNext();
    } else {
      toast.error('Invalid Password!');
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await dispatch(updatePassword({ newPassword: passwordData.newPassword, UserId: user._id }));
      if (response.payload !== true) return toast.error("Password update failed!");

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      SetStep(1);
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      setErrors({ submit: 'Failed to update password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    SetStep(1);
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
    <div
      className='flex w-full pl-4 pt-3 scrollBar max-md:p-0 overflow-y-auto h-[calc(100vh-57px)] max-md:h-[calc(100vh-41px)] max-md:max-w-full sm:px-3 sm:pt-2 max-[400px]:pl-2 transition-all'
      style={{
        backgroundColor: appearanceSettings.customBackground ? 'transparent' : "var(--color-bg-primary)",
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family)',
        transitionDuration: 'var(--animation-duration)'
      }}
    >
      <div
        className="flex-col max-w-3xl mx-auto"
        style={{
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-family)'
        }}
      >
        {/* Header */}
        <div
          className="mb-8 md:hidden max-md:pt-4 max-md:pl-4 max-md:mb-4 max-sm:mb-2 max-[400px]:pl-2"
          style={{ marginBottom: 'var(--section-gap)' }}
        >
          <h1
            className="text-3xl font-bold mb-2 max-md:text-[18px] max-sm:text-lg max-[400px]:text-base"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-3xl)',
              fontFamily: 'var(--font-family)'
            }}
          >
            Privacy & Security
          </h1>
          <p
            className="max-md:text-sm max-[400px]:text-xs"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            Manage your account security and privacy settings
          </p>
        </div>

        <div className="flex lg:flex-row flex-col gap-8 max-lg:gap-4 max-md:gap-2">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Password Change Section */}
            <div
              className="mx-auto p-6 rounded-lg shadow-sm my-4 max-md:my-3 max-sm:my-2 transition-all"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                padding: 'var(--component-padding)',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              <div
                className="mb-6"
                style={{ marginBottom: 'var(--component-padding)' }}
              >
                <h2
                  className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold mb-6 flex items-center"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-xl)',
                    marginBottom: 'var(--component-padding)'
                  }}
                >
                  <Lock className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
                  Change Password
                </h2>
              </div>

              {step === 1 && (
                <div className="text-base">
                  <div className="text-white transition-colors flex items-center">
                    <div className="relative w-fit">
                      <input
                        type={'password'}
                        name="currentPasswordCover"
                        value={"password!password!password"}
                        disabled
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 text-black border rounded-lg"
                        placeholder="Enter current password"
                        style={{
                          backgroundColor: 'var(--color-bg-primary)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-primary)',
                          opacity: '0.7'
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="ml-2 border px-3 py-2 rounded-lg flex items-center transition-all"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-hover)';
                        e.target.style.color = 'var(--accent-color)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'var(--color-text-primary)';
                      }}
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              <form className="space-y-4">
                {step === 2 && (
                  <div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-sm)'
                        }}
                      >
                        Current Password
                      </label>
                      <div className='flex'>
                        <div
                          className="w-fit relative flex justify-end items-center border rounded-lg focus:ring-2 transition-all"
                          style={{
                            borderColor: errors.currentPassword ? 'var(--color-error)' : 'var(--color-border)',
                            focusRingColor: 'var(--accent-color)',
                            transitionDuration: 'var(--animation-duration)'
                          }}
                        >
                          <input
                            type={showPassword.currentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-2 py-2 pr-1 outline-none focus:ring-0 focus:outline-none"
                            placeholder="Enter current password"
                            style={{
                              backgroundColor: 'var(--color-bg-primary)',
                              color: 'var(--color-text-primary)',
                              fontFamily: 'var(--font-family)'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('currentPassword')}
                            className="pr-2 flex items-center justify-center transition-colors"
                            style={{
                              color: 'var(--color-text-secondary)',
                              transitionDuration: 'var(--animation-duration)'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                          >
                            {!showPassword.currentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={(e) => handleValidatePassword(e)}
                          className='flex justify-center items-center p-2 aspect-square transition-all'
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--color-text-primary)',
                            transitionDuration: 'var(--animation-duration)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--color-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                          }}
                          onMouseDown={(e) => {
                            e.target.style.backgroundColor = 'var(--color-active)';
                            e.target.style.opacity = '0.6';
                          }}
                          onMouseUp={(e) => {
                            e.target.style.backgroundColor = 'var(--color-hover)';
                            e.target.style.opacity = '1';
                          }}
                        >
                          <ChevronRight />
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p
                          className="mt-1 text-sm"
                          style={{
                            color: 'var(--color-error)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div className="">
                      {/* New Password */}
                      <div className="mb-4">
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.newPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                            placeholder="Enter new password"
                            style={{
                              backgroundColor: 'var(--color-bg-primary)',
                              borderColor: errors.newPassword ? 'var(--color-error)' : 'var(--color-border)',
                              color: 'var(--color-text-primary)',
                              fontFamily: 'var(--font-family)',
                              transitionDuration: 'var(--animation-duration)'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = 'var(--accent-color)';
                              e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = errors.newPassword ? 'var(--color-error)' : 'var(--color-border)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('newPassword')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                            style={{
                              color: 'var(--color-text-secondary)',
                              transitionDuration: 'var(--animation-duration)'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
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
                                  style={{
                                    backgroundColor: level <= passwordStrength.strength
                                      ? undefined
                                      : 'var(--color-border)'
                                  }}
                                />
                              ))}
                            </div>
                            <p
                              className="text-xs"
                              style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-xs)'
                              }}
                            >
                              Password strength: <span className="font-medium">{passwordStrength.label}</span>
                            </p>
                          </div>
                        )}

                        {errors.newPassword && (
                          <p
                            className="mt-1 text-sm"
                            style={{
                              color: 'var(--color-error)',
                              fontSize: 'var(--font-size-sm)'
                            }}
                          >
                            {errors.newPassword}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="mb-4">
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.confirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                            placeholder="Confirm new password"
                            style={{
                              backgroundColor: 'var(--color-bg-primary)',
                              borderColor: errors.confirmPassword ? 'var(--color-error)' : 'var(--color-border)',
                              color: 'var(--color-text-primary)',
                              fontFamily: 'var(--font-family)',
                              transitionDuration: 'var(--animation-duration)'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = 'var(--accent-color)';
                              e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = errors.confirmPassword ? 'var(--color-error)' : 'var(--color-border)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                            style={{
                              color: 'var(--color-text-secondary)',
                              transitionDuration: 'var(--animation-duration)'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                          >
                            {showPassword.confirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p
                            className="mt-1 text-sm"
                            style={{
                              color: 'var(--color-error)',
                              fontSize: 'var(--font-size-sm)'
                            }}
                          >
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      {/* Password Requirements */}
                      <div
                        className="p-3 rounded-lg mb-4"
                        style={{
                          backgroundColor: 'var(--color-bg-secondary)',
                          border: '1px solid var(--color-border)'
                        }}
                      >
                        <h4
                          className="text-sm font-medium mb-2"
                          style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          Password Requirements:
                        </h4>
                        <ul
                          className="text-xs space-y-1"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)'
                          }}
                        >
                          <li
                            style={{
                              color: passwordData.newPassword.length >= 8 ? 'var(--color-success)' : 'var(--color-text-secondary)'
                            }}
                          >
                            • At least 8 characters long
                          </li>
                          <li
                            style={{
                              color: /[A-Z]/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)'
                            }}
                          >
                            • One uppercase letter
                          </li>
                          <li
                            style={{
                              color: /[a-z]/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)'
                            }}
                          >
                            • One lowercase letter
                          </li>
                          <li
                            style={{
                              color: /\d/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)'
                            }}
                          >
                            • One number
                          </li>
                          <li
                            style={{
                              color: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)'
                            }}
                          >
                            • One special character
                          </li>
                        </ul>
                      </div>

                      {/* Submit Error */}
                      {errors.submit && (
                        <div
                          className="border rounded-lg p-3 mb-4"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderColor: 'rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          <p
                            className="text-sm"
                            style={{
                              color: 'var(--color-error)',
                              fontSize: 'var(--font-size-sm)'
                            }}
                          >
                            {errors.submit}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 px-4 py-2 border rounded-lg transition-all flex items-center justify-center"
                          style={{
                            backgroundColor: 'transparent',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-secondary)',
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
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </button>
                        <button
                          disabled={isLoading}
                          onClick={handleSubmit}
                          className="flex-1 px-4 py-2 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          style={{
                            backgroundColor: 'var(--color-success)',
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
              </form>
            </div>

            {/* Active Devices */}
            <div
              className="rounded-lg p-6 mb-4 max-md:rounded-none max-sm:px-3 max-sm:py-3 max-sm:mb-2 transition-all"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                padding: 'var(--component-padding)',
                marginBottom: 'var(--section-gap)',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              <h2
                className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold mb-6 flex items-center"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-xl)',
                  marginBottom: 'var(--component-padding)'
                }}
              >
                <Monitor className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
                Active Devices
              </h2>
              <div className="space-y-4 max-sm:space-y-2">
                <div>
                  {activeDevices.length === 0 && (
                    <p style={{ color: 'var(--color-text-secondary)' }}>No active device found.</p>
                  )}
                </div>
                {activeDevices.map((device) => (
                  <div
                    key={device?._id}
                    className="p-4 border rounded-lg max-sm:p-2 max-[400px]:p-1.5 transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      borderColor: 'var(--color-border)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 max-sm:space-x-1">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                        >
                          {device?.os === "android" || device?.os === 'iphone' ? (
                            <Smartphone
                              className="h-5 w-5 max-sm:w-4"
                              style={{ color: 'var(--color-text-secondary)' }}
                            />
                          ) : (
                            <Monitor
                              className="h-5 w-5 max-sm:w-4"
                              style={{ color: 'var(--color-text-secondary)' }}
                            />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 xa-msm:space-x-1">
                            <h3
                              className="font-medium max-sm:text-sm"
                              style={{ color: 'var(--color-text-primary)' }}
                            >
                              {device?.deviceName}
                            </h3>
                            {device?.isActive && (
                              <span
                                className="px-2 py-1 text-xs rounded-full"
                                style={{
                                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                  color: 'var(--color-success)'
                                }}
                              >
                                Current
                              </span>
                            )}
                          </div>
                          <div
                            className="flex items-center text-sm max-sm:text-[10px] space-x-4 max-sm:space-x-1.5"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 max-sm:w-2" />
                              {device?.location || 'New delhi INDIA'}
                            </span>
                            <span>Last active: {timeAgo(device?.lastActivity)}</span>
                            <span>{device?.browser}</span>
                          </div>
                        </div>
                      </div>
                      {!device?.isActive && (
                        <button
                          onClick={() => handleDeviceLogout(device?.id)}
                          className="px-3 py-1 max-sm:px-1.5 max-sm:py-0.5 border rounded max-sm:text-xs transition-all"
                          style={{
                            color: 'var(--color-error)',
                            borderColor: 'var(--color-error)',
                            backgroundColor: 'transparent',
                            transitionDuration: 'var(--animation-duration)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                          }}
                        >
                          Sign Out
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-6 p-4 border rounded-lg max-sm:p-2 max-[400px]:p-1.5"
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderColor: 'rgba(245, 158, 11, 0.3)'
                }}
              >
                <div className="flex items-start">
                  <AlertTriangle
                    className="h-5 w-5 mr-2 mt-0.5 max-sm:h-4 max-[400px]:h-3"
                    style={{ color: 'var(--color-warning)' }}
                  />
                  <div>
                    <h3
                      className="font-medium text-base max-[400px]:text-xs"
                      style={{ color: 'var(--color-warning)' }}
                    >
                      Security Tip
                    </h3>
                    <p
                      className="text-sm mt-1 max-[400px]:text-xs"
                      style={{ color: 'var(--color-warning)', opacity: '0.8' }}
                    >
                      If you see any unfamiliar devices, sign them out immediately and change your password.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Watch History */}
            <div
              className="rounded-lg p-6 mb-4 max-sm:px-3 max-sm:py-3 max-sm:mb-2 transition-all"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                padding: 'var(--component-padding)',
                marginBottom: 'var(--section-gap)',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 max-sm:mb-3">
                <h2
                  className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold flex items-center"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-xl)'
                  }}
                >
                  <Clock className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
                  Watch History
                </h2>
                <div className="flex items-center space-x-3 max-sm:space-x-2 mt-2 sm:mt-0">
                  <button
                    onClick={handleWatchHistoryPauseBtn}
                    className="flex items-center max-sm:text-xs px-4 py-2 max-sm:px-2 max-sm:py-1 rounded-lg transition-all text-white"
                    style={{
                      backgroundColor: watchHistoryPause ? 'var(--color-success)' : 'var(--color-warning)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '1';
                    }}
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
                    className="flex items-center px-4 py-2 max-sm:text-xs max-sm:px-2 max-sm:py-1 border rounded-lg transition-all"
                    style={{
                      color: 'var(--color-error)',
                      borderColor: 'var(--color-error)',
                      backgroundColor: 'transparent',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4 max-sm:mr-1 max-sm:w-3 stroke-2" />
                    Clear All
                  </button>
                </div>
              </div>
              <div className="space-y-4 max-sm:space-y-2">
                {watchHistory?.map((item) => (
                  <div
                    key={item?._id}
                    className="p-4 border rounded-lg max-sm:p-2 max-[400px]:p-1.5 transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      borderColor: 'var(--color-border)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3
                          className="font-medium max-sm:text-sm"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {item?.title}
                        </h3>
                        <div
                          className="flex items-center text-sm max-sm:text-xs space-x-4 max-sm:space-x-2 mt-1"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          <span>Duration: {item?.duration}</span>
                          <span>Watched: {item?.watchedAt}</span>
                          <span>Progress: {item?.progress}%</span>
                        </div>
                        <div
                          className="mt-2 w-full rounded-full h-2"
                          style={{ backgroundColor: 'var(--color-border)' }}
                        >
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${item?.progress}%`,
                              backgroundColor: 'var(--accent-color)'
                            }}
                          ></div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteWatchHistory(item._id)}
                        className="ml-4 max-sm:ml-0 p-2 transition-colors"
                        style={{
                          color: 'var(--color-text-secondary)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--color-error)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Tooltip title="Not available right now!">
                <div
                  className="opacity-50 mt-6 p-4 border rounded-lg max-sm:p-2 max-[400px]:p-1.5"
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: 'rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <h3
                    className="font-medium mb-2 text-base max-[400px]:text-xs"
                    style={{ color: 'var(--accent-color)' }}
                  >
                    Privacy Controls
                  </h3>
                  <p
                    className="text-sm mb-3 max-[400px]:text-xs"
                    style={{ color: 'var(--accent-color)', opacity: '0.8' }}
                  >
                    Control how your watch history is used for recommendations and personalization.
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span
                        className="text-sm max-[400px]:text-xs"
                        style={{ color: 'var(--accent-color)' }}
                      >
                        Use watch history for recommendations
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span
                        className="text-sm max-[400px]:text-xs"
                        style={{ color: 'var(--accent-color)' }}
                      >
                        Include in search suggestions
                      </span>
                    </label>
                  </div>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyAndSecurity;
