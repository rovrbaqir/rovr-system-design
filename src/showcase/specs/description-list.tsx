import { Badge } from "@/components/ui/badge";
import { DescriptionItem, DescriptionList } from "@/components/ui/description-list";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const items = (
  <>
    <DescriptionItem label="Patient">Amara Osei</DescriptionItem>
    <DescriptionItem label="Date of birth">14 March 1986</DescriptionItem>
    <DescriptionItem label="Member ID">RV-204-881</DescriptionItem>
    <DescriptionItem label="Primary provider">Dr. Ngozi Okafor</DescriptionItem>
    <DescriptionItem label="Blood type">O positive</DescriptionItem>
    <DescriptionItem label="Allergies">Penicillin</DescriptionItem>
  </>
);

export const spec: ComponentSpec = {
  slug: "description-list",
  sections: [
    matrix({
      title: "Description list",
      note: "columns sets how many pairs sit side by side from the sm breakpoint up. Below it the list is always one column.",
      rows: axis("columns", ["1", "2", "3"]),
      states: ["default"],
      render: (p) => (
        <div style={{ width: 576 }}>
          <DescriptionList columns={Number(p.columns) as 1 | 2 | 3}>{items}</DescriptionList>
        </div>
      ),
    }),
    list({
      title: "Description item",
      note: "One label and value pair. The value can be text or any content.",
      items: [
        { label: "Text value", code: '<DescriptionItem label="Member ID">RV-204-881</DescriptionItem>', render: () => <DescriptionItem label="Member ID">RV-204-881</DescriptionItem> },
        {
          label: "Badge value",
          code: '<DescriptionItem label="Status"><Badge tone="success">Active</Badge></DescriptionItem>',
          render: () => (
            <DescriptionItem label="Status">
              <Badge tone="success">Active</Badge>
            </DescriptionItem>
          ),
        },
        {
          label: "Long value",
          code: '<DescriptionItem label="Address">…</DescriptionItem>',
          render: () => (
            <DescriptionItem label="Address" className="w-56">
              48 Harbour Road, Flat 3, Riverside, London SE10 9QT
            </DescriptionItem>
          ),
        },
        { label: "Empty value", code: '<DescriptionItem label="Secondary insurance">None</DescriptionItem>', render: () => <DescriptionItem label="Secondary insurance">None</DescriptionItem> },
      ],
    }),
  ],
};
