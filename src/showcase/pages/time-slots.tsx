import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/toast";
import { TimeSlots, type TimeSlot } from "@/components/patterns/time-slots";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const slots: TimeSlot[] = ["8:30 AM", "9:00 AM", "9:30 AM", "10:30 AM", "11:00 AM", "1:15 PM", "2:00 PM", "3:30 PM"].map((label, i) => ({
  value: label,
  label,
  available: i !== 1 && i !== 5,
}));

function PickATime() {
  const [slot, setSlot] = React.useState<string | null>(null);
  return (
    <div className="flex w-full flex-col gap-3">
      <TimeSlots aria-label="Available times" slots={slots} value={slot} onValueChange={setSlot} />
      <p className="text-body-sm text-muted-foreground" aria-live="polite">
        {slot ? `Selected ${slot}.` : "No time selected yet."} Times that are taken are struck through and cannot be chosen.
      </p>
    </div>
  );
}

function NarrowSlots() {
  const [slot, setSlot] = React.useState<string | null>("14:20");
  return (
    <TimeSlots
      aria-label="Video visit times"
      className="w-full max-w-xs grid-cols-3"
      value={slot}
      onValueChange={setSlot}
      slots={[
        { value: "14:00", label: "2:00 PM" },
        { value: "14:20", label: "2:20 PM" },
        { value: "14:40", label: "2:40 PM", available: false },
        { value: "15:00", label: "3:00 PM" },
        { value: "15:20", label: "3:20 PM" },
        { value: "15:40", label: "3:40 PM" },
      ]}
    />
  );
}

function Booking() {
  const today = React.useMemo(() => new Date(), []);
  // Sundays are closed in this demo, so start on the next open day.
  const firstOpen = React.useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate() + (today.getDay() === 0 ? 1 : 0)), [today]);
  const [date, setDate] = React.useState<Date | null>(firstOpen);
  const [slot, setSlot] = React.useState<string | null>("9:30 AM");
  const day = date ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(date) : null;
  return (
    <div className="flex w-full flex-wrap gap-x-10 gap-y-6">
      <Calendar value={date} onValueChange={setDate} min={today} isDisabled={(d) => d.getDay() === 0} />
      <div className="flex min-w-60 flex-1 flex-col gap-3">
        <p className="text-title-sm">{day ?? "Choose a day"}</p>
        <TimeSlots aria-label="Available times" slots={slots} value={slot} onValueChange={setSlot} />
        <p className="text-body-sm text-muted-foreground">Times are shown in Pacific Time. Sundays are closed.</p>
        <Button className="w-fit" disabled={!day || !slot} onClick={() => toast.success("Appointment booked", { description: `${day}, ${slot} with Dr. Okafor` })}>
          Book appointment
        </Button>
      </div>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="time-slots-basic" files={["patterns/time-slots"]} title="Choosing a time" note="A radio group laid out as a grid: one time can be selected, and the grid fills whatever width it is given. A slot with available: false is shown but disabled." className="items-start">
        <PickATime />
      </Demo>
      <Demo id="time-slots-columns" files={["patterns/time-slots"]} title="Fixed columns" note="The value is the machine value, such as a 24-hour time or a slot id; the label is what the person reads. Pass a grid-cols class to fix the column count." className="items-start">
        <NarrowSlots />
      </Demo>
      <Demo id="time-slots-booking" files={["patterns/time-slots", "ui/calendar", "ui/button", "ui/toast"]} title="Booking" note="Calendar and time slots together, as in the appointment flow. Pick a day, then a time." className="items-start">
        <Booking />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "time-slots",
  title: "Time slots",
  group: "Patterns",
  summary: "Available appointment times as a grid of choices. Pair it with Calendar in a booking flow, where the person picks a day and then a time.",
  keywords: "booking appointment availability times schedule picker slots",
  Body,
};
