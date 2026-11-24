import { SuccessBurst } from "@/components/ui/success-burst";
import { type ComponentSpec, axis, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "success-burst",
  sections: [
    matrix({
      title: "Success burst",
      note: "size is the diameter of the check in pixels, 72 by default. The component reserves twice that for the ring and the particles. Shown settled, after the animation has played.",
      rows: axis("size", ["40", "56", "72", "96"]),
      states: ["settled"],
      render: (p) => <SuccessBurst size={Number(p.size)} />,
    }),
  ],
};
