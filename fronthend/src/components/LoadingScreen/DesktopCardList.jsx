import React from 'react'

const DesktopCardList = ({ showThumbnail,rows = 8 }) => {

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
      <>
          {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="bg-white">
                  <td className="p-2 w-28">
                      <div className="animate-pulse bg-gray-200/60 rounded h-14 w-24" />
                  </td>
                  <td className={`${showThumbnail ? "" : "hidden"} p-2 w-28`}>
                      <div className="animate-pulse bg-gray-200/60 rounded h-14 w-24" />
                  </td>
                  <td className="p-2">
                      <div className="animate-pulse bg-gray-200/60 rounded h-4 w-2/3" />
                  </td>
                  <td className="p-2">
                      <div className="space-y-2">
                          <div className="animate-pulse bg-gray-200/60 rounded h-3 w-full" />
                          <div className="animate-pulse bg-gray-200/60 rounded h-3 w-2/3" />
                      </div>
                  </td>
                  <td className="p-2 text-center w-28">
                      <div className="flex items-center justify-center">
                          <span className="animate-pulse bg-gray-200/60 rounded-full h-5 w-12" />
                      </div>
                  </td>
                  <td className="p-2 text-center">
                      <div className="flex justify-center space-x-2">
                          <div className="animate-pulse bg-gray-200/60 rounded h-8 w-8" />
                          <div className="animate-pulse bg-gray-200/60 rounded h-8 w-8" />
                      </div>
                  </td>
              </tr>
          ))}
      </>
  )
}

export default DesktopCardList