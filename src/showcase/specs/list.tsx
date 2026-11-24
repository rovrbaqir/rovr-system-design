import { FlaskConical, Pill } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { List, ListItem } from "@/components/ui/list";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const noop = () => {};

export const spec: ComponentSpec = {
  slug: "list",
  sections: [
    matrix({
      title: "List item",
      note: "static is a plain row, button takes onClick, link takes href and shows a chevron. Under the pointer one highlight glides between the rows of a list.",
      rows: axis("type", ["static", "button", "link"]),
      states: ["default", "hover", "focus", "pressed"],
      target: "a, button, [role=listitem] > div",
      render: (p) => (
        <List style={{ width: 320 }}>
          <ListItem
            leading={<FlaskConical />}
            title="Lipid panel"
            description="Collected 12 November"
            trailing="In range"
            href={p.type === "link" ? "#/spec/list" : undefined}
            onClick={p.type === "button" ? noop : undefined}
          />
        </List>
      ),
    }),
    matrix({
      title: "List item content",
      note: "leading, description and trailing are optional.",
      rows: axis("leading", ["none", "icon", "avatar"]),
      groups: axis("description", ["false", "true"]),
      states: ["default", "trailing"],
      render: (p, s) => (
        <List className="w-72">
          <ListItem
            leading={p.leading === "icon" ? <Pill /> : p.leading === "avatar" ? <Avatar name="Dr. Ngozi Okafor" size="sm" /> : undefined}
            title={p.leading === "avatar" ? "Dr. Ngozi Okafor" : "Atorvastatin 20 mg"}
            description={p.description === "true" ? (p.leading === "avatar" ? "Cardiology" : "One tablet every morning") : undefined}
            trailing={s.is("trailing") ? (p.leading === "avatar" ? "10:30" : "2 refills") : undefined}
          />
        </List>
      ),
    }),
    list({
      title: "List",
      note: "Rows stack with no gap; the highlight is the only divider.",
      items: [
        {
          label: "Links",
          code: '<List><ListItem href="…" /></List>',
          render: () => (
            <List style={{ width: 320 }}>
              <ListItem leading={<FlaskConical />} title="Lipid panel" description="Collected 12 November" trailing="In range" href="#/spec/list" />
              <ListItem leading={<FlaskConical />} title="HbA1c" description="Collected 12 November" trailing="5.4%" href="#/spec/list" />
              <ListItem leading={<FlaskConical />} title="Thyroid panel" description="Collected 3 October" trailing="In range" href="#/spec/list" />
            </List>
          ),
        },
        {
          label: "Badge trailing",
          code: "<ListItem trailing={<Badge />} />",
          render: () => (
            <List style={{ width: 320 }}>
              <ListItem leading={<Pill />} title="Atorvastatin 20 mg" description="One tablet every morning" trailing={<Badge tone="success">Active</Badge>} />
              <ListItem leading={<Pill />} title="Lisinopril 10 mg" description="One tablet every evening" trailing={<Badge tone="warning">Refill due</Badge>} />
            </List>
          ),
        },
        {
          label: "Long text truncates",
          code: "<ListItem title=… description=… />",
          render: () => (
            <List style={{ width: 256 }}>
              <ListItem leading={<Pill />} title="Metformin hydrochloride extended release 500 mg" description="Two tablets twice a day with meals, morning and evening" trailing="90 days" />
            </List>
          ),
        },
      ],
    }),
  ],
};
