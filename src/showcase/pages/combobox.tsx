import * as React from "react";
import { Combobox, MultiCombobox, type ComboboxItem } from "@/components/ui/combobox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const clinicians: ComboboxItem[] = [
  { value: "okafor", label: "Dr. Ngozi Okafor", description: "Internal medicine" },
  { value: "whitfield", label: "Dr. Sam Whitfield", description: "Cardiology" },
  { value: "haddad", label: "Dr. Leila Haddad", description: "Endocrinology" },
  { value: "brandt", label: "Dr. Marcus Brandt", description: "Family medicine" },
  { value: "iyer", label: "Dr. Kavya Iyer", description: "Dermatology", disabled: true },
  { value: "sato", label: "Dr. Hiro Sato", description: "Orthopaedics" },
  { value: "moreau", label: "Elise Moreau, NP", description: "Primary care" },
];

const panels: ComboboxItem[] = [
  { value: "cmp", label: "Comprehensive metabolic panel" },
  { value: "lipid", label: "Lipid panel" },
  { value: "cbc", label: "Complete blood count" },
  { value: "a1c", label: "HbA1c" },
  { value: "tsh", label: "TSH" },
  { value: "vitd", label: "Vitamin D, 25-hydroxy" },
  { value: "ferritin", label: "Ferritin" },
];

const pharmacies: ComboboxItem[] = [
  { value: "walgreens", label: "Walgreens, 825 Market St" },
  { value: "cvs", label: "CVS, 731 Market St" },
  { value: "alto", label: "Alto Pharmacy, delivery" },
];

function ClinicianCombobox() {
  const [who, setWho] = React.useState<ComboboxItem | null>(clinicians[0]);
  return (
    <Field className="max-w-sm">
      <FieldLabel>Clinician</FieldLabel>
      <Combobox aria-label="Clinician" items={clinicians} value={who} onValueChange={setWho} placeholder="Search by name or specialty" emptyText="No clinician by that name. Check the spelling." />
      <FieldDescription>{who ? `${who.label} sees patients for ${who.description?.toLowerCase()}.` : "Anyone available will be assigned."}</FieldDescription>
    </Field>
  );
}

function TestsCombobox() {
  const [tests, setTests] = React.useState<ComboboxItem[]>([panels[1], panels[3]]);
  return (
    <Field className="max-w-md">
      <FieldLabel>Tests to order</FieldLabel>
      <MultiCombobox aria-label="Tests to order" items={panels} value={tests} onValueChange={setTests} placeholder="Search lab tests" />
      <FieldDescription>{tests.length === 0 ? "No tests selected." : `${tests.length} selected. Backspace removes the last one.`}</FieldDescription>
    </Field>
  );
}

function RequiredCombobox() {
  const [pharmacy, setPharmacy] = React.useState<ComboboxItem | null>(null);
  return (
    <Field invalid={!pharmacy} className="max-w-sm">
      <FieldLabel>Pharmacy</FieldLabel>
      <Combobox aria-label="Pharmacy" items={pharmacies} value={pharmacy} onValueChange={setPharmacy} invalid={!pharmacy} placeholder="Search pharmacies" />
      <FieldError match={!pharmacy}>Choose a pharmacy before sending the prescription.</FieldError>
    </Field>
  );
}

function Body() {
  return (
    <>
      <Demo id="combobox-single" files={["ui/combobox", "ui/field"]} title="Single" note="Type to filter, arrow keys to move, Enter to choose. Items can carry a second line and can be disabled." className="items-start">
        <ClinicianCombobox />
      </Demo>
      <Demo id="combobox-multiple" files={["ui/combobox", "ui/field"]} title="Multiple" note="MultiCombobox turns each choice into a removable chip inside the field. The field grows as chips wrap." className="items-start">
        <TestsCombobox />
      </Demo>
      <Demo id="combobox-sizes" files={["ui/combobox"]} title="Sizes" note="Uncontrolled here, with defaultValue." className="flex-col items-stretch">
        <Combobox size="sm" aria-label="Pharmacy, small" items={pharmacies} defaultValue={pharmacies[0]} className="max-w-sm" />
        <Combobox aria-label="Pharmacy, medium" items={pharmacies} defaultValue={pharmacies[0]} className="max-w-sm" />
        <Combobox size="lg" aria-label="Pharmacy, large" items={pharmacies} defaultValue={pharmacies[0]} className="max-w-sm" />
      </Demo>
      <Demo id="combobox-states" files={["ui/combobox", "ui/field"]} title="Invalid and disabled" note="Choose a pharmacy to clear the error." className="items-start">
        <RequiredCombobox />
        <Field disabled className="max-w-sm">
          <FieldLabel>Referring clinician</FieldLabel>
          <Combobox aria-label="Referring clinician" items={clinicians} defaultValue={clinicians[1]} disabled />
          <FieldDescription>Taken from the referral letter.</FieldDescription>
        </Field>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "combobox",
  title: "Combobox",
  group: "Components",
  summary: "A searchable dropdown for long lists such as clinicians, lab tests or pharmacies. Combobox picks one item and MultiCombobox picks several.",
  keywords: "autocomplete typeahead searchable select multi-select multiselect dropdown",
  Body,
};
