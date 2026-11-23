import * as React from "react";
import { Mail, Phone, Search } from "lucide-react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input, SearchInput, Textarea } from "@/components/ui/input";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function EmailInput() {
  const [email, setEmail] = React.useState("amara.osei@");
  const invalid = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);
  return (
    <Field invalid={invalid} className="max-w-sm">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={invalid} leading={<Mail />} />
      <FieldError match={invalid}>Enter a full address, such as name@example.com.</FieldError>
      {!invalid && <FieldDescription>We send visit summaries here.</FieldDescription>}
    </Field>
  );
}

function PatientSearch() {
  const [query, setQuery] = React.useState("Osei");
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (!query) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [query]);
  return <SearchInput aria-label="Search patients" placeholder="Search patients by name or MRN" value={query} onValueChange={setQuery} loading={loading} className="max-w-sm" />;
}

function Body() {
  return (
    <>
      <Demo id="input-sizes" files={["ui/input"]} title="Sizes" note="Medium is the default. Small fits toolbars and dense tables, large suits sign-in and kiosk screens." className="flex-col items-stretch">
        <Input size="sm" aria-label="Small" placeholder="Small" className="max-w-sm" />
        <Input aria-label="Medium" placeholder="Medium" className="max-w-sm" />
        <Input size="lg" aria-label="Large" placeholder="Large" className="max-w-sm" />
      </Demo>
      <Demo id="input-leading-and-trailing" files={["ui/input"]} title="Leading and trailing" note="An icon before the value says what the field holds. A unit after it saves the person from typing it." className="flex-col items-stretch">
        <Input aria-label="Phone number" type="tel" leading={<Phone />} defaultValue="(415) 555-0142" className="max-w-sm" />
        <Input aria-label="Weight" inputMode="decimal" defaultValue="68.4" trailing="kg" className="max-w-sm" />
        <Input aria-label="Find a lab test" leading={<Search />} placeholder="Find a lab test" className="max-w-sm" />
      </Demo>
      <Demo id="input-invalid" files={["ui/input", "ui/field"]} title="Invalid" note="Set aria-invalid and the border turns red. The message says how to fix it. Finish the address to clear the error." className="items-start">
        <EmailInput />
      </Demo>
      <Demo id="input-disabled" files={["ui/input", "ui/field"]} title="Disabled and read-only" note="Disabled fields sink into the page. Say why the value cannot be changed." className="items-start">
        <Field disabled className="max-w-sm">
          <FieldLabel>Member ID</FieldLabel>
          <Input disabled defaultValue="RVR-2041-88317" className="text-data" />
          <FieldDescription>Set by your plan. Contact support to change it.</FieldDescription>
        </Field>
        <Field className="max-w-sm">
          <FieldLabel>Date of birth</FieldLabel>
          <Input readOnly defaultValue="14 Apr 1988" className="text-data" />
        </Field>
      </Demo>
      <Demo id="input-textarea" files={["ui/input", "ui/field"]} title="Textarea" note="Textarea shares the input's border, focus ring and invalid state. It grows by dragging its corner." className="items-start">
        <Field className="max-w-lg">
          <FieldLabel optional>Anything your clinician should know</FieldLabel>
          <Textarea placeholder="Symptoms, questions, changes since your last visit" rows={3} />
        </Field>
        <Field className="max-w-lg">
          <FieldLabel>Visit note</FieldLabel>
          <Textarea rows={5} defaultValue="Follow-up for hyperlipidaemia. LDL 131 mg/dL on 12 November, down from 148. Tolerating atorvastatin 20 mg with no muscle pain. Recheck lipid panel in 12 weeks." />
        </Field>
      </Demo>
      <Demo id="input-search" files={["ui/input"]} title="Search input" note="SearchInput is controlled. A clear button appears once there is text, Escape clears it, and a spinner replaces the icon while results load.">
        <PatientSearch />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "input",
  title: "Input",
  group: "Components",
  summary: "A single-line text field in three sizes with room for an icon or a unit, plus Textarea for longer text and SearchInput for filtering lists.",
  keywords: "text field textarea search textbox form",
  Body,
};
