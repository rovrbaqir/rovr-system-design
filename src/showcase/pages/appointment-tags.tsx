import { AppointmentTagsRow, MeetingTagsRow } from "@/components/patterns/appointment-tags";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const zone = "America/Los_Angeles";

function Body() {
  return (
    <>
      <Demo
        id="appointment-tags-row"
        files={["patterns/appointment-tags", "ui/badge"]}
        title="Appointment tags"
        note="A clock marker, then date, time with its zone, in person or virtual, and the visit type. The marker is filled once the patient has confirmed. The row wraps when it runs out of width."
        className="flex-col items-start gap-5"
      >
        <AppointmentTagsRow timeZone={zone} appointment={{ startTime: "2026-12-02T18:30:00Z", isVirtual: true, isConfirmed: true, visitTypeText: "Diabetes follow-up" }} />
        <AppointmentTagsRow timeZone={zone} appointment={{ startTime: "2026-12-04T23:15:00Z", isVirtual: false, isConfirmed: false, visitCategory: "Annual physical" }} />
      </Demo>
      <Demo
        id="appointment-tags-compact"
        files={["patterns/appointment-tags", "ui/badge"]}
        title="Compact and partial rows"
        note="compact makes the tags smaller for places where they are context, such as a row in a worklist. showDate, showTime, showLocation and showType each drop one tag. The visit type tag is also left out when the appointment has none."
        className="flex-col items-start gap-5"
      >
        <AppointmentTagsRow compact timeZone={zone} appointment={{ startTime: "2026-12-02T18:30:00Z", isVirtual: true, isConfirmed: true, visitTypeText: "Diabetes follow-up" }} />
        <AppointmentTagsRow compact showDate={false} timeZone={zone} appointment={{ startTime: "2026-12-02T21:00:00Z", isVirtual: false, isConfirmed: true, visitCategory: "New patient" }} />
        <AppointmentTagsRow showLocation={false} showType={false} timeZone={zone} appointment={{ startTime: "2026-12-07T17:45:00Z", isConfirmed: false }} />
      </Demo>
      <Demo
        id="appointment-tags-meeting"
        files={["patterns/appointment-tags", "ui/badge"]}
        title="Meeting tags"
        note="For a visit that is running or has ended: date, time, how long it lasted, virtual or in person, and the visit category. Without isVirtual, a visit with no location counts as virtual."
        className="flex-col items-start gap-5"
      >
        <MeetingTagsRow timeZone={zone} startTime="2026-11-24T17:00:00Z" durationText="22m 12s" isVirtual visitCategory="Follow-up" />
        <MeetingTagsRow timeZone={zone} startTime="2026-11-25T19:30:00Z" externalLocationId="loc-mission-bay" visitTypeText="Lab review" />
      </Demo>
      <Demo
        id="appointment-tags-meeting-options"
        files={["patterns/appointment-tags", "ui/badge"]}
        title="Meeting tags, fewer tags"
        note="Turn showMeetingType off in the encounter strip, where the visit is already known to be a video call. hideDuration drops the duration before a visit has started."
        className="flex-col items-start gap-5"
      >
        <MeetingTagsRow timeZone={zone} startTime="2026-11-24T17:00:00Z" durationText="41m 05s" showMeetingType={false} visitCategory="Behavioral health" />
        <MeetingTagsRow timeZone={zone} startTime="2026-12-01T22:00:00Z" hideDuration isVirtual visitCategory="Medication check" />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "appointment-tags",
  title: "Appointment tags",
  group: "Examples",
  summary: "Provider app. Replaces AppointmentTagsRow and MeetingTagsRow. Wrapping rows of pill tags that state the facts of an appointment or a visit: when, where, what kind and how long.",
  keywords: "appointment meeting visit tags pills badges date time timezone virtual in-person duration category schedule",
  Body,
};
