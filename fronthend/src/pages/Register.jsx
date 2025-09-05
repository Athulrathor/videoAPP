import React, { useState, useEffect } from 'react';
import {
  User,Mail,Lock,Eye,EyeOff,Upload,Check,AlertCircle,ArrowRight,ArrowLeft,Camera,Shield,CheckCircle,Loader,RefreshCw,UserCheck,Play
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegisterUser, verifyEmail } from '../redux/features/user';
import { useNavigate } from 'react-router-dom';

const Register = () => {

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { emailVerified, emailVerificationLoading, emailVerificationError } = useSelector(state => state.user);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    coverImage: null,
  });

  const [previews, setPreviews] = useState({
    avatar: null,
    coverImage: null,
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullname':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';

      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';

      case 'username':
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username must be less than 20 characters';
        if (!usernameRegex.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';

      case 'password':
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!value) return 'Password is required';
        if (!passwordRegex.test(value)) return 'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character';
        return '';

      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';

      default:
        return '';
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-300'
    };
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name, value) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setFormData(prev => ({ ...prev, [type]: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews(prev => ({ ...prev, [type]: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep = (step) => {
    const stepErrors = {};

    switch (step) {
      case 1:
        stepErrors.fullname = validateField('fullname', formData.fullname);
        stepErrors.email = validateField('email', formData.email);
        break;
      case 2:
        stepErrors.username = validateField('username', formData.username);
        stepErrors.password = validateField('password', formData.password);
        stepErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
        break;
      case 3:
        // for image upload step,bugging
        break;
      default:
        break;
    }

    Object.keys(stepErrors).forEach(key => {
      if (!stepErrors[key]) delete stepErrors[key];
    });

    return stepErrors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);

      const fieldsToTouch = Object.keys(stepErrors);
      fieldsToTouch.forEach(field => {
        setTouched(prev => ({ ...prev, [field]: true }));
      });
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async () => {
    const allErrors = validateStep(2);

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    try {
      await dispatch(verifyEmail({ email: formData.email })).unwrap();
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(4);
      setResendTimer(60);
      setCanResend(false);

      toast.success("Registration successfull! Please verify your email!");
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error("Registration failed. Please try again!");
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.info('Please enter the complete 6-digit code');
      return;
    }

    try {
      if (emailVerified === otpString) {
        dispatch(fetchRegisterUser(formData)).unwrap();
        toast.success('Email verified and Registration Completed!');
        await new Promise(resolve => setTimeout(resolve, 1500));
        Navigate('/login', {replace: true});
        return;
      } else {
        toast.error('Invalid OTP. Please try again!');
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again.',error);
      setOtp(['', '', '', '', '', '']);
    }
  };

  const handleResendOTP = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.info('New OTP sent to your email');
      setResendTimer(60);
      setCanResend(false);
    } catch (error) {
      toast.error('Failed to resend OTP',error);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const stepInfo = [
    { title: 'Personal Info', icon: User, description: 'Basic information' },
    { title: 'Account Details', icon: Shield, description: 'Login credentials' },
    { title: 'Profile Setup', icon: Camera, description: 'Optional images' },
    { title: 'Verification', icon: Mail, description: 'Email confirmation' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 overflow-y-scroll h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <Play className="w-7 h-7 text-white" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              VidTube
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600 text-lg">Join millions of creators worldwide</p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex justify-between items-center mb-6">
            {stepInfo.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              const IconComponent = step.icon;

              return (
                <div key={stepNumber} className="flex flex-col items-center flex-1">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-semibold transition-all duration-300 mb-3 ${isCompleted
                    ? 'bg-green-500 text-white shadow-lg'
                    : isActive
                      ? 'bg-indigo-600 text-white shadow-lg transform scale-110'
                      : 'bg-gray-200 text-gray-500'
                    }`}>
                    {isCompleted ? (
                      <Check className="w-7 h-7" />
                    ) : (
                      <IconComponent className="w-7 h-7" />
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className={`font-semibold text-sm mb-1 ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-400 hidden sm:block">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-3xl">

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="text-center mb-8">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-600">Tell us about yourself</p>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => handleInputChange('fullname', e.target.value)}
                      onBlur={(e) => handleBlur('fullname', e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${errors.fullname
                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullname && (
                    <div className="flex items-center text-red-600 text-sm mt-2 animate-in slide-in-from-left duration-300">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.fullname}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={(e) => handleBlur('email', e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${errors.email
                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center text-red-600 text-sm mt-2 animate-in slide-in-from-left duration-300">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Account Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="text-center mb-8">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Details</h3>
                  <p className="text-gray-600">Choose your username and password</p>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Username *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserCheck className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      onBlur={(e) => handleBlur('username', e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${errors.username
                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                      placeholder="Choose a unique username"
                    />
                  </div>
                  {errors.username && (
                    <div className="flex items-center text-red-600 text-sm mt-2 animate-in slide-in-from-left duration-300">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.username}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type={showPassword.password ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      onBlur={(e) => handleBlur('password', e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${errors.password
                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword.password ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                      <div className="flex space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.strength
                              ? passwordStrength.color
                              : 'bg-gray-200'
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        Password strength: <span className="font-semibold">{passwordStrength.label}</span>
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <div className="flex items-start text-red-600 text-sm mt-2 animate-in slide-in-from-left duration-300">
                      <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Confirm Password *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${errors.confirmPassword
                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword.confirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center text-red-600 text-sm mt-2 animate-in slide-in-from-left duration-300">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Profile Setup */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="text-center mb-8">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Setup</h3>
                  <p className="text-gray-600">Add your profile picture and cover image (optional)</p>
                </div>

                {/* Avatar Upload */}
                <div className="text-center">
                  <label className="block text-sm font-semibold text-gray-700 mb-6">
                    Profile Picture
                  </label>
                  <div className="relative inline-block group">
                    <div className="w-40 h-40 rounded-full border-4 border-gradient-to-r from-purple-500 to-indigo-600 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-105">
                      {previews.avatar ? (
                        <img
                          src={previews.avatar}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all duration-200 hover:scale-110 transform"
                    >
                      <Camera className="w-6 h-6" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('avatar', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                    Cover Image
                  </label>
                  <div className="relative group">
                    <div className="w-full h-40 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center transition-all duration-300 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 group-hover:shadow-lg">
                      {previews.coverImage ? (
                        <img
                          src={previews.coverImage}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
                            <Upload className="w-8 h-8 text-indigo-500" />
                          </div>
                          <p className="text-gray-500 font-medium">Click to upload cover image</p>
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="cover-upload"
                      className="absolute inset-0 cursor-pointer"
                    >
                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('coverImage', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Recommended size: 1200x300px. Max file size: 5MB
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Email Verification */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Verify Your Email</h3>
                  <p className="text-gray-600 mb-2">We've sent a verification code to</p>
                  <p className="text-indigo-600 font-semibold break-all">{formData.email}</p>
                </div>

                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                    Enter Verification Code
                  </label>
                  <div className="flex gap-3 justify-center mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    ))}
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerifyOTP}
                    disabled={emailVerificationLoading || otp.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {emailVerificationLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Verify Email</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                  {!canResend ? (
                    <p className="text-sm text-gray-500">Resend available in {resendTimer}s</p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-2 mx-auto hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Resend Code</span>
                    </button>
                  )}
                </div>

                {emailVerificationError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <span className="text-red-700 text-sm">{emailVerificationError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons - Add this section if missing */}
            <div className="relative flex justify-between pt-8 mt-8 border-t border-gray-200">

              <div onClick={() => Navigate('/login',{replace: true})} className='absolute -translate-y-8 text-sm hover:text-blue-600 active:opacity-70  text-gray-600 flex items-center my-1 w-full'>
                <p>Already have an account?</p>
              </div>

              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Check className="w-5 h-5" />
                  <span>Create Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;