import { LabTile } from "@/components/patterns/lab-tile";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="lab-tile-statuses" files={["patterns/lab-tile"]} title="In, above and below range" note="The tile works out the status from the value and the reference range, and says it in words as well as colour. The reading is static: it is never animated in." bare className="items-stretch">
        <LabTile className="min-w-64 flex-1" name="HbA1c" value={5.4} unit="%" range={{ low: 4, high: 5.6 }} collected="12 Nov" />
        <LabTile className="min-w-64 flex-1" name="Potassium" value={5.6} unit="mmol/L" range={{ low: 3.5, high: 5.1 }} collected="12 Nov" />
        <LabTile className="min-w-64 flex-1" name="Vitamin D, 25-hydroxy" value={22} unit="ng/mL" range={{ low: 30, high: 100 }} collected="12 Nov" />
      </Demo>
      <Demo id="lab-tile-scale" files={["patterns/lab-tile"]} title="Setting the scale" note="By default the track shows a margin around the reference range. Pass scale when the range starts at zero or the natural scale is wider, as with LDL cholesterol." bare className="items-stretch">
        <LabTile className="min-w-64 flex-1" name="LDL cholesterol" value={131} unit="mg/dL" range={{ low: 0, high: 100 }} scale={{ min: 0, max: 190 }} collected="12 Nov" />
        <LabTile className="min-w-64 flex-1" name="Triglycerides" value={114} unit="mg/dL" range={{ low: 0, high: 150 }} scale={{ min: 0, max: 300 }} collected="12 Nov" />
      </Demo>
      <Demo id="lab-tile-panel" files={["patterns/lab-tile"]} title="A panel of results" note="Lay tiles out in a grid for one panel. collected is optional; leave it out when the panel already states the date." bare className="flex-col items-stretch gap-4">
        <div>
          <p className="text-title-md">Lipid panel</p>
          <p className="text-body-sm text-muted-foreground">Collected 12 Nov 2026, fasting · Quest Diagnostics</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <LabTile name="Total cholesterol" value={212} unit="mg/dL" range={{ low: 0, high: 200 }} scale={{ min: 0, max: 300 }} />
          <LabTile name="LDL cholesterol" value={131} unit="mg/dL" range={{ low: 0, high: 100 }} scale={{ min: 0, max: 190 }} />
          <LabTile name="HDL cholesterol" value={58} unit="mg/dL" range={{ low: 40, high: 90 }} />
          <LabTile name="Triglycerides" value={114} unit="mg/dL" range={{ low: 0, high: 150 }} scale={{ min: 0, max: 300 }} />
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "lab-tile",
  title: "Lab tile",
  group: "Examples",
  summary: "One lab result shown against its reference range, with the status in words. Use it wherever a patient or clinician reads results.",
  keywords: "laboratory result reference range test blood panel biomarker",
  Body,
};
