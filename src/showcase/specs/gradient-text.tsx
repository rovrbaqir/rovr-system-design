import { GradientText, type GradientTextProps } from "@/components/ui/gradient-text";
import { type ComponentSpec, axis, list, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "gradient-text",
  sections: [
    matrix({
      title: "Gradient text",
      note: "variant picks the gradient and as the element, which sets the size. Shimmer is captured as a still.",
      rows: axis("variant", ["brand", "pulse"]),
      groups: axis("as", ["h1", "h2", "h3", "h4"]),
      states: ["default", "shimmer"],
      render: (p, s) => (
        <GradientText variant={p.variant as GradientTextProps["variant"]} as={p.as as GradientTextProps["as"]} shimmer={s.is("shimmer")} className="whitespace-nowrap">
          Good morning
        </GradientText>
      ),
    }),
    list({
      title: "In context",
      items: [
        {
          label: "Inside a headline",
          code: '<GradientText as="span">Keep taking atorvastatin.</GradientText>',
          render: () => (
            <h2 className="max-w-sm text-display-sm">
              Your LDL is down 17 points. <GradientText as="span">Keep taking atorvastatin.</GradientText>
            </h2>
          ),
        },
        {
          label: "Inside a paragraph",
          code: '<GradientText as="span">made no changes</GradientText>',
          render: () => (
            <p className="max-w-xs text-body">
              Dr. Okafor reviewed your lipid panel and <GradientText as="span" className="font-medium">made no changes</GradientText> to your plan.
            </p>
          ),
        },
      ],
    }),
  ],
};
