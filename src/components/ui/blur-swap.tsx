import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface BlurSwapProps {
  /** Changes when the content changes. The old content blurs out as the new one sharpens in. */
  swapKey: string | number;
  children: React.ReactNode;
  className?: string;
}

/**
 * The mobile app's blur-replace: content does not cut or cross-fade, it
 * softens, shrinks slightly and resolves into the next state. For icon
 * swaps, labels that change in place and counters.
 */
export function BlurSwap({ swapKey, children, className }: BlurSwapProps) {
  const reduced = useReducedMotion();
  const off = reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, filter: "blur(6px)" };
  return (
    <span className={cn("relative inline-grid place-items-center", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={swapKey}
          initial={off}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={off}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="inline-flex items-center gap-[inherit]"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
