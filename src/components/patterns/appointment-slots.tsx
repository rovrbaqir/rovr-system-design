import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { CalendarDays, User, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, type DateRange } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Toggle, ToggleGroup } from "@/components/ui/toggle-group";
import { PractitionerLine, type Practitioner } from "./appointment-row";

export interface AvailabilitySlot {
  /** Start of the slot, already in the viewer's time zone. */
  start: Date;
  /** A video visit. In-person otherwise. */
  virtual: boolean;
  /** Tells apart two visit types that start at the same time. */
  typeId?: string | number;
}

export type AppointmentType = "virtual" | "in-person";

const slotKey = (slot: AvailabilitySlot) => `${slot.start.getTime()}-${slot.typeId ?? ""}`;
const pad = (n: number) => String(n).padStart(2, "0");
const ordinal = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th")}`;
const weekday = (d: Date, locale: string) => new Intl.DateTimeFormat(locale, { weekday: "long" }).format(d);
/** "December 3rd" */
const monthDay = (d: Date, locale: string) => `${new Intl.DateTimeFormat(locale, { month: "long" }).format(d)} ${ordinal(d.getDate())}`;
/** "10:30AM", or "10:30am" with `lower`. */
const clock = (d: Date, lower = false) => {
  const suffix = d.getHours() < 12 ? "AM" : "PM";
  return `${d.getHours() % 12 || 12}:${pad(d.getMinutes())}${lower ? suffix.toLowerCase() : suffix}`;
};

function ModeIcon({ virtual, className }: { virtual: boolean; className?: string }) {
  const Icon = virtual ? Video : User;
  return (
    <>
      <Icon className={cn("size-3 shrink-0", className)} aria-hidden />
      <span className="sr-only">{virtual ? "Video visit" : "In person"}</span>
    </>
  );
}

export interface SlotGridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Open slots. The first nine are shown. */
  slots: AvailabilitySlot[];
  /** Slots the patient has picked. They are raised above the rest. */
  selected?: AvailabilitySlot[];
  /** Called when a slot is pressed. Select it and move to the next step. */
  onSelect: (slot: AvailabilitySlot) => void;
  /** Adds a "See more" cell after the slots. */
  loadMore?: boolean;
  /** Called when "See more" is pressed. */
  onMore?: () => void;
  /** Shows skeleton cells in place of the slots. */
  loading?: boolean;
  /** One more than this many skeleton cells are shown while loading. */
  skeletonCells?: number;
  /** Applied to every slot cell and to the "See more" cell. */
  itemClassName?: string;
  /** Applied to the "See more" cell only. */
  seeMoreClassName?: string;
  locale?: string;
}

/** A provider's next open slots as a wrapping grid of cells: weekday, date, and time with a video or in-person mark. */
export function SlotGrid({ slots, selected = [], onSelect, loadMore = false, onMore, loading = false, skeletonCells = 3, itemClassName, seeMoreClassName, locale = "en-US", className, ...props }: SlotGridProps) {
  const cell = "h-auto! min-h-control-lg w-[30%] flex-col self-stretch rounded-md p-2 font-normal";
  return (
    <div className={cn("relative flex w-full flex-wrap items-start justify-start gap-2", className)} aria-busy={loading || undefined} {...props}>
      {loading && Array.from({ length: skeletonCells + 1 }).map((_, index) => <Skeleton key={index} className="min-h-[100px] w-full max-2xl:min-h-[70px]" />)}
      {slots.length === 0 && !loading && (
        <p className="flex size-full min-h-[100px] items-center justify-start pl-3 text-body-sm text-nowrap max-2xl:min-h-[50px]">No availability found for this provider.</p>
      )}
      {!loading &&
        slots.slice(0, 9).map((slot) => {
          const isSelected = selected.some((s) => slotKey(s) === slotKey(slot));
          return (
            <Button key={slotKey(slot)} aria-pressed={isSelected} onClick={() => onSelect(slot)} className={cn(cell, "md:p-3", isSelected && "shadow-overlay!", itemClassName)}>
              <span className="flex flex-col items-center justify-center">
                <span className="text-caption leading-4">{weekday(slot.start, locale)}</span>
                <span className="text-caption leading-4 font-medium">{monthDay(slot.start, locale)}</span>
                <span className="flex w-full items-center justify-center gap-1 text-caption leading-4 font-medium text-nowrap text-data">
                  {clock(slot.start)}
                  <ModeIcon virtual={slot.virtual} className="max-2xl:size-2" />
                </span>
              </span>
            </Button>
          );
        })}
      {loadMore && !loading && slots.length > 0 && (
        <Button variant="outline" onClick={onMore} className={cn(cell, "text-caption", itemClassName, seeMoreClassName)}>
          See more
        </Button>
      )}
    </div>
  );
}

