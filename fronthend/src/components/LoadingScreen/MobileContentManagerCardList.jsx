import React from 'react'

const MobileContentManagerCardList = () => {

        // Skeleton.tsx
         function Skeleton({ className = "" }) {
            return (
                <div className={`animate-pulse bg-gray-200/60 dark:bg-gray-700/30 rounded ${className}`} />
            );
        }
    
         function SkeletonText({ lines = 2, className = "" }) {
            return (
                <div className={`space-y-2 ${className}`} aria-hidden>
                    {Array.from({ length: lines }).map((_, i) => (
                        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
                    ))}
                </div>
            );
        }
    
         function SrLoading({ text = "Loading content, please wait." }) {
            // Accessible live region for screen readers
            return (
                <div role="status" aria-busy="true" aria-live="polite" className="sr-only">
                    {text}
                </div>
            );
        }

  return (
      <div>
          <div className="flex w-full flex-col bg-white rounded-lg shadow p-4 border mx-2 space-y-3 skeleton-surface">
              <SrLoading />

              <div className="flex space-x-2">
                  {/* Video/thumb area */}
                  <Skeleton className="h-14 w-24" />
                  {/* Thumbnail (hidden for shorts in real UI; keep generic here) */}
                  <Skeleton className="h-14 w-24" />
              </div>

              {/* Title */}
              <Skeleton className="h-4 w-3/4" />

              {/* Description */}
              <SkeletonText lines={2} />

              <div className="flex items-center justify-between">
                  {/* Published toggle placeholder */}
                  <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-4 rounded" />
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                  </div>
              </div>
          </div>
    </div>
  )
}

export default MobileContentManagerCardList