import * as React from "react";
import { TimePicker } from "@/components/ui/time-picker";
import { toast } from "@/components/ui/toast";
import { ScheduleDay, type ScheduleEvent } from "@/components/patterns/schedule-day";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const events: ScheduleEvent[] = [
  { id: "1", title: "Amara Osei", detail: "Follow-up · Room 2", start: "08:30", end: "09:00" },
  { id: "2", title: "Daniel Reyes", detail: "Lab review · Video", start: "09:00", end: "09:30", tone: "success" },
  { id: "3", title: "Priya Raman", detail: "Annual physical · Room 1", start: "09:45", end: "10:45" },
  { id: "4", title: "Team huddle", start: "11:00", end: "11:20", tone: "neutral" },
  { id: "5", title: "Tomás Lindqvist", detail: "Same-day sick visit · Room 2", start: "11:30", end: "12:00", tone: "warning" },
  { id: "6", title: "Grace Mbeki", detail: "New patient · Room 3", start: "13:00", end: "14:00" },
];

const haddad: ScheduleEvent[] = [
  { id: "h1", title: "Noah Feldman", detail: "Medication review · Video", start: "08:15", end: "08:45", tone: "success" },
  { id: "h2", title: "Sofia Marchetti", detail: "Follow-up · Room 4", start: "09:00", end: "09:45" },
  { id: "h3", title: "Jun Watanabe", detail: "Insulin start · Room 4", start: "10:00", end: "11:00" },
  { id: "h4", title: "Admin time", start: "11:15", end: "12:00", tone: "neutral" },
];

function DayWithPicker() {
  const [now, setNow] = React.useState<string | null>("10:10");
  return (
    <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <ScheduleDay events={events} startHour={8} endHour={14} now={now ?? undefined} onEventClick={(e) => toast.message(e.title, { description: `${e.start} to ${e.end}` })} />
      <div className="flex flex-col gap-3">
        <span className="text-label">Current time</span>
        <TimePicker aria-label="Current time" value={now} onValueChange={setNow} min="08:00" max="14:00" step={15} />
        <p className="text-body-sm text-muted-foreground">The red line marks the current time. Change it here, or click any visit for details.</p>
      </div>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="schedule-day-basic" files={["patterns/schedule-day", "ui/toast", "ui/time-picker"]} title="One day" note="Events sit on an hour grid between startHour and endHour. now draws the current-time line and onEventClick opens a visit." className="items-start">
        <DayWithPicker />
      </Demo>
      <Demo id="schedule-day-tones" files={["patterns/schedule-day"]} title="Tones and short events" note="Four tones: primary for visits, success for video or completed, warning for something needing attention, neutral for time that is not a visit. An event under about 40 minutes puts its title and detail on one line." className="items-start">
        <ScheduleDay
          className="w-full max-w-md"
          startHour={9}
          endHour={12}
          events={[
            { id: "a", title: "Amara Osei", detail: "Follow-up · Room 2", start: "09:00", end: "09:45", tone: "primary" },
            { id: "b", title: "Daniel Reyes", detail: "Lab review · Video", start: "09:45", end: "10:15", tone: "success" },
            { id: "c", title: "Tomás Lindqvist", detail: "Running late", start: "10:15", end: "11:00", tone: "warning" },
            { id: "d", title: "Lunch", start: "11:00", end: "12:00", tone: "neutral" },
          ]}
        />
      </Demo>
      <Demo id="schedule-day-columns" files={["patterns/schedule-day"]} title="Side by side" note="Compose several days in columns for a week or a multi-provider view. hourHeight sets the scale; a smaller value fits more of the day." className="items-start">
        <div className="grid w-full gap-x-6 gap-y-8 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-3">
            <p className="pl-[3.25rem] text-title-sm">Dr. Ngozi Okafor</p>
            <ScheduleDay events={events.slice(0, 5)} startHour={8} endHour={12} hourHeight={48} />
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <p className="pl-[3.25rem] text-title-sm">Dr. Leila Haddad</p>
            <ScheduleDay events={haddad} startHour={8} endHour={12} hourHeight={48} />
          </div>
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "schedule-day",
  title: "Schedule day",
  group: "Examples",
  summary: "One day of a clinician's schedule on an hour grid, with a line for the current time. Use one for a day view, or several side by side for a week or a multi-provider view.",
  keywords: "calendar agenda day view timeline appointments hours week providers",
  Body,
};
