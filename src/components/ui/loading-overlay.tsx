import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { duration, ease } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export interface LoadingOverlayProps {
  /** Whether the overlay is shown. */
  open?: boolean;
  /** A short sentence under the spinner that says what is happening, such as "Saving visit note". */
  message?: React.ReactNode;
  /** Cover the whole viewport instead of the nearest positioned parent. Rendered in a portal. */
  fullscreen?: boolean;
  /** Blur what is underneath. Turn it off over video or very large areas. */
  blur?: boolean;
  /** Milliseconds to wait before it appears, so a fast response never flashes an overlay. */
  delay?: number;
  className?: string;
}

/**
 * A layer that blocks an area while it loads or saves. It covers its nearest
 * positioned parent (give that parent `relative`), or the viewport with
 * `fullscreen`. Prefer Skeleton when content is loading for the first time and
 * a Button's `loading` when one action is pending.
 */
export function LoadingOverlay({ open = true, message, fullscreen = false, blur = true, delay = 0, className }: LoadingOverlayProps) {
  const [shown, setShown] = React.useState(open && delay <= 0);
  const anchor = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return setShown(false);
    if (delay <= 0) return setShown(true);
    const timer = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(timer);
  }, [open, delay]);

  // The area being covered is the busy one, so it carries aria-busy while the overlay is up.
  React.useEffect(() => {
    const region = fullscreen ? null : anchor.current?.parentElement;
    if (!shown || !region) return;
    const before = region.getAttribute("aria-busy");
    region.setAttribute("aria-busy", "true");
    return () => {
      if (before === null) region.removeAttribute("aria-busy");
      else region.setAttribute("aria-busy", before);
    };
  }, [shown, fullscreen]);

  const layer = (
    <AnimatePresence>
      {shown && (
        <motion.div
          key="overlay"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: duration.base, ease: ease.out } }}
          exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.out } }}
          className={cn(
            "inset-0 grid cursor-progress place-items-center p-4",
            fullscreen ? "fixed z-50 bg-scrim" : "absolute z-10 rounded-[inherit]",
            !fullscreen && (blur ? "bg-background/55" : "bg-background/80"),
            blur && "backdrop-blur-sm",
            className,
          )}
        >
          <div
            className={cn(
              "flex max-w-xs flex-col items-center gap-3 text-center",
              // Over a whole page the spinner sits on its own panel, so it reads on any content.
              fullscreen && "rounded-xl rovr-chrome px-8 py-6",
            )}
          >
            <Spinner label={message ? "" : "Loading"} className="size-6 text-primary" />
            {message && <p className="text-label text-foreground">{message}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (fullscreen) return typeof document === "undefined" ? null : createPortal(layer, document.body);
  return (
    <>
      {/* Finds the parent without adding a box to its layout. */}
      <span ref={anchor} hidden />
      {layer}
    </>
  );
}
