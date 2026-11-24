import { Kbd } from "@/components/ui/kbd";
import { type ComponentSpec, axis, list, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "kbd",
  sections: [
    matrix({
      title: "Kbd",
      note: "One key. It is square for a single character and grows sideways for a word.",
      rows: axis("content", ["K", "⌘", "Esc", "Enter", "Shift"]),
      states: ["default"],
      render: (p) => <Kbd>{p.content}</Kbd>,
    }),
    list({
      title: "Shortcuts",
      note: "A shortcut is one Kbd per key, set 4px apart.",
      items: [
        {
          label: "Two keys",
          code: "<Kbd>⌘</Kbd><Kbd>K</Kbd>",
          render: () => (
            <span className="inline-flex items-center gap-1">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
          ),
        },
        {
          label: "Three keys",
          code: "<Kbd>⌘</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd>",
          render: () => (
            <span className="inline-flex items-center gap-1">
              <Kbd>⌘</Kbd>
              <Kbd>Shift</Kbd>
              <Kbd>P</Kbd>
            </span>
          ),
        },
        {
          label: "In a sentence",
          code: "Press <Kbd>Esc</Kbd> to close",
          render: () => (
            <span className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground">
              Press <Kbd>Esc</Kbd> to close
            </span>
          ),
        },
      ],
    }),
  ],
};
