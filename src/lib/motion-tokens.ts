/**
 * Motion tokens for `motion/react`. The springs are the mobile app's
 * Reanimated springs (health-patient-app/src/theme/motion.ts), so a press
 * or a panel feels the same on web and on the phone.
 */
import type { Transition } from "motion/react";

export const ease = {
  /** The app's swap easing: quick start, long soft settle. */
  out: [0.2, 0, 0, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const duration = {
  instant: 0.09,
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  slower: 0.6,
} as const;

/** Panels, dialogs, card entrances: soft landing, no jitter. */
export const springGentle: Transition = { type: "spring", damping: 26, mass: 0.9, stiffness: 180 };
/** Presses, selection highlights, small indicators: quick with a hint of bounce. */
export const springSnappy: Transition = { type: "spring", damping: 28, mass: 0.6, stiffness: 320 };
/** @deprecated alias of springGentle */
export const spring = springGentle;
/** Opacity, colour, blur. Never bounces. */
export const fade: Transition = { duration: duration.base, ease: ease.out };
