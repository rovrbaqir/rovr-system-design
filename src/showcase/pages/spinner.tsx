import * as React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function CoverageCheck() {
  const [state, setState] = React.useState<"idle" | "checking" | "done">("idle");
  React.useEffect(() => {
    if (state !== "checking") return;
    const timer = setTimeout(() => setState("done"), 1800);
    return () => clearTimeout(timer);
  }, [state]);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="secondary" disabled={state === "checking"} onClick={() => setState("checking")}>
        Check coverage
      </Button>
      <p role="status" className="flex items-center gap-2 text-body-sm text-muted-foreground">
        {state === "checking" && (
          <>
            <Spinner label="" /> Checking your plan with Aetna
          </>
        )}
        {state === "done" && "Covered. Estimated copay is $25."}
      </p>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="spinner-sizes" files={["ui/spinner"]} title="Sizes" note="Sized with a size class; the default is 16px, to sit in a line of text or a button.">
        <Spinner className="size-3" />
        <Spinner />
        <Spinner className="size-5" />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </Demo>
      <Demo id="spinner-colour" files={["ui/spinner"]} title="Colour" note="It takes the text colour of whatever it sits in. Set a text colour class to change it.">
        <Spinner className="size-5" />
        <Spinner className="size-5 text-primary" />
        <Spinner className="size-5 text-muted-foreground" />
        <span className="grid size-10 place-items-center rounded-full bg-surface-inverse text-inverse-foreground">
          <Spinner className="size-5" />
        </span>
      </Demo>
      <Demo id="spinner-label" files={["ui/spinner", "ui/button"]} title="With words" note='Its accessible name is "Loading" unless you pass label. When visible text already says what is happening, pass an empty label so it is not announced twice. Press the button.' className="flex-col items-start gap-5">
        <p className="flex items-center gap-2 text-body-sm text-muted-foreground">
          <Spinner label="Sending message" /> Sending
        </p>
        <CoverageCheck />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "spinner",
  title: "Spinner",
  group: "Components",
  summary: "Indeterminate progress for a short wait, such as a button or a line of status. Prefer Skeleton when content is loading and Progress when the amount is known.",
  keywords: "loading loader busy wait activity indicator",
  Body,
};
