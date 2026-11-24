import { Separator } from "@/components/ui/separator";
import { type ComponentSpec, axis, list, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "separator",
  sections: [
    matrix({
      title: "Separator",
      note: "A one pixel line. Horizontal fills the width; vertical stretches to the height of its flex row.",
      rows: axis("orientation", ["horizontal", "vertical"]),
      states: ["default"],
      render: (p) =>
        p.orientation === "horizontal" ? (
          <div className="w-56">
            <Separator />
          </div>
        ) : (
          <div className="flex h-10">
            <Separator orientation="vertical" />
          </div>
        ),
    }),
    list({
      title: "In context",
      items: [
        {
          label: "Between sections",
          code: "<Separator />",
          render: () => (
            <div className="flex w-56 flex-col gap-3">
              <p className="text-body-sm">Atorvastatin 20 mg</p>
              <Separator />
              <p className="text-body-sm">Lisinopril 10 mg</p>
            </div>
          ),
        },
        {
          label: "Between inline items",
          code: '<Separator orientation="vertical" />',
          render: () => (
            <div className="flex items-center gap-3 text-body-sm">
              <span>Cardiology</span>
              <Separator orientation="vertical" />
              <span>Riverside Clinic</span>
              <Separator orientation="vertical" />
              <span>Room 4</span>
            </div>
          ),
        },
      ],
    }),
  ],
};
