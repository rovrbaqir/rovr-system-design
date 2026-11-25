import { Delta, type DeltaProps } from "@/components/ui/delta";
import { type ComponentSpec, axis, list, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "delta",
  sections: [
    matrix({
      title: "Delta",
      note: "direction picks the arrow. size follows the figure it sits beside.",
      rows: axis("direction", ["up", "down", "flat"]),
      groups: axis("size", ["sm", "md", "lg"]),
      states: ["default"],
      render: (p) => (
        <Delta direction={p.direction as DeltaProps["direction"]} size={p.size as DeltaProps["size"]}>
          {p.direction === "flat" ? "0.0%" : "4.2%"}
        </Delta>
      ),
    }),
    matrix({
      title: "Delta tone",
      note: "good is the direction that is good news. A change that way is success, the other way destructive, flat or unset is neutral.",
      rows: axis("direction", ["up", "down", "flat"]),
      groups: axis("good", ["none", "up", "down"]),
      states: ["default"],
      render: (p) => (
        <Delta direction={p.direction as DeltaProps["direction"]} good={p.good === "none" ? undefined : (p.good as DeltaProps["good"])}>
          {p.direction === "flat" ? "0.0%" : "4.2%"}
        </Delta>
      ),
    }),
    list({
      title: "Content",
      items: [
        { label: "Percent", code: '<Delta direction="up">4.2%</Delta>', render: () => <Delta direction="up">4.2%</Delta> },
        { label: "Points", code: '<Delta direction="down" good="down">0.9 pts</Delta>', render: () => <Delta direction="down" good="down">0.9 pts</Delta> },
        { label: "With comparison", code: '<Delta direction="up" good="up" title="vs last week">12</Delta>', render: () => <Delta direction="up" good="up" title="vs last week">12</Delta> },
      ],
    }),
  ],
};
