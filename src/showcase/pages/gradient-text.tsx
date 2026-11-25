import { GradientText } from "@/components/ui/gradient-text";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="gradient-text-variants" files={["ui/gradient-text"]} title="Variants" note="Brand runs from navy to the brand blue, and from a pale blue to a lighter blue in dark mode. Pulse is for Pulse features only." className="flex-col items-start gap-4">
        <GradientText>Good morning, Amara</GradientText>
        <GradientText variant="pulse">Pulse summarised your last visit</GradientText>
      </Demo>
      <Demo id="gradient-text-elements" files={["ui/gradient-text"]} title="Elements" note="Set as to the heading level the page needs. Each level gets its display size; p and span keep the size of the text around them." className="flex-col items-start gap-3">
        <GradientText as="h1">Your health, in one place</GradientText>
        <GradientText as="h2">Tell us about your symptoms</GradientText>
        <GradientText as="h3">Upcoming visits</GradientText>
        <GradientText as="h4">Lab results from 12 November</GradientText>
      </Demo>
      <Demo id="gradient-text-inline" files={["ui/gradient-text"]} title="Inside a sentence" note="Use a span to pick out a few words of a headline. The text still selects and copies as normal." className="flex-col items-start">
        <h2 className="text-display-md">
          Your LDL is down 17 points. <GradientText as="span">Keep taking atorvastatin.</GradientText>
        </h2>
        <p className="max-w-prose text-body-lg text-muted-foreground">
          Dr. Okafor reviewed your lipid panel and <GradientText as="span" className="font-medium">made no changes</GradientText> to your plan.
        </p>
      </Demo>
      <Demo id="gradient-text-shimmer" files={["ui/gradient-text"]} title="Shimmer" note="A slow band of light crosses the text while something is being prepared. It stops under reduced motion and the gradient stays." className="flex-col items-start gap-4">
        <GradientText as="h3" shimmer>
          Reading your intake answers
        </GradientText>
        <GradientText as="h3" variant="pulse" shimmer>
          Pulse is drafting the visit note
        </GradientText>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "gradient-text",
  title: "Gradient text",
  group: "Components",
  summary: "Text filled with the brand gradient, for one headline or a few words of emphasis on a page. Not for body text, labels or clinical values.",
  keywords: "heading headline radial gradient holographic shimmer brand title pulse",
  Body,
};
