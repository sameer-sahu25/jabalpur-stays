import React, { useEffect, useRef, useState } from "react";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // Speed multiplier: positive for foreground, negative for background
  className?: string;
  disabled?: boolean;
}

/**
 * Parallax component that uses CSS transforms for hardware-accelerated scrolling effects.
 * Includes support for prefers-reduced-motion and high-performance rendering.
 */
export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  className = "",
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [shouldDisable, setShouldDisable] = useState(disabled);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMediaQueryChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setShouldDisable(disabled || e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    // Initial check
    const initialMatches = mediaQuery.matches;
    setShouldDisable(disabled || initialMatches);

    if (disabled || initialMatches) return;

    let ticking = false;
    let animationFrameId: number;

    const updateParallax = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only calculate if the element is in or near the viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        // Calculate the relative scroll position within the element's path
        const relativeScroll = (rect.top - viewportHeight / 2) * speed;
        setOffset(relativeScroll);
      }
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        animationFrameId = window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial check
    updateParallax();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(animationFrameId);
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, [speed, disabled]); // Removed shouldDisable from deps

  const isActuallyDisabled = shouldDisable || disabled;

  const style: React.CSSProperties = isActuallyDisabled
    ? {}
    : {
        transform: `translate3d(0, ${offset}px, 0)`,
        willChange: "transform",
        transition: "transform 0.1s cubic-bezier(0, 0, 0.2, 1)", // Smooth out the movement
      };

  return (
    <div ref={containerRef} className={`parallax-container ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Parallax;
