import React from "react";
import { useAppearance } from '../../hooks/appearances';

const VideoSkeleton = ({ ariaLabel = "Loading video content" }) => {
  const { appearanceSettings } = useAppearance();

  return (
    <article
      className="transition-all"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderRadius: '12px',
        padding: 'var(--spacing-unit)',
        transitionDuration: 'var(--animation-duration)'
      }}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      <div
        className={appearanceSettings.reducedMotion ? '' : 'animate-pulse'}
        style={{
          animationDuration: appearanceSettings.reducedMotion ? '0s' : '2s'
        }}
      >
        <div>
          <div className="aspect-video">
            {/* Video thumbnail placeholder with fixed 16:9 aspect ratio */}
            <div
              className="w-full h-full aspect-video rounded"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderRadius: '8px'
              }}
              aria-hidden="true"
            />

            <div
              className="flex items-center mt-4 max-md:pl-0 max-md:pr-2 pl-2 pr-2"
              style={{
                marginTop: 'var(--spacing-unit)',
                gap: 'var(--spacing-unit)',
                padding: 'calc(var(--spacing-unit) * 0.5)'
              }}
            >
              {/* Avatar placeholder */}
              <div
                className="h-[36px] w-[36px] rounded-full mr-2.5 flex-shrink-0"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  marginRight: 'calc(var(--spacing-unit) * 0.75)'
                }}
                aria-hidden="true"
              />

              <div className="flex-1">
                {/* Title placeholder */}
                <div
                  className="h-4 rounded w-3/4 mb-2"
                  style={{
                    backgroundColor: 'var(--color-bg-tertiary)',
                    height: '1rem',
                    borderRadius: '4px',
                    marginBottom: 'calc(var(--spacing-unit) * 0.5)'
                  }}
                  aria-hidden="true"
                />

                {/* Views and time placeholder */}
                <div
                  className="flex items-center justify-between mt-0.5"
                  style={{ marginTop: 'calc(var(--spacing-unit) * 0.25)' }}
                >
                  <div
                    className="h-3 rounded w-32"
                    style={{
                      backgroundColor: 'var(--color-bg-tertiary)',
                      height: '0.75rem',
                      borderRadius: '3px',
                      width: '8rem'
                    }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader only loading text */}
      <span className="sr-only">
        {ariaLabel}
      </span>
    </article>
  );
};

// Example usage component showing multiple skeleton items
const VideoListSkeleton = ({ count = 9, isLoading = true }) => {
  // const { appearanceSettings } = useAppearance();

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        fontFamily: 'var(--font-family)'
      }}
      role="region"
      aria-label={isLoading ? "Loading video content" : "Video content loaded"}
      aria-busy={isLoading}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
        style={{
          gap: 'var(--spacing-unit)',
          padding: 'var(--component-padding)'
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <VideoSkeleton
            key={index}
            ariaLabel={`Loading video ${index + 1} of ${count}`}
          />
        ))}
      </div>

      {/* Live Region for Screen Reader Updates */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading ? `Loading ${count} videos...` : `${count} videos loaded`}
      </div>
    </section>
  );
};

// Enhanced skeleton with different types for variety
const EnhancedVideoSkeleton = ({
  variant = 'default',
  showAvatar = true,
  ariaLabel = "Loading video content"
}) => {
  const { appearanceSettings } = useAppearance();

  const getVariantStyles = () => {
    switch (variant) {
      case 'wide':
        return { aspectRatio: '21/9' }; // Ultra-wide format
      case 'square':
        return { aspectRatio: '1/1' }; // Square format
      case 'portrait':
        return { aspectRatio: '9/16' }; // Vertical format
      default:
        return { aspectRatio: '16/9' }; // Standard format
    }
  };

  return (
    <article
      className="transition-all"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderRadius: '12px',
        padding: 'var(--spacing-unit)',
        border: '1px solid var(--color-border)',
        transitionDuration: 'var(--animation-duration)'
      }}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'var(--color-hover)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'var(--color-bg-primary)';
      }}
    >
      <div
        className={appearanceSettings.reducedMotion ? '' : 'animate-pulse'}
        style={{
          animationDuration: appearanceSettings.reducedMotion ? '0s' : '2s'
        }}
      >
        {/* Video thumbnail with variant aspect ratio */}
        <div
          className="w-full rounded overflow-hidden"
          style={{
            ...getVariantStyles(),
            backgroundColor: 'var(--color-bg-tertiary)',
            borderRadius: '8px'
          }}
          aria-hidden="true"
        />

        {/* Video metadata section */}
        <div
          className="flex items-start mt-3"
          style={{
            marginTop: 'var(--spacing-unit)',
            gap: 'var(--spacing-unit)'
          }}
        >
          {/* Avatar placeholder (conditional) */}
          {showAvatar && (
            <div
              className="flex-shrink-0 rounded-full"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--color-bg-tertiary)',
                borderRadius: '50%'
              }}
              aria-hidden="true"
            />
          )}

          {/* Text content area */}
          <div className="flex-1 min-w-0">
            {/* Title lines (2-3 lines with varying widths) */}
            <div
              className="rounded mb-2"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                height: '1rem',
                width: '85%',
                borderRadius: '4px',
                marginBottom: 'calc(var(--spacing-unit) * 0.5)'
              }}
              aria-hidden="true"
            />
            <div
              className="rounded mb-3"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                height: '1rem',
                width: '60%',
                borderRadius: '4px',
                marginBottom: 'var(--spacing-unit)'
              }}
              aria-hidden="true"
            />

            {/* Metadata line (views, time) */}
            <div
              className="flex items-center space-x-4"
              style={{ gap: 'var(--spacing-unit)' }}
            >
              <div
                className="rounded"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  height: '0.75rem',
                  width: '4rem',
                  borderRadius: '3px'
                }}
                aria-hidden="true"
              />
              <div
                className="rounded"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  height: '0.75rem',
                  width: '3rem',
                  borderRadius: '3px'
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader only loading text */}
      <span className="sr-only">
        {ariaLabel}
      </span>
    </article>
  );
};

// Comprehensive skeleton list with different variants
const ComprehensiveSkeletonList = ({
  count = 12,
  isLoading = true,
  showVariants = true
}) => {
  const variants = showVariants ? ['default', 'wide', 'square'] : ['default'];

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        fontFamily: 'var(--font-family)'
      }}
      role="region"
      aria-label={isLoading ? "Loading video content" : "Video content loaded"}
      aria-busy={isLoading}
    >
      {/* Grid layout */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
        style={{
          gap: 'var(--spacing-unit)',
          padding: 'var(--component-padding)'
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <EnhancedVideoSkeleton
            key={index}
            variant={showVariants ? variants[index % variants.length] : 'default'}
            showAvatar={index % 3 !== 2} // Vary avatar presence
            ariaLabel={`Loading video ${index + 1} of ${count}`}
          />
        ))}
      </div>

      {/* Live Region for Screen Reader Updates */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading ? `Loading ${count} videos...` : `${count} videos loaded successfully`}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default VideoListSkeleton;
export { VideoSkeleton, EnhancedVideoSkeleton, ComprehensiveSkeletonList };
