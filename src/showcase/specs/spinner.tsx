import { Spinner, TypingDots } from "@/components/ui/spinner";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const sizes: Record<string, string> = { "size-3": "size-3", "size-4": "size-4", "size-5": "size-5", "size-6": "size-6", "size-8": "size-8" };
const colors: Record<string, string> = { foreground: "text-foreground", muted: "text-muted-foreground", primary: "text-primary", destructive: "text-destructive" };

export const spec: ComponentSpec = {
  slug: "spinner",
  sections: [
    matrix({
      title: "Spinner",
      note: "Size and colour come from className: a size utility, and the text colour it inherits. size-4 is the default. Captured as a still.",
      rows: axis("color", Object.keys(colors)),
      groups: axis("size", Object.keys(sizes)),
      states: ["default"],
      render: (p) => <Spinner className={`${sizes[p.size]} ${colors[p.color]}`} />,
    }),
    matrix({
      title: "Typing dots",
      note: "Three dots that rise in sequence. Colour comes from the text colour it inherits. Captured as a still.",
      rows: axis("color", Object.keys(colors)),
      states: ["default"],
      render: (p) => <TypingDots className={colors[p.color]} />,
    }),
    list({
      title: "In context",
      items: [
        {
          label: "With a label",
          code: "<Spinner /> Loading lab results",
          render: () => (
            <span className="inline-flex items-center gap-2 text-body-sm text-muted-foreground">
              <Spinner label="" /> Loading lab results
            </span>
          ),
        },
        {
          label: "On a dark surface",
          code: '<Spinner className="text-inverse-foreground" />',
          render: () => (
            <span className="grid size-12 place-items-center rounded-lg bg-surface-inverse">
              <Spinner className="size-5 text-inverse-foreground" />
            </span>
          ),
        },
      ],
    }),
  ],
};
