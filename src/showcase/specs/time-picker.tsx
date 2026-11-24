import * as React from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { TimePicker } from "@/components/ui/time-picker";
import { type ComponentSpec, axis, list, matrix } from "./kit";

function Time({ initial, disabled, locale, label = "Start time" }: { initial: string | null; disabled?: boolean; locale?: string; label?: string }) {
  const [value, setValue] = React.useState<string | null>(initial);
  return <TimePicker aria-label={label} value={value} onValueChange={setValue} min="07:00" max="18:00" disabled={disabled} locale={locale} />;
}

export const spec: ComponentSpec = {
  slug: "time-picker",
  sections: [
    matrix({
      title: "Time picker",
      note: "The closed field, at the md control height. The list of times it opens is shown in the examples below.",
      rows: axis("value", ["empty", "filled"]),
      states: ["default", "hover", "focus", "disabled"],
      render: (p, s) => (
        <div className="w-44">
          <Time initial={p.value === "filled" ? "09:30" : null} disabled={s.disabled} />
        </div>
      ),
    }),
    list({
      title: "Content",
      note: "locale sets how the time reads. The value is always HH:mm in 24-hour time.",
      items: [
        {
          label: "12-hour",
          code: '<TimePicker value="14:00" />',
          render: () => (
            <div className="w-44">
              <Time initial="14:00" />
            </div>
          ),
        },
        {
          label: "24-hour",
          code: '<TimePicker value="14:00" locale="en-GB" />',
          render: () => (
            <div className="w-44">
              <Time initial="14:00" locale="en-GB" />
            </div>
          ),
        },
        {
          label: "In a field",
          code: "<Field><FieldLabel /><TimePicker /></Field>",
          render: () => (
            <div className="w-56">
              <Field>
                <FieldLabel>Blood draw time</FieldLabel>
                <Time initial="07:30" label="Blood draw time" />
                <FieldDescription>Fasting draws run from 7:00 to 11:00 AM.</FieldDescription>
              </Field>
            </div>
          ),
        },
      ],
    }),
  ],
};
