import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const SlideContext = React.createContext<{ index: number; count: number } | null>(null);

/** Read where the scroller is and where each slide starts, in pixels from the start edge. */
function measure(viewport: HTMLElement) {
  const style = getComputedStyle(viewport);
  const rtl = style.direction === "rtl";
  const pad = Number.parseFloat(style.paddingInlineStart) || 0;
  const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  const pos = Math.abs(viewport.scrollLeft);
  const starts = Array.from(viewport.children, (child) => {
    const el = child as HTMLElement;
    const fromStart = rtl ? viewport.clientWidth - (el.offsetLeft + el.offsetWidth) : el.offsetLeft;
    // The last slides cannot reach the start edge, so they share the final stop.
    return Math.min(Math.max(0, fromStart - pad), max);
  });
  // A stop is a place the scroller can rest. Several slides per view means fewer stops than slides.
  const firstAtEnd = starts.findIndex((start) => start >= max - 1);
  const stops = Math.max(1, firstAtEnd < 0 ? starts.length : firstAtEnd + 1);
  let nearest = 0;
  for (let i = 1; i < stops; i++) if (Math.abs(starts[i] - pos) < Math.abs(starts[nearest] - pos)) nearest = i;
  return { rtl, starts, stops, nearest };
}

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Move the carousel from outside it, through a ref. */
export interface CarouselHandle {
  /** Scrolls to a slide by index. `instant` skips the smooth scroll. */
  scrollTo: (index: number, options?: { instant?: boolean }) => void;
  next: () => void;
  prev: () => void;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Names the carousel for screen readers, e.g. "Recommended services". Set this or `aria-labelledby`. */
  "aria-label"?: string;
  /** `CarouselItem` elements, as direct children. */
  children: React.ReactNode;
  /** How many slides fit across. Fractions work (1.35 shows part of the next). `auto` leaves the width to each item's className. */
  slidesPerView?: number | "auto";
  /** Space between slides, in pixels. */
  gap?: number;
  /** Shows this many pixels of the next slide, as a hint that there is more. */
  peek?: number;
  /** Next on the last slide goes to the first, and previous on the first goes to the last. The buttons are then never disabled. */
  loop?: boolean;
  /** The slide shown first. */
  initialSlide?: number;
  /** Called with the index of the leading slide after a button, a key, a dot or a swipe moves the carousel. */
  onSlideChange?: (index: number) => void;
  /** `dots` to jump to any slide, `counter` for "2 of 5" when there are many, `none` to hide it. */
  indicator?: "dots" | "counter" | "none";
  /** Shows the previous and next buttons. */
  arrows?: boolean;
  /** Classes for the scrolling element, e.g. padding so card shadows are not cut off. */
  viewportClassName?: string;
}

/**
 * A row of slides that scrolls sideways and snaps. Swipe and trackpad work
 * through native scrolling; buttons, dots and arrow keys move it one stop at a time.
 */
