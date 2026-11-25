import * as React from "react";
import { type AppointmentType, type AvailabilitySlot, ConfirmAppointment, MoreAvailabilities, SlotGrid } from "@/components/patterns/appointment-slots";
import { Button } from "@/components/ui/button";
import type { DateRange } from "@/components/ui/calendar";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const okafor = { name: "Dr. Ngozi Okafor", specialty: "Internal medicine" };

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
const inDays = (days: number, hour: number, minute = 0) => {
  const d = startOfToday();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, hour, minute);
};

const nextSlots: AvailabilitySlot[] = [
  { start: inDays(1, 9), virtual: true },
  { start: inDays(1, 11, 30), virtual: true },
  { start: inDays(2, 14), virtual: false },
  { start: inDays(3, 8, 30), virtual: true },
  { start: inDays(3, 16), virtual: false },
];

function NextSlots() {
  const [selected, setSelected] = React.useState<AvailabilitySlot[]>([nextSlots[1]]);
  return <SlotGrid className="max-w-md" slots={nextSlots} selected={selected} onSelect={(slot) => setSelected([slot])} loadMore onMore={() => {}} />;
}

function LoadingSlots() {
  const [loading, setLoading] = React.useState(true);
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-4">
      <SlotGrid slots={loading ? [] : nextSlots.slice(0, 3)} onSelect={() => {}} loading={loading} skeletonCells={1} />
      <Button variant="secondary" size="sm" onClick={() => setLoading((v) => !v)}>
        {loading ? "Show slots" : "Show loading"}
      </Button>
    </div>
  );
}

function Confirm() {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, [loading]);
  return <ConfirmAppointment slot={{ start: inDays(9, 10, 30), virtual: true }} durationMinutes={30} practitioner={okafor} loading={loading} onConfirm={() => setLoading(true)} />;
}

const times: [number, number][] = [
  [9, 0],
  [9, 30],
  [11, 0],
  [13, 30],
  [15, 0],
  [16, 30],
];

function Availabilities() {
  const [range, setRange] = React.useState<DateRange>(() => ({ from: startOfToday(), to: inDays(7, 0) }));
  const [type, setType] = React.useState<AppointmentType>("virtual");
  const [slot, setSlot] = React.useState<AvailabilitySlot | null>(null);
  const slots = React.useMemo(() => {
    if (!range.from) return [];
    const first = Math.max(1, Math.round((range.from.getTime() - startOfToday().getTime()) / 86400000));
    const last = range.to ? Math.round((range.to.getTime() - startOfToday().getTime()) / 86400000) : first;
    const out: AvailabilitySlot[] = [];
    for (let day = first; day <= last; day++) {
      const start = inDays(day, 0);
      // The clinic is closed at weekends; in-person visits run on fewer days.
      if (start.getDay() === 0 || start.getDay() === 6) continue;
      if (type === "in-person" && start.getDay() % 2 === 0) continue;
      times.slice(day % 3, (day % 3) + 4).forEach(([h, m]) => out.push({ start: inDays(day, h, m), virtual: type === "virtual", typeId: type }));
    }
    return out;
  }, [range, type]);
  return (
    <MoreAvailabilities
      className="h-[30rem] flex-none"
      practitioner={okafor}
      profileHref="#appointment-slots"
      slots={slots}
      selectedSlot={slot}
      onSelectSlot={setSlot}
      dateRange={range}
      onDateRangeChange={setRange}
      appointmentType={type}
      onAppointmentTypeChange={(next) => {
        setType(next);
        setSlot(null);
      }}
    />
  );
}

function Body() {
  return (
    <>
      <Demo id="appointment-slots-grid" files={["patterns/appointment-slots", "ui/button", "ui/skeleton"]} title="Slot grid" note="A provider's next open slots, three to a row, nine at most. Each cell shows the weekday, the date, and the time with a video or in-person mark. The last cell opens the full list." className="items-start">
        <NextSlots />
      </Demo>
      <Demo id="appointment-slots-loading-and-empty" files={["patterns/appointment-slots", "ui/button", "ui/skeleton"]} title="Loading and empty" note="Skeleton cells stand in while availability loads. A provider with no open slots gets one plain sentence." className="flex-col items-start gap-8">
        <LoadingSlots />
        <SlotGrid className="max-w-md" slots={[]} onSelect={() => {}} />
      </Demo>
      <Demo id="appointment-slots-confirm" files={["patterns/appointment-slots", "ui/avatar", "ui/button", "ui/field", "ui/input", "ui/spinner"]} title="Confirm appointment" note="The last step of booking, shown inside the booking dialog. The button stays disabled until a reason is entered." className="flex-col items-stretch px-0 pb-0">
        <Confirm />
      </Demo>
      <Demo id="appointment-slots-confirm-reserve" files={["patterns/appointment-slots", "ui/avatar", "ui/button"]} title="Session and reservation" note="A curator session and a slot reserved during sign-up do not ask for a reason, so the form is left out." className="flex-col items-stretch px-0 pb-0">
        <ConfirmAppointment slot={{ start: inDays(4, 16), virtual: false }} durationMinutes={45} practitioner={{ name: "Maya Brandt", specialty: "Lifestyle curator" }} curator reserve onConfirm={() => {}} />
      </Demo>
      <Demo id="appointment-slots-more" files={["patterns/appointment-slots", "patterns/appointment-row", "ui/calendar", "ui/popover", "ui/toggle-group", "ui/scroll-area", "ui/button", "ui/skeleton"]} title="More availabilities" note="Every open slot of one practitioner. The calendar button changes the date range, the toggles switch between video and in-person, and the list scrolls inside a fixed height." className="flex-col items-stretch px-0 pb-0">
        <Availabilities />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "appointment-slots",
  title: "Appointment slots",
  group: "Examples",
  summary: "Patient app. Replaces AvailabilitySlotUI, ConfirmSelectedAppointment and MoreAvailabilitiesContent. The three pieces of booking a visit: a provider's next open slots, the full list by day, and the confirmation step.",
  keywords: "booking availability time slot schedule visit confirm reserve date range virtual in-person",
  Body,
};
