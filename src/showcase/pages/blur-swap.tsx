import * as React from "react";
import { Bell, BellOff, Check, Minus, Plus, UserPlus } from "lucide-react";
import { BlurSwap } from "@/components/ui/blur-swap";
import { Button } from "@/components/ui/button";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function MuteButton() {
  const [muted, setMuted] = React.useState(false);
  return (
    <Button variant="outline" size="icon-md" aria-label={muted ? "Turn reminders on" : "Turn reminders off"} aria-pressed={muted} onClick={() => setMuted((m) => !m)}>
      <BlurSwap swapKey={muted ? "off" : "on"}>{muted ? <BellOff /> : <Bell />}</BlurSwap>
    </Button>
  );
}

function FollowButton() {
  const [added, setAdded] = React.useState(false);
  return (
    <Button variant={added ? "secondary" : "primary"} onClick={() => setAdded((a) => !a)}>
      <BlurSwap swapKey={added ? "added" : "add"} className="gap-2">
        {added ? <Check /> : <UserPlus />}
        {added ? "On care team" : "Add to care team"}
      </BlurSwap>
    </Button>
  );
}

function RefillCounter() {
  const [refills, setRefills] = React.useState(3);
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="icon-md" aria-label="One fewer refill" disabled={refills === 0} onClick={() => setRefills((r) => r - 1)}>
        <Minus />
      </Button>
      <p className="flex w-24 flex-col items-center" aria-live="polite">
        <BlurSwap swapKey={refills} className="text-[1.75rem] leading-none font-medium text-data">
          {refills}
        </BlurSwap>
        <span className="mt-1 text-caption text-muted-foreground">{refills === 1 ? "refill" : "refills"}</span>
      </p>
      <Button variant="outline" size="icon-md" aria-label="One more refill" disabled={refills === 12} onClick={() => setRefills((r) => r + 1)}>
        <Plus />
      </Button>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="blur-swap-icon" files={["ui/blur-swap", "ui/button"]} title="Icon swap" note="Change swapKey when the content changes. The old icon softens and shrinks out as the new one sharpens in. Press the button.">
        <MuteButton />
      </Demo>
      <Demo id="blur-swap-label" files={["ui/blur-swap", "ui/button"]} title="Label that changes in place" note="For a button whose label reports the new state. The swap carries an icon and text together.">
        <FollowButton />
      </Demo>
      <Demo id="blur-swap-counter" files={["ui/blur-swap", "ui/button"]} title="Counter" note="A number as the swapKey: every change resolves into the next value. With reduced motion it is a plain fade.">
        <RefillCounter />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "blur-swap",
  title: "Blur swap",
  group: "Components",
  summary: "Replaces content in place by blurring the old out as the new sharpens in, as the mobile app does. Use it for icon swaps, labels that change in place and counters.",
  keywords: "animation transition replace crossfade icon swap blur",
  Body,
};
