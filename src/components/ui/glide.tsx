import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface GlideProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Which children can be highlighted. Default: anything with `data-glide`.
   * Pass a state attribute such as "data-highlighted" to follow a headless
   * component's own highlight (so keyboard navigation glides too).
   */
  follow?: string;
  /** Classes for the moving highlight. */
  highlightClassName?: string;
}

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * One highlight that glides between items instead of each item lighting up
 * on its own. Used by menus, lists, tabs and the sidebar: it is the system's
 * signature movement.
 */
export function Glide({ follow, highlightClassName, className, children, ...props }: GlideProps) {
  const root = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState<Box | null>(null);
  const [shown, setShown] = React.useState(false);
  const wasShown = React.useRef(false);
  // True for the render that follows a resize: the highlight snaps to the new box instead of gliding to it.
  const resized = React.useRef(false);
  const reduced = useReducedMotion();

  const measure = React.useCallback((el: Element | null) => {
    const host = root.current;
    if (!host || !el || !host.contains(el)) {
      setShown(false);
      return;
    }
    // Layout offsets, not getBoundingClientRect: a popup that is still
    // scaling in would otherwise report a box that is too small.
    let x = 0;
    let y = 0;
    let node: HTMLElement | null = el as HTMLElement;
    while (node && node !== host) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    const target = el as HTMLElement;
    setBox({ x, y, width: target.offsetWidth, height: target.offsetHeight });
    setShown(true);
  }, []);

  // Attribute mode: mirror the headless component's highlighted item.
  React.useEffect(() => {
    const host = root.current;
    if (!follow || !host) return;
    const sync = () => {
      resized.current = false;
      measure(host.querySelector(`[${follow}]`));
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(host, { attributes: true, attributeFilter: [follow], subtree: true, childList: true });
    return () => observer.disconnect();
  }, [follow, measure]);

  // A popup gets its final width a frame after it mounts, and lists reflow
  // when filtered. Follow the size, or the highlight keeps a stale box.
  const target = React.useRef<Element | null>(null);
  React.useEffect(() => {
    const host = root.current;
    if (!host) return;
    const observer = new ResizeObserver(() => {
      const el = follow ? host.querySelector(`[${follow}]`) : target.current;
      if (el && host.contains(el)) {
        resized.current = true;
        measure(el);
      }
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, [follow, measure]);

  React.useEffect(() => {
    wasShown.current = shown;
  }, [shown]);

  const track = (el: Element | null) => {
    target.current = el;
    resized.current = false;
    measure(el);
  };

  const pointer = follow
    ? {}
    : {
        onPointerOver: (e: React.PointerEvent) => track((e.target as Element).closest("[data-glide]")),
        onPointerLeave: () => setShown(false),
        onFocus: (e: React.FocusEvent) => track((e.target as Element).closest("[data-glide]")),
        onBlur: () => setShown(false),
      };

  return (
    <div ref={root} className={cn("relative isolate", className)} {...pointer} {...props}>
      {box && (
        <motion.div
          aria-hidden
          initial={false}
          animate={{ ...box, opacity: shown ? 1 : 0 }}
          // Appear in place, then glide. Without this the first hover flies in from the corner.
          transition={reduced || !wasShown.current || resized.current ? { duration: 0, opacity: { duration: 0.12 } } : { type: "spring", stiffness: 520, damping: 42, mass: 0.8, opacity: { duration: 0.12 } }}
          className={cn("pointer-events-none absolute top-0 left-0 -z-10 rounded-sm bg-secondary", highlightClassName)}
        />
      )}
      {children}
    </div>
  );
}
