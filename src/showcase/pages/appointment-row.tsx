import * as React from "react";
import { FlaskConical, ScanLine } from "lucide-react";
import { AppointmentRow, PractitionerLine } from "@/components/patterns/appointment-row";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const at = (month: number, day: number, hour: number, minute = 0) => new Date(2026, month - 1, day, hour, minute);

const okafor = { name: "Dr. Ngozi Okafor", specialty: "Internal medicine" };
const haddad = { name: "Dr. Leila Haddad", specialty: "Endocrinology" };
const whitfield = { name: "Dr. Sam Whitfield", specialty: "Cardiology" };

function SelectableVisits() {
  const [selected, setSelected] = React.useState("okafor");
  return (
    <ul className="flex w-full max-w-xl flex-col gap-2">
      <AppointmentRow date={at(12, 3, 10, 30)} practitioner={okafor} visitType="Virtual" visitDetail="In 1 week" selected={selected === "okafor"} onClick={() => setSelected("okafor")} />
      <AppointmentRow date={at(12, 9, 14)} practitioner={whitfield} visitType="In person" visitDetail="In 2 weeks" selected={selected === "whitfield"} onClick={() => setSelected("whitfield")} />
      <AppointmentRow date={at(11, 12, 9)} practitioner={haddad} visitType="Virtual" visitDetail="13 days ago" past selected={selected === "haddad"} onClick={() => setSelected("haddad")} />
    </ul>
  );
}

function Body() {
  return (
    <>
      <Demo id="appointment-row-visits" files={["patterns/appointment-row", "ui/avatar", "ui/button", "ui/card"]} title="Visits with a practitioner" note="The date column, the bar, the practitioner and the visit type. When the call can be joined, the second line of the visit column is a link." bare className="flex-col items-stretch">
        <ul className="flex w-full max-w-xl flex-col gap-2">
          <AppointmentRow date={at(11, 25, 15, 30)} practitioner={okafor} visitType="Virtual" visitDetail="3:30 pm" joinHref="#appointment-row" onArrowClick={() => {}} />
          <AppointmentRow date={at(12, 3, 10, 30)} practitioner={haddad} visitType="Virtual" visitDetail="In 1 week" onArrowClick={() => {}} />
          <AppointmentRow date={at(12, 9, 14)} practitioner={whitfield} visitType="In person" visitDetail="In 2 weeks" onArrowClick={() => {}} />
        </ul>
      </Demo>
      <Demo id="appointment-row-testing" files={["patterns/appointment-row", "ui/button", "ui/card"]} title="Lab draws and services" note="Without a practitioner the row shows a round marker and a title. Lab rows add the location column. These lists draw a border around each row." bare className="flex-col items-stretch">
        <ul className="flex w-full max-w-xl flex-col gap-2">
          <AppointmentRow bordered date={at(12, 17, 8, 15)} icon={<FlaskConical />} title="Lab draw" visitType="Laboratory" visitDetail="Home/Office" onClick={() => {}} />
          <AppointmentRow bordered date={at(12, 19, 11)} icon={<FlaskConical />} title="Lab draw" visitType="Laboratory" visitDetail="Walk-In Test" onClick={() => {}} />
          <AppointmentRow bordered date={at(1, 8, 13, 45)} icon={<ScanLine />} title="Coronary calcium scan" onClick={() => {}} />
        </ul>
      </Demo>
      <Demo id="appointment-row-states" files={["patterns/appointment-row", "ui/avatar", "ui/button", "ui/card"]} title="Past, canceled and read-only" note="Past rows turn the date, the bar and the marker grey. A canceled visit says so. A read-only row has no arrow and does not react to the pointer." bare className="flex-col items-stretch">
        <ul className="flex w-full max-w-xl flex-col gap-2">
          <AppointmentRow date={at(11, 12, 9)} practitioner={okafor} visitType="In person" visitDetail="13 days ago" past onArrowClick={() => {}} />
          <AppointmentRow date={at(11, 5, 15, 30)} practitioner={haddad} visitType="Virtual" visitDetail="20 days ago" joinHref="#appointment-row" past noShow onArrowClick={() => {}} />
          <AppointmentRow date={at(12, 11, 16)} practitioner={whitfield} visitType="Virtual" cancelled onArrowClick={() => {}} />
          <AppointmentRow bordered date={at(10, 28, 7, 45)} icon={<FlaskConical />} title="Lab draw" visitType="Laboratory" visitDetail="Quest Diagnostics" past onClick={() => {}} />
          <AppointmentRow date={at(12, 3, 10, 30)} practitioner={okafor} visitType="Virtual" visitDetail="In 1 week" disabled onClick={() => {}} />
        </ul>
      </Demo>
      <Demo id="appointment-row-selected" files={["patterns/appointment-row", "ui/avatar", "ui/button", "ui/card"]} title="Selected" note="In a list that drives a detail panel, the chosen row is tinted. Click a row to select it. A selected past row uses the neutral tint." bare className="flex-col items-stretch">
        <SelectableVisits />
      </Demo>
      <Demo id="appointment-row-practitioner-line" files={["patterns/appointment-row", "ui/avatar"]} title="Practitioner line" note="The avatar with name and specialty on its own. Booking screens use the larger size and add the profile link. Narrow lists use the compact date on the row.">
        <div className="flex w-full flex-col gap-6">
          <PractitionerLine practitioner={okafor} />
          <PractitionerLine practitioner={whitfield} avatarClassName="size-12" textClassName="text-body" specialtyClassName="text-muted-foreground" profileHref="#appointment-row" />
          <ul className="flex w-full max-w-sm flex-col gap-2">
            <AppointmentRow bordered compactDate date={at(12, 17, 8, 15)} icon={<FlaskConical />} title="Lab draw" visitType="Laboratory" visitDetail="Home/Office" onClick={() => {}} />
          </ul>
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "appointment-row",
  title: "Appointment row",
  group: "Examples",
  summary: "Patient app. Replaces DashboardAppointmentListItem, TestingAppointmentListItem and PractitionerUI. One appointment as a list row: date and time, an accent bar, the practitioner or the test, the visit type and an arrow.",
  keywords: "visit list item upcoming past lab draw service practitioner provider schedule",
  Body,
};
