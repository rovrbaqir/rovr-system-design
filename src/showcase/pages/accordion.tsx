import * as React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const sections = ["history", "medications", "allergies"];

function ControlledAccordion() {
  const [open, setOpen] = React.useState<string[]>(["history"]);
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => setOpen(sections)}>
          Expand all
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setOpen([])}>
          Collapse all
        </Button>
      </div>
      <Accordion multiple value={open} onValueChange={(value) => setOpen(value as string[])}>
        <AccordionItem value="history">
          <AccordionTrigger>Medical history</AccordionTrigger>
          <AccordionContent>Hyperlipidaemia, diagnosed 2024. Appendicectomy, 2011. No hospital admissions in the last five years.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="medications">
          <AccordionTrigger>Medications</AccordionTrigger>
          <AccordionContent>Atorvastatin 20 mg, one tablet every morning. Vitamin D 1,000 IU daily.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="allergies">
          <AccordionTrigger>Allergies</AccordionTrigger>
          <AccordionContent>Penicillin: rash. No known food allergies.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="accordion-basic" files={["ui/accordion"]} title="Questions and answers" note="One panel is open at a time; opening another closes it. The plus turns into a cross." className="items-start">
        <Accordion className="w-full">
          <AccordionItem value="prep">
            <AccordionTrigger>How do I prepare for a video visit?</AccordionTrigger>
            <AccordionContent>
              Find a quiet, well-lit place and open this page five minutes early. Have your medication list and any home readings to hand.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="results">
            <AccordionTrigger>When will I see my lab results?</AccordionTrigger>
            <AccordionContent>Most results are released within two business days. Your clinician may add a note explaining what they mean.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="billing">
            <AccordionTrigger>What will this visit cost?</AccordionTrigger>
            <AccordionContent>Your copay is shown before you confirm. Anything your plan does not cover appears under Payments after the visit.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Demo>
      <Demo id="accordion-multiple" files={["ui/accordion"]} title="Several open" note="multiple lets panels stay open side by side, and defaultValue opens some from the start. A disabled item cannot be opened." className="items-start">
        <Accordion multiple defaultValue={["fasting", "bring"]} className="w-full">
          <AccordionItem value="fasting">
            <AccordionTrigger>Fasting</AccordionTrigger>
            <AccordionContent>Do not eat or drink anything except water for 10 hours before your lipid panel.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="bring">
            <AccordionTrigger>What to bring</AccordionTrigger>
            <AccordionContent>Photo ID, your insurance card and the order number LB-2041-7731.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="after">
            <AccordionTrigger>After the test</AccordionTrigger>
            <AccordionContent>You can eat straight away. Keep the dressing on for an hour.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="results" disabled>
            <AccordionTrigger className="data-[disabled]:cursor-default data-[disabled]:text-muted-foreground">Results, available after collection</AccordionTrigger>
            <AccordionContent>Results appear here as soon as the lab releases them.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Demo>
      <Demo id="accordion-controlled" files={["ui/accordion", "ui/button"]} title="Controlled" note="value and onValueChange hold the open panels as an array of item values, so buttons elsewhere can open and close them." className="items-start">
        <ControlledAccordion />
      </Demo>
      <Demo id="accordion-rich-content" files={["ui/accordion", "ui/badge"]} title="Richer rows" note="The trigger can carry a status next to its words, and the panel can hold more than text." className="items-start">
        <Accordion className="w-full" defaultValue={["lipid"]}>
          <AccordionItem value="lipid">
            <AccordionTrigger>
              <span className="flex flex-1 items-center justify-between gap-3">
                Lipid panel
                <Badge tone="success">Final</Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2">
                <dt>LDL cholesterol</dt>
                <dd className="text-foreground text-data">128 mg/dL</dd>
                <dt>HDL cholesterol</dt>
                <dd className="text-foreground text-data">54 mg/dL</dd>
                <dt>Triglycerides</dt>
                <dd className="text-foreground text-data">142 mg/dL</dd>
              </dl>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="hba1c">
            <AccordionTrigger>
              <span className="flex flex-1 items-center justify-between gap-3">
                HbA1c
                <Badge tone="warning">Awaiting results</Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>Collected 12 November at 08:14. Most results are released within two business days.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "accordion",
  title: "Accordion",
  group: "Components",
  summary: "A stack of headings that each open a panel. Use it for questions and answers and for long records where people need one or two sections at a time.",
  keywords: "faq expand collapse disclosure sections panels",
  Body,
};
