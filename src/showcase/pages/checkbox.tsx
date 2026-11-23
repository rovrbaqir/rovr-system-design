import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function SelectAllResults() {
  const results = ["Lipid panel, 12 Nov", "HbA1c, 12 Nov", "Complete blood count, 28 Oct"];
  const [checked, setChecked] = React.useState<string[]>([results[0]]);
  const all = checked.length === results.length;
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-3 text-body font-medium">
        <Checkbox checked={all} indeterminate={checked.length > 0 && !all} onCheckedChange={(on) => setChecked(on ? results : [])} /> Share all results
      </label>
      <div className="flex flex-col gap-3 pl-8">
        {results.map((r) => (
          <label key={r} className="flex items-center gap-3 text-body">
            <Checkbox checked={checked.includes(r)} onCheckedChange={(on) => setChecked((list) => (on ? [...list, r] : list.filter((x) => x !== r)))} /> {r}
          </label>
        ))}
      </div>
    </div>
  );
}

function ConsentCheckbox() {
  const [agreed, setAgreed] = React.useState(false);
  const [tried, setTried] = React.useState(true);
  const invalid = tried && !agreed;
  return (
    <div className="flex max-w-md flex-col items-start gap-3">
      <label className="flex items-start gap-3 text-body">
        <Checkbox checked={agreed} onCheckedChange={setAgreed} aria-invalid={invalid} className={invalid ? "border-destructive" : undefined} />
        <span>I agree to a video visit and understand it is not for emergencies.</span>
      </label>
      {invalid && <p className="pl-8 text-body-sm text-destructive-fg">Tick the box to confirm before you join.</p>}
      <Button size="sm" className="ml-8" onClick={() => setTried(true)}>
        Join visit
      </Button>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="checkbox-basic" files={["ui/checkbox"]} title="Checked and unchecked" note="Wrap the checkbox and its text in a label so the words are clickable too. The tick draws itself." className="flex-col items-start">
        <label className="flex items-center gap-3 text-body">
          <Checkbox defaultChecked /> Send me appointment reminders
        </label>
        <label className="flex items-center gap-3 text-body">
          <Checkbox /> Share results with my care team
        </label>
      </Demo>
      <Demo id="checkbox-indeterminate" files={["ui/checkbox"]} title="Indeterminate" note="A parent checkbox shows a dash when only some of its children are ticked. Controlled with checked and onCheckedChange." className="items-start">
        <SelectAllResults />
      </Demo>
      <Demo id="checkbox-disabled" files={["ui/checkbox"]} title="Disabled" note="Mute the label as well and say why the option is unavailable." className="flex-col items-start">
        <label className="flex items-center gap-3 text-body text-muted-foreground">
          <Checkbox disabled /> Paper statements (unavailable on this plan)
        </label>
        <label className="flex items-center gap-3 text-body text-muted-foreground">
          <Checkbox disabled defaultChecked /> Security alerts (always on)
        </label>
      </Demo>
      <Demo id="checkbox-consent" files={["ui/checkbox", "ui/button"]} title="Required consent" note="An unticked required box gets a red border and a message that says what to do." className="items-start">
        <ConsentCheckbox />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "checkbox",
  title: "Checkbox",
  group: "Components",
  summary: "Turns one option on or off, or picks any number from a list. For a setting that takes effect immediately, use a Switch.",
  keywords: "tick check box multi-select consent indeterminate",
  Body,
};
