import * as React from "react";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function VisitFormat() {
  const [format, setFormat] = React.useState("video");
  const detail = { video: "The video room opens 10 minutes before your visit.", clinic: "Mission St Clinic, 410 Mission St, Suite 2.", phone: "Dr. Okafor will call the number on file." }[format];
  return (
    <div className="flex flex-col gap-4">
      <RadioGroup value={format} onValueChange={(v) => setFormat(v as string)} aria-label="Visit format">
        <label className="flex items-center gap-3 text-body">
          <Radio value="video" /> Video visit
        </label>
        <label className="flex items-center gap-3 text-body">
          <Radio value="clinic" /> In clinic
        </label>
        <label className="flex items-center gap-3 text-body">
          <Radio value="phone" /> Phone call
        </label>
      </RadioGroup>
      <p className="text-body-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="radio-group-basic" files={["ui/radio-group"]} title="Controlled" note="Arrow keys move the choice. The dot springs in." className="items-start">
        <VisitFormat />
      </Demo>
      <Demo id="radio-group-horizontal" files={["ui/radio-group"]} title="Horizontal" note="For two or three short options, lay the group out in a row with a class.">
        <RadioGroup defaultValue="email" aria-label="Send reminders by" className="flex-row flex-wrap gap-6">
          <label className="flex items-center gap-3 text-body">
            <Radio value="email" /> Email
          </label>
          <label className="flex items-center gap-3 text-body">
            <Radio value="text" /> Text message
          </label>
          <label className="flex items-center gap-3 text-body">
            <Radio value="none" /> No reminders
          </label>
        </RadioGroup>
      </Demo>
      <Demo id="radio-group-descriptions" files={["ui/radio-group"]} title="With descriptions" note="A second line under each option explains the consequence of choosing it." className="items-start">
        <RadioGroup defaultValue="pickup" aria-label="How to receive your prescription" className="max-w-md gap-4">
          <label className="flex items-start gap-3">
            <Radio value="pickup" />
            <span className="flex flex-col gap-0.5">
              <span className="text-body font-medium">Pick up</span>
              <span className="text-body-sm text-muted-foreground">Ready tomorrow after 10:00 at Walgreens, 825 Market St.</span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <Radio value="delivery" />
            <span className="flex flex-col gap-0.5">
              <span className="text-body font-medium">Home delivery</span>
              <span className="text-body-sm text-muted-foreground">Arrives in 2 to 3 days. No delivery charge on your plan.</span>
            </span>
          </label>
        </RadioGroup>
      </Demo>
      <Demo id="radio-group-disabled" files={["ui/radio-group"]} title="Disabled" note="Disable one option, or the whole group." className="items-start gap-12">
        <RadioGroup defaultValue="morning" aria-label="Preferred time">
          <label className="flex items-center gap-3 text-body">
            <Radio value="morning" /> Morning
          </label>
          <label className="flex items-center gap-3 text-body">
            <Radio value="afternoon" /> Afternoon
          </label>
          <label className="flex items-center gap-3 text-body text-muted-foreground">
            <Radio value="evening" disabled /> Evening (no clinicians available)
          </label>
        </RadioGroup>
        <RadioGroup defaultValue="english" disabled aria-label="Interpreter language">
          <label className="flex items-center gap-3 text-body text-muted-foreground">
            <Radio value="english" /> English
          </label>
          <label className="flex items-center gap-3 text-body text-muted-foreground">
            <Radio value="spanish" /> Spanish
          </label>
        </RadioGroup>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "radio-group",
  title: "Radio group",
  group: "Components",
  summary: "Chooses exactly one of a few options that should all stay visible. For more than five options use a Select.",
  keywords: "radio button option single choice",
  Body,
};
