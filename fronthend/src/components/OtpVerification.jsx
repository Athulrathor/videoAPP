import React, { useCallback, useEffect, useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Loader, Eye, EyeOff, RefreshCw, X, Save, ArrowLeft, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword, verifyEmail } from '../redux/features/user';
import { useNavigate } from 'react-router-dom';
import favicon from "../assets/favicon.png";
import { useAppearance } from '../hooks/appearances';

const OtpVerificationPage = () => {
    const { appearanceSettings } = useAppearance();
    const { user } = useSelector(state => state.user);
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

    // All your existing handler functions remain the same...
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
            dispatch(updatePassword({ newPassword: passwordData.newPassword, UserId: user._id }));
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
    }, [passwordData, validateForm, dispatch, Navigate, user]);

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
        const colors = ['var(--color-error)', 'var(--color-warning)', 'var(--color-warning)', 'var(--accent-color)', 'var(--color-success)'];

        return {
            strength,
            label: labels[strength - 1] || '',
            color: colors[strength - 1] || 'var(--color-border)'
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
        <div
            className="min-h-screen transition-all"
            style={{
                background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-accent-bg) 100%)',
                fontFamily: 'var(--font-family)',
                transitionDuration: 'var(--animation-duration)'
            }}
            role="main"
            aria-label="Email verification and password reset"
        >
            {/* Header */}
            <div
                className='w-full h-16 shadow-sm border-b sticky top-0 z-10 transition-all'
                style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: 'var(--color-border)',
                    transitionDuration: 'var(--animation-duration)'
                }}
            >
                <div className='h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
                    <div
                        onClick={() => Navigate('/login')}
                        className='cursor-pointer flex items-center space-x-2 transition-all'
                        style={{
                            gap: 'var(--spacing-unit)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.opacity = '1';
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label="Go to login page"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                Navigate('/login');
                            }
                        }}
                    >
                        <img src={favicon} alt="VidTube" className='w-10 h-10 sm:w-12 sm:h-12' />
                        <span
                            className='text-xl sm:text-2xl font-bold'
                            style={{
                                color: 'var(--color-text-primary)',
                                fontSize: 'var(--font-size-2xl)',
                                fontFamily: 'var(--font-family)'
                            }}
                        >
                            VidTube
                        </span>
                    </div>
                    {(step === 'verify' || step === 'update') && (
                        <button
                            onClick={goBack}
                            className="p-2 rounded-full transition-all"
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
                            aria-label="Go back to previous step"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div
                className="max-w-lg mx-auto h-[calc(100vh_-_41px)] scrollBar px-4 py-8 sm:py-8 max-md:overflow-y-scroll"
                style={{
                    padding: 'var(--component-padding)',
                    paddingTop: 'var(--section-gap)'
                }}
            >
                {/* Progress Indicator */}
                <div
                    className="mb-8"
                    style={{ marginBottom: 'var(--section-gap)' }}
                    role="progressbar"
                    aria-valuenow={['configure', 'verify', 'success', 'update'].indexOf(step) + 1}
                    aria-valuemin={1}
                    aria-valuemax={4}
                    aria-label={`Step ${['configure', 'verify', 'success', 'update'].indexOf(step) + 1} of 4`}
                >
                    <div
                        className="flex justify-center space-x-4"
                        style={{ gap: 'var(--spacing-unit)' }}
                    >
                        {['configure', 'verify', 'success', 'update'].map((s, index) => (
                            <div
                                key={s}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all`}
                                style={{
                                    backgroundColor: ['configure', 'verify', 'success', 'update'].indexOf(step) >= index
                                        ? 'var(--accent-color)'
                                        : 'var(--color-bg-primary)',
                                    color: ['configure', 'verify', 'success', 'update'].indexOf(step) >= index
                                        ? 'white'
                                        : 'var(--color-text-secondary)',
                                    fontSize: 'var(--font-size-sm)',
                                    fontFamily: 'var(--font-family)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                                aria-label={`Step ${index + 1}: ${s}`}
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Configuration Step */}
                {step === 'configure' && (
                    <div
                        className="rounded-3xl shadow-xl p-6 sm:p-8 border transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            borderColor: 'var(--color-border)',
                            padding: 'var(--component-padding)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                        role="form"
                        aria-labelledby="config-title"
                    >
                        <div
                            className="text-center mb-8"
                            style={{ marginBottom: 'var(--section-gap)' }}
                        >
                            <div
                                className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
                                    marginBottom: 'var(--spacing-unit)'
                                }}
                            >
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h1
                                id="config-title"
                                className="text-2xl sm:text-3xl font-bold mb-2"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-3xl)',
                                    fontFamily: 'var(--font-family)',
                                    marginBottom: 'var(--spacing-unit)'
                                }}
                            >
                                Verify Your Email
                            </h1>
                            <p
                                className="text-center"
                                style={{
                                    color: 'var(--color-text-secondary)',
                                    fontSize: 'var(--font-size-base)'
                                }}
                            >
                                Enter your email address to receive a verification code
                            </p>
                        </div>

                        <div
                            className="space-y-6"
                            style={{ gap: 'var(--section-gap)' }}
                        >
                            <div>
                                <label
                                    htmlFor="email-input"
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        color: 'var(--color-text-primary)',
                                        fontSize: 'var(--font-size-sm)',
                                        fontFamily: 'var(--font-family)',
                                        marginBottom: 'var(--spacing-unit)'
                                    }}
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email-input"
                                        type="email"
                                        value={emailConfig.to}
                                        onChange={(e) => setEmailConfig({ ...emailConfig, to: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all`}
                                        style={{
                                            padding: 'var(--spacing-unit)',
                                            borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
                                            backgroundColor: error ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-bg-primary)',
                                            color: 'var(--color-text-primary)',
                                            fontSize: 'var(--font-size-base)',
                                            fontFamily: 'var(--font-family)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--accent-color)';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            if (!error) {
                                                e.target.style.borderColor = 'var(--color-border)';
                                                e.target.style.boxShadow = 'none';
                                            }
                                        }}
                                        placeholder="Enter your email address"
                                        aria-describedby={error ? "email-error" : undefined}
                                        aria-invalid={!!error}
                                        required
                                    />
                                    <Mail
                                        className="absolute right-3 top-3.5 w-5 h-5"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div
                                    id="email-error"
                                    className="flex items-center gap-2 text-sm p-3 rounded-lg"
                                    style={{
                                        color: 'var(--color-error)',
                                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                        fontSize: 'var(--font-size-sm)',
                                        padding: 'var(--spacing-unit)',
                                        gap: 'var(--spacing-unit)'
                                    }}
                                    role="alert"
                                    aria-live="polite"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleConfigSubmit}
                                disabled={isLoading || !emailConfig.to}
                                className="w-full text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                                style={{
                                    background: (!isLoading && emailConfig.to)
                                        ? 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))'
                                        : 'var(--color-text-primary)',
                                    opacity: (!isLoading && emailConfig.to) ? 1 : 0.5,
                                    cursor: (!isLoading && emailConfig.to) ? 'pointer' : 'not-allowed',
                                    fontSize: 'var(--font-size-base)',
                                    fontFamily: 'var(--font-family)',
                                    padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 1.5)',
                                    gap: 'var(--spacing-unit)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoading && emailConfig.to) {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isLoading && emailConfig.to) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                    }
                                }}
                                aria-label={isLoading ? "Sending verification code..." : "Send verification code"}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader
                                            className="w-5 h-5 animate-spin"
                                            style={{
                                                animationDuration: appearanceSettings.reducedMotion ? '0s' : '1s'
                                            }}
                                        />
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
                    <div
                        className="rounded-3xl shadow-xl p-6 sm:p-8 border transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            borderColor: 'var(--color-border)',
                            padding: 'var(--component-padding)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                        role="form"
                        aria-labelledby="verify-title"
                    >
                        <div
                            className="text-center mb-8"
                            style={{ marginBottom: 'var(--section-gap)' }}
                        >
                            <div
                                className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent-color), var(--color-success))',
                                    marginBottom: 'var(--spacing-unit)'
                                }}
                            >
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h1
                                id="verify-title"
                                className="text-2xl sm:text-3xl font-bold mb-2"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-3xl)',
                                    fontFamily: 'var(--font-family)',
                                    marginBottom: 'var(--spacing-unit)'
                                }}
                            >
                                Check Your Email
                            </h1>
                            <p
                                className="mb-2"
                                style={{
                                    color: 'var(--color-text-secondary)',
                                    fontSize: 'var(--font-size-base)',
                                    marginBottom: 'var(--spacing-unit)'
                                }}
                            >
                                We've sent a 6-digit verification code to
                            </p>
                            <p
                                className="font-semibold text-lg"
                                style={{
                                    color: 'var(--accent-color)',
                                    fontSize: 'var(--font-size-lg)',
                                    fontFamily: 'var(--font-family)'
                                }}
                            >
                                {emailConfig.to}
                            </p>
                        </div>

                        <div
                            className="space-y-6"
                            style={{ gap: 'var(--section-gap)' }}
                        >
                            <fieldset>
                                <legend
                                    className="block text-sm font-medium mb-4 text-center sr-only"
                                    style={{
                                        color: 'var(--color-text-primary)',
                                        fontSize: 'var(--font-size-sm)',
                                        fontFamily: 'var(--font-family)',
                                        marginBottom: 'var(--spacing-unit)'
                                    }}
                                >
                                    Enter 6-digit verification code
                                </legend>
                                <div
                                    className="flex gap-2 sm:gap-3 justify-center"
                                    style={{ gap: 'var(--spacing-unit)' }}
                                    role="group"
                                    aria-label="6-digit verification code"
                                >
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
                                            className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all"
                                            style={{
                                                borderColor: digit ? 'var(--accent-color)' : 'var(--color-border)',
                                                backgroundColor: digit ? 'var(--color-bg-secondary)' : 'var(--color-bg-primary)',
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
                                    className="text-xs text-center mt-2"
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: 'var(--font-size-xs)',
                                        marginTop: 'var(--spacing-unit)'
                                    }}
                                >
                                    Enter the 6-digit code sent to your email
                                </p>
                            </fieldset>

                            {error && (
                                <div
                                    className="flex items-center gap-2 text-sm justify-center p-3 rounded-lg"
                                    style={{
                                        color: 'var(--color-error)',
                                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                        fontSize: 'var(--font-size-sm)',
                                        padding: 'var(--spacing-unit)',
                                        gap: 'var(--spacing-unit)'
                                    }}
                                    role="alert"
                                    aria-live="polite"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={verifyOTP}
                                disabled={isLoading || userOTP.join('').length !== 6}
                                className="w-full text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                                style={{
                                    background: (!isLoading && userOTP.join('').length === 6)
                                        ? 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))'
                                        : 'var(--color-text-secondary)',
                                    opacity: (!isLoading && userOTP.join('').length === 6) ? 1 : 0.5,
                                    cursor: (!isLoading && userOTP.join('').length === 6) ? 'pointer' : 'not-allowed',
                                    fontSize: 'var(--font-size-base)',
                                    fontFamily: 'var(--font-family)',
                                    padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 1.5)',
                                    gap: 'var(--spacing-unit)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoading && userOTP.join('').length === 6) {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isLoading && userOTP.join('').length === 6) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                    }
                                }}
                                aria-label={isLoading ? "Verifying code..." : "Verify code"}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader
                                            className="w-5 h-5 animate-spin"
                                            style={{
                                                animationDuration: appearanceSettings.reducedMotion ? '0s' : '1s'
                                            }}
                                        />
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
                                {resendTimer > 0 ? (
                                    <p
                                        className="text-sm font-medium"
                                        style={{
                                            color: 'var(--accent-color)',
                                            fontSize: 'var(--font-size-sm)'
                                        }}
                                    >
                                        Resend available in {resendTimer}s
                                    </p>
                                ) : (
                                    <button
                                        onClick={sendEmail}
                                        className="text-sm font-medium flex items-center gap-1 mx-auto px-3 py-1 rounded-lg transition-all"
                                        style={{
                                            color: 'var(--accent-color)',
                                            fontSize: 'var(--font-size-sm)',
                                            gap: 'calc(var(--spacing-unit) * 0.5)',
                                            padding: 'calc(var(--spacing-unit) * 0.5) var(--spacing-unit)',
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
                                        aria-label="Resend verification code"
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
                    <div
                        className="rounded-3xl shadow-xl p-6 sm:p-8 border text-center transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            borderColor: 'var(--color-border)',
                            padding: 'var(--component-padding)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                        role="status"
                        aria-live="polite"
                    >
                        <div
                            className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, var(--color-bg-secondary), var(--color-success))',
                                marginBottom: 'var(--spacing-unit)',
                                animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s infinite'
                            }}
                        >
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1
                            className="text-2xl sm:text-3xl font-bold mb-2"
                            style={{
                                color: 'var(--color-text-primary)',
                                fontSize: 'var(--font-size-3xl)',
                                fontFamily: 'var(--font-family)',
                                marginBottom: 'var(--spacing-unit)'
                            }}
                        >
                            Email Verified!
                        </h1>
                        <p
                            className="mb-6"
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-base)',
                                marginBottom: 'var(--section-gap)'
                            }}
                        >
                            Your email address has been successfully verified.
                        </p>
                        <div
                            className="text-sm cursor-pointer underline"
                            style={{
                                color: 'var(--accent-color)',
                                fontSize: 'var(--font-size-sm)'
                            }}
                        >
                            Redirecting to password setup...
                        </div>
                    </div>
                )}

                {/* Update Password Step */}
                {step === 'update' && (
                    <div
                        className="rounded-3xl shadow-xl p-6 sm:p-8 border transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            borderColor: 'var(--color-border)',
                            padding: 'var(--component-padding)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                    >
                        <div
                            className="text-center mb-8"
                            style={{ marginBottom: 'var(--section-gap)' }}
                        >
                            <div
                                className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
                                    marginBottom: 'var(--spacing-unit)'
                                }}
                            >
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h1
                                className="text-2xl sm:text-3xl font-bold mb-2"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-3xl)',
                                    fontFamily: 'var(--font-family)',
                                    marginBottom: 'var(--spacing-unit)'
                                }}
                            >
                                Update Password
                            </h1>
                            <p
                                style={{
                                    color: 'var(--color-text-secondary)',
                                    fontSize: 'var(--font-size-base)'
                                }}
                            >
                                Create a strong password for your account
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                            style={{ gap: 'var(--section-gap)' }}
                            role="form"
                            aria-label="Password update form"
                        >
                            {/* New Password */}
                            <div>
                                <label
                                    htmlFor="new-password"
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        color: 'var(--color-text-primary)',
                                        fontSize: 'var(--font-size-sm)',
                                        fontFamily: 'var(--font-family)',
                                        marginBottom: 'var(--spacing-unit)'
                                    }}
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="new-password"
                                        type={showPassword.new ? 'text' : 'password'}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none transition-all`}
                                        style={{
                                            padding: 'var(--spacing-unit)',
                                            paddingRight: '3rem',
                                            borderColor: errors.newPassword ? 'var(--color-error)' : 'var(--color-border)',
                                            backgroundColor: errors.newPassword ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-bg-primary)',
                                            color: 'var(--color-text-primary)',
                                            fontSize: 'var(--font-size-base)',
                                            fontFamily: 'var(--font-family)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--accent-color)';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            if (!errors.newPassword) {
                                                e.target.style.borderColor = 'var(--color-border)';
                                                e.target.style.boxShadow = 'none';
                                            }
                                        }}
                                        placeholder="Enter new password"
                                        aria-describedby={errors.newPassword ? "new-password-error" : "password-strength"}
                                        aria-invalid={!!errors.newPassword}
                                        autoComplete="new-password"
                                        spellCheck="false"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                                        style={{
                                            color: 'var(--color-text-secondary)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = 'var(--accent-color)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = 'var(--color-text-secondary)';
                                        }}
                                        aria-label={showPassword.new ? "Hide password" : "Show password"}
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
                                    <div
                                        id="password-strength"
                                        className="mt-3"
                                        style={{ marginTop: 'var(--spacing-unit)' }}
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
                                                    className={`h-2 flex-1 rounded-full transition-all`}
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
                                                className="font-medium"
                                                style={{ color: passwordStrength.color }}
                                            >
                                                {passwordStrength.label}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {errors.newPassword && (
                                    <p
                                        id="new-password-error"
                                        className="mt-2 text-sm"
                                        style={{
                                            color: 'var(--color-error)',
                                            fontSize: 'var(--font-size-sm)',
                                            marginTop: 'var(--spacing-unit)'
                                        }}
                                        role="alert"
                                    >
                                        {errors.newPassword}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        color: 'var(--color-text-primary)',
                                        fontSize: 'var(--font-size-sm)',
                                        fontFamily: 'var(--font-family)',
                                        marginBottom: 'var(--spacing-unit)'
                                    }}
                                >
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={showPassword.confirm ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none transition-all`}
                                        style={{
                                            padding: 'var(--spacing-unit)',
                                            paddingRight: '3rem',
                                            borderColor: errors.confirmPassword ? 'var(--color-error)' : 'var(--color-border)',
                                            backgroundColor: errors.confirmPassword ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-bg-primary)',
                                            color: 'var(--color-text-primary)',
                                            fontSize: 'var(--font-size-base)',
                                            fontFamily: 'var(--font-family)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--accent-color)';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            if (!errors.confirmPassword) {
                                                e.target.style.borderColor = 'var(--color-border)';
                                                e.target.style.boxShadow = 'none';
                                            }
                                        }}
                                        placeholder="Confirm new password"
                                        aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                                        aria-invalid={!!errors.confirmPassword}
                                        autoComplete="new-password"
                                        spellCheck="false"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                                        style={{
                                            color: 'var(--color-text-secondary)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = 'var(--accent-color)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = 'var(--color-text-secondary)';
                                        }}
                                        aria-label={showPassword.confirm ? "Hide password confirmation" : "Show password confirmation"}
                                    >
                                        {showPassword.confirm ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p
                                        id="confirm-password-error"
                                        className="mt-2 text-sm"
                                        style={{
                                            color: 'var(--color-error)',
                                            fontSize: 'var(--font-size-sm)',
                                            marginTop: 'var(--spacing-unit)'
                                        }}
                                        role="alert"
                                    >
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Password Requirements */}
                            <div
                                className="p-4 rounded-xl"
                                style={{
                                    backgroundColor: 'var(--color-border)',
                                    padding: 'var(--spacing-unit)'
                                }}
                            >
                                <h4
                                    className="text-sm font-medium mb-3"
                                    style={{
                                        color: 'var(--color-text-primary)',
                                        fontSize: 'var(--font-size-sm)',
                                        fontFamily: 'var(--font-family)',
                                        marginBottom: 'var(--spacing-unit)'
                                    }}
                                >
                                    Password Requirements:
                                </h4>
                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                                    style={{ gap: 'var(--spacing-unit)' }}
                                >
                                    <div
                                        className={`flex items-center text-xs`}
                                        style={{
                                            color: passwordData.newPassword.length >= 8 ? 'var(--color-success)' : 'var(--color-text-secondary)',
                                            fontSize: 'var(--font-size-xs)'
                                        }}
                                    >
                                        <CheckCircle
                                            className={`w-3 h-3 mr-2`}
                                            style={{
                                                color: passwordData.newPassword.length >= 8 ? 'var(--color-success)' : 'var(--color-text-secondary)'
                                            }}
                                        />
                                        8+ characters
                                    </div>
                                    <div
                                        className={`flex items-center text-xs`}
                                        style={{
                                            color: /[A-Z]/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)',
                                            fontSize: 'var(--font-size-xs)'
                                        }}
                                    >
                                        <CheckCircle
                                            className={`w-3 h-3 mr-2`}
                                            style={{
                                                color: /[A-Z]/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)'
                                            }}
                                        />
                                        Uppercase letter
                                    </div>
                                    <div
                                        className={`flex items-center text-xs`}
                                        style={{
                                            color: /[a-z]/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)',
                                            fontSize: 'var(--font-size-xs)'
                                        }}
                                    >
                                        <CheckCircle
                                            className={`w-3 h-3 mr-2`}
                                            style={{
                                                color: /[a-z]/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)'
                                            }}
                                        />
                                        Lowercase letter
                                    </div>
                                    <div
                                        className={`flex items-center text-xs`}
                                        style={{
                                            color: /\d/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)',
                                            fontSize: 'var(--font-size-xs)'
                                        }}
                                    >
                                        <CheckCircle
                                            className={`w-3 h-3 mr-2`}
                                            style={{
                                                color: /\d/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)'
                                            }}
                                        />
                                        Number
                                    </div>
                                    <div
                                        className={`flex items-center text-xs col-span-1 sm:col-span-2`}
                                        style={{
                                            color: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)',
                                            fontSize: 'var(--font-size-xs)'
                                        }}
                                    >
                                        <CheckCircle
                                            className={`w-3 h-3 mr-2`}
                                            style={{
                                                color: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'var(--color-success)' : 'var(--color-text-secondary)'
                                            }}
                                        />
                                        Special character (!@#$%^&*)
                                    </div>
                                </div>
                            </div>

                            {/* Submit Error */}
                            {errors.submit && (
                                <div
                                    className="border rounded-xl p-4"
                                    style={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                        borderColor: 'var(--color-error)',
                                        padding: 'var(--spacing-unit)'
                                    }}
                                    role="alert"
                                >
                                    <div className="flex items-center">
                                        <AlertCircle
                                            className="w-5 h-5 mr-2"
                                            style={{ color: 'var(--color-error)' }}
                                        />
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
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div
                                className="flex flex-col sm:flex-row gap-3 pt-4"
                                style={{
                                    gap: 'var(--spacing-unit)',
                                    paddingTop: 'var(--spacing-unit)'
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3 border-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                                    style={{
                                        color: 'var(--color-text-primary)',
                                        borderColor: 'var(--color-border)',
                                        backgroundColor: 'transparent',
                                        fontSize: 'var(--font-size-base)',
                                        fontFamily: 'var(--font-family)',
                                        padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 1.5)',
                                        gap: 'var(--spacing-unit)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = 'var(--color-hover)';
                                        e.target.style.borderColor = 'var(--color-text-secondary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.borderColor = 'var(--color-border)';
                                    }}
                                    aria-label="Cancel password update"
                                >
                                    <X className="w-5 h-5" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                                    style={{
                                        background: isLoading
                                            ? 'var(--color-text-secondary)'
                                            : ' var(--color-success)',
                                        opacity: isLoading ? 0.5 : 1,
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        fontSize: 'var(--font-size-base)',
                                        fontFamily: 'var(--font-family)',
                                        padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 1.5)',
                                        gap: 'var(--spacing-unit)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isLoading) {
                                            e.target.style.transform = 'translateY(-1px)';
                                            e.target.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isLoading) {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                        }
                                    }}
                                    aria-label={isLoading ? "Updating password..." : "Save new password"}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader
                                                className="w-5 h-5 animate-spin"
                                                style={{
                                                    animationDuration: appearanceSettings.reducedMotion ? '0s' : '1s'
                                                }}
                                            />
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

                {/* Live Region for Screen Readers */}
                <div
                    className="sr-only"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    {step === 'configure' && 'Email configuration step'}
                    {step === 'verify' && 'Email verification step'}
                    {step === 'success' && 'Email verification successful'}
                    {step === 'update' && 'Password update step'}
                </div>
            </div>
        </div>
    );
};

export default OtpVerificationPage;
