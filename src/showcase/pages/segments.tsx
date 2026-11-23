import * as React from "react";
import { Button } from "@/components/ui/button";
import { Frost } from "@/components/ui/frost";
import { Segments } from "@/components/ui/segments";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const intakeSteps = ["About you", "Insurance", "Medical history", "Medications", "Consent", "Review"];

function IntakeSteps() {
  const [step, setStep] = React.useState(2);
  const done = step >= intakeSteps.length;
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-title-sm">{done ? "Intake complete" : intakeSteps[step]}</p>
          <p className="text-body-sm text-muted-foreground text-data">
            {Math.min(step, intakeSteps.length)} of {intakeSteps.length}
          </p>
        </div>
        <Segments value={step} total={intakeSteps.length} label="Intake steps" />
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={done} onClick={() => setStep((s) => s + 1)}>
          {step === intakeSteps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="segments-basic" files={["ui/segments"]} title="Steps done" note="One segment per step. It reads as 3 of 9 at a glance, where a continuous bar would only say about a third. The label names what is counted for screen readers." className="flex-col items-stretch gap-5">
        <Segments value={1} total={3} label="Kick-off steps" />
        <Segments value={3} total={9} label="Setup steps" />
        <Segments value={6} total={6} label="Intake steps" />
        <Segments value={0} total={4} label="Pre-visit steps" />
      </Demo>
      <Demo id="segments-on-aurora" files={["ui/segments", "ui/frost"]} title="On the aurora" note="The on-aurora tone is white for the rich brand surface and for glass panes on it." bare className="items-stretch">
        <div className="flex w-full flex-wrap items-end justify-between gap-4 rounded-xl rovr-aurora p-card">
          <div className="flex min-w-56 flex-1 flex-col gap-3">
            <p className="text-title-lg">Getting ready for your first visit</p>
            <Segments value={5} total={9} label="Setup steps" tone="on-aurora" />
          </div>
          <Frost className="w-56">
            <p className="text-caption text-white/70">Setup</p>
            <p className="text-title-lg text-data">56%</p>
            <Segments className="mt-2" value={5} total={9} label="Setup steps" tone="on-aurora" />
          </Frost>
        </div>
      </Demo>
      <Demo id="segments-controlled" files={["ui/segments", "ui/button"]} title="Through a flow" note="Pair it with the name of the current step and the count in figures. Segments fill as the value changes." className="items-start">
        <IntakeSteps />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "segments",
  title: "Segments",
  group: "Components",
  summary: "Progress as a row of equal segments, one per step. Use it when the number of steps is small and known; use Progress for a percentage.",
  keywords: "steps progress segmented bar onboarding setup count",
  Body,
};
