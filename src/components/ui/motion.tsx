import * as React from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface RevealProps extends React.ComponentProps<typeof motion.div> {
  /** Seconds to wait after the element enters the viewport. */
  delay?: number;
  /** Distance travelled, in px. */
  y?: number;
}

/**
 * Fades and lifts content into place the first time it scrolls into view.
 * For marketing and overview pages. Do not wrap task UI in it: an app screen
 * should be ready the moment it loads.
 */
export function Reveal({ delay = 0, y = 16, className, children, ...props }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: ease.out, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Reveals its direct children one after another. Keep to lists of six or fewer. */
export function RevealGroup({
  stagger = 0.07,
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & { stagger?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ staggerChildren: stagger }}
      className={className}
      {...props}
    >
      {React.Children.map(children as React.ReactNode, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: reduced ? 0 : 16 },
            shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export interface ParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** How far the content drifts across the scroll, in px. Negative moves against the scroll. */
  offset?: number;
}

/** Moves content slower or faster than the page as it crosses the viewport. Decorative layers only. */
export function Parallax({ offset = 40, className, children, ...props }: ParallaxProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [offset, -offset]);
  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  /** Intl.NumberFormat options, e.g. { style: "currency", currency: "USD" }. Whole numbers by default. */
  format?: Intl.NumberFormatOptions;
  locale?: string;
}

/**
 * Counts to a value once, when first seen, then tracks later changes.
 * For summary figures. Never for a clinical reading someone needs to read at once.
 */
export function NumberTicker({ value, format, locale = "en-US", className, ...props }: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(0);
  const formatKey = JSON.stringify(format ?? { maximumFractionDigits: 0 });
  const formatter = React.useMemo(() => new Intl.NumberFormat(locale, JSON.parse(formatKey)), [locale, formatKey]);

  React.useEffect(() => {
    if (!inView) return;
    if (reduced) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: duration.slower * 2, ease: ease.out });
    return () => controls.stop();
  }, [inView, value, reduced, motionValue]);

  React.useEffect(
    () =>
      motionValue.on("change", (latest) => {
        if (ref.current) ref.current.textContent = formatter.format(latest);
      }),
    [motionValue, formatter],
  );

  return (
    <span ref={ref} className={cn("text-data", className)} aria-label={formatter.format(value)} {...props}>
      {formatter.format(0)}
    </span>
  );
}
