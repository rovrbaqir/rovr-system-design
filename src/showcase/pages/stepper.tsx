import * as React from "react";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function BookingStepper() {
  const [step, setStep] = React.useState(1);
  const steps = [{ label: "Reason for visit" }, { label: "Choose a time" }, { label: "Insurance" }, { label: "Confirm" }];
  return (
    <div className="flex w-full flex-col items-start gap-6">
      <Stepper current={step} steps={steps} />
      <p className="text-body text-muted-foreground" aria-live="polite">
        {step < steps.length ? `Step ${step + 1} of ${steps.length}: ${steps[step].label}.` : "All steps complete. Your visit is booked."}
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={step === steps.length} onClick={() => setStep((s) => s + 1)}>
          {step >= steps.length - 1 ? "Confirm" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="stepper-basic" files={["ui/stepper", "ui/button"]} title="Controlled" note="current is the zero-based index of the step in progress. Earlier steps show a tick and the line between them fills. Set it to the number of steps to mark them all done." className="items-start">
        <BookingStepper />
      </Demo>
      <Demo id="stepper-descriptions" files={["ui/stepper"]} title="With descriptions" note="A second line under each label says what the step holds or what was entered." className="items-start">
        <Stepper
          current={2}
          steps={[
            { label: "Details", description: "Amara Osei, 14 Apr 1988" },
            { label: "Insurance", description: "Aetna PPO" },
            { label: "Medical history", description: "About 4 minutes" },
            { label: "Consent", description: "2 forms to sign" },
          ]}
        />
      </Demo>
      <Demo id="stepper-states" files={["ui/stepper"]} title="Start and finish" note="The first step in progress, and every step complete." className="flex-col items-stretch gap-8">
        <Stepper current={0} steps={[{ label: "Order" }, { label: "Collection" }, { label: "Results" }]} aria-label="Lab order, just started" />
        <Stepper current={3} steps={[{ label: "Order" }, { label: "Collection" }, { label: "Results" }]} aria-label="Lab order, complete" />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "stepper",
  title: "Stepper",
  group: "Components",
  summary: "Shows where someone is in a multi-step flow such as intake or booking. It displays progress only: the Back and Continue buttons are yours.",
  keywords: "steps wizard progress multi-step flow onboarding",
  Body,
};
