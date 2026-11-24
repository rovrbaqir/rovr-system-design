import { HeartPulse, Moon } from "lucide-react";
import { Frost, FrostDisc } from "@/components/ui/frost";
import { type ComponentSpec, axis, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "frost",
  sections: [
    matrix({
      title: "Frost",
      note: "A clear glass pane, shown on the aurora surface it is made for.",
      rows: axis("content", ["fact", "text"]),
      states: ["default"],
      render: (p) => (
        <div className="rounded-xl rovr-aurora p-5">
          {p.content === "fact" ? (
            <Frost className="w-56">
              <p className="text-caption text-white/70">LDL cholesterol</p>
              <p className="text-title-lg text-data">128 mg/dL</p>
              <p className="text-body-sm text-white/70">Down from 162 in August</p>
            </Frost>
          ) : (
            <Frost className="w-56">
              <p className="text-body-sm">Your next visit is on Thursday 3 December at 10:30 with Dr. Okafor.</p>
            </Frost>
          )}
        </div>
      ),
    }),
    matrix({
      title: "Frost disc",
      note: "A round pane for one number or one icon. size-16 by default; resize it with a size class.",
      rows: axis("className", ["size-12", "size-16", "size-20"]),
      groups: axis("content", ["number", "icon"]),
      states: ["default"],
      render: (p) => {
        const size = { "size-12": "size-12", "size-16": "size-16", "size-20": "size-20" }[p.className];
        const small = p.className === "size-12";
        return (
          <div className="rounded-xl rovr-aurora p-5">
            <FrostDisc className={size}>
              {p.content === "number" ? <span className={small ? "text-title-sm text-data" : "text-title-lg text-data"}>72</span> : p.className === "size-12" ? <Moon className="size-5" aria-hidden /> : <HeartPulse className="size-6" aria-hidden />}
            </FrostDisc>
          </div>
        );
      },
    }),
  ],
};
