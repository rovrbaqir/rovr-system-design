import * as React from "react";
import type { DateRange } from "@/components/ui/calendar";
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function DateOfBirth() {
  const [dob, setDob] = React.useState<Date | null>(new Date(1988, 3, 14));
  return (
    <Field className="max-w-xs">
      <FieldLabel>Date of birth</FieldLabel>
      <DatePicker aria-label="Date of birth" value={dob} onValueChange={setDob} max={new Date()} />
      <FieldDescription>Future dates cannot be chosen.</FieldDescription>
    </Field>
  );
}

function ReportingPeriod() {
  const [range, setRange] = React.useState<DateRange>({ from: new Date(2026, 10, 2), to: new Date(2026, 10, 22) });
  return (
    <Field className="max-w-xs">
      <FieldLabel>Reporting period</FieldLabel>
      <DateRangePicker aria-label="Reporting period" value={range} onValueChange={setRange} />
      <FieldDescription>Click a start day, then an end day. The popover closes once both are set.</FieldDescription>
    </Field>
  );
}

function FollowUpDate() {
  const today = React.useMemo(() => new Date(), []);
  const lastDay = React.useMemo(() => new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()), [today]);
  const [date, setDate] = React.useState<Date | null>(null);
  return (
    <Field className="max-w-xs">
      <FieldLabel>Follow-up with Dr. Okafor</FieldLabel>
      <DatePicker
        aria-label="Follow-up date"
        value={date}
        onValueChange={setDate}
        placeholder="Choose a weekday"
        min={today}
        max={lastDay}
        isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
        weekStartsOn={1}
        format={{ weekday: "short", day: "numeric", month: "short", year: "numeric" }}
      />
      <FieldDescription>Weekdays in the next three months. Weeks start on Monday.</FieldDescription>
    </Field>
  );
}

function SizedPickers() {
  const [date, setDate] = React.useState<Date | null>(new Date(2026, 11, 3));
  return (
    <>
      <DatePicker size="sm" aria-label="Visit date, small" value={date} onValueChange={setDate} className="w-44" />
      <DatePicker aria-label="Visit date, medium" value={date} onValueChange={setDate} className="w-44" />
      <DatePicker size="lg" aria-label="Visit date, large" value={date} onValueChange={setDate} className="w-44" />
    </>
  );
}

function RequiredDate() {
  const [date, setDate] = React.useState<Date | null>(null);
  return (
    <Field invalid={!date} className="max-w-xs">
      <FieldLabel>Collection date</FieldLabel>
      <DatePicker aria-label="Collection date" value={date} onValueChange={setDate} invalid={!date} />
      <FieldError match={!date}>Choose the day the sample was collected.</FieldError>
    </Field>
  );
}

function Body() {
  return (
    <>
      <Demo id="date-picker-single" files={["ui/date-picker", "ui/calendar", "ui/field"]} title="Single date" note="A field that opens a Calendar. Choosing a day closes it. Arrow keys move by day, PageUp and PageDown by month." className="items-start">
        <DateOfBirth />
      </Demo>
      <Demo id="date-picker-range" files={["ui/date-picker", "ui/calendar", "ui/field"]} title="Date range" note="DateRangePicker takes and returns an object with from and to." className="items-start">
        <ReportingPeriod />
      </Demo>
      <Demo id="date-picker-limits" files={["ui/date-picker", "ui/calendar", "ui/field"]} title="Limits and format" note="min, max and isDisabled pass straight to the calendar. format takes Intl.DateTimeFormat options for the text in the field." className="items-start">
        <FollowUpDate />
      </Demo>
      <Demo id="date-picker-sizes" files={["ui/date-picker"]} title="Sizes" note="The same three heights as Input.">
        <SizedPickers />
      </Demo>
      <Demo id="date-picker-states" files={["ui/date-picker", "ui/field"]} title="Invalid and disabled" note="Choose a date to clear the error." className="items-start">
        <RequiredDate />
        <Field disabled className="max-w-xs">
          <FieldLabel>Coverage starts</FieldLabel>
          <DatePicker aria-label="Coverage starts" value={new Date(2026, 0, 1)} onValueChange={() => {}} disabled />
          <FieldDescription>Set by your plan.</FieldDescription>
        </Field>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "date-picker",
  title: "Date picker",
  group: "Components",
  summary: "A form field that opens a calendar. DatePicker chooses one day and DateRangePicker chooses a start and an end. To show the month grid on the page itself, use Calendar.",
  keywords: "date range calendar datepicker day month dob period",
  Body,
};
