import { CalendarPlus, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, type EmptyStateProps } from "@/components/ui/empty-state";
import { type ComponentSpec, axis, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "empty-state",
  sections: [
    matrix({
      title: "Empty state",
      note: "default draws the ghost of the rows that will be here, with the icon resting on them. compact shows the icon alone, for small panels.",
      rows: axis("size", ["default", "compact"]),
      states: ["title only", "description", "action", "no icon"],
      render: (p, s) => (
        <div style={{ width: 320 }}>
          <EmptyState
            size={p.size as EmptyStateProps["size"]}
            icon={s.is("no icon") ? undefined : <FlaskConical />}
            title="No lab results yet"
            description={s.is("title only") ? undefined : "Results appear here as soon as the lab releases them."}
            action={
              s.is("action") || s.is("no icon") ? (
                <Button size={p.size === "compact" ? "sm" : "md"}>
                  <CalendarPlus /> Book a lab visit
                </Button>
              ) : undefined
            }
          />
        </div>
      ),
    }),
  ],
};
