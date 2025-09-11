import React from 'react'
import { useAppearance } from '../../hooks/appearances';

const MobileContentManagerCardList = ({
    isLoading = true,
    ariaLabel = "Loading mobile content card",
    onLoadComplete
}) => {
    const { appearanceSettings } = useAppearance();

    // Skeleton component with theme integration
    function Skeleton({ className = "", ariaHidden = true }) {
        return (
            <div
                className={className}
                style={{
                    backgroundColor: 'var(--color-bg-tertiary)',
                    borderRadius: '4px',
                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite'
                }}
                aria-hidden={ariaHidden}
            />
        );
    }

    function SkeletonText({ lines = 2, className = "" }) {
        return (
            <div
                className={`space-y-2 ${className}`}
                style={{ gap: 'calc(var(--spacing-unit) * 0.5)' }}
                aria-hidden="true"
            >
                {Array.from({ length: lines }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-3"
                        style={{
                            height: '0.75rem',
                            width: i === lines - 1 ? '66.67%' : '100%',
                            borderRadius: '3px'
                        }}
                    />
                ))}
            </div>
        );
    }

    function SrLoading({ text = "Loading content, please wait." }) {
        // Accessible live region for screen readers
        return (
            <div
                role="status"
                aria-busy="true"
                aria-live="polite"
                className="sr-only"
            >
                {text}
            </div>
        );
    }

    React.useEffect(() => {
        if (!isLoading && onLoadComplete) {
            onLoadComplete();
        }
    }, [isLoading, onLoadComplete]);

    if (!isLoading) {
        return null; // Should be replaced with actual content
    }

    return (
        <article
            role="status"
            aria-busy={isLoading}
            aria-label={ariaLabel}
            style={{
                backgroundColor: 'var(--color-bg-primary)',
                fontFamily: 'var(--font-family)'
            }}
        >
            <div
                className="flex w-full flex-col rounded-lg shadow p-4 border mx-2 space-y-3"
                style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '12px',
                    padding: 'var(--spacing-unit)',
                    margin: '0 calc(var(--spacing-unit) * 0.5)',
                    gap: 'var(--spacing-unit)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
            >
                <SrLoading text={ariaLabel} />

                <div
                    className="flex space-x-2"
                    style={{ gap: 'calc(var(--spacing-unit) * 0.5)' }}
                >
                    {/* Video/thumb area */}
                    <Skeleton
                        className="h-14 w-24"
                        style={{
                            height: '3.5rem',
                            width: '6rem',
                            borderRadius: '8px'
                        }}
                    />
                    {/* Thumbnail (hidden for shorts in real UI; keep generic here) */}
                    <Skeleton
                        className="h-14 w-24"
                        style={{
                            height: '3.5rem',
                            width: '6rem',
                            borderRadius: '8px'
                        }}
                    />
                </div>

                {/* Title */}
                <Skeleton
                    className="h-4"
                    style={{
                        height: '1rem',
                        width: '75%',
                        borderRadius: '4px'
                    }}
                />

                {/* Description */}
                <SkeletonText lines={2} />

                <div
                    className="flex items-center justify-between"
                    style={{
                        gap: 'var(--spacing-unit)',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    {/* Published toggle placeholder */}
                    <div
                        className="flex items-center space-x-2"
                        style={{
                            gap: 'calc(var(--spacing-unit) * 0.5)',
                            alignItems: 'center'
                        }}
                    >
                        <Skeleton
                            className="h-4 w-16"
                            style={{
                                height: '1rem',
                                width: '4rem',
                                borderRadius: '4px'
                            }}
                        />
                        <Skeleton
                            className="h-4 w-4 rounded"
                            style={{
                                height: '1rem',
                                width: '1rem',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    {/* Action buttons */}
                    <div
                        className="flex space-x-2"
                        style={{ gap: 'calc(var(--spacing-unit) * 0.5)' }}
                    >
                        <Skeleton
                            className="h-8 w-8"
                            style={{
                                height: '2rem',
                                width: '2rem',
                                borderRadius: '6px'
                            }}
                        />
                        <Skeleton
                            className="h-8 w-8"
                            style={{
                                height: '2rem',
                                width: '2rem',
                                borderRadius: '6px'
                            }}
                        />
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
            opacity: 0.5;
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

// Enhanced version with multiple cards
const EnhancedMobileContentManagerCardList = ({
    count = 3,
    isLoading = true,
    onLoadComplete
}) => {
    // const { appearanceSettings } = useAppearance();

    return (
        <section
            className="w-full"
            style={{
                backgroundColor: 'var(--color-bg-primary)',
                fontFamily: 'var(--font-family)',
                padding: 'var(--component-padding)'
            }}
            role="region"
            aria-label={isLoading ? "Loading mobile content cards" : "Mobile content cards loaded"}
            aria-busy={isLoading}
        >
            <div
                className="space-y-4"
                style={{ gap: 'var(--spacing-unit)' }}
            >
                {Array.from({ length: count }).map((_, index) => (
                    <MobileContentManagerCardList
                        key={index}
                        isLoading={isLoading}
                        ariaLabel={`Loading mobile content card ${index + 1} of ${count}`}
                        onLoadComplete={index === count - 1 ? onLoadComplete : undefined}
                    />
                ))}
            </div>

            {/* Live Region for Screen Reader Updates */}
            <div
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
            >
                {isLoading ? `Loading ${count} mobile content cards...` : `${count} mobile content cards loaded successfully`}
            </div>
        </section>
    );
};

export default MobileContentManagerCardList;
export { EnhancedMobileContentManagerCardList };
