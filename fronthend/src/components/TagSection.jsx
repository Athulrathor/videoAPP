import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import React, { useRef, useEffect, useState } from "react";
// import { useAppearance } from '../hooks/appearances';

const TagSection = () => {
  // const { appearanceSettings } = useAppearance();
  const scrollContainerRef = useRef(null); // Fixed typo: was useRef without (null)
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [selectedTag, setSelectedTag] = useState('All');

  const keyWord = [
    "All",
    "Engine",
    "Sport Bikes",
    "React routers",
    "Technology",
    "Gaming",
    "Music",
    "Education",
    "Sports",
    "Lifestyle",
    "News",
    "Art & Design",
    "Cooking",
    "Travel",
    "Finance",
    "Health",
    "Science",
    "Entertainment",
  ];

  // Track scroll position to disable buttons appropriately
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const element = scrollContainerRef.current;
    const updateScrollState = () => {
      setScrollLeftPos(element.scrollLeft);
      setMaxScroll(element.scrollWidth - element.clientWidth);
    };

    element.addEventListener('scroll', updateScrollState);
    updateScrollState(); // Initial calculation

    return () => element.removeEventListener('scroll', updateScrollState);
  }, []);

  const scrollByAmount = 150;
  const canScrollLeft = scrollLeftPos > 0;
  const canScrollRight = scrollLeftPos < maxScroll - 1; // Small threshold for precision

  const scrollButton = (count) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: count,
        behavior: "smooth",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (!scrollContainerRef.current) return;

    switch (e.key) {
      case 'ArrowRight':
        if (canScrollRight) {
          scrollButton(scrollByAmount);
          e.preventDefault();
        }
        break;
      case 'ArrowLeft':
        if (canScrollLeft) {
          scrollButton(-scrollByAmount);
          e.preventDefault();
        }
        break;
      case 'Home':
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        e.preventDefault();
        break;
      case 'End':
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.scrollWidth,
          behavior: 'smooth'
        });
        e.preventDefault();
        break;
    }
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    // You can emit this selection to parent component or handle filtering here
  };

  return (
    <div
      className="flex items-center"
      style={{
        gap: 'var(--spacing-unit)',
        padding: 'var(--spacing-unit)',
        fontFamily: 'var(--font-family)'
      }}
      role="toolbar"
      aria-label="Tag filters"
    >
      {/* Left scroll button */}
      <button
        onClick={() => scrollButton(-scrollByAmount)}
        disabled={!canScrollLeft}
        className="rounded-full p-2 transition-all"
        style={{
          backgroundColor: 'transparent',
          color: canScrollLeft ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
          opacity: canScrollLeft ? 1 : 0.4,
          cursor: canScrollLeft ? 'pointer' : 'not-allowed',
          transitionDuration: 'var(--animation-duration)'
        }}
        onMouseEnter={(e) => {
          if (canScrollLeft) {
            e.target.style.backgroundColor = 'var(--color-hover)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
        aria-label="Scroll tags left"
        tabIndex={canScrollLeft ? 0 : -1}
      >
        <IoIosArrowBack className="text-2xl" />
      </button>

      {/* Scrollable tag container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-hidden gap-1 rounded-lg"
        style={{
          gap: 'calc(var(--spacing-unit) * 0.75)',
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
          scrollSnapType: 'x mandatory'
        }}
        role="listbox"
        aria-label="Available tag filters"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-orientation="horizontal"
        aria-activedescendant={`tag-${selectedTag}`}
      >
        {keyWord.map((word, index) => {
          const isSelected = selectedTag === word;
          return (
            <button
              key={index}
              id={`tag-${word}`}
              onClick={() => handleTagSelect(word)}
              className="px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all"
              style={{
                backgroundColor: isSelected ? 'var(--accent-color)' : 'var(--color-bg-secondary)',
                color: isSelected ? 'white' : 'var(--color-text-primary)',
                borderColor: isSelected ? 'var(--accent-color)' : 'var(--color-border)',
                border: '1px solid',
                fontSize: 'var(--font-size-sm)',
                fontFamily: 'var(--font-family)',
                padding: 'calc(var(--spacing-unit) * 0.5) var(--spacing-unit)',
                scrollSnapAlign: 'start',
                transitionDuration: 'var(--animation-duration)'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.target.style.backgroundColor = 'var(--color-hover)';
                } else {
                  e.target.style.backgroundColor = 'var(--color-accent-hover)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isSelected ? 'var(--accent-color)' : 'var(--color-bg-secondary)';
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
              role="option"
              aria-selected={isSelected}
              aria-label={`Filter by ${word} ${isSelected ? '(selected)' : ''}`}
              tabIndex={-1} // Managed by parent container
            >
              {word}
            </button>
          );
        })}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scrollButton(scrollByAmount)}
        disabled={!canScrollRight}
        className="rounded-full p-2 transition-all"
        style={{
          backgroundColor: 'transparent',
          color: canScrollRight ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
          opacity: canScrollRight ? 1 : 0.4,
          cursor: canScrollRight ? 'pointer' : 'not-allowed',
          transitionDuration: 'var(--animation-duration)'
        }}
        onMouseEnter={(e) => {
          if (canScrollRight) {
            e.target.style.backgroundColor = 'var(--color-hover)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
        aria-label="Scroll tags right"
        tabIndex={canScrollRight ? 0 : -1}
      >
        <IoIosArrowForward className="text-2xl" />
      </button>

      {/* Live Region for Screen Reader Updates */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {selectedTag && `${selectedTag} filter selected`}
        {!canScrollLeft && !canScrollRight && "All tags visible"}
      </div>

      {/* CSS for scroll snap and animations */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TagSection;