/** "In 2 weeks", "In 3 days", "In 5 hours": how far away the visit is. */
function timeUntil(date: Date, now: Date) {
  const minutes = Math.floor((date.getTime() - now.getTime()) / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = (date.getFullYear() - now.getFullYear()) * 12 + date.getMonth() - now.getMonth() - (date.getDate() < now.getDate() ? 1 : 0);
  if (months > 0) return `In ${months} ${months === 1 ? "month" : "months"}`;
  if (weeks > 0) return `In ${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  if (days > 0) return `In ${days} ${days === 1 ? "day" : "days"}`;
  if (hours > 0) return `In ${hours} hours`;
  return `In ${minutes} minutes`;
}

export interface ConfirmAppointmentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "slot"> {
  /** The slot the patient picked. */
  slot: AvailabilitySlot;
  /** Length of the visit in minutes. */
  durationMinutes: number;
  practitioner: Practitioner;
  /** A lifestyle curator session: the subtitle says "session" and the reason form is hidden. */
  curator?: boolean;
  /** Sign-up flow: the slot is reserved, not booked, so the button says "Reserve appointment". */
  reserve?: boolean;
  /** Shows the "Reason for visit" form. Hide it when the reason is already known, e.g. a referral. */
  showReason?: boolean;
  /** Reason for the visit. Leave out to let the component keep it. */
  reason?: string;
  onReasonChange?: (reason: string) => void;
  /** Called with the reason when the button is pressed. */
  onConfirm: (reason: string) => void;
  /** The booking request is running. */
  loading?: boolean;
  /** The moment "In 2 weeks" is measured from. Defaults to now. */
  now?: Date;
  locale?: string;
}

/** The last step of booking: when, with whom, how, an optional reason, and the confirming button. */
export function ConfirmAppointment({
  slot,
  durationMinutes,
  practitioner,
  curator = false,
  reserve = false,
  showReason = true,
  reason: reasonProp,
  onReasonChange,
  onConfirm,
  loading = false,
  now,
  locale = "en-US",
  className,
  ...props
}: ConfirmAppointmentProps) {
  const reduced = useReducedMotion();
  const [ownReason, setOwnReason] = React.useState("");
  const reason = reasonProp ?? ownReason;
  const hasForm = showReason && !curator && !reserve;
  const date = slot.start;
  const headline = `${weekday(date, locale)} ${monthDay(date, locale)} ${date.getFullYear()} at ${clock(date)}`;

  return (
    <div className={cn("flex w-full flex-1 flex-col items-start justify-between gap-6", className)} {...props}>
      <div className="flex w-full flex-col items-start justify-start gap-1 px-8">
        <h2 className="text-title-lg font-normal">{headline}</h2>
        <p className="text-body text-muted-foreground">
          {durationMinutes} minutes {curator ? "session" : "consultation"}
        </p>
      </div>

      <div className="flex w-full items-center justify-start gap-6 p-5 px-8">
        <Avatar name={practitioner.name} src={practitioner.photoUrl} size="lg" />
        <span aria-hidden className="inline-block w-1 self-stretch rounded-full bg-linear-to-b from-transparent to-brand" />
        <div className="flex flex-col items-start justify-start gap-1">
          <h3 className="text-body-lg leading-snug">{practitioner.name}</h3>
          <p className="text-body-sm text-muted-foreground">{practitioner.specialty}</p>
        </div>
        <div className="flex flex-col items-start justify-center">
          <p className="text-sm">{slot.virtual ? "Virtual" : "In-Person"}</p>
          <p className="text-sm font-medium text-accent-foreground">{timeUntil(date, now ?? new Date())}</p>
        </div>
      </div>

      {hasForm && (
        <form
          className="mb-1 flex w-full flex-1 flex-col items-center justify-start border-y border-border py-7"
          onSubmit={(event) => {
            event.preventDefault();
            if (reason && !loading) onConfirm(reason);
          }}
        >
          <Field className="gap-2 px-8">
            <FieldLabel className="my-2 block text-sm font-normal text-muted-foreground">Reason for visit</FieldLabel>
            <Textarea
              required
              placeholder="Enter reason for visit"
              className="min-h-[100px] flex-1"
              value={reason}
              onChange={(event) => {
                setOwnReason(event.target.value);
                onReasonChange?.(event.target.value);
              }}
            />
          </Field>
        </form>
      )}

      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full border-t border-border px-5 pt-4 pb-5 text-center"
      >
        <Button aria-busy={loading || undefined} disabled={loading || (hasForm && !reason)} onClick={() => onConfirm(reason)}>
          {loading ? (
            <>
              <Spinner label="" />
              {reserve ? "Reserving..." : "Confirming..."}
            </>
          ) : reserve ? (
            "Reserve appointment"
          ) : (
            "Confirm appointment"
          )}
        </Button>
      </motion.div>
    </div>
  );
}

export interface MoreAvailabilitiesProps extends React.HTMLAttributes<HTMLDivElement> {
  practitioner: Practitioner;
  /** Shows a "View profile" link under the practitioner that opens this address. */
  profileHref?: string;
  /** Open slots in the chosen range and type, in time order. They are grouped by day. */
  slots: AvailabilitySlot[];
  /** Covers the slot area with a skeleton while availability loads. */
  loading?: boolean;
  selectedSlot: AvailabilitySlot | null;
  onSelectSlot: (slot: AvailabilitySlot) => void;
  /** The range availability is shown for. */
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  appointmentType: AppointmentType;
  onAppointmentTypeChange: (type: AppointmentType) => void;
  /** The practitioner only offers video visits: "In person" cannot be chosen. */
  onlyVirtual?: boolean;
  /** Earliest day that can be picked. Defaults to today. */
  minDate?: Date;
  locale?: string;
}

/** Every open slot of one practitioner: change the date range and the appointment type, then pick a time from a scrolling list grouped by day. */
export function MoreAvailabilities({
  practitioner,
  profileHref,
  slots,
  loading = false,
  selectedSlot,
  onSelectSlot,
  dateRange,
  onDateRangeChange,
  appointmentType,
  onAppointmentTypeChange,
  onlyVirtual = false,
  minDate,
  locale = "en-US",
  className,
  ...props
}: MoreAvailabilitiesProps) {
  const labelId = React.useId();
  const [open, setOpen] = React.useState(false);
  const today = React.useMemo(() => new Date(), []);
  const days = React.useMemo(() => {
    const groups = new Map<string, AvailabilitySlot[]>();
    for (const slot of slots) {
      const key = `${slot.start.getFullYear()}-${pad(slot.start.getMonth() + 1)}-${pad(slot.start.getDate())}`;
      groups.set(key, [...(groups.get(key) ?? []), slot]);
    }
    return [...groups.entries()];
  }, [slots]);
  const selectedKey = selectedSlot ? slotKey(selectedSlot) : null;

  return (
    <div className={cn("relative flex w-full flex-1 flex-col items-start justify-start gap-8 overflow-hidden p-5 pt-0", className)} {...props}>
      <div className="flex w-full items-center justify-between">
        <PractitionerLine practitioner={practitioner} avatarClassName="size-12" textClassName="text-body" specialtyClassName="text-muted-foreground" profileHref={profileHref} />
        <div className="flex items-center gap-2">
          <p className="text-sm text-nowrap text-foreground">Change date range</p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <Button size="icon-sm" aria-label="Change date range">
                  <CalendarDays />
                </Button>
              }
            />
            <PopoverContent align="end" className="w-auto p-3">
              <Calendar
                mode="range"
                value={dateRange}
                min={minDate ?? today}
                locale={locale}
                onValueChange={(range) => {
                  onDateRangeChange(range);
                  if (range.from && range.to) setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex w-full flex-col items-start justify-start gap-1">
        <span id={labelId} className="text-caption">
          Appointment type
        </span>
        <ToggleGroup
          aria-labelledby={labelId}
          value={[appointmentType]}
          // One type is always chosen: pressing the active one again keeps it.
          onValueChange={(value) => {
            const next = value[0] as AppointmentType | undefined;
            if (next) onAppointmentTypeChange(next);
          }}
          className="w-full items-start justify-start"
        >
          <Toggle value="virtual" className="[&_svg]:order-last">
            <Video aria-hidden /> Virtual
          </Toggle>
          <Toggle value="in-person" disabled={onlyVirtual} className="[&_svg]:order-last">
            <User aria-hidden /> In-person
          </Toggle>
        </ToggleGroup>
      </div>

      <div className="relative min-h-0 w-full flex-1" aria-busy={loading || undefined}>
        {loading && <Skeleton className="absolute inset-0 z-10 w-full" />}
        <ScrollArea className="size-full">
          <div className="flex w-full flex-col items-start justify-start gap-4">
            {!loading && days.length === 0 && (
              <div className="flex w-full flex-col items-center justify-center py-8 text-center">
                <p className="text-body text-muted-foreground">
                  {dateRange.from && dateRange.to
                    ? "No availabilities found for the selected date range. Please try a different range to see available slots."
                    : "No upcoming availabilities found. Please select a date range to view personalized availability options."}
                </p>
              </div>
            )}
            {days.map(([day, daySlots]) => (
              <div key={day} className="flex w-full max-w-[92%] flex-col items-start justify-start">
                <span className="flex flex-col items-start justify-start">
                  {weekday(daySlots[0].start, locale)}, {monthDay(daySlots[0].start, locale)}
                </span>
                <div className="grid w-full grid-cols-3 items-start justify-start gap-3 pt-2">
                  {daySlots.map((slot) => {
                    const isSelected = slotKey(slot) === selectedKey;
                    return (
                      <Button
                        key={slotKey(slot)}
                        aria-pressed={isSelected}
                        onClick={() => onSelectSlot(slot)}
                        className={cn("h-auto! rounded-md border border-transparent p-2 px-5 text-body font-normal text-data", isSelected && "border-on-solid shadow-[0_0_0_2px_var(--ring)]!")}
                      >
                        {clock(slot.start, true)}
                        <ModeIcon virtual={slot.virtual} />
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
