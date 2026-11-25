import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DescriptionItem, DescriptionList } from "@/components/ui/description-list";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Demo } from "../kit";
import type { DocPage } from "../types";

/** Runs a pretend request for `ms` milliseconds. */
function useBusy(ms: number) {
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => {
    if (!busy) return;
    const timer = setTimeout(() => setBusy(false), ms);
    return () => clearTimeout(timer);
  }, [busy, ms]);
  return [busy, () => setBusy(true)] as const;
}

function Coverage() {
  return (
    <DescriptionList columns={2}>
      <DescriptionItem label="Plan">Aetna Choice POS II</DescriptionItem>
      <DescriptionItem label="Member ID">
        <span className="font-mono">W2041 88317</span>
      </DescriptionItem>
      <DescriptionItem label="Copay">
        <span className="text-data">$25</span>
      </DescriptionItem>
      <DescriptionItem label="Deductible met">
        <span className="text-data">$640 of $1,500</span>
      </DescriptionItem>
    </DescriptionList>
  );
}

function CoverageCard({ message, blur, delay, ms = 2200 }: { message?: string; blur?: boolean; delay?: number; ms?: number }) {
  const [busy, start] = useBusy(ms);
  return (
    <Card className="relative w-full max-w-md">
      <CardHeader>
        <div>
          <CardTitle>Coverage</CardTitle>
          <CardDescription>Checked on 14 November</CardDescription>
        </div>
        <Button variant="secondary" size="sm" onClick={start}>
          Check again
        </Button>
      </CardHeader>
      <Coverage />
      <LoadingOverlay open={busy} message={message} blur={blur} delay={delay} />
    </Card>
  );
}

function FullscreenSave() {
  const [busy, start] = useBusy(2400);
  return (
    <>
      <Button onClick={start}>Sign and close visit</Button>
      <LoadingOverlay fullscreen open={busy} message="Signing the visit note" />
    </>
  );
}

function Body() {
  return (
    <>
      <Demo id="loading-overlay-area" files={["ui/loading-overlay", "ui/spinner", "ui/card"]} title="Over an area" note="It covers its nearest positioned parent, so give that parent relative. The parent is marked aria-busy while the overlay is up. Press Check again." bare className="items-start">
        <CoverageCard />
      </Demo>
      <Demo id="loading-overlay-message" files={["ui/loading-overlay", "ui/spinner", "ui/card"]} title="With a message" note="Say what is happening when the wait is longer than a second or two. The message is announced to screen readers." bare className="items-start">
        <CoverageCard message="Checking your plan with Aetna" />
      </Demo>
      <Demo id="loading-overlay-delay" files={["ui/loading-overlay", "ui/spinner", "ui/card"]} title="Delay" note="With delay the overlay waits before it appears, so a fast response never flashes it. The first card answers in 250 ms and shows nothing; the second takes 2 seconds." bare className="items-start gap-6">
        <CoverageCard delay={400} ms={250} />
        <CoverageCard delay={400} ms={2000} />
      </Demo>
      <Demo id="loading-overlay-no-blur" files={["ui/loading-overlay", "ui/spinner", "ui/card"]} title="Without blur" note="Turn blur off over video or a very large area. The veil is a little stronger to keep the spinner readable." bare className="items-start">
        <CoverageCard blur={false} message="Saving" />
      </Demo>
      <Demo id="loading-overlay-fullscreen" files={["ui/loading-overlay", "ui/spinner", "ui/button"]} title="Full screen" note="For a step that must finish before anything else can happen, such as signing a visit. It renders in a portal over a neutral scrim, with the spinner on its own panel.">
        <FullscreenSave />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "loading-overlay",
  title: "Loading overlay",
  group: "Components",
  summary: "A layer that blocks a card, a panel or the whole screen while it loads or saves. Prefer Skeleton when content loads for the first time and a loading Button when one action is pending.",
  keywords: "loader loading spinner blocking busy wait scrim backdrop full screen page loader",
  Body,
};
