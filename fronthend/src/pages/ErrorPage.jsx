import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react';
import { useAppearance } from '../hooks/appearances';
import favicon from "../assets/favicon.png";

const ErrorPage = () => {
  const { appearanceSettings } = useAppearance();
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 'var(--component-padding)',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
        fontFamily: 'var(--font-family)',
        transition: `all ${appearanceSettings.reducedMotion ? '0s' : 'var(--animation-duration)'}`
      }}
      role="main"
      aria-labelledby="error-title"
      aria-describedby="error-description"
    >
      {/* Error Icon/Image */}
      <div
        style={{
          marginBottom: 'var(--section-gap)',
          animation: appearanceSettings.reducedMotion ? 'none' : 'float 3s ease-in-out infinite'
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
          alt=""
          style={{
            maxWidth: "150px",
            width: "30vw",
            height: "auto",
            filter: 'drop-shadow(0 8px 25px rgba(0, 0, 0, 0.15))',
            transition: `all ${appearanceSettings.reducedMotion ? '0s' : 'var(--animation-duration)'}`
          }}
          aria-hidden="true"
        />
      </div>

      {/* Error Title */}
      <h1
        id="error-title"
        style={{
          fontSize: "8vw",
          margin: "0",
          fontWeight: "700",
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-family)',
          marginBottom: 'var(--spacing-unit)',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, var(--color-text-primary), var(--accent-color))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
        aria-label="Error 404"
      >
        404
      </h1>

      {/* Error Message */}
      <p
        id="error-description"
        style={{
          fontSize: 'var(--font-size-xl)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--section-gap)',
          maxWidth: "400px",
          lineHeight: '1.6',
          fontFamily: 'var(--font-family)'
        }}
        role="alert"
        aria-live="polite"
      >
        Oops! The page you are looking for does not exist or has been moved.
      </p>

      {/* Helpful Message */}
      <p
        style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--section-gap)',
          maxWidth: "500px",
          fontFamily: 'var(--font-family)'
        }}
      >
        Don't worry, it happens to the best of us. Here are some things you can try:
      </p>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-unit)',
          marginTop: 'var(--section-gap)'
        }}
      >
        {/* Primary Action - Go Home */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-unit)',
            fontSize: 'var(--font-size-lg)',
            color: 'white',
            background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
            border: 'none',
            padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 2)',
            borderRadius: '12px',
            fontWeight: '600',
            fontFamily: 'var(--font-family)',
            textDecoration: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            transition: `all ${appearanceSettings.reducedMotion ? '0s' : 'var(--animation-duration)'}`,
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            if (!appearanceSettings.reducedMotion) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }
            e.target.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            if (!appearanceSettings.reducedMotion) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }
            e.target.style.opacity = '1';
          }}
          aria-label="Go back to homepage"
        >
          <Home size={20} aria-hidden="true" />
          Go back home
        </button>

        {/* Secondary Actions */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-unit)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing-unit) * 0.5)',
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-bg-secondary)',
              border: '2px solid var(--color-border)',
              padding: 'calc(var(--spacing-unit) * 0.75) var(--spacing-unit)',
              borderRadius: '8px',
              fontWeight: '500',
              fontFamily: 'var(--font-family)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: `all ${appearanceSettings.reducedMotion ? '0s' : 'var(--animation-duration)'}`,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-hover)';
              e.target.style.borderColor = 'var(--accent-color)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-bg-secondary)';
              e.target.style.borderColor = 'var(--color-border)';
            }}
            aria-label="Go back to previous page"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Go back
          </button>

          {/* Search Button */}
          <button
            onClick={() => navigate('/search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing-unit) * 0.5)',
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-bg-secondary)',
              border: '2px solid var(--color-border)',
              padding: 'calc(var(--spacing-unit) * 0.75) var(--spacing-unit)',
              borderRadius: '8px',
              fontWeight: '500',
              fontFamily: 'var(--font-family)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: `all ${appearanceSettings.reducedMotion ? '0s' : 'var(--animation-duration)'}`,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-hover)';
              e.target.style.borderColor = 'var(--accent-color)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-bg-secondary)';
              e.target.style.borderColor = 'var(--color-border)';
            }}
            aria-label="Search for content"
          >
            <Search size={16} aria-hidden="true" />
            Search
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing-unit) * 0.5)',
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-bg-secondary)',
              border: '2px solid var(--color-border)',
              padding: 'calc(var(--spacing-unit) * 0.75) var(--spacing-unit)',
              borderRadius: '8px',
              fontWeight: '500',
              fontFamily: 'var(--font-family)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: `all ${appearanceSettings.reducedMotion ? '0s' : 'var(--animation-duration)'}`,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-hover)';
              e.target.style.borderColor = 'var(--accent-color)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-bg-secondary)';
              e.target.style.borderColor = 'var(--color-border)';
            }}
            aria-label="Refresh the page"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </div>

      {/* Help Text */}
      <div
        style={{
          marginTop: 'var(--section-gap)',
          padding: 'var(--spacing-unit)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          maxWidth: '500px',
          width: '100%'
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            margin: '0',
            fontFamily: 'var(--font-family)',
            lineHeight: '1.5'
          }}
        >
          <strong style={{ color: 'var(--color-text-primary)' }}>Need help?</strong>{' '}
          If you believe this is a mistake or you were looking for something specific,
          please use the search function or navigate back to our homepage.
        </p>
      </div>

      {/* Brand Footer */}
      <div
        style={{
          position: 'fixed',
          bottom: 'var(--spacing-unit)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(var(--spacing-unit) * 0.5)',
          padding: 'calc(var(--spacing-unit) * 0.5) var(--spacing-unit)',
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: `all ${appearanceSettings.reducedMotion ? '0s' : 'var(--animation-duration)'}`,
        }}
        onClick={() => navigate('/')}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--color-hover)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'var(--color-bg-primary)';
        }}
        role="button"
        tabIndex={0}
        aria-label="Go to VidTube homepage"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate('/');
          }
        }}
      >
        <img
          src={favicon}
          alt="VidTube"
          style={{ width: '24px', height: '24px' }}
        />
        <span
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-base)',
            fontWeight: '600',
            fontFamily: 'var(--font-family)'
          }}
        >
          VidTube
        </span>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        @media (max-width: 640px) {
          h1 {
            font-size: 15vw !important;
          }
        }
      `}</style>

      {/* Screen Reader Only Content */}
      <div className="sr-only">
        This is a 404 error page. The page you were looking for could not be found.
        You can use the navigation buttons above to go back to the homepage,
        search for content, or go back to the previous page.
      </div>
    </div>
  );
};

export default ErrorPage;
