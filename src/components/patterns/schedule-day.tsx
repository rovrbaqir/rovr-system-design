import { cn } from "@/lib/utils";

export interface ScheduleEvent {
  id: string;
  title: string;
  /** Second line: visit type or room. */
  detail?: string;
  /** "HH:mm", 24-hour. */
  start: string;
  end: string;
  tone?: "primary" | "success" | "warning" | "neutral";
}

export interface ScheduleDayProps {
  events: ScheduleEvent[];
  /** First and last hour shown, 0 to 24. */
  startHour?: number;
  endHour?: number;
  /** Draws the "now" line at this time, "HH:mm". */
  now?: string;
  onEventClick?: (event: ScheduleEvent) => void;
  hourHeight?: number;
  className?: string;
}

const minutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const tones = {
  primary: "[--tone:var(--brand)]",
  success: "[--tone:var(--success)]",
  warning: "[--tone:var(--warning)]",
  neutral: "[--tone:var(--subtle-foreground)]",
} as const;

/** One day of a clinician's schedule on an hour grid. Compose several side by side for a week or a multi-provider view. */
export function ScheduleDay({ events, startHour = 8, endHour = 17, now, onEventClick, hourHeight = 56, className }: ScheduleDayProps) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const top = (t: string) => ((minutes(t) - startHour * 60) / 60) * hourHeight;
  const label = (h: number) => new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(new Date(2000, 0, 1, h));
  return (
    <div className={cn("relative grid grid-cols-[3.25rem_minmax(0,1fr)]", className)} style={{ height: (endHour - startHour) * hourHeight + 16 }}>
      <div className="relative" aria-hidden>
        {hours.map((h) => (
          <span key={h} className="absolute right-3 -translate-y-1/2 text-caption text-subtle-foreground text-data" style={{ top: (h - startHour) * hourHeight + 8 }}>
            {label(h)}
          </span>
        ))}
      </div>
      <div className="relative mt-2">
        {hours.map((h) => (
          <div key={h} className="absolute inset-x-0 border-t border-border" style={{ top: (h - startHour) * hourHeight }} />
        ))}
        {events.map((event) => {
          const height = Math.max(26, top(event.end) - top(event.start) - 3);
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onEventClick?.(event)}
              aria-label={`${event.title}, ${event.start} to ${event.end}`}
              style={{ top: top(event.start) + 1.5, height }}
              className={cn(
                "absolute inset-x-1 flex cursor-pointer flex-col overflow-hidden rounded-md px-2.5 text-left rovr-focus",
                "bg-[color-mix(in_oklab,var(--tone)_11%,var(--surface))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--tone)_24%,transparent)]",
                "hover:z-10 hover:bg-[color-mix(in_oklab,var(--tone)_17%,var(--surface))] hover:translate-x-0.5 active:scale-[0.99]",
                height < 40 ? "flex-row items-center gap-2" : "justify-center gap-0.5 py-1",
                tones[event.tone ?? "primary"],
              )}
            >
              <span className="truncate text-[0.8125rem] font-semibold">{event.title}</span>
              {event.detail && <span className="truncate text-caption text-muted-foreground">{event.detail}</span>}
            </button>
          );
        })}
        {now && (
          <div className="pointer-events-none absolute inset-x-0 z-20 flex items-center" style={{ top: top(now) }} aria-hidden>
            <span className="-ml-1 size-2 rounded-full bg-destructive" />
            <span className="h-px flex-1 bg-destructive" />
          </div>
        )}
      </div>
    </div>
  );
}
