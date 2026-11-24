import { ArrowRight, CalendarPlus, Download } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const variants = ["primary", "outline", "secondary", "ghost", "destructive", "destructive-solid", "link"] as const;
const states = ["default", "hover", "focus", "pressed", "disabled", "loading"] as const;

export const spec: ComponentSpec = {
  slug: "button",
  sections: [
    matrix({
      title: "Button",
      note: "variant sets the emphasis, size the height. Loading keeps the width and swaps the label for a spinner.",
      rows: axis("variant", variants),
      groups: axis("size", ["sm", "md", "lg"]),
      states,
      render: (p, s) => (
        <Button variant={p.variant as ButtonProps["variant"]} size={p.size as ButtonProps["size"]} disabled={s.disabled} loading={s.is("loading")}>
          Button
        </Button>
      ),
    }),
    matrix({
      title: "Icon button",
      note: "Icon-only sizes are square. They need an aria-label and a tooltip.",
      rows: axis("variant", variants.filter((v) => v !== "link")),
      groups: axis("size", ["icon-sm", "icon-md", "icon-lg"]),
      states,
      render: (p, s) => (
        <Button variant={p.variant as ButtonProps["variant"]} size={p.size as ButtonProps["size"]} disabled={s.disabled} loading={s.is("loading")} aria-label="Download">
          <Download />
        </Button>
      ),
    }),
    list({
      title: "Content",
      note: "An icon goes before the label when it names the action and after it when it shows direction.",
      items: [
        { label: "Label only", code: "<Button>Book a visit</Button>", render: () => <Button>Book a visit</Button> },
        {
          label: "Leading icon",
          code: "<Button><CalendarPlus /> Book a visit</Button>",
          render: () => (
            <Button>
              <CalendarPlus /> Book a visit
            </Button>
          ),
        },
        {
          label: "Trailing icon",
          code: "<Button>Continue <ArrowRight /></Button>",
          render: () => (
            <Button>
              Continue <ArrowRight />
            </Button>
          ),
        },
      ],
    }),
  ],
};
