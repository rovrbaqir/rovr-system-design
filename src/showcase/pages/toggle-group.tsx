import * as React from "react";
import { Phone, Video } from "lucide-react";
import { Toggle, ToggleGroup } from "@/components/ui/toggle-group";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function ClinicDays() {
  const [days, setDays] = React.useState<string[]>(["mon", "wed", "fri"]);
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label">Clinic days</span>
      <ToggleGroup multiple value={days} onValueChange={setDays} aria-label="Clinic days">
        <Toggle value="mon">Mon</Toggle>
        <Toggle value="tue">Tue</Toggle>
        <Toggle value="wed">Wed</Toggle>
        <Toggle value="thu">Thu</Toggle>
        <Toggle value="fri">Fri</Toggle>
      </ToggleGroup>
      <p className="text-body-sm text-muted-foreground">{days.length === 0 ? "No clinic days chosen." : `${days.length} days a week.`}</p>
    </div>
  );
}

function ClaimStatusFilter() {
  const statuses = ["Paid", "Submitted", "In review", "Denied"];
  const [status, setStatus] = React.useState<string[]>(["Denied"]);
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup multiple value={status} onValueChange={setStatus} aria-label="Claim status">
        {statuses.map((s) => (
          <Toggle key={s} value={s}>
            {s}
          </Toggle>
        ))}
      </ToggleGroup>
      <p className="text-body-sm text-muted-foreground">{status.length === 0 ? "Showing all claims." : `Showing claims that are ${status.join(" or ").toLowerCase()}.`}</p>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="toggle-group-multiple" files={["ui/toggle-group"]} title="Multiple" note="Pass multiple to let several toggles be on at once. The value is always an array." className="items-start">
        <ClinicDays />
      </Demo>
      <Demo id="toggle-group-single" files={["ui/toggle-group"]} title="Single" note="Without multiple, pressing one toggle releases the others. Unlike a segmented control, all of them can be off.">
        <ToggleGroup defaultValue={["video"]} aria-label="Visit format">
          <Toggle value="video">
            <Video /> Video
          </Toggle>
          <Toggle value="phone">
            <Phone /> Phone
          </Toggle>
          <Toggle value="clinic">In clinic</Toggle>
        </ToggleGroup>
      </Demo>
      <Demo id="toggle-group-disabled" files={["ui/toggle-group"]} title="Disabled" note="Disable one toggle, or the whole group." className="flex-col items-start gap-4">
        <ToggleGroup multiple defaultValue={["sat"]} aria-label="Weekend cover">
          <Toggle value="sat">Sat</Toggle>
          <Toggle value="sun" disabled>
            Sun
          </Toggle>
        </ToggleGroup>
        <ToggleGroup multiple disabled defaultValue={["mon", "tue"]} aria-label="Locked clinic days">
          <Toggle value="mon">Mon</Toggle>
          <Toggle value="tue">Tue</Toggle>
          <Toggle value="wed">Wed</Toggle>
        </ToggleGroup>
      </Demo>
      <Demo id="toggle-group-filters" files={["ui/toggle-group"]} title="As filters" note="Quick filters above a table: each toggle narrows the list, and none means everything." className="items-start">
        <ClaimStatusFilter />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "toggle-group",
  title: "Toggle group",
  group: "Components",
  summary: "A set of on and off buttons for filters, days of the week or formatting. Pass multiple to allow several at once.",
  keywords: "toggle button filter multi-select days pressed",
  Body,
};
