/**
 * Core typewriter animation hook for narrative-form.
 *
 * @remarks
 * Animates a string character by character to create the "letter being written"
 * effect. Cleans up the interval on unmount to prevent memory leaks.
 * Respects `prefers-reduced-motion` — skips animation entirely if set.
 *
 * @example
 * ```tsx
 * const { displayedText, isTyping, isComplete } = useTypewriter({
 *   text: "My name is",
 *   speed: 38,
 * });
 * ```
 */

import { useState, useEffect, useRef, useCallback } from "react";

/** Configuration options for the useTypewriter hook. */
export interface UseTypewriterOptions {
  /** The full text to type out. */
  text: string;
  /** Milliseconds per character. Default: 38 */
  speed?: number;
  /** Whether animation is enabled. Default: true */
  enabled?: boolean;
  /** Milliseconds to pause after typing completes before signalling done. Default: 100 */
  pauseAfter?: number;
  /** Callback fired when typing is fully complete (after pause). */
  onComplete?: () => void;
}

/** Return value of the useTypewriter hook. */
export interface UseTypewriterResult {
  /** The currently visible portion of the text. */
  displayedText: string;
  /** Whether the typewriter is actively typing characters. */
  isTyping: boolean;
  /** Whether typing is fully complete (including the post-typing pause). */
  isComplete: boolean;
}

/**
 * Check if the user prefers reduced motion.
 * Guarded for SSR — returns false if `window` is not available.
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * React hook that animates text character by character.
 *
 * @param options - Typewriter configuration
 * @returns Object with displayedText, isTyping, and isComplete
 */
export function useTypewriter(options: UseTypewriterOptions): UseTypewriterResult {
  const { text, speed = 38, enabled = true, pauseAfter = 100, onComplete } = options;

  const [charIndex, setCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref fresh without triggering effect re-runs
  onCompleteRef.current = onComplete;

  // Clean up helper
  const cleanup = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (pauseTimeoutRef.current !== null) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    // If animation is disabled or user prefers reduced motion, show everything instantly
    if (!enabled || prefersReducedMotion() || text.length === 0) {
      setCharIndex(text.length);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    // Reset for new text
    setCharIndex(0);
    setIsComplete(false);

    intervalRef.current = setInterval(() => {
      setCharIndex((prev) => {
        const next = prev + 1;
        if (next >= text.length) {
          // All characters typed — clear interval, start pause
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          // Pause before signalling completion
          pauseTimeoutRef.current = setTimeout(() => {
            setIsComplete(true);
            onCompleteRef.current?.();
          }, pauseAfter);

          return text.length;
        }
        return next;
      });
    }, speed);

    // Cleanup on unmount or text/speed/enabled change
    return cleanup;
  }, [text, speed, enabled, pauseAfter, cleanup]);

  return {
    displayedText: text.slice(0, charIndex),
    isTyping: charIndex < text.length && !isComplete,
    isComplete,
  };
}
