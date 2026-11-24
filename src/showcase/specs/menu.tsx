import { Copy, Download, Pencil, Trash2 } from "lucide-react";
import { Glide } from "@/components/ui/glide";
import { Menu, MenuCheckboxItem, MenuItem, MenuLabel, MenuSeparator } from "@/components/ui/menu";
import { type ComponentSpec, type SpecState, axis, list, matrix } from "./kit";

const states = ["default", "highlighted", "disabled"] as const;

// The highlight is not drawn by the item: MenuContent wraps its items in a Glide
// that follows data-highlighted. The same Glide is used here, without the popup.
const highlight = (s: SpecState) => (s.is("highlighted") ? { "data-highlighted": "" } : {});

function Row({ children }: { children: React.ReactNode }) {
  return (
    <Menu>
      <Glide follow="data-highlighted" className="w-56">
        {children}
      </Glide>
    </Menu>
  );
}

export const spec: ComponentSpec = {
  slug: "menu",
  sections: [
    matrix({
      title: "Menu item",
      note: "One row of the menu. The highlight follows the pointer and the arrow keys; it is one shape that glides between items. A destructive item is red and sits last, on its own.",
      rows: axis("content", ["label", "icon", "shortcut", "icon and shortcut"]),
      groups: axis("destructive", ["false", "true"]),
      states,
      render: (p, s) => {
        const destructive = p.destructive === "true";
        const icon = p.content.startsWith("icon");
        const shortcut = p.content.endsWith("shortcut");
        return (
          <Row>
            <MenuItem destructive={destructive} disabled={s.disabled} shortcut={shortcut ? (destructive ? "⌫" : "⌘C") : undefined} {...highlight(s)}>
              {icon && (destructive ? <Trash2 /> : <Copy />)}
              {destructive ? "Remove from chart" : "Copy link"}
            </MenuItem>
          </Row>
        );
      },
    }),
    matrix({
      title: "Menu checkbox item",
      note: "For a setting that applies straight away. The check takes the place an icon would.",
      rows: axis("checked", ["false", "true"]),
      states,
      render: (p, s) => (
        <Row>
          <MenuCheckboxItem checked={p.checked === "true"} disabled={s.disabled} {...highlight(s)}>
            Show reference range
          </MenuCheckboxItem>
        </Row>
      ),
    }),
    list({
      title: "Parts",
      note: "A label heads a run of items and a separator divides runs.",
      items: [
        {
          label: "Label",
          code: "<MenuLabel>Result</MenuLabel>",
          render: () => (
            <div className="w-56">
              <MenuLabel>Result</MenuLabel>
            </div>
          ),
        },
        {
          label: "Separator",
          code: "<MenuSeparator />",
          render: () => (
            <Menu>
              <div className="w-56 px-1">
                <MenuSeparator />
              </div>
            </Menu>
          ),
        },
        {
          label: "A run of items",
          code: "<MenuLabel /> <MenuItem /> <MenuSeparator /> <MenuItem destructive />",
          render: () => (
            <Menu>
              <Glide follow="data-highlighted" className="w-56 p-1">
                <MenuLabel>Result</MenuLabel>
                <MenuItem shortcut="E">
                  <Pencil /> Add a note
                </MenuItem>
                <MenuItem data-highlighted="">
                  <Download /> Download PDF
                </MenuItem>
                <MenuSeparator />
                <MenuItem destructive>
                  <Trash2 /> Remove from chart
                </MenuItem>
              </Glide>
            </Menu>
          ),
        },
      ],
    }),
  ],
};
