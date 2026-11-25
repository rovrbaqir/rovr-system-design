import * as React from "react";
import { ChipListField, type ChipListValue } from "@/components/patterns/chip-list-field";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const allergies = ["None", "Penicillin", "Sulfa drugs", "Aspirin", "Ibuprofen", "Latex", "Peanuts", "Shellfish", "Eggs", "Pollen", "Other"];
const surgeries = ["None", "Appendectomy", "Tonsillectomy", "Gallbladder removal", "Cesarean section", "Knee arthroscopy", "Hernia repair", "Cataract surgery", "Other"];
const conditions = [
  "None",
  "High blood pressure",
  "High cholesterol",
  "Type 2 diabetes",
  "Asthma",
  "Underactive thyroid",
  "Gastroesophageal reflux disease",
  "Obstructive sleep apnea",
  "Chronic kidney disease",
  "Other",
];

function Allergies() {
  const [value, setValue] = React.useState<ChipListValue[]>(["Penicillin", "Latex"]);
  return <ChipListField label="Allergies" options={allergies} value={value} onChange={setValue} placeholder="Other allergy" className="mt-0" />;
}

function Surgeries() {
  const [value, setValue] = React.useState<ChipListValue[]>([
    ["Appendectomy", "2014"],
    ["Knee arthroscopy", ""],
  ]);
  return <ChipListField label="Surgeries" options={surgeries} value={value} onChange={setValue} hasYear placeholder="Other surgery" className="mt-0" />;
}

function Conditions() {
  const [value, setValue] = React.useState<ChipListValue[]>(["High cholesterol"]);
  return <ChipListField label="Conditions" options={conditions} value={value} onChange={setValue} variant="wide" height="240px" className="mt-0" />;
}

function Unanswered() {
  const [value, setValue] = React.useState<ChipListValue[]>([]);
  return <ChipListField label="Allergies" options={allergies} value={value} onChange={setValue} error={value.length === 0} className="mt-0" />;
}

function Body() {
  return (
    <>
      <Demo id="chip-list-field-basic" files={["patterns/chip-list-field", "ui/button", "ui/chip", "ui/field", "ui/input", "ui/scroll-area"]} title="Options and chips" note="Pick from the list and each choice becomes a chip. The list scrolls inside 180px and fades at both ends. None clears the rest. Other opens a text input with an Add button." className="items-start">
        <Allergies />
      </Demo>
      <Demo id="chip-list-field-year" files={["patterns/chip-list-field", "ui/button", "ui/chip", "ui/field", "ui/input", "ui/scroll-area"]} title="With a year" note="For surgeries and diagnoses each chip carries a year input. It takes four digits between 1900 and this year." className="items-start">
        <Surgeries />
      </Demo>
      <Demo id="chip-list-field-wide" files={["patterns/chip-list-field", "ui/button", "ui/chip", "ui/field", "ui/input", "ui/scroll-area"]} title="Wide, with a taller list" note="The wide variant gives the label less room and the options a minimum width, for long option names. Height sets how much of the list shows." className="items-start">
        <Conditions />
      </Demo>
      <Demo id="chip-list-field-error" files={["patterns/chip-list-field", "ui/button", "ui/chip", "ui/field", "ui/input", "ui/scroll-area"]} title="Error" note="When the question was skipped the label turns red. Choose an option to clear it." className="items-start">
        <Unanswered />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "chip-list-field",
  title: "Chip list field",
  group: "Examples",
  summary: "Patient app. Replaces ScrollableField. A pick-many question in clinical intake: a label, a short scrolling list of options with a free-text Other, and the answers as removable chips. Used for allergies, conditions and surgeries.",
  keywords: "scrollable field multi select tags intake allergies conditions surgeries year other",
  Body,
};
