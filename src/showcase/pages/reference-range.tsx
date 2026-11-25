import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReferenceRange } from "@/components/ui/reference-range";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="reference-range-basic" files={["ui/reference-range"]} title="Below, in and above range" note="The tinted band is the normal range and the marker is the reading. The words on the right say which side it is on, so the result does not rest on colour." className="flex-col items-stretch gap-6">
        <ReferenceRange label="Vitamin D" value={22} low={30} high={100} unit="ng/mL" />
        <ReferenceRange label="Potassium" value={4.2} low={3.5} high={5.1} unit="mmol/L" />
        <ReferenceRange label="Fasting glucose" value={118} low={70} high={99} unit="mg/dL" />
      </Demo>
      <Demo id="reference-range-one-sided" files={["ui/reference-range"]} title="One limit" note="Leave out low or high when the range has one limit. The band then runs to the end of the bar." className="flex-col items-stretch gap-6">
        <ReferenceRange label="LDL cholesterol" value={131} high={100} unit="mg/dL" />
        <ReferenceRange label="HDL cholesterol" value={58} low={40} unit="mg/dL" />
        <ReferenceRange label="eGFR" value={52} low={60} unit="mL/min" />
      </Demo>
      <Demo id="reference-range-scale" files={["ui/reference-range"]} title="Scale, format and severity" note="min and max fix the scale so several results line up. format sets the decimals. severity is danger only for a critical value." className="flex-col items-stretch gap-6">
        <ReferenceRange label="TSH" value={2.125} low={0.4} high={4} min={0} max={10} unit="uIU/mL" format={(v) => v.toFixed(2)} />
        <ReferenceRange label="Hemoglobin A1c" value={6.1} high={5.6} min={4} max={10} unit="%" format={(v) => v.toFixed(1)} labels={{ high: "Prediabetes range" }} />
        <ReferenceRange label="Potassium" value={6.4} low={3.5} high={5.1} unit="mmol/L" severity="danger" labels={{ high: "Critical high" }} />
      </Demo>
      <Demo id="reference-range-sizes" files={["ui/reference-range"]} title="Sizes" note="sm for dense tables and tiles, md by default, lg for a patient-facing result." className="flex-col items-stretch gap-6">
        <ReferenceRange size="sm" label="Sodium" value={139} low={135} high={145} unit="mmol/L" />
        <ReferenceRange size="md" label="Sodium" value={139} low={135} high={145} unit="mmol/L" />
        <ReferenceRange size="lg" label="Sodium" value={139} low={135} high={145} unit="mmol/L" />
      </Demo>
      <Demo id="reference-range-in-a-tile" files={["ui/reference-range", "ui/card"]} title="In a lab tile" note="Turn the header off when the tile already shows the name, the value and the interpretation. The label still names the bar for screen readers." bare className="items-stretch">
        <Card className="max-w-sm flex-1">
          <CardHeader>
            <div>
              <CardTitle>LDL cholesterol</CardTitle>
              <CardDescription>Lipid panel, 18 November 2026</CardDescription>
            </div>
          </CardHeader>
          <p className="flex items-baseline gap-2">
            <span className="text-display-sm text-data">131</span>
            <span className="text-body-sm text-muted-foreground">mg/dL</span>
            <span className="text-label text-warning-fg">Above range</span>
          </p>
          <ReferenceRange header={false} label="LDL cholesterol" value={131} low={0} high={100} unit="mg/dL" />
        </Card>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "reference-range",
  title: "Reference range",
  group: "Components",
  summary: "Shows where a lab value sits against its normal range. Read-only. Use Meter for an amount against a goal and Slider for a value people set.",
  keywords: "lab biomarker result normal range low high slider measurement interpretation",
  Body,
};
