import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function ControlledCollapsible() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger>{open ? "Hide earlier readings" : "Show 3 earlier readings"}</CollapsibleTrigger>
      <CollapsibleContent>
        <dl className="grid max-w-xs grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-body-sm">
          <dt className="text-muted-foreground">14 August 2026</dt>
          <dd className="text-data">162 mg/dL</dd>
          <dt className="text-muted-foreground">9 May 2026</dt>
          <dd className="text-data">171 mg/dL</dd>
          <dt className="text-muted-foreground">2 February 2026</dt>
          <dd className="text-data">168 mg/dL</dd>
        </dl>
      </CollapsibleContent>
    </Collapsible>
  );
}

function Body() {
  return (
    <>
      <Demo id="collapsible-basic" files={["ui/collapsible"]} title="Show and hide" note="One label that reveals a little more in place. The chevron turns and the content grows in.">
        <Collapsible className="w-full">
          <CollapsibleTrigger>Show billing codes</CollapsibleTrigger>
          <CollapsibleContent className="text-body-sm text-muted-foreground">
            <span className="font-mono text-foreground">99214</span> Office visit, established patient, moderate complexity.{" "}
            <span className="font-mono text-foreground">E78.5</span> Hyperlipidaemia, unspecified.
          </CollapsibleContent>
        </Collapsible>
      </Demo>
      <Demo id="collapsible-default-open" files={["ui/collapsible"]} title="Open or disabled from the start" note="defaultOpen starts it open. disabled keeps it shut and stops the trigger responding." className="flex-col items-stretch gap-5">
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Preparation</CollapsibleTrigger>
          <CollapsibleContent className="text-body-sm text-muted-foreground">
            Do not eat or drink anything except water for 10 hours before your lipid panel.
          </CollapsibleContent>
        </Collapsible>
        <Collapsible disabled>
          <CollapsibleTrigger className="data-[disabled]:cursor-default data-[disabled]:text-muted-foreground">Clinician's note, added once the result is final</CollapsibleTrigger>
          <CollapsibleContent className="text-body-sm text-muted-foreground">No note yet.</CollapsibleContent>
        </Collapsible>
      </Demo>
      <Demo id="collapsible-controlled" files={["ui/collapsible"]} title="Controlled" note="open and onOpenChange let the label say what pressing it will do.">
        <ControlledCollapsible />
      </Demo>
      <Demo id="collapsible-in-a-card" files={["ui/collapsible", "ui/card", "ui/badge"]} title="In a card" note="Keep the headline figure visible and fold the detail away under it." bare className="items-stretch">
        <Card className="max-w-md flex-1">
          <CardHeader>
            <div>
              <CardTitle>Visit on 12 November</CardTitle>
              <CardDescription>Follow-up with Dr. Ngozi Okafor</CardDescription>
            </div>
            <Badge tone="success">Paid</Badge>
          </CardHeader>
          <p className="text-display-sm text-data">$25.00</p>
          <Collapsible>
            <CollapsibleTrigger>How this was worked out</CollapsibleTrigger>
            <CollapsibleContent>
              <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-body-sm">
                <dt className="text-muted-foreground">Billed by the clinic</dt>
                <dd className="text-data">$180.00</dd>
                <dt className="text-muted-foreground">Plan discount</dt>
                <dd className="text-data">−$62.00</dd>
                <dt className="text-muted-foreground">Paid by Aetna</dt>
                <dd className="text-data">−$93.00</dd>
                <dt className="font-medium">Your copay</dt>
                <dd className="font-medium text-data">$25.00</dd>
              </dl>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "collapsible",
  title: "Collapsible",
  group: "Components",
  summary: "A single label that shows and hides one piece of content in place. Use it for detail most people do not need; use Accordion for a list of sections.",
  keywords: "disclosure show more expand collapse details toggle",
  Body,
};
