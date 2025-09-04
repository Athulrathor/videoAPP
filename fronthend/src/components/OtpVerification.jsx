import React, { useCallback, useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { verifyOtp, updatePassword } from '../redux/features/user';
import { Mail, Send, CheckCircle, AlertCircle, Loader, Eye, EyeOff, Copy, RefreshCw, X, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword, verifyEmail } from '../redux/features/user';
import { useNavigate } from 'react-router-dom';
import favicon from "../assets/favicon.png";

const OtpVerificationPage = () => {

    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const [step, setStep] = useState('configure');
    const [emailConfig, setEmailConfig] = useState({
        to: '',
        subject: 'Email Verification Code',
        text: 'Your Company',
    });
    // const [generatedOTP, setGeneratedOTP] = useState('');
    const [userOTP, setUserOTP] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    // const [emailSent, setEmailSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const { emailVerified } = useSelector(state => state.user);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '12345678fghfgh',
    newPassword: '',
    confirmPassword: ''
  });
    
      const [errors, setErrors] = useState({});
    //   const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
      const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
      });

    //   const handleVerify = () => {
    //     if (isComplete) {
    //       setIsVerifying(true);
    //       setTimeout(() => {
    //         setIsVerifying(false);
    //         alert(`OTP Verified: ${otp.join('')}`);
    //       }, 1500);
    //     }
    //   };
    
    //   const handleClear = () => {
    //     setOtp(['', '', '', '', '', '']);
    //     setIsComplete(false);
    //     setIsVerifying(false);
    //     inputRefs.current[0]?.focus();
    //   };
    
    //   const handleResend = () => {
    //     setOtp(['', '', '', '', '', '']);
    //     setIsComplete(false);
    //     setIsVerifying(false);
    //     inputRefs.current[0]?.focus();
    //     // Simulate resend action
    //     alert('New OTP sent to your device!');
    //   };
    
    //   const simulateAutoFill = () => {
    //     const randomOtp = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10).toString());
    //     setOtp(randomOtp);
    //     inputRefs.current[5]?.focus();
    //   };
    
    
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
          await new Promise(resolve => setTimeout(resolve, 2000));
    
            dispatch(updatePassword(passwordData.newPassword));
    
          console.log('Password updated successfully');
            Navigate('/login');
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
    
    //   const handleStartEdit = useCallback(() => {
    //     setIsEditing(true);
    //   }, []);
    
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

    // Handle email configuration
    const handleConfigSubmit = () => {
        if (!emailConfig.to) {
            setError('Please enter recipient email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailConfig.to)) {
            setError('Please enter a valid email address');
            return;
        }
        sendEmail();
        dispatch(verifyEmail(emailConfig.to));

        setError('');

    };

    // Send email
    const sendEmail = async () => {
        setIsLoading(true);
        setError('');

        // Simulate email sending
        setTimeout(() => {
            setIsLoading(false);
            // setEmailSent(true);
            setStep('verify');
            setResendTimer(60);

            console.log('Email sent to:', emailConfig.to);
        }, 2000);
    };

    const handleOtpChange = (e,index, value) => {
        if (value.length > 1) return;

        const newOTP = [...userOTP];
        newOTP[index] = value;
        setUserOTP(newOTP);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`verify-otp-${index + 1}`);
            nextInput?.focus();
        }

        if (e.key === 'Backspace') {
            e.preventDefault();

            // Clear the current input
            // const newOtp = [...userOTP];
            // newOtp[index] = '';
            // setUserOTP(newOtp);

            if (index > 0) {
                const prevInput = document.getElementById(`verify-otp-${index - 1}`);
                prevInput?.focus();
            }
        }

        

        setError('');
    };

    const verifyOTP = () => {
        const enteredOTP = userOTP.join('');

        if (enteredOTP.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            setIsLoading(false);
            if (enteredOTP == emailVerified) {
                setStep('success');
                // Navigate("/login");
                setStep('update');
            } else {
                setError('Invalid verification code. Please try again.');
            }
        }, 1500);
    };

    // Resend timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // const resetForm = () => {
    //     setStep('configure');
    //     setEmailConfig({
    //         to: '',
    //         subject: 'Email Verification Code',
    //         text: 'VidTube',
    //     });
    //     setGeneratedOTP('');
    //     setUserOTP(['', '', '', '', '', '']);
    //     setError('');
    //     setEmailSent(false);
    //     setResendTimer(0);
    // };

    return (
        <div className="flex  min-h-screen flex-col max-sm:p-0">
            {/* header */}
            <div className='w-screen h-14 top-0 border-b-2 border-gray-600 mb-5 items-center'>
                <div className='h-full w-fit ml-3 max-md:ml-2 flex items-center'>
                    <img src={favicon} alt="" className='w-[60px] h-[36px] mr-1 '/><span className='text-2xl font-bold'>VidTube</span>
                </div>
            </div>
            <div className="max-w-4xl mx-auto mt-7 max-md:mt-2 ">

                {/* Configuration Step */}
                {step === 'configure' && (
                    <div className="bg-white rounded-2xl p-8">
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <Mail className="w-8 h-8 text-purple-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h1>
                            <p className="text-gray-600">Configure your email verification</p>
                        </div>

                        {/* strep  */}

                        <div className='w-full flex justify-center'>
                            <div className=' w-2xs border-2 border-green-600 rounded-lg'>
                                <input type="email" name="email" id="emailForgetPassword" value={emailConfig.to} onChange={(e) => setEmailConfig({to:e.target.value})} className='w-full py-2 max-sm:py-1 px-3 max-sm:px-2' placeholder='Enter email here...' />
                            </div>
                        </div>

                        {error && (
                            <div className="mt-6 flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleConfigSubmit}
                                disabled={isLoading}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                            >
                                Verify 
                            </button>
                        </div>
                    </div>
                )}

                {/* Verification Step */}
                {step === 'verify' && (
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                            <p className="text-gray-600 mb-2">We've sent a verification code to</p>
                            <p className="text-purple-600 font-semibold">{emailConfig.recipientEmail}</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                    Enter Verification Code
                                </label>
                                <div className="flex gap-2 justify-center">
                                    {userOTP.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`verify-otp-${index}`}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e,index, e.target.value)}
                                            // onKeyDown={ handleKeyDown}
                                            className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 text-sm justify-center">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={verifyOTP}
                                disabled={isLoading || userOTP.join('').length !== 6}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Code'
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                                {resendTimer > 0 ? (
                                    <p className="text-sm text-purple-600">Resend in {resendTimer}s</p>
                                ) : (
                                    <button
                                        onClick={sendEmail}
                                        className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 mx-auto"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Resend Code
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Step */}
                {step === 'success' && (
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
                        <p className="text-gray-600 mb-6">Your email address has been successfully verified.</p>
                    </div>
                )}

                {step === 'update' && (
                    <div className="bg-white rounded-2xl p-8">
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
                                type="button"
                                disabled={isLoading}
                                onClick={handleSubmit}
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
                    // </div>
                                    
                )}
            </div>
        </div>
    );
};

export default OtpVerificationPage;