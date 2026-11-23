import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldLabel, Label } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const visitTypes = [
  { value: "annual", label: "Annual physical" },
  { value: "follow-up", label: "Follow-up" },
  { value: "labs", label: "Lab review" },
  { value: "urgent", label: "Same-day sick visit" },
];

function MemberIdField() {
  const [id, setId] = React.useState("RVR-2041");
  const invalid = !/^RVR-\d{4}-\d{5}$/.test(id);
  return (
    <Field invalid={invalid} className="max-w-sm">
      <FieldLabel>Member ID</FieldLabel>
      <Input value={id} onChange={(e) => setId(e.target.value)} aria-invalid={invalid} className="text-data" />
      <FieldError match={invalid}>Enter the full ID from your card, such as RVR-2041-88317.</FieldError>
    </Field>
  );
}

function BookingForm() {
  return (
    <form className="grid w-full gap-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
      <Field>
        <FieldLabel>Full name</FieldLabel>
        <Input defaultValue="Amara Osei" autoComplete="off" />
      </Field>
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
      <Field className="sm:col-span-2">
        <FieldLabel optional>Anything your clinician should know</FieldLabel>
        <Textarea placeholder="Symptoms, questions, changes since your last visit" rows={3} />
        <FieldDescription>Dr. Okafor reads this before the visit.</FieldDescription>
      </Field>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button variant="secondary">Back</Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}

function Body() {
  return (
    <>
      <Demo id="field-anatomy" files={["ui/field", "ui/input"]} title="Label and help text" note="The label sits above the control and help text below. Field connects them, so a screen reader reads both." className="items-start">
        <Field className="max-w-sm">
          <FieldLabel>Preferred pharmacy</FieldLabel>
          <Input defaultValue="Walgreens, 825 Market St" />
          <FieldDescription>Prescriptions are sent here unless you choose another at checkout.</FieldDescription>
        </Field>
        <Field className="max-w-sm">
          <FieldLabel optional>Preferred name</FieldLabel>
          <Input placeholder="What should we call you?" />
        </Field>
      </Demo>
      <Demo id="field-error" files={["ui/field", "ui/input"]} title="Error" note="Pass invalid to the Field and show a FieldError. The message slides in under the control and says what to type. Complete the ID to clear it." className="items-start">
        <MemberIdField />
      </Demo>
      <Demo id="field-disabled" files={["ui/field", "ui/input"]} title="Disabled" note="Disabling the Field dims its label and disables the control inside it." className="items-start">
        <Field disabled className="max-w-sm">
          <FieldLabel>Primary clinician</FieldLabel>
          <Input defaultValue="Dr. Ngozi Okafor" />
          <FieldDescription>Assigned by the clinic. Ask the front desk to change it.</FieldDescription>
        </Field>
      </Demo>
      <Demo id="field-plain-label" files={["ui/field", "ui/checkbox", "ui/input"]} title="Plain label" note="Label is for a control used outside a Field, such as a checkbox row or a field in a toolbar." className="flex-col items-start gap-4">
        <Label className="flex items-center gap-3">
          <Checkbox defaultChecked /> Share results with my care team
        </Label>
        <div className="flex w-full max-w-sm flex-col gap-1.5">
          <Label htmlFor="field-plain-mrn">MRN</Label>
          <Input id="field-plain-mrn" defaultValue="20418" className="text-data" />
        </div>
      </Demo>
      <Demo id="field-form" files={["ui/field", "ui/input", "ui/select", "ui/button"]} title="In a form" note="Input, Select and Textarea share one border and focus ring, so a form reads as one object." className="items-start">
        <BookingForm />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "field",
  title: "Field",
  group: "Components",
  summary: "Field groups a label, a control, help text and an error message, and wires up the ids and aria attributes between them. Wrap every form control in one.",
  keywords: "form label help text error message validation description",
  Body,
};
