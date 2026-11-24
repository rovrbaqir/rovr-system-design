import { Progress, ProgressRing, type ProgressProps, type ProgressRingProps } from "@/components/ui/progress";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const tones = ["primary", "success", "warning", "danger"] as const;

export const spec: ComponentSpec = {
  slug: "progress",
  sections: [
    matrix({
      title: "Progress",
      note: "tone colours the bar and size its height. Indeterminate is value={null}, for work of unknown length.",
      rows: axis("tone", tones),
      groups: axis("size", ["sm", "md"]),
      states: ["0", "25", "50", "75", "100", "indeterminate"],
      render: (p, s) => (
        <div className="w-40">
          <Progress aria-label="Uploading records" tone={p.tone as ProgressProps["tone"]} size={p.size as ProgressProps["size"]} value={s.is("indeterminate") ? null : Number(s.name)} />
        </div>
      ),
    }),
    matrix({
      title: "Progress ring",
      note: "A ring for a single figure, with the value in the middle.",
      rows: axis("tone", tones),
      states: ["0", "25", "50", "75", "100"],
      render: (p, s) => (
        <ProgressRing label="Intake form" tone={p.tone as ProgressRingProps["tone"]} value={Number(s.name)}>
          {s.name}%
        </ProgressRing>
      ),
    }),
    list({
      title: "Ring size",
      note: "size and strokeWidth are in pixels.",
      items: [
        { label: "Small", code: "<ProgressRing size={40} strokeWidth={4} />", render: () => <ProgressRing label="Steps" value={60} size={40} strokeWidth={4} /> },
        { label: "Default", code: "<ProgressRing value={60}>60%</ProgressRing>", render: () => <ProgressRing label="Steps" value={60}>60%</ProgressRing> },
        { label: "Large", code: "<ProgressRing size={80} strokeWidth={7}>4 of 6</ProgressRing>", render: () => <ProgressRing label="Intake form" value={67} size={80} strokeWidth={7}>4 of 6</ProgressRing> },
      ],
    }),
  ],
};
