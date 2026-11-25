import * as React from "react";
import { CalendarDays, Clock, House, HousePlus, Timer, Video } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

/**
 * Each kind of tag keeps its own hue, so a row reads at a glance. Date and time use the Badge's info
 * tone. The others are categories, not statuses, so they take a categorical hue instead of a status
 * tone: red, amber and green keep their meaning. The text step leans on the foreground so it stays
 * readable on the tint in both themes.
 */
const hues = {
  when: "",
  place: "[--tone:var(--chart-4)] [--tone-fg:color-mix(in_oklab,var(--chart-4)_62%,var(--foreground))]",
  visit: "[--tone:var(--chart-2)] [--tone-fg:color-mix(in_oklab,var(--chart-2)_62%,var(--foreground))]",
  duration: "[--tone:var(--chart-5)] [--tone-fg:color-mix(in_oklab,var(--chart-5)_62%,var(--foreground))]",
} as const;

function InfoTag({ kind, className, ...props }: BadgeProps & { kind: keyof typeof hues }) {
  return <Badge tone="info" className={cn(hues[kind], className)} {...props} />;
}

/** "11/25/2026", "2:30PM" and "PST" for an ISO time, in the given zone or the viewer's own. */
function formatStart(startTime: string | undefined | null, timeZone?: string) {
  if (!startTime) return null;
  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) return null;
  const date = new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "numeric", timeZone }).format(start);
  const parts = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short", timeZone }).formatToParts(start);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return { date, time: `${part("hour")}:${part("minute")}${part("dayPeriod")}`, timezone: part("timeZoneName") };
}

/* ------------------------------------------------------------------ */
/* AppointmentTagsRow                                                  */
/* ------------------------------------------------------------------ */

export interface AppointmentTagsInfo {
  /** ISO start time. The date and time tags are hidden without it. */
  startTime?: string | null;
  /** A video visit. Otherwise the visit is in person. */
  isVirtual?: boolean | null;
  /** The patient has confirmed. Fills the clock marker at the start of the row. */
  isConfirmed?: boolean | null;
  /** Visit type as written by the clinic: "Annual physical". Wins over `visitCategory`. */
  visitTypeText?: string | null;
  /** Visit category label: "Follow-up". */
  visitCategory?: string | null;
}

export interface AppointmentTagsRowProps extends React.HTMLAttributes<HTMLDivElement> {
  appointment: AppointmentTagsInfo;
  showDate?: boolean;
  showTime?: boolean;
  showLocation?: boolean;
  showType?: boolean;
  /** Smaller tags for surfaces where the tags are context, not content. */
  compact?: boolean;
  /** IANA zone the time is shown in, e.g. "America/Los_Angeles". Defaults to the viewer's zone. */
  timeZone?: string;
}

/** The facts of an appointment in a wrapping row of tags: confirmed or not, date, time, in person or virtual, and the visit type. */
export const AppointmentTagsRow = React.forwardRef<HTMLDivElement, AppointmentTagsRowProps>(function AppointmentTagsRow(
  { appointment, showDate = true, showTime = true, showLocation = true, showType = true, compact = false, timeZone, className, ...props },
  ref,
) {
  const start = React.useMemo(() => formatStart(appointment.startTime, timeZone), [appointment.startTime, timeZone]);
  const isVirtual = appointment.isVirtual || false;
  const isConfirmed = appointment.isConfirmed || false;
  const visitType = appointment.visitTypeText || appointment.visitCategory;
  const size = compact ? "h-6 gap-2 px-2" : "h-8 gap-2 px-2.5 text-[0.8125rem]";
  const confirmedLabel = isConfirmed ? "Confirmed" : "Not confirmed";

  return (
    <div ref={ref} className={cn("flex flex-wrap items-center", compact ? "gap-2" : "gap-3", className)} {...props}>
      <span
        role="img"
        aria-label={confirmedLabel}
        title={confirmedLabel}
        className={cn(
          "grid shrink-0 place-items-center rounded-full",
          compact ? "size-5.5" : "size-6.5",
          isConfirmed ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground shadow-[inset_0_0_0_0.5px_var(--border-strong)]",
        )}
      >
        <Clock aria-hidden className="size-2.5" />
      </span>

      {showDate && start?.date && (
        <InfoTag kind="when" className={cn(size, "text-data")}>
          <CalendarDays aria-hidden />
          {start.date}
        </InfoTag>
      )}

      {showTime && start?.time && (
        <InfoTag kind="when" className={cn(size, "text-data")}>
          <Clock aria-hidden />
          {start.time} ({start.timezone})
        </InfoTag>
      )}

      {showLocation && (
        <InfoTag kind="place" className={size}>
          {isVirtual ? <Video aria-hidden /> : <House aria-hidden />}
          {isVirtual ? "Virtual" : "In-Person"}
        </InfoTag>
      )}

      {showType && visitType && (
        <InfoTag kind="visit" className={size}>
          <HousePlus aria-hidden />
          {visitType}
        </InfoTag>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* MeetingTagsRow                                                      */
/* ------------------------------------------------------------------ */

export interface MeetingTagsRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ISO start time. */
  startTime: string;
  /** Visit category label: "Follow-up". Wins over `visitTypeText`. */
  visitCategory?: string | null;
  /** Visit type as written by the clinic. Used when there is no category. */
  visitTypeText?: string | null;
  /** A video visit. When not set, a visit without a location counts as virtual. */
  isVirtual?: boolean | null;
  /** The clinic location, when the visit has one. */
  externalLocationId?: string | null;
  /** Shows the Virtual or In person tag. On for the schedule dialog; turn off in the encounter strip. */
  showMeetingType?: boolean;
  /** Text for the duration tag, e.g. "N/A" or "22m 12s". */
  durationText?: string;
  hideDuration?: boolean;
  /** IANA zone the time is shown in. Defaults to the viewer's zone. */
  timeZone?: string;
}

/** The facts of a visit that is running or has ended: date, time, how long it lasted, virtual or in person, and the visit category. */
export const MeetingTagsRow = React.forwardRef<HTMLDivElement, MeetingTagsRowProps>(function MeetingTagsRow(
  { startTime, visitCategory, visitTypeText, isVirtual, externalLocationId, showMeetingType = true, durationText = "N/A", hideDuration = false, timeZone, className, ...props },
  ref,
) {
  const start = React.useMemo(() => formatStart(startTime, timeZone), [startTime, timeZone]);
  const virtual = isVirtual ?? !externalLocationId;
  const visit = visitCategory?.trim() || visitTypeText?.trim() || "—";
  const size = "h-7 gap-1.5 px-2.5 [&_svg]:size-3.5";

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props}>
      <InfoTag kind="when" className={cn(size, "text-data")}>
        <CalendarDays aria-hidden className="size-3!" />
        {start?.date ?? "—"}
      </InfoTag>
      <InfoTag kind="when" className={cn(size, "text-data")}>
        <Clock aria-hidden />
        {start ? `${start.time} (${start.timezone})` : "—"}
      </InfoTag>
      {!hideDuration && (
        <InfoTag kind="duration" className={cn(size, "text-data")}>
          <Timer aria-hidden />
          Duration: {durationText}
        </InfoTag>
      )}
      {showMeetingType ? (
        <InfoTag kind="place" className={size}>
          <Video aria-hidden />
          {virtual ? "Virtual" : "In person"}
        </InfoTag>
      ) : null}
      <InfoTag kind="visit" className={size}>
        <House aria-hidden />
        {visit}
      </InfoTag>
    </div>
  );
});
