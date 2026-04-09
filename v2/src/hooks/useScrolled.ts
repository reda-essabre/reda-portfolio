"use client";

import { useState, useEffect } from "react";

/**
 * Returns true when window.scrollY > threshold (default: 50px).
 * Used by NavBar to trigger frosted-glass style.
 */
export function useScrolled(threshold = 50): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    handler(); // check immediately on mount
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);

  return scrolled;
}
