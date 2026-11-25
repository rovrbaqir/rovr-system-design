import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { type ComponentSpec, list } from "./kit";

/** A stand-in for the area being covered. */
function Area({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-40 w-72 flex-col gap-2 rounded-xl rovr-risen p-5">
      <p className="text-title-sm">Coverage</p>
      <p className="text-body-sm text-muted-foreground">Aetna Choice POS II. Copay $25. Deductible met $640 of $1,500.</p>
      {children}
    </div>
  );
}

export const spec: ComponentSpec = {
  slug: "loading-overlay",
  sections: [
    list({
      title: "Loading overlay",
      note: "Shown over a card. The fullscreen form covers the viewport from a portal and is not captured here. Captured as a still.",
      items: [
        {
          label: "Default",
          code: "<LoadingOverlay />",
          render: () => (
            <Area>
              <LoadingOverlay />
            </Area>
          ),
        },
        {
          label: "With a message",
          code: '<LoadingOverlay message="Checking your plan with Aetna" />',
          render: () => (
            <Area>
              <LoadingOverlay message="Checking your plan with Aetna" />
            </Area>
          ),
        },
        {
          label: "Without blur",
          code: "<LoadingOverlay blur={false} />",
          render: () => (
            <Area>
              <LoadingOverlay blur={false} message="Saving" />
            </Area>
          ),
        },
      ],
    }),
  ],
};
