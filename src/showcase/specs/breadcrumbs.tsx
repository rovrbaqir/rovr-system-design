import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const trail = [
  { label: "Patients", href: "#/spec/breadcrumbs" },
  { label: "Amara Osei", href: "#/spec/breadcrumbs" },
  { label: "Lab results", href: "#/spec/breadcrumbs" },
  { label: "Lipid panel, 12 Nov 2026" },
];

export const spec: ComponentSpec = {
  slug: "breadcrumbs",
  sections: [
    matrix({
      title: "Breadcrumbs",
      note: "The last item is the current page and is never a link. Hover, focus and pressed are shown on the first link.",
      rows: axis("items", ["2", "3", "4"]),
      states: ["default", "hover", "focus", "pressed"],
      target: "a",
      render: (p) => {
        const count = Number(p.items);
        return <Breadcrumbs items={[...trail.slice(0, count - 1), { label: trail[count - 1].label }]} />;
      },
    }),
    list({
      title: "Items",
      items: [
        { label: "Item without href", code: '{ label: "Amara Osei" }', render: () => <Breadcrumbs items={[{ label: "Patients", href: "#/spec/breadcrumbs" }, { label: "Amara Osei" }, { label: "Medications" }]} /> },
        { label: "Single item", code: 'items={[{ label: "Patients" }]}', render: () => <Breadcrumbs items={[{ label: "Patients" }]} /> },
      ],
    }),
  ],
};
