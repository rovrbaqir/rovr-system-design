import { BarList, type BarListProps } from "@/components/ui/bar-list";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const rows = [
  { label: "Missing prior authorisation", value: 148 },
  { label: "Eligibility not active", value: 96 },
  { label: "Duplicate claim", value: 61 },
  { label: "Timely filing", value: 12 },
];

export const spec: ComponentSpec = {
  slug: "bar-list",
  sections: [
    matrix({
      title: "Bar list",
      note: "tone colours every bar. The bars are scaled to the largest row.",
      rows: axis("tone", ["primary", "success", "warning", "danger"]),
      states: ["default"],
      render: (p) => (
        <div className="w-96">
          <BarList aria-label="Claim denials by reason" rows={rows} tone={p.tone as BarListProps["tone"]} />
        </div>
      ),
    }),
    matrix({
      title: "Bar list width",
      note: "The list fills its container. The label takes 38% and truncates.",
      rows: axis("width", ["18rem", "24rem", "32rem"]),
      states: ["default"],
      render: (p) => (
        <div style={{ width: p.width }}>
          <BarList aria-label="Claim denials by reason" rows={rows} />
        </div>
      ),
    }),
    list({
      title: "Content",
      items: [
        {
          label: "Hint",
          code: '{ label: "Insurance check", value: 42, hint: "human step" }',
          render: () => (
            <div className="w-96">
              <BarList
                aria-label="Average time per intake step"
                format={(v) => `${v} min`}
                rows={[
                  { label: "Insurance check", value: 42, hint: "human step" },
                  { label: "Intake form", value: 9 },
                ]}
              />
            </div>
          ),
        },
        {
          label: "Value label",
          code: '{ label: "Riverside", value: 38, valueLabel: "38 of 40" }',
          render: () => (
            <div className="w-96">
              <BarList
                aria-label="Slots booked today"
                max={40}
                rows={[
                  { label: "Riverside", value: 38, valueLabel: "38 of 40" },
                  { label: "Northgate", value: 27, valueLabel: "27 of 40" },
                ]}
              />
            </div>
          ),
        },
        {
          label: "Zero",
          code: '{ label: "Appeals", value: 0 }',
          render: () => (
            <div className="w-96">
              <BarList
                aria-label="Open items"
                rows={[
                  { label: "Denials", value: 18 },
                  { label: "Appeals", value: 0 },
                ]}
              />
            </div>
          ),
        },
      ],
    }),
  ],
};
