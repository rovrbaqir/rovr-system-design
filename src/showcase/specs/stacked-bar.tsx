import { StackedBar, type StackedBarProps } from "@/components/ui/stacked-bar";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const claims = [
  { key: "paid", label: "Paid", value: 412 },
  { key: "pending", label: "Pending", value: 96 },
  { key: "denied", label: "Denied", value: 38 },
  { key: "appealed", label: "Appealed", value: 14 },
  { key: "void", label: "Voided", value: 9 },
];

export const spec: ComponentSpec = {
  slug: "stacked-bar",
  sections: [
    matrix({
      title: "Stacked bar",
      note: "size sets the height of the bar. The legend can be turned off where the values are written elsewhere.",
      rows: axis("size", ["sm", "md", "lg"]),
      groups: axis("legend", ["true", "false"]),
      states: ["default"],
      render: (p) => (
        <div className="w-80">
          <StackedBar aria-label="Claims by status" segments={claims.slice(0, 4)} size={p.size as StackedBarProps["size"]} legend={p.legend === "true"} />
        </div>
      ),
    }),
    matrix({
      title: "Stacked bar segments",
      note: "Two to five segments. Colours follow the chart tokens in order.",
      rows: axis("segments", ["2", "3", "4", "5"]),
      states: ["default"],
      render: (p) => (
        <div className="w-96">
          <StackedBar aria-label="Claims by status" segments={claims.slice(0, Number(p.segments))} />
        </div>
      ),
    }),
    list({
      title: "Content",
      items: [
        {
          label: "Formatted values",
          code: "<StackedBar formatValue={(v) => `${v}%`} />",
          render: () => (
            <div className="w-80">
              <StackedBar
                aria-label="Visits by type"
                formatValue={(v) => `${v}%`}
                segments={[
                  { key: "clinic", label: "In clinic", value: 57 },
                  { key: "video", label: "Video", value: 38 },
                  { key: "phone", label: "Phone", value: 5 },
                ]}
              />
            </div>
          ),
        },
        {
          label: "No data",
          code: "<StackedBar segments={[]} />",
          render: () => (
            <div className="w-80">
              <StackedBar aria-label="Claims by status" segments={[]} />
            </div>
          ),
        },
      ],
    }),
  ],
};
