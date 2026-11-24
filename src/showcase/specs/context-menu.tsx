import { CalendarClock, Trash2 } from "lucide-react";
import { ContextMenu, ContextMenuItem } from "@/components/ui/context-menu";
import { Glide } from "@/components/ui/glide";
import { type ComponentSpec, axis, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "context-menu",
  sections: [
    matrix({
      title: "Context menu item",
      note: "One row of the right-click menu. The highlight is one shape that glides between items, drawn by the Glide inside ContextMenuContent.",
      rows: axis("content", ["label", "icon"]),
      groups: axis("destructive", ["false", "true"]),
      states: ["default", "highlighted", "disabled"],
      render: (p, s) => {
        const destructive = p.destructive === "true";
        return (
          <ContextMenu>
            <Glide follow="data-highlighted" className="w-56">
              <ContextMenuItem destructive={destructive} disabled={s.disabled} {...(s.is("highlighted") ? { "data-highlighted": "" } : {})}>
                {p.content === "icon" && (destructive ? <Trash2 /> : <CalendarClock />)}
                {destructive ? "Cancel visit" : "Reschedule"}
              </ContextMenuItem>
            </Glide>
          </ContextMenu>
        );
      },
    }),
  ],
};
