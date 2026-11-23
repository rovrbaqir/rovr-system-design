import * as React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SmoothHeight } from "@/components/ui/smooth-height";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function AllergyList() {
  const all = ["Penicillin", "Latex", "Sulfa drugs", "Peanuts", "Ibuprofen"];
  const [items, setItems] = React.useState(all.slice(0, 2));
  const next = all.find((a) => !items.includes(a));
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <SmoothHeight className="rounded-lg border border-border">
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item} className="flex h-11 items-center justify-between border-b border-border pr-1.5 pl-3 text-body last:border-0 rovr-enter">
              {item}
              <Button variant="ghost" size="icon-sm" aria-label={`Remove ${item}`} onClick={() => setItems((list) => list.filter((x) => x !== item))}>
                <X />
              </Button>
            </li>
          ))}
          {items.length === 0 && <li className="px-3 py-3 text-body-sm text-muted-foreground">No known allergies recorded.</li>}
        </ul>
      </SmoothHeight>
      <Button variant="secondary" size="sm" className="w-fit" disabled={!next} onClick={() => next && setItems((list) => [...list, next])}>
        <Plus /> Add allergy
      </Button>
    </div>
  );
}

function VisitDetail() {
  const [view, setView] = React.useState<"summary" | "full">("summary");
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <SegmentedControl
        size="sm"
        aria-label="Note length"
        value={view}
        onValueChange={setView}
        options={[
          { value: "summary", label: "Summary" },
          { value: "full", label: "Full note" },
        ]}
      />
      <SmoothHeight className="rounded-lg bg-surface-sunken">
        <div className="flex flex-col gap-2 p-4 text-body-sm">
          <p>Follow-up for hyperlipidaemia. LDL 131 mg/dL, above target. Atorvastatin increased to 20 mg daily.</p>
          {view === "full" && (
            <>
              <p>Blood pressure 118/76 mmHg, resting heart rate 61 bpm, weight 72.4 kg. No missed doses and no muscle pain reported.</p>
              <p>Repeat lipid panel in 8 weeks. Patient to message the clinic if she notices muscle aches.</p>
              <p className="text-muted-foreground">Signed by Dr. Ngozi Okafor, 12 Nov 2026.</p>
            </>
          )}
        </div>
      </SmoothHeight>
      <p className="text-body-sm text-muted-foreground">This line is pushed down smoothly, not in a jump.</p>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="smooth-height-list" files={["ui/smooth-height", "ui/button"]} title="A list that gains and loses rows" note="Add and remove allergies. The rows change at once; the frame follows in one smooth move, so what sits below never snaps." className="items-start">
        <AllergyList />
      </Demo>
      <Demo id="smooth-height-content" files={["ui/smooth-height", "ui/segmented-control"]} title="Content that changes length" note="Wrap any region whose content changes size: a filtered table, an expanding note, a form that reveals fields. It measures its content, so there is nothing to configure." className="items-start">
        <VisitDetail />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "smooth-height",
  title: "Smooth height",
  group: "Components",
  summary: "A wrapper that animates its own height to follow its content. Use it around lists and panels that gain or lose content, so the layout resizes in one move instead of snapping. Data table uses it already.",
  keywords: "animate height resize auto height transition expand collapse layout",
  Body,
};
