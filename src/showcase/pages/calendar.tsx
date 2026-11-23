import * as React from "react";
import { Calendar, type DateRange } from "@/components/ui/calendar";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const longDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });

function SingleCalendar() {
  const [date, setDate] = React.useState<Date | null>(new Date(2026, 11, 3));
  return (
    <div className="flex flex-col gap-3">
      <Calendar value={date} onValueChange={setDate} />
      <p className="text-body-sm text-muted-foreground">{date ? `Selected: ${longDate.format(date)}` : "No day selected."}</p>
    </div>
  );
}

function RangeCalendar() {
  const [range, setRange] = React.useState<DateRange>({ from: new Date(2026, 10, 9), to: new Date(2026, 10, 20) });
  const days = range.from && range.to ? Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000) + 1 : null;
  return (
    <div className="flex flex-col gap-3">
      <Calendar mode="range" value={range} onValueChange={setRange} />
      <p className="text-body-sm text-muted-foreground">{days ? `${days} days of leave selected.` : "Now choose the last day."}</p>
    </div>
  );
}

function LimitedCalendar() {
  const today = React.useMemo(() => new Date(), []);
  const lastDay = React.useMemo(() => new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()), [today]);
  const [date, setDate] = React.useState<Date | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <Calendar value={date} onValueChange={setDate} min={today} max={lastDay} isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6} />
      <p className="text-body-sm text-muted-foreground">{date ? `Follow-up on ${longDate.format(date)}.` : "Weekdays in the next two months can be booked."}</p>
    </div>
  );
}

function LocaleCalendars() {
  const [date, setDate] = React.useState<Date | null>(new Date(2026, 11, 3));
  return (
    <>
      <Calendar value={date} onValueChange={setDate} weekStartsOn={1} locale="en-GB" />
      <Calendar value={date} onValueChange={setDate} weekStartsOn={1} locale="es-MX" />
    </>
  );
}

function Body() {
  return (
    <>
      <Demo id="calendar-single" files={["ui/calendar"]} title="Single day" note="Arrow keys move by day, PageUp and PageDown by month. Months slide in the direction you move." className="items-start">
        <SingleCalendar />
      </Demo>
      <Demo id="calendar-range" files={["ui/calendar"]} title="Range" note="With mode set to range, the first click sets the start and the second the end. Hovering previews the span." className="items-start">
        <RangeCalendar />
      </Demo>
      <Demo id="calendar-disabled-days" files={["ui/calendar"]} title="Limits and closed days" note="min and max bound the selectable dates. isDisabled rules out individual days: here, weekends." className="items-start">
        <LimitedCalendar />
      </Demo>
      <Demo id="calendar-locale" files={["ui/calendar"]} title="Week start and locale" note="weekStartsOn takes 0 for Sunday or 1 for Monday. locale sets the month and weekday names." className="items-start gap-10">
        <LocaleCalendars />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "calendar",
  title: "Calendar",
  group: "Components",
  summary: "A month grid for choosing one day or a range, shown directly on the page. It is what DatePicker opens, and it pairs with TimeSlots in the booking flow.",
  keywords: "date month grid day range booking datepicker",
  Body,
};
