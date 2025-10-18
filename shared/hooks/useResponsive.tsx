"use client";
import { useState, useEffect } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setBreakpoint("mobile");
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 1024) {
        setBreakpoint("tablet");
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else {
        setBreakpoint("desktop");
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    // Set initial breakpoint
    updateBreakpoint();

    // Add event listener
    window.addEventListener("resize", updateBreakpoint);

    // Cleanup
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
  };
};
