import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Animates its own height to follow its content, so a list that gains or
 * loses rows resizes in one smooth move instead of snapping. The content is
 * never animated here: it changes at once and the frame catches up.
 */
export function SmoothHeight({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const outer = React.useRef<HTMLDivElement>(null);
  const inner = React.useRef<HTMLDivElement>(null);
  const ready = React.useRef(false);

  React.useLayoutEffect(() => {
    const frame = outer.current;
    const content = inner.current;
    if (!frame || !content) return;
    const apply = () => {
      frame.style.height = `${content.offsetHeight}px`;
    };
    apply();
    // Turn the transition on only after the first size is set, so the
    // component does not grow from zero when it mounts.
    const raf = requestAnimationFrame(() => {
      ready.current = true;
      frame.style.transition = "height var(--dur-smooth-height, 320ms) cubic-bezier(0.32, 0.72, 0, 1)";
    });
    const observer = new ResizeObserver(apply);
    observer.observe(content);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={outer} className={cn("[overflow:clip] [overflow-clip-margin:8px] motion-reduce:[--dur-smooth-height:1ms]", className)} {...props}>
      <div ref={inner}>{children}</div>
    </div>
  );
}
