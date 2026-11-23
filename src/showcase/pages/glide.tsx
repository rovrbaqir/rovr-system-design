import * as React from "react";
import { CalendarDays, FlaskConical, MessageSquare, Pill } from "lucide-react";
import { Glide } from "@/components/ui/glide";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function FollowSelection() {
  const [view, setView] = React.useState("Week");
  return (
    <Glide follow="data-current" highlightClassName="rounded-md bg-accent" className="flex gap-1">
      {["Day", "Week", "Month"].map((v) => (
        <button
          key={v}
          type="button"
          data-current={view === v ? "" : undefined}
          aria-pressed={view === v}
          onClick={() => setView(v)}
          className="h-9 cursor-pointer rounded-md px-4 text-sm font-medium text-muted-foreground rovr-focus data-[current]:text-accent-foreground"
        >
          {v}
        </button>
      ))}
    </Glide>
  );
}

function Body() {
  return (
    <>
      <Demo id="glide-pointer" files={["ui/glide"]} title="Following the pointer" note="Mark each item with data-glide. Move across the rows, or tab through them: one highlight travels between them instead of each lighting up on its own." className="items-start">
        <Glide className="flex w-full max-w-sm flex-col" highlightClassName="rounded-lg">
          <a data-glide href="#/glide" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium rovr-focus [&_svg]:size-4.5 [&_svg]:text-muted-foreground">
            <CalendarDays /> Schedule
          </a>
          <a data-glide href="#/glide" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium rovr-focus [&_svg]:size-4.5 [&_svg]:text-muted-foreground">
            <MessageSquare /> Messages
          </a>
          <a data-glide href="#/glide" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium rovr-focus [&_svg]:size-4.5 [&_svg]:text-muted-foreground">
            <FlaskConical /> Labs and imaging
          </a>
          <a data-glide href="#/glide" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium rovr-focus [&_svg]:size-4.5 [&_svg]:text-muted-foreground">
            <Pill /> Prescriptions
          </a>
        </Glide>
      </Demo>
      <Demo id="glide-horizontal" files={["ui/glide"]} title="Horizontal" note="The highlight takes the size of whatever it lands on, so it works for a row of items of different widths. highlightClassName sets its shape and colour.">
        <Glide className="flex flex-wrap gap-1" highlightClassName="rounded-full">
          {["Overview", "Visits", "Labs and imaging", "Medications", "Billing"].map((label) => (
            <a key={label} data-glide href="#/glide" className="flex h-9 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap text-muted-foreground rovr-focus hover:text-foreground">
              {label}
            </a>
          ))}
        </Glide>
      </Demo>
      <Demo id="glide-follow" files={["ui/glide"]} title="Following an attribute" note="Pass follow with an attribute name and the highlight tracks whichever child carries it, not the pointer. This is how menus and comboboxes glide under keyboard navigation: they follow the headless component's data-highlighted. Here it follows the selected view.">
        <FollowSelection />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "glide",
  title: "Glide",
  group: "Components",
  summary: "One highlight that moves between items instead of each item lighting up on its own. It is the system's signature movement, already built into menus, lists, tabs and the sidebar; use it directly when you build a new set of rows or links.",
  keywords: "hover highlight animation sliding indicator motion",
  Body,
};
