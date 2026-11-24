import { Slider } from "@/components/ui/slider";
import { type ComponentSpec, axis, list, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "slider",
  sections: [
    matrix({
      title: "Slider",
      note: "An array value gives a range with one thumb per number. Hover and focus are shown on the first thumb. The thumb also grows while it is dragged.",
      rows: axis("thumbs", ["1", "2"]),
      states: ["default", "hover", "focus", "disabled"],
      // Hover styles sit on the thumb, focus styles follow the range input inside it.
      target: '[data-spec-cell$="state=hover"] div:has(> input[type=range]), input[type=range]',
      render: (p, s) => (
        <div className="w-56">
          {p.thumbs === "2" ? (
            <Slider defaultValue={[80, 180]} min={40} max={300} step={5} disabled={s.disabled} aria-label="Target glucose range" />
          ) : (
            <Slider defaultValue={4} min={0} max={10} disabled={s.disabled} aria-label="Pain level" />
          )}
        </div>
      ),
    }),
    list({
      title: "Content",
      note: "The slider has no label or value of its own. Put them above it, and show the value as text.",
      items: [
        {
          label: "With label and value",
          code: "<Slider min={0} max={10} />",
          render: () => (
            <div className="flex w-64 flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-label">Pain level</span>
                <span className="text-body-sm text-muted-foreground text-data">4 of 10</span>
              </div>
              <Slider defaultValue={4} min={0} max={10} aria-label="Pain level" />
            </div>
          ),
        },
        {
          label: "Range with values",
          code: "<Slider defaultValue={[80, 180]} />",
          render: () => (
            <div className="flex w-64 flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-label">Target glucose</span>
                <span className="text-body-sm text-muted-foreground text-data">80 to 180 mg/dL</span>
              </div>
              <Slider defaultValue={[80, 180]} min={40} max={300} step={5} aria-label="Target glucose range" />
            </div>
          ),
        },
        {
          label: "At minimum",
          code: "<Slider defaultValue={0} />",
          render: () => (
            <div className="w-64">
              <Slider defaultValue={0} min={0} max={10} aria-label="Pain level" />
            </div>
          ),
        },
        {
          label: "At maximum",
          code: "<Slider defaultValue={10} />",
          render: () => (
            <div className="w-64">
              <Slider defaultValue={10} min={0} max={10} aria-label="Pain level" />
            </div>
          ),
        },
      ],
    }),
  ],
};
