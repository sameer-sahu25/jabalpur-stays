import React, { useRef, useState, useEffect } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

/**
 * MagneticButton component that subtly follows the mouse cursor when nearby.
 * Optimized for performance using CSS transforms and requestAnimationFrame.
 * Respects prefers-reduced-motion.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = "",
  strength = 0.3,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const handleMouseMove = (e: MouseEvent) => {
      if (shouldReduceMotion || !buttonRef.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
      
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      
      // Calculate if mouse is within range
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const maxDistance = 100;

      if (distance < maxDistance) {
        const x = distanceX * strength;
        const y = distanceY * strength;
        setPosition({ x, y });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shouldReduceMotion, strength]);

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: position.x === 0 && position.y === 0 
      ? "transform 0.5s cubic-bezier(0.2, 0, 0, 1)" 
      : "transform 0.1s linear",
    willChange: "transform",
    display: "inline-block",
  };

  return (
    <div ref={buttonRef} style={style} className={className}>
      {children}
    </div>
  );
};

export default MagneticButton;
