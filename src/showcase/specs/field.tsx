import { Field, FieldDescription, FieldError, FieldLabel, Label } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { NumberField } from "@/components/ui/number-field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const visitTypes = [
  { value: "new", label: "New patient visit" },
  { value: "follow-up", label: "Follow-up" },
  { value: "annual", label: "Annual physical" },
];

export const spec: ComponentSpec = {
  slug: "field",
  sections: [
    matrix({
      title: "Field",
      note: "A label, a control and help text. When invalid, the error says what is wrong and how to fix it.",
      rows: axis("description", ["false", "true"]),
      groups: axis("optional", ["false", "true"]),
      states: ["default", "hover", "focus", "invalid", "disabled"],
      render: (p, s) => (
        <div className="w-64">
          <Field invalid={s.is("invalid")} disabled={s.disabled}>
            <FieldLabel optional={p.optional === "true"}>Member ID</FieldLabel>
            <Input defaultValue={s.is("invalid") ? "RVR-2041" : "RVR-2041-88317"} aria-invalid={s.is("invalid") || undefined} disabled={s.disabled} className="text-data" />
            {p.description === "true" && <FieldDescription>Printed on the front of your insurance card.</FieldDescription>}
            <FieldError match={s.is("invalid")}>Enter the full ID from your card, such as RVR-2041-88317.</FieldError>
          </Field>
        </div>
      ),
    }),
    list({
      title: "Controls",
      note: "Field works with any control. Label is the plain label for a control outside a Field.",
      items: [
        {
          label: "Input",
          code: "<Field><FieldLabel /><Input /></Field>",
          render: () => (
            <div className="w-64">
              <Field>
                <FieldLabel>Preferred pharmacy</FieldLabel>
                <Input defaultValue="Walgreens, 825 Market St" />
                <FieldDescription>Prescriptions are sent here unless you choose another at checkout.</FieldDescription>
              </Field>
            </div>
          ),
        },
        {
          label: "Select",
          code: "<Field><FieldLabel /><Select /></Field>",
          render: () => (
            <div className="w-64">
              <Field>
                <FieldLabel>Visit type</FieldLabel>
                <Select defaultValue="follow-up" items={visitTypes}>
                  <SelectTrigger placeholder="Choose a visit type" />
                  <SelectContent>
                    {visitTypes.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          ),
        },
        {
          label: "Textarea",
          code: "<FieldLabel optional />",
          render: () => (
            <div className="w-64">
              <Field>
                <FieldLabel optional>Anything your clinician should know</FieldLabel>
                <Textarea placeholder="Symptoms, questions, changes since your last visit" rows={3} />
                <FieldDescription>Dr. Okafor reads this before the visit.</FieldDescription>
              </Field>
            </div>
          ),
        },
        {
          label: "Number field",
          code: "<Field><FieldLabel /><NumberField /></Field>",
          render: () => (
            <Field className="w-auto">
              <FieldLabel>Refills</FieldLabel>
              <NumberField defaultValue={3} min={0} max={12} />
              <FieldDescription>Up to 12 on this prescription.</FieldDescription>
            </Field>
          ),
        },
        {
          label: "Plain label",
          code: '<Label htmlFor="mrn" />',
          render: () => (
            <div className="flex w-64 flex-col gap-1.5">
              <Label htmlFor="spec-field-mrn">Medical record number</Label>
              <Input id="spec-field-mrn" defaultValue="20418" className="text-data" />
            </div>
          ),
        },
      ],
    }),
  ],
};