export const Carousel = React.forwardRef<CarouselHandle, CarouselProps>(function Carousel(
  { children, className, viewportClassName, slidesPerView = 1, gap = 16, peek = 0, loop = false, initialSlide = 0, onSlideChange, indicator = "dots", arrows = true, ...props },
  ref,
) {
  const slides = React.Children.toArray(children);
  const count = slides.length;
  const viewport = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(() => Math.max(0, Math.min(initialSlide, count - 1)));
  const [stops, setStops] = React.useState(count);
  const rtl = React.useRef(false);
  // While a button or dot scroll is in flight, the slides passed on the way are not reported.
  const target = React.useRef<number | null>(null);
  const timer = React.useRef<number | undefined>(undefined);
  const frame = React.useRef(0);

  const sync = React.useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    const m = measure(el);
    rtl.current = m.rtl;
    setStops(m.stops);
    if (target.current !== null) {
      if (m.nearest !== Math.min(target.current, m.stops - 1)) return;
      target.current = null;
    }
    setActive(m.nearest);
  }, []);

  const go = React.useCallback(
    (index: number, instant = false) => {
      const el = viewport.current;
      if (!el) return;
      const m = measure(el);
      const next = Math.max(0, Math.min(index, m.stops - 1));
      const left = m.starts[next] ?? 0;
      target.current = next;
      setActive(next);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        target.current = null;
        sync();
      }, 900);
      el.scrollTo({ left: m.rtl ? -left : left, behavior: instant || reducedMotion() ? "auto" : "smooth" });
    },
    [sync],
  );

  const atStart = active <= 0;
  const atEnd = active >= stops - 1;
  const prev = React.useCallback(() => go(atStart ? (loop ? stops - 1 : 0) : active - 1), [go, atStart, loop, stops, active]);
  const next = React.useCallback(() => go(atEnd ? (loop ? 0 : stops - 1) : active + 1), [go, atEnd, loop, stops, active]);

  React.useImperativeHandle(ref, () => ({ scrollTo: (index, options) => go(index, options?.instant), next, prev }), [go, next, prev]);

  // Start on the requested slide before the first paint. Runs once: later changes to initialSlide are ignored.
  const first = React.useRef(initialSlide);
  React.useLayoutEffect(() => {
    if (first.current > 0) go(first.current, true);
    else sync();
  }, [go, sync]);

  // Stops move when the carousel is resized or its slides change.
  React.useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    sync();
    const observer = new ResizeObserver(() => sync());
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync, count, slidesPerView, gap, peek]);

  React.useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      cancelAnimationFrame(frame.current);
    },
    [],
  );

  const changed = React.useRef(onSlideChange);
  changed.current = onSlideChange;
  const reported = React.useRef(active);
  React.useEffect(() => {
    if (reported.current === active) return;
    reported.current = active;
    changed.current?.(active);
  }, [active]);

  // A swipe, wheel or drag takes over from a scroll that a button started.
  const release = () => {
    target.current = null;
  };

  const perView = slidesPerView === "auto" ? null : Math.max(1, slidesPerView);
  const gaps = perView === null ? 0 : Math.ceil(perView) - 1 + (peek > 0 ? 1 : 0);
  const basis = perView === null ? undefined : `calc((100% - ${peek + gaps * gap}px) / ${perView})`;
  const showFooter = stops > 1 && (arrows || indicator !== "none");

  return (
    <div role="region" aria-roledescription="carousel" className={cn("flex min-w-0 flex-col gap-4", className)} {...props}>
      <div
        ref={viewport}
        tabIndex={0}
        onScroll={() => {
          cancelAnimationFrame(frame.current);
          frame.current = requestAnimationFrame(sync);
        }}
        onWheel={release}
        onTouchStart={release}
        onPointerDown={release}
        onKeyDown={(event) => {
          const el = event.target as HTMLElement;
          // Leave the arrow keys to a field that needs them.
          if (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
          const forward = rtl.current ? "ArrowLeft" : "ArrowRight";
          const back = rtl.current ? "ArrowRight" : "ArrowLeft";
          if (event.key === forward) next();
          else if (event.key === back) prev();
          else if (event.key === "Home") go(0);
          else if (event.key === "End") go(stops - 1);
          else return;
          event.preventDefault();
        }}
        style={{ gap, "--carousel-basis": basis } as React.CSSProperties}
        className={cn(
          "relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-lg rovr-focus [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          viewportClassName,
        )}
      >
        {slides.map((slide, index) => (
          <SlideContext.Provider key={React.isValidElement(slide) && slide.key != null ? slide.key : index} value={{ index, count }}>
            {slide}
          </SlideContext.Provider>
        ))}
      </div>
      {/* Says where the carousel landed after it moves. The visible counter is hidden from it to avoid reading twice. */}
      <span aria-live="polite" className="sr-only">
        {stops > 1 ? `Slide ${active + 1} of ${stops}` : ""}
      </span>
      {showFooter && (
        <div className="flex min-h-control-sm items-center justify-between gap-3">
          {indicator === "dots" ? (
            <div role="group" aria-label="Choose a slide" className="flex flex-wrap items-center">
              {Array.from({ length: stops }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => go(index)}
                  className="group grid h-6 min-w-6 cursor-pointer place-items-center rounded-full px-1 rovr-focus"
                >
                  <span
                    className={cn(
                      "h-1.5 rounded-full transition-[width,background-color] duration-(--dur-base) ease-out",
                      index === active ? "w-4 bg-primary" : "w-1.5 bg-border-strong group-hover:bg-subtle-foreground",
                    )}
                  />
                </button>
              ))}
            </div>
          ) : indicator === "counter" ? (
            <p aria-hidden className="text-label text-data text-muted-foreground">
              {active + 1} of {stops}
            </p>
          ) : (
            <span />
          )}
          {arrows && (
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="secondary" size="icon-sm" aria-label="Previous slide" disabled={!loop && atStart} onClick={prev}>
                <ChevronLeft className="rtl:rotate-180" />
              </Button>
              <Button variant="secondary" size="icon-sm" aria-label="Next slide" disabled={!loop && atEnd} onClick={next}>
                <ChevronRight className="rtl:rotate-180" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

/** One slide. Its width comes from the carousel's `slidesPerView`, or from className when that is `auto`. */
export const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CarouselItem({ className, ...props }, ref) {
  const slide = React.useContext(SlideContext);
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={slide ? `${slide.index + 1} of ${slide.count}` : undefined}
      className={cn("min-w-0 shrink-0 grow-0 basis-[var(--carousel-basis,auto)] snap-start", className)}
      {...props}
    />
  );
});
