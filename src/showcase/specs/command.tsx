import { CommandTrigger } from "@/components/ui/command";
import { type ComponentSpec, axis, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "command",
  sections: [
    matrix({
      title: "Command trigger",
      note: "The search field that opens the palette. It is a button: the label is its children and the width comes from a class. The disabled look is set by the caller, as on the docs page.",
      rows: axis("label", ["default", "custom"]),
      states: ["default", "hover", "focus", "disabled"],
      render: (p, s) => (
        <div className="w-80">
          <CommandTrigger disabled={s.disabled} className={s.disabled ? "cursor-not-allowed opacity-45" : undefined}>
            {p.label === "custom" ? "Search 2,418 patients" : undefined}
          </CommandTrigger>
        </div>
      ),
    }),
  ],
};
