import * as React from "react";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/tag-input";
import { Textarea } from "@/components/ui/input";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Allergies() {
  const [allergies, setAllergies] = React.useState(["Penicillin", "Latex"]);
  return (
    <div className="flex w-full max-w-md flex-col gap-1.5">
      <span className="text-label">Allergies</span>
      <TagInput aria-label="Allergies" value={allergies} onValueChange={setAllergies} placeholder="Type an allergy and press Enter" />
      <p className="text-body-sm text-muted-foreground">Press Enter or a comma to add. Backspace removes the last one.</p>
    </div>
  );
}

function DiagnosisCodes() {
  const [codes, setCodes] = React.useState(["E78.5", "I10"]);
  return (
    <div className="flex w-full max-w-md flex-col gap-1.5">
      <span className="text-label">Diagnosis codes</span>
      <TagInput
        aria-label="Diagnosis codes"
        value={codes}
        onValueChange={setCodes}
        placeholder="ICD-10 code"
        validate={(tag) => (/^[A-Z]\d{2}(\.\d{1,4})?$/.test(tag) ? null : `${tag} is not an ICD-10 code. Use a letter, two digits and an optional decimal, such as E11.9.`)}
      />
    </div>
  );
}

function ShareSummary() {
  const [to, setTo] = React.useState(["ngozi.okafor@missionclinic.org"]);
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-label">Send to</span>
        <TagInput
          aria-label="Recipients"
          value={to}
          onValueChange={setTo}
          placeholder="name@example.com"
          validate={(tag) => (/^\S+@\S+\.\S+$/.test(tag) ? null : "Enter a full email address, such as name@example.com.")}
        />
      </div>
      <Textarea aria-label="Message" rows={3} defaultValue="Sharing my visit summary from 12 November ahead of the cardiology referral." />
      <Button className="self-end" disabled={to.length === 0}>
        Share summary
      </Button>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="tag-input-basic" files={["ui/tag-input"]} title="Default" note="Each entry becomes a tag with its own remove button. The same entry cannot be added twice: try Latex again." className="items-start">
        <Allergies />
      </Demo>
      <Demo id="tag-input-validate" files={["ui/tag-input"]} title="Validation" note="validate returns a message to reject an entry, or null to accept it. Try typing 'cholesterol'." className="items-start">
        <DiagnosisCodes />
      </Demo>
      <Demo id="tag-input-recipients" files={["ui/tag-input", "ui/input", "ui/button"]} title="Recipients" note="A share form: the action stays disabled until there is at least one valid address." className="items-start">
        <ShareSummary />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "tag-input",
  title: "Tag input",
  group: "Components",
  summary: "Free-text entries collected as tags: allergies, diagnosis codes, email recipients. When the options are known in advance, use a MultiCombobox instead.",
  keywords: "tags tokens chips multi-value pills recipients labels",
  Body,
};
