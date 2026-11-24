import { Glide } from "@/components/ui/glide";
import { type ComponentSpec, axis, matrix } from "./kit";

const views = ["Day", "Week", "Month"] as const;

export const spec: ComponentSpec = {
  slug: "glide",
  sections: [
    matrix({
      title: "Glide",
      note: "The moving highlight, at rest and on an item. It takes the size of the item it lands on; highlightClassName sets its shape and colour. Shown here following an attribute, on Week.",
      rows: axis("highlightClassName", ["default", "rounded-lg", "rounded-full", "rounded-md bg-accent"]),
      states: ["rest", "highlighted"],
      render: (p, s) => (
        <Glide follow="data-current" highlightClassName={p.highlightClassName === "default" ? undefined : p.highlightClassName} className="flex gap-1">
          {views.map((view) => (
            <span key={view} data-current={s.is("highlighted") && view === "Week" ? "" : undefined} className="flex h-9 items-center px-4 text-sm font-medium text-muted-foreground data-[current]:text-foreground">
              {view}
            </span>
          ))}
        </Glide>
      ),
    }),
  ],
};
