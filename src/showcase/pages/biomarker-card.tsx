import { toast } from "@/components/ui/toast";
import { BiomarkerCard, type BiomarkerResult } from "@/components/patterns/biomarker-card";
import { Demo } from "../kit";
import type { DocPage } from "../types";

/** Results dated back from today, so the six-month and one-year periods always have something to draw. */
const monthsAgo = (values: [number, number][]): BiomarkerResult[] =>
  values.map(([months, value]) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return { date, value };
  });

const ldl = monthsAgo([[11, 162], [9, 155], [7, 148], [5, 139], [3, 131], [1, 124], [0, 118]]);
const hdl = monthsAgo([[10, 44], [8, 46], [5, 49], [3, 52], [0, 55]]);
const a1c = monthsAgo([[11, 6.1], [8, 6.4], [5, 6.8], [2, 7.0], [0, 7.2]]);
const potassium = monthsAgo([[10, 4.4], [6, 4.9], [3, 5.4], [0, 6.3]]);

function Body() {
  return (
    <>
      <Demo
        id="biomarker-card-numeric"
        files={["patterns/biomarker-card", "ui/reference-range", "ui/chart", "ui/segmented-control"]}
        title="Numeric result"
        note="The name and target on top, the value on the left with the normal range and the range bar on the right, and the trend below. The switch under the chart moves between six months and a year."
        bare
        className="items-stretch"
      >
        <BiomarkerCard className="max-w-md min-w-80 flex-1" name="HDL-C" value={55} unit="mg/dL" target="> 40" interpretation="normal" low={40} history={hdl} />
        <BiomarkerCard className="max-w-md min-w-80 flex-1" name="LDL-C" value={118} unit="mg/dL" target="< 100" interpretation="abnormal" high={100} history={ldl} />
      </Demo>
      <Demo
        id="biomarker-card-provider"
        files={["patterns/biomarker-card", "ui/reference-range", "ui/chart", "ui/button"]}
        title="Provider chart"
        note="The provider app labels the value Patient and adds a history button next to the name. A critical result turns the dot and the marker red."
        bare
        className="items-stretch"
      >
        <BiomarkerCard
          className="max-w-md min-w-80 flex-1"
          name="HbA1c"
          value={7.2}
          unit="%"
          target="< 7.0"
          interpretation="abnormal"
          low={4}
          high={5.6}
          history={a1c}
          valueLabel="Patient"
          onHistoryClick={() => toast.info("HbA1c history", { description: "Five results since last December." })}
        />
        <BiomarkerCard
          className="max-w-md min-w-80 flex-1"
          name="Potassium"
          value={6.3}
          unit="mmol/L"
          target="3.5 - 5.1"
          interpretation="critical"
          low={3.5}
          high={5.1}
          history={potassium}
          valueLabel="Patient"
          onHistoryClick={() => toast.info("Potassium history", { description: "Four results since last January." })}
        />
      </Demo>
      <Demo
        id="biomarker-card-text"
        files={["patterns/biomarker-card"]}
        title="Text result"
        note="A result without a number shows the interpretation as the headline and the date it was last updated."
        bare
        className="items-stretch"
      >
        <BiomarkerCard className="max-w-xs min-w-60 flex-1" type="text" name="Hepatitis B surface antigen" interpretation="normal" lastUpdated="2026-11-12T09:30:00" />
        <BiomarkerCard className="max-w-xs min-w-60 flex-1" type="text" name="Urine protein" interpretation="abnormal" lastUpdated="2026-11-18T14:05:00" />
      </Demo>
      <Demo
        id="biomarker-card-bare"
        files={["patterns/biomarker-card", "ui/reference-range", "ui/chart"]}
        title="Bare"
        note="bare drops the card surface and the range switch, for showing a result inside a message or another card."
      >
        <BiomarkerCard bare className="w-full max-w-md" name="LDL-C" value={118} unit="mg/dL" target="< 100" interpretation="abnormal" high={100} history={ldl} />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "biomarker-card",
  title: "Biomarker card",
  group: "Examples",
  summary:
    "Provider app and patient app. One lab biomarker with its latest value, the normal range and its trend over six months or a year. Replaces BioMarkerKPI and the LabMeasurementSlider inside it.",
  keywords: "lab result biomarker kpi reference range trend ldl a1c labs chart history",
  Body,
};
