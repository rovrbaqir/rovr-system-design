import { CalendarCheck, CircleCheck, FlaskConical, TriangleAlert } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const tones = ["neutral", "info", "success", "warning", "danger"] as const;
const words: Record<string, string> = { neutral: "Draft", info: "Scheduled", success: "Completed", warning: "Pending", danger: "Overdue" };

export const spec: ComponentSpec = {
  slug: "badge",
  sections: [
    matrix({
      title: "Badge",
      note: "tag is a small pill, status is a dot with plain text for tables, count is a number.",
      rows: axis("tone", tones),
      groups: axis("variant", ["tag", "status", "count"]),
      states: ["default"],
      // The wrapper only widens the cell so the group labels above have room.
      render: (p) => (
        <span className="flex w-28 justify-center">
          <Badge tone={p.tone as BadgeProps["tone"]} variant={p.variant as BadgeProps["variant"]}>
            {p.variant === "count" ? "3" : words[p.tone]}
          </Badge>
        </span>
      ),
    }),
    matrix({
      title: "Badge with icon",
      note: "A tag can lead with a 12px icon.",
      rows: axis("tone", tones),
      states: ["default"],
      render: (p) => (
        <Badge tone={p.tone as BadgeProps["tone"]}>
          <CalendarCheck /> {words[p.tone]}
        </Badge>
      ),
    }),
    matrix({
      title: "Badge count",
      note: "A count grows sideways with its digits and stays a circle for one.",
      rows: axis("tone", tones),
      states: ["1", "12", "99+"],
      render: (p, s) => (
        <Badge tone={p.tone as BadgeProps["tone"]} variant="count">
          {s.name}
        </Badge>
      ),
    }),
    list({
      title: "Content",
      items: [
        { label: "Live status", code: '<Badge variant="status" tone="success" live>In call</Badge>', render: () => <Badge variant="status" tone="success" live>In call</Badge> },
        {
          label: "Result in range",
          code: '<Badge tone="success"><CircleCheck /> In range</Badge>',
          render: () => (
            <Badge tone="success">
              <CircleCheck /> In range
            </Badge>
          ),
        },
        {
          label: "Result out of range",
          code: '<Badge tone="warning"><TriangleAlert /> Above range</Badge>',
          render: () => (
            <Badge tone="warning">
              <TriangleAlert /> Above range
            </Badge>
          ),
        },
        {
          label: "Category",
          code: "<Badge><FlaskConical /> Lab</Badge>",
          render: () => (
            <Badge>
              <FlaskConical /> Lab
            </Badge>
          ),
        },
      ],
    }),
  ],
};
