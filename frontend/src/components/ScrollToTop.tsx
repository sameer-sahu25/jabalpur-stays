import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export function ScrollToTop(): null {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<Record<string, number>>({});

  useEffect(() => {
    // Save current position before pathname changes
    const handleScroll = () => {
      scrollPositions.current[pathname] = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (navigationType === "PUSH") {
      // New navigation: scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    } else if (navigationType === "POP") {
      // Back/Forward navigation: restore position if it exists
      const savedPosition = scrollPositions.current[pathname] || 0;
      window.scrollTo({
        top: savedPosition,
        left: 0,
        behavior: "instant",
      });
    } else {
      // Default: scroll to top for replacements or other types
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname, navigationType]);

  return null;
}
