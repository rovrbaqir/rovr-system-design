import { CopyButton, type CopyButtonProps } from "@/components/ui/copy-button";
import { type ComponentSpec, axis, list, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "copy-button",
  sections: [
    matrix({
      title: "Copy button",
      note: "A ghost icon-sm button by default. It takes every Button variant and icon size.",
      rows: axis("variant", ["ghost", "outline", "secondary"]),
      groups: axis("size", ["icon-sm", "icon-md", "icon-lg"]),
      states: ["default", "hover", "focus", "pressed", "disabled"],
      render: (p, s) => <CopyButton value="20418" label="Copy MRN" variant={p.variant as CopyButtonProps["variant"]} size={p.size as CopyButtonProps["size"]} disabled={s.disabled} />,
    }),
    list({
      title: "In context",
      note: "The button sits directly after the value it copies.",
      items: [
        {
          label: "After an identifier",
          code: '<CopyButton value="20418" label="Copy MRN" />',
          render: () => (
            <span className="flex items-center gap-1 text-body-sm">
              <span className="text-muted-foreground">MRN</span>
              <span className="font-mono">20418</span>
              <CopyButton value="20418" label="Copy MRN" />
            </span>
          ),
        },
        {
          label: "In a field",
          code: '<CopyButton value={link} label="Copy visit link" />',
          render: () => (
            <span className="flex h-control-md w-80 items-center justify-between gap-2 rounded-md border border-border-strong pr-1 pl-3 text-body-sm">
              <span className="truncate font-mono text-[0.8125rem]">rovr.health/visit/7f3k-92qd</span>
              <CopyButton value="https://rovr.health/visit/7f3k-92qd" label="Copy visit link" />
            </span>
          ),
        },
      ],
    }),
  ],
};
