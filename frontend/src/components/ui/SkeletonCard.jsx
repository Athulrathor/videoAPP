import React from 'react'

const SkeletonCard = () => {
  return (
      <div
          className="animate-pulse space-y-2"
          aria-hidden="true"
      >
          {/* Thumbnail */}
          <div className="bg-(--border)] h-40 w-full rounded" />

          {/* Title */}
          <div className="h-4 bg-(--border) rounded w-3/4" />

          {/* Subtitle */}
          <div className="h-3 bg-(--border) rounded w-1/2" />
      </div>
  )
}

export default SkeletonCard;