import React, { useState } from "react";
import videoLogo from "../assets/favicon.png";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import google from "../assets/google.svg";
import facebook from "../assets/facebook.svg";
import { AuthService, fetchLoginUser, setAuth, setSideActive } from "../redux/features/user.js";
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useAppearance } from "../hooks/appearances";
import { Eye, EyeOff, Loader, AlertCircle } from 'lucide-react';

const Login = () => {
  const { appearanceSettings } = useAppearance();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { loading } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  // Form validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleInputChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
      if (touched.email) {
        setErrors(prev => ({ ...prev, email: validateEmail(value) }));
      }
    } else if (field === 'password') {
      setPassword(value);
      if (touched.password) {
        setErrors(prev => ({ ...prev, password: validatePassword(value) }));
      }
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    } else if (field === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError
    });

    setTouched({
      email: true,
      password: true
    });

    if (emailError || passwordError) {
      toast.error('Please fix the form errors');
      return;
    }

    try {
      await dispatch(fetchLoginUser({ email: email, password: password }));
      Navigate("/");
      dispatch(setSideActive("home"));
      toast.success('Login successful');
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const result = await AuthService.loginWithGoogle(access_token);
        if (result.user && result.accessToken) {
          dispatch(setAuth({ loggedIn: true, user: result.user, token: result?.accessToken }));
          toast.success('Google login successful');
          Navigate('/', { replace: true });
        } else {
          dispatch(setAuth({ loggedIn: false, user: {}, token: null }));
          toast.error('Google login failed');
        }
      } catch (error) {
        console.error('Google login error:', error);
        toast.error('Google login failed');
      }
    },
    onError: () => toast.error('Google login failed'),
    flow: 'implicit',
  });

  return (
    <div
      className="w-screen h-screen flex items-center justify-center transition-all"
      style={{
        background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
        fontFamily: 'var(--font-family)',
        transitionDuration: 'var(--animation-duration)'
      }}
      role="main"
      aria-label="Login page"
    >
      <div
        className={`${loading ? "opacity-90" : ""} border-2 rounded-2xl min-w-sm w-2xl max-sm:border-0 max-sm:shadow-none shadow-lg p-4 transition-all duration-300`}
        style={{
          backgroundColor: loading ? 'rgba(0, 0, 0, 0.05)' : 'var(--color-bg-primary)',
          borderColor: 'var(--color-border)',
          backdropFilter: 'blur(0.1px)',
          transitionDuration: 'var(--animation-duration)',
          padding: 'var(--component-padding)'
        }}
        // onMouseEnter={(e) => {
        //   if (!loading && !appearanceSettings.reducedMotion) {
        //     e.target.style.transform = 'translateY(-2px)';
        //     e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        //   }
        // }}
        // onMouseLeave={(e) => {
        //   if (!loading && !appearanceSettings.reducedMotion) {
        //     e.target.style.transform = 'translateY(0)';
        //     e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        //   }
        // }}
      >
        <div
          className="flex justify-between max-sm:block max-sm:flex-col max-sm:py-2.5 max-sm:items-center my-6 mx-4"
          style={{
            margin: 'var(--section-gap) var(--spacing-unit)'
          }}
        >
          {/* Header Section */}
          <div className="flex flex-col max-sm:items-center">
            <div
              className="flex items-center font-bold text-2xl mt-4"
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontFamily: 'var(--font-family)',
                marginTop: 'var(--spacing-unit)'
              }}
            >
              <img
                src={videoLogo}
                alt="VidTube Logo"
                className="w-12 mr-1"
                style={{ marginRight: 'var(--spacing-unit)' }}
              />
              <h1
                style={{
                  background: 'linear-gradient(135deg, var(--color-text-primary), var(--accent-color))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                VidTube
              </h1>
            </div>
            <h1
              className="mt-4 font-bold text-3xl max-sm:text-4xl max-sm:mt-6"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-3xl)',
                fontFamily: 'var(--font-family)',
                marginTop: 'var(--spacing-unit)'
              }}
            >
              Sign in
            </h1>
            <p
              className="opacity-70"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-base)'
              }}
            >
              Continue to VidTube
            </p>
          </div>

          {/* Form Section */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="flex items-center tracking-tighter flex-col min-w-36 max-sm:mt-20"
              style={{ marginTop: 'var(--section-gap)' }}
              role="form"
              aria-label="Login form"
              noValidate
            >
              {/* Email Field */}
              <div
                className="relative flex items-center mt-6 w-2xs"
                style={{
                  marginTop: 'var(--section-gap)',
                  width: '300px'
                }}
              >
                <div className="w-full">
                  <label
                    htmlFor="email-input"
                    className="sr-only"
                  >
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200"
                    style={{
                      borderColor: errors.email
                        ? 'var(--color-error)'
                        : 'var(--color-border)',
                      backgroundColor: errors.email
                        ? 'rgba(239, 68, 68, 0.05)'
                        : 'var(--color-bg-primary)',
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
                    placeholder="Email"
                    autoComplete="email"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={!!errors.email}
                    required
                  />
                  {errors.email && (
                    <div
                      id="email-error"
                      className="flex items-center text-sm mt-1"
                      style={{
                        color: 'red',
                        fontSize: 'var(--font-size-sm)',
                        marginTop: 'calc(var(--spacing-unit) * 0.5)'
                      }}
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div
                className="relative flex items-center mt-6 w-2xs flex-col"
                style={{
                  marginTop: 'var(--section-gap)',
                  width: '300px'
                }}
              >
                <div className="w-full relative">
                  <label
                    htmlFor="password-input"
                    className="sr-only"
                  >
                    Password
                  </label>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className="w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none transition-all duration-200"
                    style={{
                      borderColor: errors.password
                        ? 'var(--color-error)'
                        : 'var(--color-border)',
                      backgroundColor: errors.password
                        ? 'rgba(239, 68, 68, 0.05)'
                        : 'var(--color-bg-primary)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-family)',
                      paddingRight: '3rem',
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
                    placeholder="Password"
                    autoComplete="current-password"
                    aria-describedby={errors.password ? "password-error" : undefined}
                    aria-invalid={!!errors.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`${errors.password ? "top-[36%]" : ""} absolute right-3  top-1/2 transform -translate-y-1/2 transition-colors`}
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && (
                    <div
                      id="password-error"
                      className="flex items-center text-sm mt-1"
                      style={{
                        color: 'red',
                        fontSize: 'var(--font-size-sm)',
                        marginTop: 'calc(var(--spacing-unit) * 0.5)'
                      }}
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div
                  className="mt-4 flex items-center justify-between w-full"
                  style={{ marginTop: 'var(--spacing-unit)' }}
                >
                  <Link
                    to="/forget/password"
                    className="transition-colors"
                    style={{
                      color: 'var(--accent-color)',
                      fontSize: 'var(--font-size-sm)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--color-accent-hover)';
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--accent-color)';
                      e.target.style.textDecoration = 'none';
                    }}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-2xs mt-6 py-3 text-xl font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  width: '300px',
                  backgroundColor: loading ? 'var(--color-text-primary)' : 'var(--accent-color)',
                  color: 'white',
                  fontSize: 'var(--font-size-xl)',
                  fontFamily: 'var(--font-family)',
                  marginTop: 'var(--section-gap)',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = 'var(--color-accent-hover)';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = 'var(--accent-color)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                aria-label={loading ? "Signing in..." : "Sign in to your account"}
              >
                {loading ? (
                  <>
                    <Loader
                      className="w-5 h-5 animate-spin mr-2"
                      style={{
                        animationDuration: appearanceSettings.reducedMotion ? '0s' : '1s'
                      }}
                    />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Register Link */}
              <div
                className="mt-4 flex items-center justify-center"
                style={{ marginTop: 'var(--spacing-unit)' }}
              >
                <Link
                  to="/register"
                  className="w-2xs transition-colors"
                  style={{
                    color: 'var(--accent-color)',
                    fontSize: 'var(--font-size-sm)',
                    transitionDuration: 'var(--animation-duration)',
                    textAlign: 'center',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--color-accent-hover)';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--accent-color)';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  Don't have an account? Register
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Social Login Section */}
        <div
          className="flex flex-col items-center justify-center mt-4"
          style={{
            marginTop: 'var(--spacing-unit)',
            paddingTop: 'var(--spacing-unit)',
            borderTop: '1px solid var(--color-border)'
          }}
        >
          <span
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-sm)',
              fontFamily: 'var(--font-family)'
            }}
          >
            OR
          </span>

          <div
            className="flex space-x-4 mt-2"
            style={{
              gap: 'var(--spacing-unit)',
              marginTop: 'var(--spacing-unit)'
            }}
          >
            <button
              onClick={googleLogin}
              disabled={loading}
              className="w-14 h-14 rounded-full transition-all duration-200 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                transitionDuration: 'var(--animation-duration)',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--color-hover)';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }
              }}
              aria-label="Sign in with Google"
            >
              <img
                src={google}
                alt="Google"
                className="w-13 h-13 rounded-full"
              />
            </button>

            <button
              disabled={loading}
              className="w-14 h-14 rounded-full transition-all duration-200 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                transitionDuration: 'var(--animation-duration)',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--color-hover)';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }
              }}
              aria-label="Sign in with Facebook"
            >
              <img
                src={facebook}
                alt="Facebook"
                className="w-14 h-14 rounded-full"
              />
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-sm rounded-2xl"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              zIndex: 10
            }}
            role="status"
            aria-label="Signing in, please wait"
          >
            <div className="text-center">
              <Loader
                className="w-8 h-8 animate-spin mx-auto mb-2"
                style={{
                  color: 'var(--accent-color)',
                  animationDuration: appearanceSettings.reducedMotion ? '0s' : '1s'
                }}
              />
              <p
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)'
                }}
              >
                Signing you in...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
