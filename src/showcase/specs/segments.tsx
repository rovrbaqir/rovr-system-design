import { Segments, type SegmentsProps } from "@/components/ui/segments";
import { type ComponentSpec, axis, list, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "segments",
  sections: [
    matrix({
      title: "Segments",
      note: "One segment per step. on-aurora is the white tone for the aurora surface.",
      rows: axis("tone", ["primary", "on-aurora"]),
      groups: axis("total", ["4", "9"]),
      states: ["empty", "partial", "complete"],
      render: (p, s) => {
        const total = Number(p.total);
        const bar = <Segments tone={p.tone as SegmentsProps["tone"]} total={total} value={s.is("empty") ? 0 : s.is("complete") ? total : Math.floor(total / 2)} label="Intake steps" />;
        return p.tone === "on-aurora" ? <div className="w-56 rounded-lg rovr-aurora p-4">{bar}</div> : <div className="w-56 p-4">{bar}</div>;
      },
    }),
    list({
      title: "With a caption",
      items: [
        {
          label: "Count beside the bar",
          code: '<Segments value={3} total={9} label="Intake steps" />',
          render: () => (
            <div className="flex w-64 flex-col gap-2">
              <div className="flex items-baseline justify-between text-body-sm">
                <span className="font-medium">Intake</span>
                <span className="text-muted-foreground text-data">3 of 9</span>
              </div>
              <Segments value={3} total={9} label="Intake steps" />
            </div>
          ),
        },
      ],
    }),
  ],
};
