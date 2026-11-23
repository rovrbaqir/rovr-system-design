import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ease } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface Base {
  /** Days that cannot be chosen, e.g. past dates or days without availability. */
  isDisabled?: (date: Date) => boolean;
  min?: Date;
  max?: Date;
  /** 0 is Sunday, 1 is Monday. */
  weekStartsOn?: 0 | 1;
  locale?: string;
  className?: string;
}
export type CalendarProps = Base &
  (
    | { mode?: "single"; value: Date | null; onValueChange: (value: Date) => void }
    | { mode: "range"; value: DateRange; onValueChange: (value: DateRange) => void }
  );

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && startOfDay(a).getTime() === startOfDay(b).getTime();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

/** A month grid for choosing one day or a range. Arrow keys move by day, PageUp/PageDown by month. */
export function Calendar(props: CalendarProps) {
  const { isDisabled, min, max, weekStartsOn = 0, locale = "en-US", className } = props;
  const reduced = useReducedMotion();
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const anchorDate = props.mode === "range" ? props.value.from : props.value;
  const [month, setMonth] = React.useState(() => addMonths(anchorDate ?? today, 0));
  const [focused, setFocused] = React.useState<Date>(() => startOfDay(anchorDate ?? today));
  const [hovered, setHovered] = React.useState<Date | null>(null);
  const [direction, setDirection] = React.useState(0);
  const grid = React.useRef<HTMLDivElement>(null);
  const moveFocus = React.useRef(false);

  const blocked = (d: Date) => (min && d < startOfDay(min)) || (max && d > startOfDay(max)) || !!isDisabled?.(d);

  const showMonth = (next: Date) => {
    const target = addMonths(next, 0);
    setDirection(target > month ? 1 : -1);
    setMonth(target);
  };

  const focusDay = (d: Date) => {
    moveFocus.current = true;
    setFocused(d);
    if (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear()) showMonth(d);
  };

  React.useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    grid.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  }, [focused, month]);

  const select = (d: Date) => {
    if (blocked(d)) return;
    if (props.mode === "range") {
      const { from, to } = props.value;
      if (!from || to) props.onValueChange({ from: d, to: null });
      else props.onValueChange(d < from ? { from: d, to: from } : { from, to: d });
    } else props.onValueChange(d);
  };

  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const days = Array.from({ length: 42 }, (_, i) => addDays(first, i - lead));
  const weekdays = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: "short" }).format(days[i]));
  const title = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month);
  const fullLabel = new Intl.DateTimeFormat(locale, { dateStyle: "full" });

  const range = props.mode === "range" ? props.value : null;
  const rangeEnd = range?.to ?? (range?.from && hovered ? hovered : null);
  const inRange = (d: Date) => {
    if (!range?.from || !rangeEnd) return false;
    const [a, b] = range.from <= rangeEnd ? [range.from, rangeEnd] : [rangeEnd, range.from];
    return d >= startOfDay(a) && d <= startOfDay(b);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step: Record<string, Date> = {
      ArrowLeft: addDays(focused, -1),
      ArrowRight: addDays(focused, 1),
      ArrowUp: addDays(focused, -7),
      ArrowDown: addDays(focused, 7),
      PageUp: new Date(focused.getFullYear(), focused.getMonth() - 1, focused.getDate()),
      PageDown: new Date(focused.getFullYear(), focused.getMonth() + 1, focused.getDate()),
      Home: addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7)),
      End: addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7)),
    };
    const next = step[event.key];
    if (!next) return;
    event.preventDefault();
    focusDay(next);
  };

  return (
    <div className={cn("w-[17.5rem] select-none", className)}>
      <div className="flex items-center justify-between pb-2">
        <p aria-live="polite" className="pl-1.5 text-title-sm">
          {title}
        </p>
        <div className="flex">
          <Button variant="ghost" size="icon-sm" aria-label="Previous month" onClick={() => showMonth(addMonths(month, -1))}>
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Next month" onClick={() => showMonth(addMonths(month, 1))}>
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 pb-1" aria-hidden>
        {weekdays.map((w) => (
          <span key={w} className="grid h-7 place-items-center text-overline text-subtle-foreground">
            {w.slice(0, 2)}
          </span>
        ))}
      </div>
      <div className="relative h-60 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={month.getTime()}
            ref={grid}
            role="grid"
            aria-label={title}
            onKeyDown={onKeyDown}
            onMouseLeave={() => setHovered(null)}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir * 24 }),
              center: { opacity: 1, x: 0 },
              exit: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir * -24 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.24, ease: ease.out }}
            className="absolute inset-0 grid grid-cols-7 grid-rows-6"
          >
            {days.map((d) => {
              const outside = d.getMonth() !== month.getMonth();
              const isStart = range ? sameDay(d, range.from) : sameDay(d, props.mode !== "range" ? props.value : null);
              const isEnd = range ? sameDay(d, range.to) : false;
              const selected = isStart || isEnd;
              const within = inRange(d) && !selected;
              const off = blocked(d);
              return (
                <button
                  key={d.getTime()}
                  type="button"
                  role="gridcell"
                  tabIndex={sameDay(d, focused) ? 0 : -1}
                  aria-label={fullLabel.format(d)}
                  aria-selected={selected}
                  aria-disabled={off || undefined}
                  aria-current={sameDay(d, today) ? "date" : undefined}
                  onClick={() => {
                    setFocused(d);
                    select(d);
                  }}
                  onMouseEnter={() => setHovered(d)}
                  onFocus={() => setFocused(d)}
                  className={cn(
                    "relative grid cursor-pointer place-items-center text-sm text-data outline-none",
                    "before:absolute before:inset-0.5 before:rounded-md before:transition-colors before:duration-(--dur-instant)",
                    "focus-visible:before:ring-2 focus-visible:before:ring-ring",
                    !selected && !off && "hover:before:bg-secondary",
                    within && "bg-accent",
                    range?.to && isStart && "rounded-l-md bg-accent",
                    range?.to && isEnd && "rounded-r-md bg-accent",
                    selected && "font-medium text-primary-foreground before:bg-primary",
                    outside && !selected && "text-subtle-foreground",
                    off && "cursor-not-allowed text-subtle-foreground opacity-50",
                  )}
                >
                  <span className="relative">{d.getDate()}</span>
                  {sameDay(d, today) && !selected && <span className="absolute bottom-1.5 size-1 rounded-full bg-primary" />}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
