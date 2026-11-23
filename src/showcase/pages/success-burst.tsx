import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SuccessBurst } from "@/components/ui/success-burst";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Replay() {
  const [burst, setBurst] = React.useState(0);
  return (
    <>
      <SuccessBurst key={burst} size={56} />
      <div className="flex flex-col gap-2">
        <p className="text-title-md">Appointment booked</p>
        <p className="text-body-sm text-muted-foreground">Thursday 3 December, 10:30 with Dr. Okafor</p>
        <Button variant="secondary" size="sm" className="w-fit" onClick={() => setBurst((b) => b + 1)}>
          Play again
        </Button>
      </div>
    </>
  );
}

function Sizes() {
  const [burst, setBurst] = React.useState(0);
  return (
    <>
      <SuccessBurst key={`sm-${burst}`} size={40} />
      <SuccessBurst key={`md-${burst}`} />
      <SuccessBurst key={`lg-${burst}`} size={96} />
      <Button variant="secondary" size="sm" onClick={() => setBurst((b) => b + 1)}>
        Play again
      </Button>
    </>
  );
}

function PaymentFlow() {
  const [state, setState] = React.useState<"review" | "paying" | "paid">("review");
  React.useEffect(() => {
    if (state !== "paying") return;
    const timer = setTimeout(() => setState("paid"), 1200);
    return () => clearTimeout(timer);
  }, [state]);
  return (
    <Card variant="outline" className="w-full max-w-sm items-center text-center">
      {state === "paid" ? (
        <>
          <SuccessBurst size={56} />
          <div className="flex flex-col gap-1">
            <p className="text-title-md">Payment received</p>
            <p className="text-body-sm text-muted-foreground">$25.00 copay for your visit on 12 November. A receipt is on its way to amara.osei@example.com.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setState("review")}>
            Start over
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <p className="text-title-md">Copay due</p>
            <p className="text-display-sm text-data">$25.00</p>
            <p className="text-body-sm text-muted-foreground">Follow-up with Dr. Okafor, 12 November</p>
          </div>
          <Button loading={state === "paying"} onClick={() => setState("paying")}>
            Pay $25.00
          </Button>
        </>
      )}
    </Card>
  );
}

function Body() {
  return (
    <>
      <Demo id="success-burst-basic" files={["ui/success-burst", "ui/button"]} title="Completion" note="A check pops in, a ring expands and a few particles fly out, once. For the end of a flow that took effort: a booking, an intake, a payment. Not for routine saves.">
        <Replay />
      </Demo>
      <Demo id="success-burst-sizes" files={["ui/success-burst", "ui/button"]} title="Sizes" note="size is the diameter of the check in pixels, 72 by default. The component reserves twice that, so the particles have room. It plays when it mounts; change its key to play it again.">
        <Sizes />
      </Demo>
      <Demo id="success-burst-in-a-flow" files={["ui/success-burst", "ui/card", "ui/button"]} title="At the end of a flow" note="Swap it in where the form was, with words that say what happened. With reduced motion the check simply appears." className="items-start">
        <PaymentFlow />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "success-burst",
  title: "Success burst",
  group: "Components",
  summary: "The app's small celebration for a finished flow: a check with a ring and a few brand-coloured particles. Use it once, at the end of something that took effort.",
  keywords: "celebration confetti done complete confirmation check animation",
  Body,
};
