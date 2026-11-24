import * as React from "react";
import { CalendarDays, List } from "lucide-react";
import { SegmentedControl, type SegmentedControlProps } from "@/components/ui/segmented-control";
import { type ComponentSpec, axis, list, matrix } from "./kit";

type Option = { value: string; label: React.ReactNode };

const views: Option[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

function Segments({ options, initial, size, label }: { options: Option[]; initial: string; size?: SegmentedControlProps<string>["size"]; label: string }) {
  const [value, setValue] = React.useState(initial);
  return <SegmentedControl aria-label={label} value={value} onValueChange={setValue} options={options} size={size} />;
}

export const spec: ComponentSpec = {
  slug: "segmented-control",
  sections: [
    matrix({
      title: "Segmented control",
      note: "Week is selected. Hover is shown on an unselected segment (Day) and focus on the selected one, which is where the keyboard lands.",
      rows: axis("size", ["sm", "md"]),
      states: ["default", "hover", "focus"],
      target: '[data-spec-cell$="state=hover"] [aria-checked=false], [aria-checked=true]',
      render: (p) => <Segments options={views} initial="week" size={p.size as SegmentedControlProps<string>["size"]} label="Calendar view" />,
    }),
    matrix({
      title: "Segmented control selection",
      note: "The pill slides to the selected segment.",
      rows: axis("size", ["sm", "md"]),
      groups: axis("value", ["day", "week", "month"]),
      states: ["default"],
      render: (p) => <Segments options={views} initial={p.value} size={p.size as SegmentedControlProps<string>["size"]} label="Calendar view" />,
    }),
    list({
      title: "Options",
      note: "Two to five options with short labels. A label can carry an icon.",
      items: [
        {
          label: "Two options",
          code: "<SegmentedControl options={[…2]} />",
          render: () => (
            <Segments
              label="Appointments"
              initial="upcoming"
              options={[
                { value: "upcoming", label: "Upcoming" },
                { value: "past", label: "Past" },
              ]}
            />
          ),
        },
        {
          label: "Five options",
          code: "<SegmentedControl options={[…5]} />",
          render: () => (
            <Segments
              label="Result range"
              initial="3m"
              options={[
                { value: "1m", label: "1 mo" },
                { value: "3m", label: "3 mo" },
                { value: "6m", label: "6 mo" },
                { value: "1y", label: "1 yr" },
                { value: "all", label: "All" },
              ]}
            />
          ),
        },
        {
          label: "With icons",
          code: "label: <><List /> List</>",
          render: () => (
            <Segments
              label="Layout"
              initial="list"
              options={[
                {
                  value: "list",
                  label: (
                    <span className="flex items-center gap-1.5">
                      <List className="size-4" /> List
                    </span>
                  ),
                },
                {
                  value: "calendar",
                  label: (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-4" /> Calendar
                    </span>
                  ),
                },
              ]}
            />
          ),
        },
      ],
    }),
  ],
};
