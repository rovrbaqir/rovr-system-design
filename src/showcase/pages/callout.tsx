import * as React from "react";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function InsuranceCheck() {
  const [state, setState] = React.useState<"idle" | "failed" | "verified">("idle");
  const [memberId, setMemberId] = React.useState("RVR-2041-8831");
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Field>
        <FieldLabel>Member ID</FieldLabel>
        <Input value={memberId} onChange={(event) => setMemberId(event.target.value)} className="text-data" autoComplete="off" />
      </Field>
      {state === "failed" && (
        <Callout tone="danger" role="alert" title="Could not verify insurance">
          The member ID should have 14 characters. Check it against your card.
        </Callout>
      )}
      {state === "verified" && (
        <Callout tone="success" role="alert" title="Insurance verified">
          Your plan covers this visit. Estimated copay is $25.
        </Callout>
      )}
      <Button className="w-fit" onClick={() => setState(memberId.trim().length === 14 ? "verified" : "failed")}>
        Verify insurance
      </Button>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="callout-tones" files={["ui/callout"]} title="Tones" note="Four tones, each with its own icon, so the meaning never rests on colour alone. Info is the default." bare className="flex-col items-stretch">
        <Callout title="Join from this page">The video room opens 10 minutes before your visit.</Callout>
        <Callout tone="success" title="Insurance verified">
          Your plan covers this visit. Estimated copay is $25.
        </Callout>
        <Callout tone="warning" title="Fasting required before this test">
          Do not eat or drink anything except water for 10 hours before your lipid panel.
        </Callout>
        <Callout tone="danger" title="Could not verify insurance">
          The member ID on file was not recognised. Check it against your card.
        </Callout>
      </Demo>
      <Demo id="callout-with-action" files={["ui/callout", "ui/button"]} title="With an action" note="The action resolves the message and sits at the end of the row. It wraps under the text when the callout is narrow." bare className="flex-col items-stretch">
        <Callout tone="warning" title="Fasting required before this test" action={<Button size="sm" variant="outline">Add reminder</Button>}>
          Do not eat or drink anything except water for 10 hours before your lipid panel.
        </Callout>
        <Callout
          tone="danger"
          title="Could not verify insurance"
          action={
            <>
              <Button size="sm" variant="ghost">
                Pay without insurance
              </Button>
              <Button size="sm" variant="outline">
                Update card
              </Button>
            </>
          }
        >
          The member ID on file was not recognised. Check it against your card.
        </Callout>
      </Demo>
      <Demo id="callout-content" files={["ui/callout", "ui/button"]} title="Title or text alone" note="Both the title and the body are optional. A single line works for a short notice." bare className="flex-col items-stretch">
        <Callout tone="success" title="Results shared with your care team" />
        <Callout>Dr. Okafor usually replies within one working day.</Callout>
        <Callout tone="warning" action={<Button size="sm" variant="outline">Renew</Button>}>
          Metformin 500 mg has no refills left.
        </Callout>
      </Demo>
      <Demo id="callout-in-response" files={["ui/callout", "ui/field", "ui/input", "ui/button"]} title="In response to an action" note='When a callout appears because of something the person did, give it role="alert" so screen readers announce it. Press Verify, then add a digit and press it again.' className="items-start">
        <InsuranceCheck />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "callout",
  title: "Callout",
  group: "Components",
  summary: "An inline message that stays on the page, next to the thing it is about. Use it for preparation instructions, verification results and errors the person must act on.",
  keywords: "alert notice message inline info warning error",
  Body,
};
