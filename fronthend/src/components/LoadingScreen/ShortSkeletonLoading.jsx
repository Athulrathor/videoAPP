import React from 'react';
import { useAppearance } from '../../hooks/appearances';

const ShortSkeletonLoading = ({ ariaLabel = "Loading short video content" }) => {
  const { appearanceSettings } = useAppearance();

  return (
    <article
      className="relative m-auto snap-start"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        fontFamily: 'var(--font-family)',
        animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite'
      }}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      <div
        className="relative m-auto"
        style={{
          aspectRatio: "9/16",
          height: "90vh",
          maxWidth: "100vw",
          maxHeight: "90vh",
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: 'var(--color-bg-tertiary)',
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Progress bar placeholder */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 z-40"
          aria-hidden="true"
        >
          <div
            className="h-full w-0"
            style={{ backgroundColor: 'var(--color-bg-secondary)' }}
          />
        </div>

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-4"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)',
            padding: 'var(--spacing-unit)'
          }}
        >

          {/* Top Controls Skeleton */}
          <div
            className="flex justify-between items-start"
            style={{ gap: 'var(--spacing-unit)' }}
          >
            <div
              className="flex items-center space-x-2"
              style={{ gap: 'calc(var(--spacing-unit) * 0.5)' }}
            >
              <div
                className="p-4 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: 'var(--spacing-unit)',
                  animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite'
                }}
                aria-hidden="true"
              >
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                />
              </div>
            </div>

            <div
              className="flex space-x-2"
              style={{ gap: 'calc(var(--spacing-unit) * 0.5)' }}
            >
              <div
                className="p-2 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: 'calc(var(--spacing-unit) * 0.5)',
                  animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.2s'
                }}
                aria-hidden="true"
              >
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                />
              </div>
              <div
                className="p-2 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: 'calc(var(--spacing-unit) * 0.5)',
                  animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.4s'
                }}
                aria-hidden="true"
              >
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                />
              </div>
            </div>
          </div>

          {/* Center Play Button Skeleton */}
          <div className="flex items-end h-full justify-center">
            <div
              className="p-4 rounded-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                padding: 'var(--spacing-unit)',
                animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.5s'
              }}
              aria-hidden="true"
            >
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
              />
            </div>
          </div>

          {/* Bottom Info and Controls Skeleton */}
          <div
            className="flex justify-between items-end"
            style={{ gap: 'var(--spacing-unit)' }}
          >
            <div
              className="flex-1 mr-4"
              style={{ marginRight: 'var(--spacing-unit)' }}
            >
              {/* User info skeleton */}
              <div
                className="flex text-white text-sm font-medium mb-1 gap-2 items-center"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  marginBottom: 'calc(var(--spacing-unit) * 0.5)',
                  gap: 'calc(var(--spacing-unit) * 0.5)'
                }}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite'
                  }}
                  aria-hidden="true"
                />
                <div
                  className="h-4 rounded w-24"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    height: '1rem',
                    width: '6rem',
                    borderRadius: '4px',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.1s'
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Title skeleton */}
              <div
                className="mb-2 space-y-1"
                style={{
                  marginBottom: 'var(--spacing-unit)',
                  gap: 'calc(var(--spacing-unit) * 0.25)'
                }}
              >
                <div
                  className="h-4 rounded w-full"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    height: '1rem',
                    borderRadius: '4px',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.2s'
                  }}
                  aria-hidden="true"
                />
                <div
                  className="h-4 rounded w-3/4"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    height: '1rem',
                    width: '75%',
                    borderRadius: '4px',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.3s'
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Side Controls Skeleton */}
            <div
              className="flex flex-col space-y-4"
              style={{ gap: 'var(--spacing-unit)' }}
            >
              {/* Like button */}
              <div className="flex flex-col items-center">
                <div
                  className="p-3 rounded-full"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: 'var(--spacing-unit)',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.4s'
                  }}
                  aria-hidden="true"
                >
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                  />
                </div>
                <div
                  className="h-3 rounded w-6 mt-1"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    height: '0.75rem',
                    width: '1.5rem',
                    borderRadius: '3px',
                    marginTop: 'calc(var(--spacing-unit) * 0.25)',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.5s'
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Comments button */}
              <div className="flex flex-col items-center">
                <div
                  className="p-3 rounded-full"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: 'var(--spacing-unit)',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.6s'
                  }}
                  aria-hidden="true"
                >
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                  />
                </div>
                <div
                  className="h-3 rounded w-6 mt-1"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    height: '0.75rem',
                    width: '1.5rem',
                    borderRadius: '3px',
                    marginTop: 'calc(var(--spacing-unit) * 0.25)',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.7s'
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Share button */}
              <div className="flex flex-col items-center">
                <div
                  className="p-3 rounded-full"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: 'var(--spacing-unit)',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.8s'
                  }}
                  aria-hidden="true"
                >
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                  />
                </div>
                <div
                  className="h-3 rounded w-4 mt-1"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    height: '0.75rem',
                    width: '1rem',
                    borderRadius: '3px',
                    marginTop: 'calc(var(--spacing-unit) * 0.25)',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.9s'
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Download button */}
              <div
                className="p-3 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: 'var(--spacing-unit)',
                  animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 1s'
                }}
                aria-hidden="true"
              >
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                />
              </div>

              {/* More button */}
              <div
                className="p-3 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: 'var(--spacing-unit)',
                  animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 1.1s'
                }}
                aria-hidden="true"
              >
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader only loading text */}
      <span className="sr-only">
        {ariaLabel}
      </span>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </article>
  );
};

// Enhanced version with loading state management
const EnhancedShortSkeletonLoading = ({
  isLoading = true,
  onLoadComplete,
  ariaLabel = "Loading short video content"
}) => {
  // const { appearanceSettings } = useAppearance();

  React.useEffect(() => {
    if (!isLoading && onLoadComplete) {
      onLoadComplete();
    }
  }, [isLoading, onLoadComplete]);

  if (!isLoading) {
    return null; // Component should be replaced with actual content
  }

  return (
    <section
      className="w-full h-full flex items-center justify-center"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        fontFamily: 'var(--font-family)'
      }}
      role="region"
      aria-label="Loading short video player"
      aria-busy={isLoading}
    >
      <ShortSkeletonLoading ariaLabel={ariaLabel} />

      {/* Live Region for Screen Reader Updates */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading ? "Loading short video content..." : "Short video content loaded successfully"}
      </div>
    </section>
  );
};

export default ShortSkeletonLoading;
export { EnhancedShortSkeletonLoading };
