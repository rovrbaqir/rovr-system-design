import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const visitTypes = [
  { value: "new", label: "New patient visit" },
  { value: "follow-up", label: "Follow-up" },
  { value: "annual", label: "Annual physical" },
  { value: "urgent", label: "Same-day sick visit" },
];

type Size = "sm" | "md" | "lg";

function VisitType({ size, value, invalid, disabled }: { size?: Size; value?: string; invalid?: boolean; disabled?: boolean }) {
  return (
    <Select defaultValue={value} items={visitTypes} disabled={disabled}>
      <SelectTrigger size={size} placeholder="Choose a visit type" aria-label="Visit type" aria-invalid={invalid || undefined} />
      <SelectContent>
        {visitTypes.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export const spec: ComponentSpec = {
  slug: "select",
  sections: [
    matrix({
      title: "Select trigger",
      note: "The closed control. size matches Input, so the two line up in a form. The open list is shown in the examples below.",
      rows: axis("size", ["sm", "md", "lg"]),
      groups: axis("value", ["empty", "filled"]),
      states: ["default", "hover", "focus", "invalid", "disabled"],
      render: (p, s) => (
        <div className="w-52">
          <VisitType size={p.size as Size} value={p.value === "filled" ? "follow-up" : undefined} invalid={s.is("invalid")} disabled={s.disabled} />
        </div>
      ),
    }),
    list({
      title: "In a field",
      note: "Field adds the label, help text and the error message.",
      items: [
        {
          label: "With label",
          code: "<Field><FieldLabel /><Select /></Field>",
          render: () => (
            <div className="w-64">
              <Field>
                <FieldLabel>Visit type</FieldLabel>
                <VisitType value="follow-up" />
              </Field>
            </div>
          ),
        },
        {
          label: "With description",
          code: "<FieldDescription />",
          render: () => (
            <div className="w-64">
              <Field>
                <FieldLabel>Visit type</FieldLabel>
                <VisitType value="annual" />
                <FieldDescription>We hold 40 minutes for this visit.</FieldDescription>
              </Field>
            </div>
          ),
        },
        {
          label: "With error text",
          code: "<Field invalid><FieldError /></Field>",
          render: () => (
            <div className="w-64">
              <Field invalid>
                <FieldLabel>Visit type</FieldLabel>
                <VisitType invalid />
                <FieldError match>Choose a visit type so we can hold the right amount of time.</FieldError>
              </Field>
            </div>
          ),
        },
        {
          label: "Disabled",
          code: "<Field disabled><Select disabled /></Field>",
          render: () => (
            <div className="w-64">
              <Field disabled>
                <FieldLabel>Visit type</FieldLabel>
                <VisitType value="new" disabled />
                <FieldDescription>Set by the clinic for your first visit.</FieldDescription>
              </Field>
            </div>
          ),
        },
      ],
    }),
  ],
};
