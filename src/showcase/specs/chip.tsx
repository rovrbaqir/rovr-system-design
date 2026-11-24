import { Chip, ChipGroup } from "@/components/ui/chip";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const noop = () => {};

export const spec: ComponentSpec = {
  slug: "chip",
  sections: [
    matrix({
      title: "Chip",
      note: "label is the lighter prefix before the value. onRemove adds the remove button.",
      rows: axis("label", ["false", "true"]),
      states: ["default", "removable"],
      render: (p, s) => (
        <Chip label={p.label === "true" ? "Status" : undefined} onRemove={s.is("removable") ? noop : undefined}>
          Completed
        </Chip>
      ),
    }),
    matrix({
      title: "Chip remove button",
      note: "States of the remove button.",
      rows: axis("label", ["false", "true"]),
      states: ["default", "hover", "focus", "pressed"],
      target: "button",
      render: (p) => (
        <Chip label={p.label === "true" ? "Provider" : undefined} onRemove={noop}>
          Dr. Okafor
        </Chip>
      ),
    }),
    list({
      title: "Chip group",
      note: "A row of chips that wraps. trailing sits after the last chip.",
      items: [
        {
          label: "Applied filters",
          code: "<ChipGroup items={[…]} />",
          render: () => (
            <ChipGroup
              items={[
                { key: "status", node: <Chip label="Status" onRemove={noop}>Completed</Chip> },
                { key: "provider", node: <Chip label="Provider" onRemove={noop}>Dr. Okafor</Chip> },
                { key: "type", node: <Chip label="Type" onRemove={noop}>Video visit</Chip> },
              ]}
            />
          ),
        },
        {
          label: "With trailing action",
          code: "<ChipGroup items={[…]} trailing={<button>Clear all</button>} />",
          render: () => (
            <ChipGroup
              items={[
                { key: "status", node: <Chip label="Status" onRemove={noop}>Completed</Chip> },
                { key: "date", node: <Chip label="Date" onRemove={noop}>Last 30 days</Chip> },
              ]}
              trailing={
                <button type="button" className="cursor-pointer text-body-sm font-medium text-accent-foreground">
                  Clear all
                </button>
              }
            />
          ),
        },
        {
          label: "Wrapping",
          code: "<ChipGroup items={[…]} />",
          render: () => (
            <ChipGroup
              style={{ width: 256 }}
              items={[
                { key: "a", node: <Chip onRemove={noop}>Metformin</Chip> },
                { key: "b", node: <Chip onRemove={noop}>Atorvastatin</Chip> },
                { key: "c", node: <Chip onRemove={noop}>Lisinopril</Chip> },
                { key: "d", node: <Chip onRemove={noop}>Levothyroxine</Chip> },
              ]}
            />
          ),
        },
      ],
    }),
  ],
};
