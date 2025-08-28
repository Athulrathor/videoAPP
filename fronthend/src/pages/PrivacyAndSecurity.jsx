
import React, { useCallback, useState,useRef,useEffect } from 'react';
import {
  Shield,
  Key,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  Trash2,
  Pause,
  Play,
  MapPin,
  Clock,
  Settings,
  AlertTriangle,
  Check,
  X,
  MoreVertical,
  Save,
  Lock
} from 'lucide-react';

const PrivacyAndSecurity = () => {
  // const [currentSection, setCurrentSection] = useState('password');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [watchHistoryPaused, setWatchHistoryPaused] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '12345678fghfgh',
    newPassword: '',
    confirmPassword: ''
  });

  const [getUserPassword, setGetUserPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for active devices
  const [activeDevices] = useState([
    {
      id: 1,
      name: 'iPhone 14 Pro',
      location: 'New York, NY',
      lastActive: '2 minutes ago',
      current: true,
      browser: 'Safari'
    },
    {
      id: 2,
      name: 'MacBook Pro',
      location: 'New York, NY',
      lastActive: '1 hour ago',
      current: false,
      browser: 'Chrome'
    },
    {
      id: 3,
      name: 'Windows PC',
      location: 'Los Angeles, CA',
      lastActive: '3 days ago',
      current: false,
      browser: 'Edge'
    }
  ]);

  // Mock data for watch history
  const [watchHistory] = useState([
    {
      id: 1,
      title: 'Introduction to React Hooks',
      duration: '45:30',
      watchedAt: '2024-08-01 14:30',
      progress: 100
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      duration: '1:20:15',
      watchedAt: '2024-08-01 10:15',
      progress: 75
    },
    {
      id: 3,
      title: 'CSS Grid Layout Tutorial',
      duration: '32:45',
      watchedAt: '2024-07-31 16:45',
      progress: 45
    },
    {
      id: 4,
      title: 'Node.js Backend Development',
      duration: '2:15:30',
      watchedAt: '2024-07-30 20:00',
      progress: 30
    }
  ]);

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

  // const handlePasswordToggle = (field) => {
  //   setShowPassword(prev => ({
  //     ...prev,
  //     [field]: !prev[field]
  //   }));
  // };




  // otp section 
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Check if OTP is complete
    const complete = otp.every(digit => digit !== '');
    setIsComplete(complete);

    if (complete) {
      // Simulate verification process
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        console.log('OTP Verified:', otp.join(''));
      }, 1500);
    }
  }, [otp]);

  const handleChange = (index, value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter' && isComplete) {
      handleVerify();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);

      // Focus the last filled input or first empty one
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleVerify = () => {
    if (isComplete) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        alert(`OTP Verified: ${otp.join('')}`);
      }, 1500);
    }
  };

  const handleClear = () => {
    setOtp(['', '', '', '', '', '']);
    setIsComplete(false);
    setIsVerifying(false);
    inputRefs.current[0]?.focus();
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setIsComplete(false);
    setIsVerifying(false);
    inputRefs.current[0]?.focus();
    // Simulate resend action
    alert('New OTP sent to your device!');
  };

  const simulateAutoFill = () => {
    const randomOtp = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10).toString());
    setOtp(randomOtp);
    inputRefs.current[5]?.focus();
  };
  

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
  },[errors]);

  // const handlePasswordChange = useCallback((e) => {
  //   const { name, value } = e.target;
  //   setPasswords(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));

  //   // Clear errors when user starts typing
  //   if (errors[name]) {
  //     setErrors(prev => ({
  //       ...prev,
  //       [name]: ''
  //     }));
  //   }
  // }, [errors]);

  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

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

      // Here you would call your actual API
      // await updatePassword({
      //   currentPassword: passwords.currentPassword,
      //   newPassword: passwords.newPassword
      // });

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

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
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

  // const handlePasswordSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Changing password...', passwordData);
  //   // Add password change logic here
  // };

  const handleDeviceLogout = (deviceId) => {
    console.log('Logging out device:', deviceId);
    // Add device logout logic here
  };

  const handleDeleteWatchHistory = (itemId) => {
    console.log('Deleting watch history item:', itemId);
    // Add delete logic here
  };

  const handleClearAllHistory = () => {
    console.log('Clearing all watch history...');
    // Add clear all logic here
  };

  // const sections = [
  //   { id: 'password', name: 'Password', icon: Key },
  //   { id: 'twoFactor', name: 'Two-Factor Auth', icon: Shield },
  //   { id: 'devices', name: 'Active Devices', icon: Monitor },
  //   { id: 'history', name: 'Watch History', icon: Clock }
  // ];

  return (
    <div className="w-full max-w-4xl mx-auto pl-4 pt-3 scrollBar max-md:p-0 bg-white overflow-y-auto h-[calc(100vh-65px)] max-md:h-[calc(100vh-53px)] max-xl:max-w-2xl max-md:max-w-full max-md:w-full sm:px-3 sm:pt-2 max-[400px]:pl-2">
      {/* Header */}
      <div className="mb-8 max-md:pt-4 max-md:pl-4 max-md:mb-4 max-sm:mb-2 max-[400px]:pl-2">
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

            {!isEditing ? (
              <div className="text-base">
                <button
                  onClick={handleStartEdit}
                  className=" text-white rounded-lg border-2 hover:border-blue-700 transition-colors flex items-center"
                >
                  {/* <Key className="mr-2 h-4 w-4" /> */}
                  <div className="relative">
                    <input
                      type={showPassword.currentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={"dskfjheufcsdn"}
                      // onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 pr-10 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      // onClick={() => togglePasswordVisibility('currentPassword')}
                      className="absolute inset-y-0 right-0 pr-3 text-black flex items-center hover:text-blue-600 transition-colors"
                    >
                      {showPassword.currentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.currentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('currentPassword')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                    >
                      {!showPassword.currentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                    
                    <div>
                      <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                          {/* Header */}
                          <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h2>
                            <p className="text-gray-600">Enter the 6-digit code sent to your device</p>
                          </div>

                          {/* OTP Input Fields */}
                          <div className="mb-8">
                            <div className="flex justify-center gap-3 mb-4">
                              {otp.map((digit, index) => (
                                <input
                                  key={index}
                                  ref={el => inputRefs.current[index] = el}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength="1"
                                  value={digit}
                                  onChange={(e) => handleChange(index, e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(index, e)}
                                  onPaste={index === 0 ? handlePaste : undefined}
                                  className={`
                    w-12 h-12 text-center text-xl font-semibold rounded-lg border-2 
                    transition-all duration-200 outline-none
                    ${digit
                                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                                      : 'border-gray-300 bg-white text-gray-900'
                                    }
                    ${isComplete && !isVerifying
                                      ? 'border-green-500 bg-green-50'
                                      : ''
                                    }
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  `}
                                />
                              ))}
                            </div>

                            {/* Status Indicator */}
                            <div className="text-center h-6">
                              {isVerifying && (
                                <div className="flex items-center justify-center gap-2 text-blue-600">
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-sm font-medium">Verifying...</span>
                                </div>
                              )}
                              {isComplete && !isVerifying && (
                                <div className="flex items-center justify-center gap-2 text-green-600">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-sm font-medium">Ready to verify</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-4">
                            <button
                              onClick={handleVerify}
                              disabled={!isComplete || isVerifying}
                              className={`
                w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
                ${isComplete && !isVerifying
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:scale-105 shadow-lg'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }
              `}
                            >
                              {isVerifying ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <div className="flex gap-3">
                              <button
                                onClick={handleClear}
                                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                              >
                                Clear
                              </button>
                              <button
                                onClick={handleResend}
                                className="flex-1 py-2 px-4 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                              >
                                Resend OTP
                              </button>
                            </div>

                            {/* Demo Button */}
                            <button
                              onClick={simulateAutoFill}
                              className="w-full py-2 px-4 text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                            >
                              🎯 Simulate Auto-Fill (Demo)
                            </button>
                          </div>

                          {/* Help Text */}
                          <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                              Didn't receive the code? Check your spam folder or try again
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>




                </div>
                <div className='hidden'>
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
              </form>
            )}
          </div>
          
          {/* 2FA Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-4 max-sm:px-3 max-sm:py-3 max-sm:mb-2 max-[400px]:px-1.5">
            <h2 className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
              Two-Factor Authentication
            </h2>
            <div className="space-y-6 max-sm:space-y-3">
              {/* SMS Auth Row */}
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
              {/* ...other 2FA sections... */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                <h3 className="font-medium text-gray-900 mb-2 text-base max-[400px]:text-xs">Authenticator App</h3>
                <p className="text-sm text-gray-600 mb-3 max-[400px]:text-xs">Use an authenticator app for more secure 2FA</p>
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-base max-[400px]:px-2 max-[400px]:py-1 max-[400px]:text-xs">
                  Set Up Authenticator
                </button>
              </div>
            </div>
          </div>
          {/* Active Devices */}
          <div className="bg-gray-50 rounded-lg p-6 mb-4 max-md:rounded-none max-sm:px-3 max-sm:py-3 max-sm:mb-2">
            <h2 className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold text-gray-900 mb-6 flex items-center">
              <Monitor className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
              Active Devices
            </h2>
            <div className="space-y-4 max-sm:space-y-2">
              {activeDevices.map((device) => (
                <div key={device.id} className="p-4 bg-white border border-gray-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                  <div className="flex items-center justify-between">
                                       <div className="flex items-center space-x-3 max-sm:space-x-1">
                                         <div className="p-2 bg-gray-100 rounded-lg">
                                           {device.name.includes('iPhone') ? (
                                            <Smartphone className="h-5 w-5 max-sm:w-4 text-gray-600" />
                                          ) : (
                                            <Monitor className="h-5 w-5 max-sm:w-4 text-gray-600" />
                                          )}
                                        </div>
                                        <div>
                                          <div className="flex items-center space-x-2 xa-msm:space-x-1">
                                            <h3 className="font-medium max-sm:text-sm text-gray-900">{device.name}</h3>
                                            {device.current && (
                                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                Current
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center text-sm max-sm:text-[10px] text-gray-600 space-x-4 max-sm:space-x-1.5">
                                            <span className="flex items-center">
                                              <MapPin className="h-3 w-3 mr-1 max-sm:w-2" />
                                              {device.location}
                                            </span>
                                            <span>Last active: {device.lastActive}</span>
                                            <span >{device.browser}</span>
                                          </div>
                                        </div>
                                      </div>
                                      {!device.current && (
                                        <button
                                          onClick={() => handleDeviceLogout(device.id)}
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
                  onClick={() => setWatchHistoryPaused(!watchHistoryPaused)}
                  className={`flex items-center max-sm:text-xs px-4 py-2 max-sm:px-2 max-sm:py-1 rounded-lg transition-colors ${watchHistoryPaused
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                >
                  {watchHistoryPaused ? (
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
              {watchHistory.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                  <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                     <h3 className="font-medium text-gray-900 max-sm:text-sm">{item.title}</h3>
                                    <div className="flex items-center text-sm max-sm:text-xs text-gray-600 space-x-4 max-sm:space-x-2 mt-1">
                                      <span>Duration: {item.duration}</span>
                                       <span>Watched: {item.watchedAt}</span>
                                       <span>Progress: {item.progress}%</span>
                                     </div>
                                     <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${item.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteWatchHistory(item.id)}
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
  )
}

export default PrivacyAndSecurity;


// <div className={` bg-gray-50 rounded-lg p-6 mb-4 max-sm:px-3 max-sm:py-3 max-sm:mb-2 max-[400px]:px-1.5`}>
//   <div>
//     <h2 className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold text-gray-900 mb-6 flex items-center">
//       <Key className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
//       Change Password
//     </h2>
//     <div className="space-y-6 max-sm:space-y-3">
//       {/* Current Password */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2 max-[400px]:text-xs">
//           Current Password
//         </label>
//         <div className="relative">
//           <input
//             type={showPassword.current ? 'text' : 'password'}
//             name="currentPassword"
//             value={passwordData.currentPassword}
//             onChange={handlePasswordChange}
//             className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm max-[400px]:px-2 max-[400px]:py-1"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => handlePasswordToggle('current')}
//             className="absolute inset-y-0 right-0 pr-3 flex items-center"
//           >
//             {showPassword.current ? (
//               <EyeOff className="h-4 w-4 text-gray-400" />
//             ) : (
//               <Eye className="h-4 w-4 text-gray-400" />
//             )}
//           </button>
//         </div>
//       </div>
//       {/* New Password */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2 max-[400px]:text-xs">
//           New Password
//         </label>
//         <div className="relative">
//           <input
//             type={showPassword.new ? 'text' : 'password'}
//             name="newPassword"
//             value={passwordData.newPassword}
//             onChange={handlePasswordChange}
//             className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm max-[400px]:px-2 max-[400px]:py-1"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => handlePasswordToggle('new')}
//             className="absolute inset-y-0 right-0 pr-3 flex items-center"
//           >
//             {showPassword.new ? (
//               <EyeOff className="h-4 w-4 text-gray-400" />
//             ) : (
//               <Eye className="h-4 w-4 text-gray-400" />
//             )}
//           </button>
//         </div>
//       </div>
//       {/* Confirm New Password */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2 max-[400px]:text-xs">
//           Confirm New Password
//         </label>
//         <div className="relative">
//           <input
//             type={showPassword.confirm ? 'text' : 'password'}
//             name="confirmPassword"
//             value={passwordData.confirmPassword}
//             onChange={handlePasswordChange}
//             className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm max-[400px]:px-2 max-[400px]:py-1"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => handlePasswordToggle('confirm')}
//             className="absolute inset-y-0 right-0 pr-3 flex items-center"
//           >
//             {showPassword.confirm ? (
//               <EyeOff className="h-4 w-4 text-gray-400" />
//             ) : (
//               <Eye className="h-4 w-4 text-gray-400" />
//             )}
//           </button>
//         </div>
//       </div>
//       {/* Submit Button */}
//       <button
//         type="button"
//         onClick={handlePasswordSubmit}
//         className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base max-[400px]:px-4 max-[400px]:py-1 max-sm:text-xs"
//       >
//         Update Password
//       </button>
//     </div>
//   </div>
// </div>
