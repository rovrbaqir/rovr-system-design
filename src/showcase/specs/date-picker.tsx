import * as React from "react";
import type { DateRange } from "@/components/ui/calendar";
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { type ComponentSpec, axis, list, matrix } from "./kit";

type Size = "sm" | "md" | "lg";
interface TriggerProps {
  size?: Size;
  invalid?: boolean;
  disabled?: boolean;
}

function Single({ initial, format, ...trigger }: TriggerProps & { initial: Date | null; format?: Intl.DateTimeFormatOptions }) {
  const [value, setValue] = React.useState<Date | null>(initial);
  return <DatePicker aria-label="Visit date" value={value} onValueChange={setValue} format={format} {...trigger} />;
}

function Range({ initial, ...trigger }: TriggerProps & { initial: DateRange }) {
  const [value, setValue] = React.useState<DateRange>(initial);
  return <DateRangePicker aria-label="Reporting period" value={value} onValueChange={setValue} {...trigger} />;
}

const day = new Date(2026, 10, 12);
const period: DateRange = { from: new Date(2026, 10, 2), to: new Date(2026, 10, 27) };
const states = ["default", "hover", "focus", "invalid", "disabled"] as const;

export const spec: ComponentSpec = {
  slug: "date-picker",
  sections: [
    matrix({
      title: "Date picker",
      note: "The closed field. size matches Input. The calendar it opens is shown in the examples below.",
      rows: axis("size", ["sm", "md", "lg"]),
      groups: axis("value", ["empty", "filled"]),
      states,
      render: (p, s) => (
        <div className="w-48">
          <Single size={p.size as Size} initial={p.value === "filled" ? day : null} invalid={s.is("invalid")} disabled={s.disabled} />
        </div>
      ),
    }),
    matrix({
      title: "Date range picker",
      note: "Takes and returns an object with from and to.",
      rows: axis("size", ["sm", "md", "lg"]),
      groups: axis("value", ["empty", "filled"]),
      states,
      render: (p, s) => (
        <div className="w-56">
          <Range size={p.size as Size} initial={p.value === "filled" ? period : { from: null, to: null }} invalid={s.is("invalid")} disabled={s.disabled} />
        </div>
      ),
    }),
    list({
      title: "Content",
      note: "format takes Intl.DateTimeFormat options. A range with only a start asks for the end date.",
      items: [
        {
          label: "Long format",
          code: '<DatePicker format={{ dateStyle: "full" }} />',
          render: () => (
            <div className="w-72">
              <Single initial={day} format={{ dateStyle: "full" }} />
            </div>
          ),
        },
        {
          label: "Range, start only",
          code: "<DateRangePicker value={{ from, to: null }} />",
          render: () => (
            <div className="w-56">
              <Range initial={{ from: period.from, to: null }} />
            </div>
          ),
        },
        {
          label: "Range across months",
          code: "<DateRangePicker value={{ from, to }} />",
          render: () => (
            <div className="w-56">
              <Range initial={{ from: new Date(2026, 9, 19), to: new Date(2026, 10, 27) }} />
            </div>
          ),
        },
        {
          label: "In a field",
          code: "<Field><FieldLabel /><DatePicker /></Field>",
          render: () => (
            <div className="w-64">
              <Field>
                <FieldLabel>Collection date</FieldLabel>
                <Single initial={day} />
                <FieldDescription>The day your blood sample was taken.</FieldDescription>
              </Field>
            </div>
          ),
        },
        {
          label: "With error text",
          code: "<DatePicker invalid />",
          render: () => (
            <div className="flex w-64 flex-col gap-1.5">
              <Single initial={null} invalid />
              <p className="text-body-sm text-destructive-fg">Choose the day the sample was collected.</p>
            </div>
          ),
        },
      ],
    }),
  ],
};
