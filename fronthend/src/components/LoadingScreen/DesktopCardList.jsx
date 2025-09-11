import React from 'react'
import { useAppearance } from '../../hooks/appearances';

const DesktopCardList = ({ showThumbnail, rows = 8, isLoading = true }) => {
    const { appearanceSettings } = useAppearance();

    // Skeleton.tsx
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
                        className={`h-3`}
                        style={{
                            height: '0.75rem',
                            width: i === lines - 1 ? '66.67%' : '100%'
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

    return (
        <>
            {/* Screen reader announcement for table loading state */}
            <SrLoading text={`Loading ${rows} table rows, please wait.`} />

            {Array.from({ length: rows }).map((_, i) => (
                <tr
                    key={i}
                    className="transition-colors"
                    style={{
                        backgroundColor: 'var(--color-bg-primary)',
                        borderBottom: '1px solid var(--color-border)',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-hover)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'var(--color-bg-primary)';
                    }}
                    role="row"
                    aria-busy="true"
                >
                    {/* First column - always visible */}
                    <td
                        className="p-2 w-28"
                        style={{ padding: 'var(--spacing-unit)' }}
                        role="cell"
                    >
                        <Skeleton
                            className="h-14 w-24"
                            style={{
                                height: '3.5rem',
                                width: '6rem',
                                borderRadius: '8px'
                            }}
                        />
                    </td>

                    {/* Thumbnail column - conditional */}
                    <td
                        className={`${showThumbnail ? "" : "hidden"} p-2 w-28`}
                        style={{
                            padding: 'var(--spacing-unit)',
                            display: showThumbnail ? 'table-cell' : 'none'
                        }}
                        role="cell"
                    >
                        <Skeleton
                            className="h-14 w-24"
                            style={{
                                height: '3.5rem',
                                width: '6rem',
                                borderRadius: '8px'
                            }}
                        />
                    </td>

                    {/* Title column */}
                    <td
                        className="p-2"
                        style={{ padding: 'var(--spacing-unit)' }}
                        role="cell"
                    >
                        <Skeleton
                            className="h-4"
                            style={{
                                height: '1rem',
                                width: '66.67%',
                                borderRadius: '4px'
                            }}
                        />
                    </td>

                    {/* Description column */}
                    <td
                        className="p-2"
                        style={{ padding: 'var(--spacing-unit)' }}
                        role="cell"
                    >
                        <SkeletonText lines={2} />
                    </td>

                    {/* Status column */}
                    <td
                        className="p-2 text-center w-28"
                        style={{
                            padding: 'var(--spacing-unit)',
                            textAlign: 'center'
                        }}
                        role="cell"
                    >
                        <div className="flex items-center justify-center">
                            <Skeleton
                                className="rounded-full h-5 w-12"
                                style={{
                                    height: '1.25rem',
                                    width: '3rem',
                                    borderRadius: '9999px'
                                }}
                            />
                        </div>
                    </td>

                    {/* Actions column */}
                    <td
                        className="p-2 text-center"
                        style={{
                            padding: 'var(--spacing-unit)',
                            textAlign: 'center'
                        }}
                        role="cell"
                    >
                        <div
                            className="flex justify-center space-x-2"
                            style={{
                                gap: 'calc(var(--spacing-unit) * 0.5)',
                                justifyContent: 'center'
                            }}
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
                    </td>
                </tr>
            ))}

            {/* Live Region for Screen Reader Updates */}
            <tr className="sr-only">
                <td colSpan="6">
                    <div
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {isLoading ? `Loading ${rows} table rows...` : `${rows} table rows loaded successfully`}
                    </div>
                </td>
            </tr>

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
        </>
    )
}

// Enhanced version with comprehensive table skeleton
const EnhancedDesktopCardList = ({
    showThumbnail = true,
    rows = 8,
    isLoading = true,
    tableCaption = "Data table loading",
    onLoadComplete
}) => {
    const { appearanceSettings } = useAppearance();

    React.useEffect(() => {
        if (!isLoading && onLoadComplete) {
            onLoadComplete();
        }
    }, [isLoading, onLoadComplete]);

    if (!isLoading) {
        return null; // Should be replaced with actual table content
    }

    return (
        <div
            style={{
                backgroundColor: 'var(--color-bg-primary)',
                fontFamily: 'var(--font-family)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}
            role="region"
            aria-label="Loading table data"
            aria-busy={isLoading}
        >
            <table
                className="w-full"
                style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                }}
                role="table"
                aria-label={tableCaption}
            >
                <caption
                    className="sr-only"
                    style={{
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-base)'
                    }}
                >
                    {tableCaption} - Loading {rows} rows
                </caption>

                <thead role="rowgroup">
                    <tr
                        role="row"
                        style={{
                            backgroundColor: 'var(--color-bg-secondary)',
                            borderBottom: '2px solid var(--color-border)'
                        }}
                    >
                        <th
                            role="columnheader"
                            className="p-2 text-left"
                            style={{
                                padding: 'var(--spacing-unit)',
                                textAlign: 'left',
                                color: 'var(--color-text-primary)',
                                fontSize: 'var(--font-size-sm)',
                                fontFamily: 'var(--font-family)'
                            }}
                        >
                            <div
                                className="h-4 rounded"
                                style={{
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    height: '1rem',
                                    width: '4rem',
                                    borderRadius: '4px',
                                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite'
                                }}
                                aria-hidden="true"
                            />
                        </th>
                        {showThumbnail && (
                            <th
                                role="columnheader"
                                className="p-2 text-left"
                                style={{
                                    padding: 'var(--spacing-unit)',
                                    textAlign: 'left'
                                }}
                            >
                                <div
                                    className="h-4 rounded"
                                    style={{
                                        backgroundColor: 'var(--color-bg-tertiary)',
                                        height: '1rem',
                                        width: '5rem',
                                        borderRadius: '4px',
                                        animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.1s'
                                    }}
                                    aria-hidden="true"
                                />
                            </th>
                        )}
                        <th
                            role="columnheader"
                            className="p-2 text-left"
                            style={{
                                padding: 'var(--spacing-unit)',
                                textAlign: 'left'
                            }}
                        >
                            <div
                                className="h-4 rounded"
                                style={{
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    height: '1rem',
                                    width: '6rem',
                                    borderRadius: '4px',
                                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.2s'
                                }}
                                aria-hidden="true"
                            />
                        </th>
                        <th
                            role="columnheader"
                            className="p-2 text-left"
                            style={{
                                padding: 'var(--spacing-unit)',
                                textAlign: 'left'
                            }}
                        >
                            <div
                                className="h-4 rounded"
                                style={{
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    height: '1rem',
                                    width: '7rem',
                                    borderRadius: '4px',
                                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.3s'
                                }}
                                aria-hidden="true"
                            />
                        </th>
                        <th
                            role="columnheader"
                            className="p-2 text-center"
                            style={{
                                padding: 'var(--spacing-unit)',
                                textAlign: 'center'
                            }}
                        >
                            <div
                                className="h-4 rounded mx-auto"
                                style={{
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    height: '1rem',
                                    width: '4rem',
                                    borderRadius: '4px',
                                    margin: '0 auto',
                                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.4s'
                                }}
                                aria-hidden="true"
                            />
                        </th>
                        <th
                            role="columnheader"
                            className="p-2 text-center"
                            style={{
                                padding: 'var(--spacing-unit)',
                                textAlign: 'center'
                            }}
                        >
                            <div
                                className="h-4 rounded mx-auto"
                                style={{
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    height: '1rem',
                                    width: '5rem',
                                    borderRadius: '4px',
                                    margin: '0 auto',
                                    animation: appearanceSettings.reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite 0.5s'
                                }}
                                aria-hidden="true"
                            />
                        </th>
                    </tr>
                </thead>

                <tbody role="rowgroup">
                    <DesktopCardList
                        showThumbnail={showThumbnail}
                        rows={rows}
                        isLoading={isLoading}
                    />
                </tbody>
            </table>

            {/* Live Region for Screen Reader Updates */}
            <div
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
            >
                {isLoading ? `Loading table with ${rows} rows...` : `Table with ${rows} rows loaded successfully`}
            </div>
        </div>
    );
};

export default DesktopCardList;
export { EnhancedDesktopCardList };
