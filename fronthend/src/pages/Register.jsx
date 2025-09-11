import React, { useState, useEffect } from 'react';
import {
  User, Mail, Lock, Eye, EyeOff, Upload, Check, AlertCircle, ArrowRight, ArrowLeft,
  Camera, Shield, CheckCircle, Loader, RefreshCw, UserCheck, Play
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegisterUser, verifyEmailVerification } from '../redux/features/user';
import { useNavigate } from 'react-router-dom';
import favicon from '../assets/favicon.png';
import { useAppearance } from '../hooks/appearances';

const Register = () => {
  const { appearanceSettings } = useAppearance();
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

  const [emailStatus, setEmailStatus] = useState(false);
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

  // All your existing validation and handler functions remain the same...
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
    const colors = ['var(--color-error)', 'var(--color-warning)', 'var(--color-warning)', 'var(--accent-color)', 'var(--color-success)'];

    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'var(--color-border)'
    };
  };

  // All other existing handlers remain the same...
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
      toast.info('File size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.info('Please select an image file');
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
        // Image upload step
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

  // All other handlers remain the same...
  useEffect(() => {
    if (currentStep === 4) {
      dispatch(verifyEmailVerification(formData.email));
      setResendTimer(60);
    }
  }, [dispatch, currentStep, formData]);

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
      await dispatch(fetchRegisterUser(formData)).unwrap();
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Registration successful! Please verify your email!");
      setCurrentStep(4);
      setResendTimer(60);
      setCanResend(false);
      Navigate('/login', { replace: true });
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
        toast.success('Email verified and Registration Completed!');
        setEmailStatus(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return;
      } else {
        toast.error('Invalid OTP. Please try again!');
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again.', error);
      setOtp(['', '', '', '', '', '']);
    }
  };

  const handleResendOTP = async () => {
    try {
      await dispatch(verifyEmailVerification(formData.email)).unwrap()
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.info('New OTP sent to your email');
      setResendTimer(60);
      setCanResend(false);
    } catch (error) {
      toast.error('Failed to resend OTP', error);
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
    <div
      className="min-h-screen py-8 scrollBar overflow-y-scroll h-screen transition-all"
      style={{
        background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
        transitionDuration: 'var(--animation-duration)',
        fontFamily: 'var(--font-family)'
      }}
      role="main"
      aria-label="Registration form"
    >
      <div
        className="container max-w-4xl mx-auto max-sm:px-2 px-4"
        style={{ padding: 'var(--component-padding)' }}
      >
        {/* Header */}
        <div
          className="text-center mb-8"
          style={{ marginBottom: 'var(--section-gap)' }}
        >
          <div
            className="flex items-center justify-center mb-6"
            style={{ marginBottom: 'var(--section-gap)' }}
          >
            <img
              src={favicon}
              alt="VidTube Logo"
              className='w-12 h-12 max-sm:mr-1 mr-3'
              style={{ marginRight: 'var(--spacing-unit)' }}
            />
            <h1
              className="text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, var(--color-text-primary), var(--accent-color))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: 'var(--font-size-3xl)',
                fontFamily: 'var(--font-family)'
              }}
            >
              VidTube
            </h1>
          </div>
          <h2
            className="text-3xl font-bold mb-2"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-3xl)',
              fontFamily: 'var(--font-family)',
              marginBottom: 'var(--spacing-unit)'
            }}
          >
            Create Your Account
          </h2>
          <p
            className="text-lg"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-lg)'
            }}
          >
            Join millions of creators worldwide
          </p>
        </div>

        {/* Progress Bar */}
        <div
          className="max-w-4xl mx-auto mb-12 max-sm:mb-6"
          style={{ marginBottom: 'var(--section-gap)' }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Step ${currentStep} of ${totalSteps}: ${stepInfo[currentStep - 1].title}`}
        >
          <div
            className="flex justify-between items-center max-sm:mb-4 mb-6"
            style={{
              gap: 'var(--spacing-unit)',
              marginBottom: 'var(--section-gap)'
            }}
          >
            {stepInfo.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              const IconComponent = step.icon;

              return (
                <div key={stepNumber} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-16 h-16 max-sm:w-8 max-sm:h-8 rounded-full flex items-center justify-center font-semibold transition-all duration-300 max-sm:mb-1.5 mb-3 ${emailStatus && currentStep === 4 ? '' : ''
                      }`}
                    style={{
                      backgroundColor: isCompleted
                        ? 'var(--color-success)'
                        : isActive
                          ? 'var(--accent-color)'
                          : 'var(--color-bg-secondary)',
                      color: (isCompleted || isActive) ? 'white' : 'var(--color-text-secondary)',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: (isCompleted || isActive) ? '0 8px 25px rgba(0, 0, 0, 0.15)' : 'none',
                      transitionDuration: 'var(--animation-duration)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    {isCompleted || (emailStatus && currentStep === 4) ? (
                      <Check className="w-7 h-7 max-sm:w-5 max-sm:h-5" />
                    ) : (
                      <IconComponent className="w-7 h-7 max-sm:w-5 max-sm:h-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <h3
                      className={`font-semibold text-sm max-sm:text-xs max-sm:mb-0.5 mb-1`}
                      style={{
                        color: isActive
                          ? 'var(--accent-color)'
                          : isCompleted
                            ? 'var(--color-success)'
                            : 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)',
                        fontFamily: 'var(--font-family)',
                        marginBottom: 'calc(var(--spacing-unit) * 0.5)'
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-xs hidden sm:block"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)'
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="w-full rounded-full h-2 max-sm:mb-2 mb-4"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              marginBottom: 'var(--spacing-unit)'
            }}
          >
            <div
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
                background: 'linear-gradient(90deg, var(--accent-color), var(--color-accent-hover))',
                transitionDuration: appearanceSettings.reducedMotion ? '0s' : '0.5s'
              }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-3xl max-sm:rounded-lg shadow-2xl border p-8 max-sm:px-2 transition-all duration-300"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(10px)',
              transitionDuration: 'var(--animation-duration)',
              padding: 'var(--component-padding)'
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
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div
                className="space-y-6 max-sm:space-y-4"
                style={{ gap: 'var(--section-gap)' }}
                role="tabpanel"
                aria-labelledby="step-1-tab"
                aria-label="Personal Information Form"
              >
                {/* Full Name */}
                <div
                  className="space-y-2"
                  style={{ gap: 'var(--spacing-unit)' }}
                >
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-semibold"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)'
                    }}
                  >
                    Full Name *
                  </label>
                  <div className="relative group">
                    <div
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      style={{ paddingLeft: 'var(--spacing-unit)' }}
                    >
                      <User
                        className="h-5 w-5 transition-colors"
                        style={{
                          color: 'var(--color-text-secondary)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                      />
                    </div>
                    <input
                      id="fullname"
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => handleInputChange('fullname', e.target.value)}
                      onBlur={(e) => handleBlur('fullname', e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-200`}
                      style={{
                        paddingLeft: '3rem',
                        padding: 'var(--spacing-unit)',
                        borderColor: errors.fullname
                          ? 'var(--color-error)'
                          : 'var(--color-border)',
                        backgroundColor: errors.fullname
                          ? 'rgba(239, 68, 68, 0.05)'
                          : 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-base)',
                        fontFamily: 'var(--font-family)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-color)';
                        e.target.style.backgroundColor = 'var(--color-bg-primary)';
                        e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                      }}
                      onBlurCapture={(e) => {
                        if (!errors.fullname) {
                          e.target.style.borderColor = 'var(--color-border)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                      placeholder="Enter your full name"
                      aria-describedby={errors.fullname ? "fullname-error" : undefined}
                      aria-invalid={!!errors.fullname}
                    />
                  </div>
                  {errors.fullname && (
                    <div
                      id="fullname-error"
                      className="flex items-center text-sm mt-2"
                      style={{
                        color: 'var(--color-error)',
                        fontSize: 'var(--font-size-sm)',
                        marginTop: 'var(--spacing-unit)'
                      }}
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.fullname}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div
                  className="space-y-2"
                  style={{ gap: 'var(--spacing-unit)' }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)'
                    }}
                  >
                    Email Address *
                  </label>
                  <div className="relative group">
                    <div
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      style={{ paddingLeft: 'var(--spacing-unit)' }}
                    >
                      <Mail
                        className="h-5 w-5 transition-colors"
                        style={{
                          color: 'var(--color-text-secondary)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                      />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={(e) => handleBlur('email', e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-200`}
                      style={{
                        paddingLeft: '3rem',
                        padding: 'var(--spacing-unit)',
                        borderColor: errors.email
                          ? 'var(--color-error)'
                          : 'var(--color-border)',
                        backgroundColor: errors.email
                          ? 'rgba(239, 68, 68, 0.05)'
                          : 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-base)',
                        fontFamily: 'var(--font-family)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-color)';
                        e.target.style.backgroundColor = 'var(--color-bg-primary)';
                        e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                      }}
                      onBlurCapture={(e) => {
                        if (!errors.email) {
                          e.target.style.borderColor = 'var(--color-border)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                      placeholder="Enter your email address"
                      aria-describedby={errors.email ? "email-error" : undefined}
                      aria-invalid={!!errors.email}
                    />
                  </div>
                  {errors.email && (
                    <div
                      id="email-error"
                      className="flex items-center text-sm mt-2"
                      style={{
                        color: 'var(--color-error)',
                        fontSize: 'var(--font-size-sm)',
                        marginTop: 'var(--spacing-unit)'
                      }}
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Account Details */}
            {currentStep === 2 && (
              <div
                className="space-y-6 max-sm:space-y-4"
                style={{ gap: 'var(--section-gap)' }}
                role="tabpanel"
                aria-labelledby="step-2-tab"
                aria-label="Account Details Form"
              >
                {/* Username */}
                <div
                  className="space-y-2"
                  style={{ gap: 'var(--spacing-unit)' }}
                >
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)'
                    }}
                  >
                    Username *
                  </label>
                  <div className="relative group">
                    <div
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      style={{ paddingLeft: 'var(--spacing-unit)' }}
                    >
                      <UserCheck
                        className="h-5 w-5 transition-colors"
                        style={{
                          color: 'var(--color-text-secondary)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                      />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      onBlur={(e) => handleBlur('username', e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-200`}
                      style={{
                        paddingLeft: '3rem',
                        padding: 'var(--spacing-unit)',
                        borderColor: errors.username
                          ? 'var(--color-error)'
                          : 'var(--color-border)',
                        backgroundColor: errors.username
                          ? 'rgba(239, 68, 68, 0.05)'
                          : 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-base)',
                        fontFamily: 'var(--font-family)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-color)';
                        e.target.style.backgroundColor = 'var(--color-bg-primary)';
                        e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                      }}
                      onBlurCapture={(e) => {
                        if (!errors.username) {
                          e.target.style.borderColor = 'var(--color-border)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                      placeholder="Choose a unique username"
                      aria-describedby={errors.username ? "username-error" : undefined}
                      aria-invalid={!!errors.username}
                    />
                  </div>
                  {errors.username && (
                    <div
                      id="username-error"
                      className="flex items-center text-sm mt-2"
                      style={{
                        color: 'var(--color-error)',
                        fontSize: 'var(--font-size-sm)',
                        marginTop: 'var(--spacing-unit)'
                      }}
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.username}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div
                  className="space-y-2"
                  style={{ gap: 'var(--spacing-unit)' }}
                >
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)'
                    }}
                  >
                    Password *
                  </label>
                  <div className="relative group">
                    <div
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      style={{ paddingLeft: 'var(--spacing-unit)' }}
                    >
                      <Lock
                        className="h-5 w-5 transition-colors"
                        style={{
                          color: 'var(--color-text-secondary)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                      />
                    </div>
                    <input
                      id="password"
                      type={showPassword.password ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      onBlur={(e) => handleBlur('password', e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-200`}
                      style={{
                        paddingLeft: '3rem',
                        paddingRight: '3rem',
                        padding: 'var(--spacing-unit)',
                        borderColor: errors.password
                          ? 'var(--color-error)'
                          : 'var(--color-border)',
                        backgroundColor: errors.password
                          ? 'rgba(239, 68, 68, 0.05)'
                          : 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-base)',
                        fontFamily: 'var(--font-family)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-color)';
                        e.target.style.backgroundColor = 'var(--color-bg-primary)';
                        e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                      }}
                      onBlurCapture={(e) => {
                        if (!errors.password) {
                          e.target.style.borderColor = 'var(--color-border)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                      placeholder="Create a strong password"
                      aria-describedby={errors.password ? "password-error" : "password-strength"}
                      aria-invalid={!!errors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                      style={{
                        color: 'var(--color-text-secondary)',
                        paddingRight: 'var(--spacing-unit)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--accent-color)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--color-text-secondary)';
                      }}
                      aria-label={showPassword.password ? "Hide password" : "Show password"}
                    >
                      {showPassword.password ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div
                      id="password-strength"
                      className="mt-3 p-3 rounded-xl"
                      style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        marginTop: 'var(--spacing-unit)',
                        padding: 'var(--spacing-unit)'
                      }}
                    >
                      <div
                        className="flex space-x-1 mb-2"
                        style={{
                          gap: 'calc(var(--spacing-unit) * 0.25)',
                          marginBottom: 'var(--spacing-unit)'
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded-full transition-all duration-300`}
                            style={{
                              backgroundColor: level <= passwordStrength.strength
                                ? passwordStrength.color
                                : 'var(--color-border)',
                              transitionDuration: 'var(--animation-duration)'
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
                        Password strength: <span
                          className="font-semibold"
                          style={{ color: passwordStrength.color }}
                        >
                          {passwordStrength.label}
                        </span>
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <div
                      id="password-error"
                      className="flex items-start text-sm mt-2"
                      style={{
                        color: 'var(--color-error)',
                        fontSize: 'var(--font-size-sm)',
                        marginTop: 'var(--spacing-unit)'
                      }}
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div
                  className="space-y-2"
                  style={{ gap: 'var(--spacing-unit)' }}
                >
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)'
                    }}
                  >
                    Confirm Password *
                  </label>
                  <div className="relative group">
                    <div
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      style={{ paddingLeft: 'var(--spacing-unit)' }}
                    >
                      <Lock
                        className="h-5 w-5 transition-colors"
                        style={{
                          color: 'var(--color-text-secondary)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                      />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword.confirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-200`}
                      style={{
                        paddingLeft: '3rem',
                        paddingRight: '3rem',
                        padding: 'var(--spacing-unit)',
                        borderColor: errors.confirmPassword
                          ? 'var(--color-error)'
                          : 'var(--color-border)',
                        backgroundColor: errors.confirmPassword
                          ? 'rgba(239, 68, 68, 0.05)'
                          : 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-base)',
                        fontFamily: 'var(--font-family)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-color)';
                        e.target.style.backgroundColor = 'var(--color-bg-primary)';
                        e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                      }}
                      onBlurCapture={(e) => {
                        if (!errors.confirmPassword) {
                          e.target.style.borderColor = 'var(--color-border)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                      placeholder="Confirm your password"
                      aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                      aria-invalid={!!errors.confirmPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                      style={{
                        color: 'var(--color-text-secondary)',
                        paddingRight: 'var(--spacing-unit)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--accent-color)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--color-text-secondary)';
                      }}
                      aria-label={showPassword.confirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                    >
                      {showPassword.confirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div
                      id="confirm-password-error"
                      className="flex items-center text-sm mt-2"
                      style={{
                        color: 'var(--color-error)',
                        fontSize: 'var(--font-size-sm)',
                        marginTop: 'var(--spacing-unit)'
                      }}
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Profile Setup */}
            {currentStep === 3 && (
              <div
                className="space-y-8 max-sm:space-y-4"
                style={{ gap: 'var(--section-gap)' }}
                role="tabpanel"
                aria-labelledby="step-3-tab"
                aria-label="Profile Setup Form"
              >
                {/* Avatar Upload */}
                <div className="text-center">
                  <label
                    className="block text-sm font-semibold mb-6"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)',
                      marginBottom: 'var(--section-gap)'
                    }}
                  >
                    Profile Picture
                  </label>
                  <div className="relative inline-block group">
                    <div
                      className="w-40 h-40 rounded-full border-4 overflow-hidden flex items-center justify-center shadow-xl transition-transform duration-300"
                      style={{
                        borderColor: 'var(--accent-color)',
                        background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        if (!appearanceSettings.reducedMotion) {
                          e.target.style.transform = 'scale(1.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!appearanceSettings.reducedMotion) {
                          e.target.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      {previews.avatar ? (
                        <img
                          src={previews.avatar}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User
                          className="w-16 h-16"
                          style={{ color: 'var(--color-text-secondary)' }}
                        />
                      )}
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-2 right-2 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all duration-200 transform"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        if (!appearanceSettings.reducedMotion) {
                          e.target.style.transform = 'scale(1.1)';
                        }
                        e.target.style.opacity = '0.9';
                      }}
                      onMouseLeave={(e) => {
                        if (!appearanceSettings.reducedMotion) {
                          e.target.style.transform = 'scale(1)';
                        }
                        e.target.style.opacity = '1';
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label="Upload profile picture"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          document.getElementById('avatar-upload').click();
                        }
                      }}
                    >
                      <Camera className="w-6 h-6" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('avatar', e)}
                        className="hidden"
                        aria-describedby="avatar-help"
                      />
                    </label>
                  </div>
                  <p
                    id="avatar-help"
                    className="text-xs mt-2"
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-xs)',
                      marginTop: 'var(--spacing-unit)'
                    }}
                  >
                    Recommended size: 400x400px. Max file size: 5MB
                  </p>
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-4 text-center"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    Cover Image
                  </label>
                  <div className="relative group">
                    <div
                      className="w-full h-40 rounded-2xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-all duration-300"
                      style={{
                        borderColor: 'var(--color-border)',
                        background: 'linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-tertiary))',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = 'var(--accent-color)';
                        e.target.style.background = `linear-gradient(135deg, var(--color-accent-bg), var(--color-bg-secondary))`;
                        if (!appearanceSettings.reducedMotion) {
                          e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = 'var(--color-border)';
                        e.target.style.background = `linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-tertiary))`;
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {previews.coverImage ? (
                        <img
                          src={previews.coverImage}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center py-8">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors"
                            style={{
                              background: 'linear-gradient(135deg, var(--color-accent-bg), var(--color-bg-tertiary))',
                              transitionDuration: 'var(--animation-duration)'
                            }}
                          >
                            <Upload
                              className="w-8 h-8"
                              style={{ color: 'var(--accent-color)' }}
                            />
                          </div>
                          <p
                            className="font-medium"
                            style={{
                              color: 'var(--color-text-secondary)',
                              fontSize: 'var(--font-size-base)'
                            }}
                          >
                            Click to upload cover image
                          </p>
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="cover-upload"
                      className="absolute inset-0 cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label="Upload cover image"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          document.getElementById('cover-upload').click();
                        }
                      }}
                    >
                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('coverImage', e)}
                        className="hidden"
                        aria-describedby="cover-help"
                      />
                    </label>
                  </div>
                  <p
                    id="cover-help"
                    className="text-xs mt-2 text-center"
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-xs)',
                      marginTop: 'var(--spacing-unit)'
                    }}
                  >
                    Recommended size: 1200x300px. Max file size: 5MB
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Email Verification */}
            {currentStep === 4 && (
              <div
                className="space-y-6 max-sm:space-y-3"
                style={{ gap: 'var(--section-gap)' }}
                role="tabpanel"
                aria-labelledby="step-4-tab"
                aria-label="Email Verification Form"
              >
                <div className="text-center mb-6">
                  <p
                    className="mb-2"
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-base)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    We've sent a verification code to
                  </p>
                  <p
                    className="font-semibold break-all"
                    style={{
                      color: 'var(--accent-color)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)'
                    }}
                  >
                    {formData.email}
                  </p>
                </div>

                {/* OTP Input */}
                <div>
                  <label
                    className="block text-sm font-medium mb-4 text-center"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    Enter Verification Code
                  </label>
                  <div
                    className="flex gap-3 max-sm:gap-1.5 justify-center max-sm:mb-4 mb-6"
                    style={{
                      gap: 'var(--spacing-unit)',
                      marginBottom: 'var(--section-gap)'
                    }}
                    role="group"
                    aria-label="6-digit verification code"
                  >
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
                        className="w-12 h-12 max-sm:w-10 max-sm:h-10 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-colors"
                        style={{
                          borderColor: digit ? 'var(--accent-color)' : 'var(--color-border)',
                          backgroundColor: digit ? 'var(--color-accent-bg)' : 'var(--color-bg-secondary)',
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-xl)',
                          fontFamily: 'var(--font-family)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--accent-color)';
                          e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                        }}
                        onBlur={(e) => {
                          if (!digit) {
                            e.target.style.borderColor = 'var(--color-border)';
                          }
                          e.target.style.boxShadow = 'none';
                        }}
                        aria-label={`Digit ${index + 1} of verification code`}
                        aria-describedby="otp-help"
                      />
                    ))}
                  </div>
                  <p
                    id="otp-help"
                    className="text-xs text-center mb-4"
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-xs)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    Enter the 6-digit code sent to your email
                  </p>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerifyOTP}
                    disabled={emailStatus && currentStep === 4 || otp.join('').length !== 6}
                    className="w-full text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                    style={{
                      background: (emailStatus && currentStep === 4) || otp.join('').length !== 6
                        ? 'var(--color-text-secondary)'
                        : 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
                      opacity: (emailStatus && currentStep === 4) || otp.join('').length !== 6 ? 0.5 : 1,
                      cursor: (emailStatus && currentStep === 4) || otp.join('').length !== 6 ? 'not-allowed' : 'pointer',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      if (otp.join('').length === 6 && !emailStatus) {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (otp.join('').length === 6 && !emailStatus) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                      }
                    }}
                    aria-label="Verify email with entered code"
                  >
                    {emailVerificationLoading && otp.join('').length === 6 ? (
                      <>
                        <Loader
                          className="w-5 h-5 animate-spin"
                          style={{
                            animationDuration: appearanceSettings.reducedMotion ? '0s' : '1s'
                          }}
                        />
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
                  <p
                    className="text-sm mb-2"
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-sm)',
                      marginBottom: 'var(--spacing-unit)'
                    }}
                  >
                    Didn't receive the code?
                  </p>
                  {!canResend ? (
                    <p
                      className="text-sm"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)'
                      }}
                    >
                      Resend available in {resendTimer}s
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      className="font-medium text-sm flex items-center gap-2 mx-auto px-3 py-2 rounded-lg transition-colors"
                      style={{
                        color: 'var(--accent-color)',
                        fontSize: 'var(--font-size-sm)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-accent-bg)';
                        e.target.style.color = 'var(--color-accent-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'var(--accent-color)';
                      }}
                      aria-label="Request new verification code"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Resend Code</span>
                    </button>
                  )}
                </div>

                {emailVerificationError && (
                  <div
                    className="p-4 border rounded-xl flex items-center"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      borderColor: 'var(--color-error)',
                      padding: 'var(--spacing-unit)'
                    }}
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle
                      className="w-5 h-5 mr-3"
                      style={{ color: 'var(--color-error)' }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: 'var(--color-error)',
                        fontSize: 'var(--font-size-sm)'
                      }}
                    >
                      {emailVerificationError}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div
              className="relative flex justify-between pt-8 mt-8 border-t"
              style={{
                borderColor: 'var(--color-border)',
                paddingTop: 'var(--section-gap)',
                marginTop: 'var(--section-gap)'
              }}
            >
              <div
                onClick={() => Navigate('/login', { replace: true })}
                className={`${currentStep < 3 ? "" : "hidden"} cursor-pointer absolute -translate-y-8 text-sm hover:text-blue-600 active:opacity-70 flex items-center my-1 w-full transition-colors`}
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--accent-color)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--color-text-secondary)';
                }}
                role="link"
                tabIndex={0}
                aria-label="Go to login page"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    Navigate('/login', { replace: true });
                  }
                }}
              >
                <p>Already have an account?</p>
              </div>

              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center cursor-pointer gap-2 px-6 py-3 font-medium rounded-xl transition-colors"
                  style={{
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'transparent',
                    fontSize: 'var(--font-size-base)',
                    gap: 'var(--spacing-unit)',
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
                  aria-label="Go to previous step"
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
                  className="flex items-center cursor-pointer gap-2 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
                    fontSize: 'var(--font-size-base)',
                    gap: 'var(--spacing-unit)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                  aria-label="Go to next step"
                >
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!emailVerified}
                  className="flex items-center cursor-pointer gap-2 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
                  style={{
                    background: !emailVerified
                      ? 'var(--color-text-secondary)'
                      : 'linear-gradient(135deg, var(--color-success), var(--accent-color))',
                    opacity: !emailVerified ? 0.4 : 1,
                    cursor: !emailVerified ? 'not-allowed' : 'pointer',
                    fontSize: 'var(--font-size-base)',
                    gap: 'var(--spacing-unit)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onMouseEnter={(e) => {
                    if (emailVerified) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (emailVerified) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  aria-label="Complete registration"
                >
                  <Check className="w-5 h-5" />
                  <span>Finish</span>
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
