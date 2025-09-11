import React from "react";
import { useAppearance } from '../hooks/appearances';

const LoadingCircle = ({
  size = 60,
  color = null, // Will use theme color if null
  backgroundColor = null, // Will use theme color if null
  text = "Loading...",
  showText = true,
  speed = 1,
}) => {
  const { appearanceSettings } = useAppearance();

  const circleStyle = {
    width: `${size}px`,
    height: `${size}px`,
    border: `4px solid ${backgroundColor || 'var(--color-bg-tertiary)'}`,
    borderTop: `4px solid ${color || 'var(--accent-color)'}`,
    borderRadius: "50%",
    animation: `spin ${speed}s linear infinite`,
    margin: "0 auto 20px",
    animationDuration: appearanceSettings.reducedMotion ? '0s' : `${speed}s`,
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
    fontFamily: 'var(--font-family)',
    margin: 0,
    padding: 0,
    color: 'var(--color-text-primary)',
  };

  const textStyle = {
    color: color || 'var(--color-text-primary)',
    fontSize: 'var(--font-size-lg)',
    fontWeight: "300",
    fontFamily: 'var(--font-family)',
    opacity: 0.8,
    animation: appearanceSettings.reducedMotion ? 'none' : "pulse 1.5s ease-in-out infinite",
  };

  return (
    <div
      style={containerStyle}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div className="loading-container">
        <div
          style={circleStyle}
          aria-hidden="true"
        />
        {showText && (
          <div
            style={textStyle}
            id="loading-text"
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

// Alternative inline component version
const InlineLoadingCircle = ({
  size = 40,
  color = null, // Will use theme color if null
  backgroundColor = null, // Will use theme color if null
  className = "",
  ariaLabel = "Loading"
}) => {
  const { appearanceSettings } = useAppearance();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
      <div
        className="rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `3px solid ${backgroundColor || 'var(--color-bg-tertiary)'}`,
          borderTop: `3px solid ${color || 'var(--accent-color)'}`,
          animation: appearanceSettings.reducedMotion ? 'none' : 'spin 1s linear infinite',
        }}
        aria-hidden="true"
      />
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

// Demo component showing both versions
const Circle = () => {
  const { appearanceSettings } = useAppearance();
  const [showFullscreen, setShowFullscreen] = React.useState(true);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        fontFamily: 'var(--font-family)'
      }}
    >
      {showFullscreen ? (
        <div className="relative">
          <LoadingCircle
            size={80}
            text="Loading your content..."
            speed={0.8}
          />
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              color: 'var(--color-text-primary)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: 'var(--font-size-sm)',
              fontFamily: 'var(--font-family)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            aria-label="Switch to inline loading examples"
          >
            Show Inline Version
          </button>
        </div>
      ) : (
        <div
          className="p-8"
          style={{ padding: 'var(--section-gap)' }}
        >
          <div
            className="max-w-md mx-auto rounded-lg shadow-lg p-6"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
              padding: 'var(--section-gap)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h2
              className="text-2xl font-bold mb-4"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-2xl)',
                fontFamily: 'var(--font-family)',
                marginBottom: 'var(--spacing-unit)'
              }}
            >
              Content Loading
            </h2>
            <p
              className="mb-6"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-base)',
                marginBottom: 'var(--section-gap)'
              }}
            >
              Here's an example of the inline loading circle:
            </p>

            <div
              className="flex items-center space-x-4 mb-6"
              style={{
                gap: 'var(--spacing-unit)',
                marginBottom: 'var(--section-gap)',
                alignItems: 'center'
              }}
            >
              <InlineLoadingCircle size={24} ariaLabel="Loading data" />
              <span
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)'
                }}
              >
                Loading data...
              </span>
            </div>

            <div
              className="flex items-center space-x-4 mb-6"
              style={{
                gap: 'var(--spacing-unit)',
                marginBottom: 'var(--section-gap)',
                alignItems: 'center'
              }}
            >
              <InlineLoadingCircle
                size={32}
                color="var(--color-success)"
                ariaLabel="Processing request"
              />
              <span
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)'
                }}
              >
                Processing...
              </span>
            </div>

            <div
              className="flex items-center space-x-4 mb-6"
              style={{
                gap: 'var(--spacing-unit)',
                marginBottom: 'var(--section-gap)',
                alignItems: 'center'
              }}
            >
              <InlineLoadingCircle
                size={20}
                color="var(--color-warning)"
                ariaLabel="Saving changes"
              />
              <span
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)'
                }}
              >
                Saving changes...
              </span>
            </div>

            <button
              onClick={() => setShowFullscreen(true)}
              className="w-full py-2 px-4 rounded-lg transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
                color: 'white',
                fontSize: 'var(--font-size-base)',
                fontFamily: 'var(--font-family)',
                padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 1.5)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onMouseEnter={(e) => {
                if (!appearanceSettings.reducedMotion) {
                  e.target.style.transform = 'translateY(-1px)';
                }
                e.target.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                if (!appearanceSettings.reducedMotion) {
                  e.target.style.transform = 'translateY(0)';
                }
                e.target.style.opacity = '1';
              }}
              aria-label="Switch to fullscreen loading example"
            >
              Show Fullscreen Version
            </button>
          </div>
        </div>
      )}

      {/* Live Region for Status Updates */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {showFullscreen ? "Displaying fullscreen loading indicator" : "Displaying inline loading examples"}
      </div>
    </div>
  );
};

export default Circle;
