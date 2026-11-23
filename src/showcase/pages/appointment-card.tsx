import { Button } from "@/components/ui/button";
import { AppointmentCard } from "@/components/patterns/appointment-card";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="appointment-card-modes" files={["patterns/appointment-card", "ui/button"]} title="Video and in person" note="A video visit says so; an in-person visit shows its location. Actions sit at the end, with one primary at most." bare className="flex-col items-stretch">
        <AppointmentCard
          month="Dec"
          day="3"
          time="10:30 – 11:00"
          title="Follow-up visit"
          person={{ name: "Dr. Ngozi Okafor", role: "Internal medicine" }}
          mode="video"
          status="confirmed"
          actions={
            <>
              <Button variant="ghost" size="sm">
                Reschedule
              </Button>
              <Button size="sm">Join</Button>
            </>
          }
        />
        <AppointmentCard
          month="Dec"
          day="17"
          time="08:15 – 08:30"
          title="Lipid panel blood draw"
          person={{ name: "Quest Diagnostics" }}
          mode="in-person"
          location="410 Mission St, Suite 2"
          status="pending"
          actions={
            <Button variant="ghost" size="sm">
              Details
            </Button>
          }
        />
      </Demo>
      <Demo id="appointment-card-statuses" files={["patterns/appointment-card"]} title="Statuses" note="Five statuses, each with its own tone and wording. In progress pulses, because it is happening now." bare className="flex-col items-stretch">
        <AppointmentCard month="Nov" day="23" time="10:00 – 10:30" title="Medication review" person={{ name: "Dr. Leila Haddad", role: "Endocrinology" }} mode="video" status="in-progress" />
        <AppointmentCard month="Dec" day="3" time="10:30 – 11:00" title="Follow-up visit" person={{ name: "Dr. Ngozi Okafor", role: "Internal medicine" }} mode="video" status="confirmed" />
        <AppointmentCard month="Dec" day="9" time="14:00 – 14:45" title="Cardiology consultation" person={{ name: "Dr. Sam Whitfield", role: "Cardiology" }} mode="in-person" location="Mission St Clinic, Room 4" status="pending" />
        <AppointmentCard month="Nov" day="12" time="09:00 – 09:30" title="Follow-up visit" person={{ name: "Dr. Ngozi Okafor", role: "Internal medicine" }} mode="in-person" location="Mission St Clinic, Room 2" status="completed" />
        <AppointmentCard month="Nov" day="5" time="15:30 – 16:00" title="Skin check" person={{ name: "Dr. Kavya Iyer", role: "Dermatology" }} mode="in-person" location="Mission St Clinic, Room 1" status="cancelled" />
      </Demo>
      <Demo id="appointment-card-provider" files={["patterns/appointment-card", "ui/button"]} title="From the clinician's side" note="The person is whoever the viewer is meeting, so the provider app passes the patient." bare className="flex-col items-stretch">
        <AppointmentCard
          month="Nov"
          day="23"
          time="11:30 – 12:00"
          title="Same-day sick visit"
          person={{ name: "Tomás Lindqvist", role: "MRN 18842" }}
          mode="in-person"
          location="Room 2"
          status="confirmed"
          actions={
            <>
              <Button variant="ghost" size="sm">
                Open chart
              </Button>
              <Button size="sm">Start visit</Button>
            </>
          }
        />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "appointment-card",
  title: "Appointment card",
  group: "Examples",
  summary: "One appointment: date, time, who it is with, how it happens and its status. Use it in upcoming and past visit lists in both apps.",
  keywords: "visit booking calendar event schedule telehealth video",
  Body,
};
