import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  glowOpacity?: number;
  disabled?: boolean;
}

/**
 * GlowEffect component that provides a performance-optimized mouse-following glow.
 * Uses CSS variables and requestAnimationFrame for high performance (60fps).
 * Respects prefers-reduced-motion for accessibility.
 */
export const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  className = "",
  glowColor = "rgba(212, 175, 55, 0.15)", // Default to gold
  glowSize = 400,
  glowOpacity = 0.8,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || shouldReduceMotion) return;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    // Move glow off-screen smoothly
    setMousePos({ x: -glowSize, y: -glowSize });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        className
      )}
      style={{
        // Define CSS variables for the glow
        "--glow-x": `${mousePos.x}px`,
        "--glow-y": `${mousePos.y}px`,
        "--glow-size": `${glowSize}px`,
        "--glow-color": glowColor,
        "--glow-opacity": isHovered ? glowOpacity : 0,
      } as React.CSSProperties}
    >
      {/* The Glow Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 ease-out"
        style={{
          opacity: "var(--glow-opacity)",
          background: `radial-gradient(var(--glow-size) circle at var(--glow-x) var(--glow-y), var(--glow-color), transparent 70%)`,
        }}
        aria-hidden="true"
      />
      
      {/* Border Highlight Effect (Optional but adds premium feel) */}
      <div
        className="pointer-events-none absolute -inset-px z-20 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(calc(var(--glow-size) / 1.5) circle at var(--glow-x) var(--glow-y), var(--glow-color), transparent 80%)`,
          WebkitMaskImage: "linear-gradient(black, black), linear-gradient(black, black)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
        aria-hidden="true"
      />

      {children}
    </div>
  );
};

export default GlowEffect;
