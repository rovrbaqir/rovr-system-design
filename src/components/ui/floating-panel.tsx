import * as React from "react";
import { createPortal } from "react-dom";
import { GripHorizontal, Maximize2, Minus, X } from "lucide-react";
import { AnimatePresence, motion, useDragControls, useMotionValue, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const corners = {
  "top-left": "top-0 left-0 origin-top-left",
  "top-right": "top-0 right-0 origin-top-right",
  "bottom-left": "bottom-0 left-0 origin-bottom-left",
  "bottom-right": "right-0 bottom-0 origin-bottom-right",
} as const;

const arrows: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

export interface FloatingPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Names the window for assistive technology, such as "Visit with Amara Osei". Also used in the button labels. */
  label: string;
  /** What the header shows next to the grip: a title, a status, a timer. The whole header drags the window. */
  header?: React.ReactNode;
  /** Whether the window is shown. Leave it out and use `defaultOpen` to let the window manage itself. */
  open?: boolean;
  defaultOpen?: boolean;
  /** Called with `false` when the close button is pressed. */
  onOpenChange?: (open: boolean) => void;
  /** The corner of the viewport the window starts in. */
  defaultPosition?: keyof typeof corners;
  /** Adds a button that folds the window down to its header. The content stays mounted, so a call keeps running. */
  minimizable?: boolean;
  /** Whether the window is folded down to its header. Leave it out and use `defaultMinimized` to let the window manage itself. */
  minimized?: boolean;
  defaultMinimized?: boolean;
  onMinimizedChange?: (minimized: boolean) => void;
  /** Hides the close button, for a window that must stay until its task ends. */
  hideClose?: boolean;
  /** How far one arrow-key press moves the window, in px. Shift moves four times as far. */
  step?: number;
}

/**
 * A small window that floats above the page and can be moved out of the way:
 * a video call that follows the person between pages, a scribe, a chat. Drag
 * it by its header, or focus the grip and use the arrow keys. It does not
 * block the page; use Dialog when the person must answer before going on.
 */
export const FloatingPanel = React.forwardRef<HTMLDivElement, FloatingPanelProps>(function FloatingPanel(
  {
    label,
    header,
    open: openProp,
    defaultOpen = true,
    onOpenChange,
    defaultPosition = "bottom-right",
    minimizable = false,
    minimized: minimizedProp,
    defaultMinimized = false,
    onMinimizedChange,
    hideClose = false,
    step = 16,
    className,
    children,
    ...props
  },
  ref,
) {
  const bodyId = React.useId();
  const hintId = React.useId();
  const reduced = useReducedMotion();
  const controls = useDragControls();
  const bounds = React.useRef<HTMLDivElement>(null);
  const panel = React.useRef<HTMLDivElement | null>(null);
  // Kept outside the animated element, so the window is where it was left when it opens again.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = openProp ?? openState;
  const [minimizedState, setMinimizedState] = React.useState(defaultMinimized);
  const minimized = minimizedProp ?? minimizedState;

  // Portals need the document, so nothing renders on the server.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const close = () => {
    setOpenState(false);
    onOpenChange?.(false);
  };
  const toggleMinimized = () => {
    setMinimizedState(!minimized);
    onMinimizedChange?.(!minimized);
  };

  /** Moves the window, stopping at the same edges the pointer drag stops at. */
  const shift = React.useCallback(
    (byX: number, byY: number) => {
      const box = panel.current?.getBoundingClientRect();
      const area = bounds.current?.getBoundingClientRect();
      if (!box || !area) return;
      x.set(x.get() + Math.max(area.left - box.left, Math.min(area.right - box.right, byX)));
      y.set(y.get() + Math.max(area.top - box.top, Math.min(area.bottom - box.bottom, byY)));
    },
    [x, y],
  );

  const nudge = (event: React.KeyboardEvent) => {
    const direction = arrows[event.key];
    if (!direction) return;
    event.preventDefault();
    const distance = step * (event.shiftKey ? 4 : 1);
    shift(direction[0] * distance, direction[1] * distance);
  };

  // Restoring makes the window taller: bring it back inside the viewport if it now overhangs.
  React.useLayoutEffect(() => {
    if (!minimized) shift(0, 0);
  }, [minimized, shift]);

  if (!mounted) return null;

  return createPortal(
    // The area the window may move in: the viewport, less a margin. It lets clicks through.
    <div ref={bounds} className="pointer-events-none fixed inset-4 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            ref={(node) => {
              panel.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            role="dialog"
            aria-label={label}
            drag
            dragListener={false}
            dragControls={controls}
            dragConstraints={bounds}
            dragMomentum={false}
            dragElastic={0}
            style={{ x, y }}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.98, transition: { duration: 0.11, ease: [0.16, 1, 0.3, 1] } }}
            className={cn(
              "pointer-events-auto absolute flex w-80 max-w-full flex-col overflow-hidden rounded-xl rovr-glass text-popover-foreground",
              corners[defaultPosition],
              className,
            )}
            {...(props as Omit<React.ComponentProps<typeof motion.div>, "ref">)}
          >
            <div
              // touch-none: on a touch screen the drag must not scroll the page underneath.
              className="flex min-h-12 cursor-grab touch-none items-center gap-1 p-2 select-none active:cursor-grabbing"
              onPointerDown={(event) => controls.start(event)}
            >
              <button
                type="button"
                aria-label={`Move ${label}`}
                aria-describedby={hintId}
                onKeyDown={nudge}
                className="grid size-control-sm shrink-0 cursor-grab place-items-center rounded-full text-muted-foreground rovr-focus hover:bg-secondary hover:text-foreground active:cursor-grabbing"
              >
                <GripHorizontal className="size-4" />
              </button>
              <span id={hintId} className="sr-only">
                Use the arrow keys to move this window. Hold Shift to move further.
              </span>
              <div className="min-w-0 flex-1 text-label">{header}</div>
              {/* The buttons are not part of the drag handle. */}
              <div className="flex shrink-0 cursor-default items-center gap-0.5" onPointerDown={(event) => event.stopPropagation()}>
                {minimizable && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground"
                    aria-label={minimized ? `Restore ${label}` : `Minimise ${label}`}
                    aria-expanded={!minimized}
                    aria-controls={bodyId}
                    onClick={toggleMinimized}
                  >
                    {minimized ? <Maximize2 /> : <Minus />}
                  </Button>
                )}
                {!hideClose && (
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground" aria-label={`Close ${label}`} onClick={close}>
                    <X />
                  </Button>
                )}
              </div>
            </div>
            <div id={bodyId} hidden={minimized} className="min-h-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
});
