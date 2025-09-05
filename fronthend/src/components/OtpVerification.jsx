import React, { useCallback, useEffect, useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Loader, Eye, EyeOff, Copy, RefreshCw, X, Save, ArrowLeft, Shield } from 'lucide-react';
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
    const [userOTP, setUserOTP] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const { emailVerified } = useSelector(state => state.user);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

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
            alert('Password updated successfully!');
        } catch (error) {
            console.error('Error updating password:', error);
            setErrors({ submit: 'Failed to update password. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    }, [passwordData, validateForm, dispatch, Navigate]);

    const handleCancel = useCallback(() => {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
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

    const sendEmail = async () => {
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            setIsLoading(false);
            setStep('verify');
            setResendTimer(60);
            console.log('Email sent to:', emailConfig.to);
        }, 2000);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...userOTP];
            newOtp[index] = '';
            setUserOTP(newOtp);

            if (index > 0) {
                const prevInput = document.getElementById(`verify-otp-${index - 1}`);
                prevInput?.focus();
            }
        }
    };

    const handleOtpChange = (e, index, value) => {
        if (value.length > 1) return;

        const newOTP = [...userOTP];
        newOTP[index] = value;
        setUserOTP(newOTP);

        if (value && index < 5) {
            const nextInput = document.getElementById(`verify-otp-${index + 1}`);
            nextInput?.focus();
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
                setTimeout(() => setStep('update'), 2000);
            } else {
                setError('Invalid verification code. Please try again.');
            }
        }, 1500);
    };

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const goBack = () => {
        if (step === 'verify') {
            setStep('configure');
        } else if (step === 'update') {
            setStep('success');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <div className='w-full h-16 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10'>
                <div className='h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
                    <div onClick={() => Navigate('/login')}  className='cursor-pointer flex items-center space-x-2'>
                        <img src={favicon} alt="VidTube" className='w-10 h-10 sm:w-12 sm:h-12' />
                        <span className='text-xl sm:text-2xl font-bold text-gray-900'>VidTube</span>
                    </div>
                    {(step === 'verify' || step === 'update') && (
                        <button
                            onClick={goBack}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-lg mx-auto h-[calc(100vh_-_41px)] scrollBar px-4 py-8 sm:py-8 max-md:overflow-y-scroll">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex justify-center space-x-4">
                        {['configure', 'verify', 'success', 'update'].map((s, index) => (
                            <div
                                key={s}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${['configure', 'verify', 'success', 'update'].indexOf(step) >= index
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Configuration Step */}
                {step === 'configure' && (
                    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                            <p className="text-gray-600">Enter your email address to receive a verification code</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={emailConfig.to}
                                        onChange={(e) => setEmailConfig({ ...emailConfig, to: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="Enter your email address"
                                    />
                                    <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleConfigSubmit}
                                disabled={isLoading || !emailConfig.to}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Send Verification Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Verification Step */}
                {step === 'verify' && (
                    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                            <p className="text-gray-600 mb-2">We've sent a 6-digit verification code to</p>
                            <p className="text-indigo-600 font-semibold text-lg">{emailConfig.to}</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                    Enter Verification Code
                                </label>
                                <div className="flex gap-2 sm:gap-3 justify-center">
                                    {userOTP.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`verify-otp-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e, index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 text-sm justify-center bg-red-50 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={verifyOTP}
                                disabled={isLoading || userOTP.join('').length !== 6}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Verify Code
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                                {resendTimer > 0 ? (
                                    <p className="text-sm text-indigo-600 font-medium">
                                        Resend available in {resendTimer}s
                                    </p>
                                ) : (
                                    <button
                                        onClick={sendEmail}
                                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 mx-auto hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
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
                    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-pulse">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Email Verified!</h1>
                        <p className="text-gray-600 mb-6">Your email address has been successfully verified.</p>
                        <div className="text-indigo-600 text-sm">Redirecting to password setup...</div>
                    </div>
                )}

                {/* Update Password Step */}
                {step === 'update' && (
                    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Update Password</h1>
                            <p className="text-gray-600">Create a strong password for your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword.new ? 'text' : 'password'}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.newPassword ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword.new ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {passwordData.newPassword && (
                                    <div className="mt-3">
                                        <div className="flex space-x-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-2 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength
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
                                    <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword.confirm ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword.confirm ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className={`flex items-center text-xs ${passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-3 h-3 mr-2 ${passwordData.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                                        8+ characters
                                    </div>
                                    <div className={`flex items-center text-xs ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-3 h-3 mr-2 ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                        Uppercase letter
                                    </div>
                                    <div className={`flex items-center text-xs ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-3 h-3 mr-2 ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                        Lowercase letter
                                    </div>
                                    <div className={`flex items-center text-xs ${/\d/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-3 h-3 mr-2 ${/\d/.test(passwordData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                        Number
                                    </div>
                                    <div className={`flex items-center text-xs col-span-1 sm:col-span-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-3 h-3 mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                        Special character (!@#$%^&*)
                                    </div>
                                </div>
                            </div>

                            {/* Submit Error */}
                            {errors.submit && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-center">
                                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                        <p className="text-sm text-red-600">{errors.submit}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3 text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    <X className="w-5 h-5" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OtpVerificationPage;
