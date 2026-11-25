import * as React from "react";
import { LoadError } from "@/components/patterns/load-error";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function RetryExample() {
  const [attempts, setAttempts] = React.useState(0);
  return (
    <LoadError
      title="Couldn't load the call queue"
      detail={attempts === 0 ? "The request timed out after 30 seconds." : `Still not responding. Tried again ${attempts} ${attempts === 1 ? "time" : "times"}.`}
      onRetry={() => setAttempts((n) => n + 1)}
    />
  );
}

function Body() {
  return (
    <>
      <Demo
        id="load-error-full"
        files={["patterns/load-error", "ui/button"]}
        title="Full"
        note="Takes the place of a list or table that failed to load. The badge, the text and the button sit in a row, and stack centred on a small screen."
        bare
        className="items-stretch"
      >
        <RetryExample />
      </Demo>
      <Demo
        id="load-error-compact"
        files={["patterns/load-error", "ui/button"]}
        title="Compact"
        note="Smaller padding, badge and type, always in a row. Use it inside a KPI strip or a narrow card."
        bare
        className="flex-col items-stretch"
      >
        <LoadError variant="compact" title="Couldn't load today's claim totals" detail="The billing service returned an error (502)." onRetry={() => {}} />
        <LoadError variant="compact" title="Couldn't load wait times" onRetry={() => {}} />
      </Demo>
      <Demo
        id="load-error-no-retry"
        files={["patterns/load-error"]}
        title="Without retry"
        note="Leave out onRetry when trying again cannot help, such as a missing permission. detail is optional too."
        bare
        className="flex-col items-stretch"
      >
        <LoadError title="Couldn't load lab results" detail="Your account does not have access to this patient's chart. Ask a clinic admin to add you to the care team." />
        <LoadError variant="compact" title="Couldn't load voicemail" />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "load-error",
  title: "Load error",
  group: "Examples",
  summary: "Stands in for a section whose data failed to load: what went wrong, the error's detail and a button to try again. Provider app. Replaces LoadError and QueueLoadError.",
  keywords: "error failed retry try again alert fetch query empty state",
  Body,
};
