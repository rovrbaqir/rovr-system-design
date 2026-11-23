import * as React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { TimePicker } from "@/components/ui/time-picker";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function StartTime() {
  const [time, setTime] = React.useState<string | null>("09:30");
  return (
    <Field className="max-w-48">
      <FieldLabel>Start time</FieldLabel>
      <TimePicker aria-label="Start time" value={time} onValueChange={setTime} />
      <FieldDescription>
        Stored as <span className="font-mono text-foreground">{time ?? "null"}</span>
      </FieldDescription>
    </Field>
  );
}

function ClinicHours() {
  const [time, setTime] = React.useState<string | null>(null);
  return (
    <Field className="max-w-48">
      <FieldLabel>Blood draw</FieldLabel>
      <TimePicker aria-label="Blood draw time" value={time} onValueChange={setTime} min="07:00" max="11:00" step={15} placeholder="Choose a time" />
      <FieldDescription>Fasting draws run 7:00 to 11:00 AM, every 15 minutes.</FieldDescription>
    </Field>
  );
}

function Locales() {
  const [time, setTime] = React.useState<string | null>("14:00");
  return (
    <>
      <Field className="max-w-48">
        <FieldLabel>en-US</FieldLabel>
        <TimePicker aria-label="Time, US format" value={time} onValueChange={setTime} step={60} />
      </Field>
      <Field className="max-w-48">
        <FieldLabel>en-GB</FieldLabel>
        <TimePicker aria-label="Time, UK format" value={time} onValueChange={setTime} step={60} locale="en-GB" />
      </Field>
    </>
  );
}

function BlockTime() {
  const [date, setDate] = React.useState<Date | null>(new Date(2026, 11, 3));
  const [from, setFrom] = React.useState<string | null>("12:00");
  const [to, setTo] = React.useState<string | null>("13:00");
  return (
    <div className="grid w-full max-w-xl gap-5 sm:grid-cols-[1.4fr_1fr_1fr]">
      <Field>
        <FieldLabel>Day</FieldLabel>
        <DatePicker aria-label="Day" value={date} onValueChange={setDate} />
      </Field>
      <Field>
        <FieldLabel>From</FieldLabel>
        <TimePicker aria-label="From" value={from} onValueChange={setFrom} min="08:00" max="17:30" />
      </Field>
      <Field>
        <FieldLabel>To</FieldLabel>
        <TimePicker aria-label="To" value={to} onValueChange={setTo} min={from ?? "08:00"} max="18:00" />
      </Field>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="time-picker-basic" files={["ui/time-picker", "ui/field"]} title="Default" note="A list of times every 30 minutes. The value is a 24-hour string such as 09:30, whatever the display format." className="items-start">
        <StartTime />
      </Demo>
      <Demo id="time-picker-range-and-step" files={["ui/time-picker", "ui/field"]} title="Limits and step" note="min and max set the first and last time on offer. step is the minutes between options." className="items-start">
        <ClinicHours />
      </Demo>
      <Demo id="time-picker-locale" files={["ui/time-picker", "ui/field"]} title="Locale" note="The locale decides between 2:00 PM and 14:00. Both fields here share one value." className="items-start">
        <Locales />
      </Demo>
      <Demo id="time-picker-disabled" files={["ui/time-picker", "ui/field"]} title="Disabled" className="items-start">
        <Field disabled className="max-w-48">
          <FieldLabel>Clinic opens</FieldLabel>
          <TimePicker aria-label="Clinic opens" value="08:00" onValueChange={() => {}} disabled />
          <FieldDescription>Set by the practice manager.</FieldDescription>
        </Field>
      </Demo>
      <Demo id="time-picker-with-date" files={["ui/time-picker", "ui/date-picker", "ui/field"]} title="With a date" note="Blocking time off a schedule. The end time cannot be earlier than the start." className="items-start">
        <BlockTime />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "time-picker",
  title: "Time picker",
  group: "Components",
  summary: "Chooses a time of day from a list at a fixed step, for schedule blocks and reminders. For bookable appointment slots use the TimeSlots pattern.",
  keywords: "time clock hour minute schedule",
  Body,
};
