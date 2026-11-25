import * as React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface Practitioner {
  /** Display name, e.g. "Dr. Ngozi Okafor". */
  name: string;
  /** Specialty or role shown under the name. */
  specialty?: string;
  photoUrl?: string;
}

export interface PractitionerLineProps extends React.HTMLAttributes<HTMLDivElement> {
  practitioner: Practitioner;
  /** Sizes the avatar, e.g. `size-12`. */
  avatarClassName?: string;
  /** Applied to the name and the specialty, e.g. a larger type role. */
  textClassName?: string;
  /** Applied to the specialty only. */
  specialtyClassName?: string;
  /** Shows a "View profile" link under the specialty that opens this address. */
  profileHref?: string;
}

/** A practitioner on one line: avatar, then name over specialty, with an optional profile link. */
export function PractitionerLine({ practitioner, avatarClassName, textClassName, specialtyClassName, profileHref, className, ...props }: PractitionerLineProps) {
  return (
    <div className={cn("flex items-center justify-start gap-3 max-2xl:gap-2", className)} {...props}>
      <Avatar name={practitioner.name} src={practitioner.photoUrl} className={cn("size-9", avatarClassName)} />
      <div className="flex-1">
        <p className={cn("text-caption font-medium whitespace-nowrap text-foreground", textClassName)}>{practitioner.name}</p>
        <p className={cn("text-caption text-foreground", textClassName, specialtyClassName)}>{practitioner.specialty}</p>
        {profileHref && (
          <a href={profileHref} className="inline-flex items-start justify-start rounded-xs text-caption text-accent-foreground rovr-focus hover:underline">
            View profile
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "December 03", "Thursday" and "10:30am", as the patient app prints them. */
function dateParts(date: Date, locale: string, shortMonth: boolean) {
  const month = new Intl.DateTimeFormat(locale, { month: shortMonth ? "short" : "long" }).format(date);
  const hours = date.getHours();
  return {
    day: `${month} ${pad(date.getDate())}`,
    weekday: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date),
    time: `${hours % 12 || 12}:${pad(date.getMinutes())}${hours < 12 ? "am" : "pm"}`,
    iso: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
  };
}

export interface AppointmentRowProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "onClick" | "title"> {
  /** Start of the appointment, already in the viewer's time zone. */
  date: Date;
  /** A visit with a person. Shows the avatar, name and specialty, and always shows the visit column. */
  practitioner?: Practitioner;
  /** A lab draw or service. Shown in the round marker when there is no practitioner. */
  icon?: React.ReactNode;
  /** A lab draw or service. The name next to the marker, e.g. "Lab draw". */
  title?: string;
  /** First line of the visit column: "Virtual", "In person" or "Laboratory". */
  visitType?: string;
  /** Second line of the visit column: how far away the visit is ("Tomorrow", "In 2 weeks") or where it is. */
  visitDetail?: React.ReactNode;
  /** Turns the second line into a link that opens the video call in a new tab. */
  joinHref?: string;
  /** Greys the date, the bar and the marker. */
  past?: boolean;
  /** Greys the row text and replaces the second line with "Canceled". */
  cancelled?: boolean;
  /** A past visit the patient missed. The join link reads "No show". */
  noShow?: boolean;
  /** Tints the row. */
  selected?: boolean;
  /** Read-only: no hover, no pointer events and no arrow. */
  disabled?: boolean;
  /** Draws a border around the row, as the lab and service lists do. */
  bordered?: boolean;
  /** Narrow lists: abbreviates the month and hides the time. */
  compactDate?: boolean;
  /** The whole row is the target. Ignored when `onArrowClick` is set. */
  onClick?: () => void;
  /** Only the arrow is the target; the row itself does nothing. */
  onArrowClick?: () => void;
  locale?: string;
}

/**
 * One appointment in a list: date and time, an accent bar, who or what it is,
 * the visit type and an arrow. Covers visits with a practitioner and lab or
 * service appointments.
 */
export function AppointmentRow({
  date,
  practitioner,
  icon,
  title,
  visitType,
  visitDetail,
  joinHref,
  past = false,
  cancelled = false,
  noShow = false,
  selected = false,
  disabled = false,
  bordered = false,
  compactDate = false,
  onClick,
  onArrowClick,
  locale = "en-US",
  className,
  ...props
}: AppointmentRowProps) {
  const parts = dateParts(date, locale, compactDate);
  const pressable = !!(onClick || onArrowClick);
  const detailTone = past || cancelled ? "text-muted-foreground" : "text-accent-foreground";
  const showVisit = practitioner ? true : !!visitType;

  return (
    <li className={cn("w-full min-w-full list-none", className)} {...props}>
      <Card
        variant="outline"
        aria-current={selected || undefined}
        onClick={onArrowClick ? undefined : onClick}
        className={cn(
          "relative h-auto w-full flex-row gap-1 self-stretch overflow-visible rounded-lg bg-surface p-3 py-1",
          "transition-colors duration-(--dur-fast) ease-out",
          bordered ? "border-border-strong" : "border-transparent",
          cancelled ? "text-muted-foreground" : "text-foreground",
          pressable && "cursor-pointer hover:bg-secondary-hover",
          selected && (past ? "bg-secondary-hover" : "bg-accent"),
          disabled && "pointer-events-none",
        )}
      >
        <span className={cn("mx-1 flex shrink-0 scale-90 flex-col items-start justify-center xl:scale-100", practitioner ? "w-[17%]" : "w-fit min-w-20")}>
          <time dateTime={parts.iso} className={cn("text-caption font-medium text-nowrap text-data", past ? "text-muted-foreground" : "text-accent-foreground")}>
            {parts.day}
          </time>
          <span className="text-caption text-foreground">{parts.weekday}</span>
          {!compactDate && <span className="text-caption text-data text-foreground">{parts.time}</span>}
        </span>

        <span aria-hidden className="flex w-[3%] min-w-[3%] items-center justify-center self-stretch">
          <span className={cn("inline-block h-full w-1 self-stretch rounded-full max-2xl:w-[3px]", past || cancelled ? "bg-subtle-foreground" : "bg-brand")} />
        </span>

        <div className="ml-1 flex w-full flex-1 items-center justify-between gap-2 text-foreground">
          {practitioner ? (
            <PractitionerLine practitioner={practitioner} avatarClassName="size-9" className="w-[60%] overflow-hidden max-2xl:max-w-[150px]" />
          ) : (
            <div className="flex w-[60%] items-center justify-start gap-2 overflow-hidden max-2xl:max-w-[150px]">
              <span
                aria-hidden
                className={cn(
                  "flex aspect-square size-9 shrink-0 items-center justify-center rounded-full [&_svg]:size-4",
                  past ? "bg-secondary-hover text-muted-foreground" : "bg-linear-to-b from-brand to-navy text-on-solid",
                )}
              >
                {icon}
              </span>
              <p className="max-w-[130px] text-caption font-medium text-foreground">{title}</p>
            </div>
          )}

          <div className={cn("flex flex-1 items-center gap-2 xl:pr-1", practitioner ? "justify-start" : "justify-between")}>
            {showVisit && (
              <div className={cn("flex", practitioner && "w-full")}>
                <div className="flex flex-col gap-1 text-caption">
                  <span>{visitType}</span>
                  {practitioner ? (
                    joinHref && !cancelled ? (
                      <a
                        href={joinHref}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className={cn("rounded-xs text-body-sm text-nowrap rovr-focus hover:underline", detailTone)}
                      >
                        {noShow ? "No show" : visitDetail}
                      </a>
                    ) : (
                      <span className={cn("cursor-default text-body-sm text-nowrap", detailTone)}>{cancelled ? "Canceled" : visitDetail}</span>
                    )
                  ) : (
                    <span className="max-w-[100px] truncate text-nowrap text-foreground">{visitDetail}</span>
                  )}
                </div>
              </div>
            )}
            {pressable && !disabled && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="View appointment"
                className={cn("shrink-0", selected && !practitioner && "text-accent-foreground")}
                onClick={(event) => {
                  event.stopPropagation();
                  if (onArrowClick) onArrowClick();
                  else onClick?.();
                }}
              >
                <ArrowRight className="size-5" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </li>
  );
}
