import * as React from "react";
import { CalendarDays, List, Rows3 } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function ScheduleView() {
  const [range, setRange] = React.useState<"day" | "week" | "month">("week");
  return (
    <SegmentedControl
      aria-label="Schedule view"
      value={range}
      onValueChange={setRange}
      options={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ]}
    />
  );
}

function SmallControl() {
  const [series, setSeries] = React.useState<"both" | "clinic">("both");
  return (
    <SegmentedControl
      size="sm"
      aria-label="Series"
      value={series}
      onValueChange={setSeries}
      options={[
        { value: "both", label: "By format" },
        { value: "clinic", label: "In clinic only" },
      ]}
    />
  );
}

function IconControl() {
  const [layout, setLayout] = React.useState<"list" | "board" | "calendar">("list");
  return (
    <SegmentedControl
      aria-label="Layout"
      value={layout}
      onValueChange={setLayout}
      options={[
        { value: "list", label: <span className="flex items-center gap-1.5"><List className="size-4" /> List</span> },
        { value: "board", label: <span className="flex items-center gap-1.5"><Rows3 className="size-4" /> Board</span> },
        { value: "calendar", label: <span className="flex items-center gap-1.5"><CalendarDays className="size-4" /> Calendar</span> },
      ]}
    />
  );
}

function ResultsToolbar() {
  const [period, setPeriod] = React.useState<"3m" | "12m" | "all">("12m");
  const count = { "3m": 4, "12m": 14, all: 31 }[period];
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-title-sm">Lab results</p>
          <p className="text-body-sm text-muted-foreground">Amara Osei, MRN 20418</p>
        </div>
        <SegmentedControl
          size="sm"
          aria-label="Period"
          value={period}
          onValueChange={setPeriod}
          options={[
            { value: "3m", label: "3 months" },
            { value: "12m", label: "12 months" },
            { value: "all", label: "All" },
          ]}
        />
      </div>
      <p className="text-body text-muted-foreground">
        <span className="font-medium text-foreground text-data">{count}</span> results in this period.
      </p>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="segmented-control-basic" files={["ui/segmented-control"]} title="Default" note="One raised thumb slides to the chosen option. Left and right arrow keys move it.">
        <ScheduleView />
      </Demo>
      <Demo id="segmented-control-small" files={["ui/segmented-control"]} title="Small" note="For card headers and chart toolbars.">
        <SmallControl />
      </Demo>
      <Demo id="segmented-control-icons" files={["ui/segmented-control"]} title="With icons" note="A label can be any node. Keep the words: an icon alone is a guess.">
        <IconControl />
      </Demo>
      <Demo id="segmented-control-toolbar" files={["ui/segmented-control"]} title="In a card header" note="It switches what the content below shows, without leaving the page." className="items-start">
        <ResultsToolbar />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "segmented-control",
  title: "Segmented control",
  group: "Components",
  summary: "A compact single choice between two to five views, such as Day, Week and Month. It is always controlled and always has one option selected.",
  keywords: "segment switcher view toggle button group pill tabs",
  Body,
};
