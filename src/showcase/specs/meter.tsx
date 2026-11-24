import { Meter, type MeterProps } from "@/components/ui/meter";
import { type ComponentSpec, axis, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "meter",
  sections: [
    matrix({
      title: "Meter",
      note: "A measured amount against a known range. tone colours the bar; the columns are the value.",
      rows: axis("tone", ["primary", "success", "warning", "danger"]),
      states: ["0", "25", "50", "75", "100"],
      render: (p, s) => (
        <div className="w-56">
          <Meter label="Medication adherence" valueText={`${s.name}%`} value={Number(s.name)} tone={p.tone as MeterProps["tone"]} />
        </div>
      ),
    }),
    matrix({
      title: "Meter width",
      note: "The meter fills its container.",
      rows: axis("width", ["12rem", "20rem", "28rem"]),
      states: ["default"],
      render: (p) => (
        <div style={{ width: p.width }}>
          <Meter label="Sleep" valueText="6.2 of 8 hours" value={6.2} max={8} />
        </div>
      ),
    }),
  ],
};
