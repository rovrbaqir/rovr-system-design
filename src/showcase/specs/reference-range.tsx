import { ReferenceRange, type ReferenceRangeProps } from "@/components/ui/reference-range";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const readings: Record<string, number> = { low: 3.1, normal: 4.2, high: 5.6 };

export const spec: ComponentSpec = {
  slug: "reference-range",
  sections: [
    matrix({
      title: "Reference range",
      note: "The columns are the reading against a range of 3.5 to 5.1. size sets the bar, the marker and the header text.",
      rows: axis("size", ["sm", "md", "lg"]),
      states: ["low", "normal", "high"],
      render: (p, s) => (
        <div className="w-64">
          <ReferenceRange label="Potassium" value={readings[s.name]} low={3.5} high={5.1} unit="mmol/L" size={p.size as ReferenceRangeProps["size"]} />
        </div>
      ),
    }),
    matrix({
      title: "Reference range severity",
      note: "The tone of a reading outside the range. A reading in range is always success.",
      rows: axis("severity", ["warning", "danger"]),
      states: ["low", "normal", "high"],
      render: (p, s) => (
        <div className="w-64">
          <ReferenceRange label="Potassium" value={readings[s.name]} low={3.5} high={5.1} unit="mmol/L" severity={p.severity as ReferenceRangeProps["severity"]} />
        </div>
      ),
    }),
    matrix({
      title: "Reference range header",
      note: "Without the header only the bar and the limits show.",
      rows: axis("header", ["true", "false"]),
      states: ["low", "normal", "high"],
      render: (p, s) => (
        <div className="w-64">
          <ReferenceRange label="Potassium" value={readings[s.name]} low={3.5} high={5.1} unit="mmol/L" header={p.header === "true"} />
        </div>
      ),
    }),
    list({
      title: "Range",
      items: [
        {
          label: "Upper limit only",
          code: "<ReferenceRange value={131} high={100} />",
          render: () => (
            <div className="w-64">
              <ReferenceRange label="LDL cholesterol" value={131} high={100} unit="mg/dL" />
            </div>
          ),
        },
        {
          label: "Lower limit only",
          code: "<ReferenceRange value={58} low={40} />",
          render: () => (
            <div className="w-64">
              <ReferenceRange label="HDL cholesterol" value={58} low={40} unit="mg/dL" />
            </div>
          ),
        },
        {
          label: "Fixed scale",
          code: "<ReferenceRange min={0} max={10} />",
          render: () => (
            <div className="w-64">
              <ReferenceRange label="TSH" value={2.13} low={0.4} high={4} min={0} max={10} unit="uIU/mL" />
            </div>
          ),
        },
      ],
    }),
  ],
};
