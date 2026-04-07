import React, { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean;
}

/**
 * Reveal component that provides smooth entrance animations on scroll.
 * Optimized for performance using Intersection Observer and CSS transforms.
 * Supports prefers-reduced-motion for accessibility.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 800,
  distance = 30,
  threshold = 0.1,
  className = "",
  triggerOnce = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for accessibility preferences
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && domRef.current) {
            observer.unobserve(domRef.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, triggerOnce]);

  const getTransform = () => {
    if (shouldReduceMotion || !isVisible) {
      if (shouldReduceMotion) return "none";
      
      switch (direction) {
        case "up": return `translate3d(0, ${distance}px, 0)`;
        case "down": return `translate3d(0, -${distance}px, 0)`;
        case "left": return `translate3d(${distance}px, 0, 0)`;
        case "right": return `translate3d(-${distance}px, 0, 0)`;
        case "none": return "scale(0.95)";
        default: return "none";
      }
    }
    return "translate3d(0, 0, 0) scale(1)";
  };

  const style: React.CSSProperties = {
    opacity: isVisible || shouldReduceMotion ? 1 : 0,
    transform: getTransform(),
    transition: shouldReduceMotion 
      ? "none" 
      : `opacity ${duration}ms cubic-bezier(0.2, 0, 0, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.2, 0, 0, 1) ${delay}ms`,
    willChange: isVisible ? "auto" : "opacity, transform",
  };

  return (
    <div ref={domRef} style={style} className={className}>
      {children}
    </div>
  );
};

export default Reveal;
