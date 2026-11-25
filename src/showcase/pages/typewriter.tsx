import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Replay({ children }: { children: React.ReactNode }) {
  const [run, setRun] = React.useState(0);
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div key={run} className="w-full">
        {children}
      </div>
      <Button variant="secondary" size="sm" onClick={() => setRun(run + 1)}>
        <RotateCcw /> Play again
      </Button>
    </div>
  );
}

function IntakeQuestion() {
  const [run, setRun] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <Typewriter key={run} as="h3" className="text-display-sm" text="How long have you had the headache?" onComplete={() => setReady(true)} />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={!ready}>
          Less than a day
        </Button>
        <Button variant="outline" disabled={!ready}>
          A few days
        </Button>
        <Button variant="outline" disabled={!ready}>
          More than a week
        </Button>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setReady(false);
          setRun(run + 1);
        }}
      >
        <RotateCcw /> Play again
      </Button>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="typewriter-words" files={["ui/typewriter"]} title="Word by word" note="The default. The text takes its full space from the start, so nothing below it moves while it appears. Screen readers get the whole sentence at once.">
        <Replay>
          <Typewriter className="max-w-prose text-body-lg" text="Your lipid panel from 12 November is back. LDL is 131 mg/dL, down from 148 in August. Dr. Okafor has reviewed it and made no changes to your medication." />
        </Replay>
      </Demo>
      <Demo id="typewriter-characters" files={["ui/typewriter"]} title="By character" note='Set by="char" for a short line, such as a greeting. Lower speed to keep the wait short.'>
        <Replay>
          <Typewriter as="h3" by="char" speed={28} className="text-display-sm" text="Good morning, Amara." />
        </Replay>
      </Demo>
      <Demo id="typewriter-lines" files={["ui/typewriter"]} title="Several lines" note="Pass an array to start each item on a new line. lineDelay is the pause between lines and delay the wait before the first word.">
        <Replay>
          <Typewriter
            className="max-w-prose text-body-lg"
            delay={300}
            lineDelay={700}
            text={["Thanks, that is everything we need.", "Dr. Ngozi Okafor will see your answers before the visit.", "Your video visit is on Thursday at 2:30 pm."]}
          />
        </Replay>
      </Demo>
      <Demo id="typewriter-on-complete" files={["ui/typewriter", "ui/button"]} title="When it finishes" note="onComplete runs once, after the last word. Here it enables the answers. Under reduced motion the text is shown at once and onComplete runs straight away.">
        <IntakeQuestion />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "typewriter",
  title: "Typewriter",
  group: "Components",
  summary: "Reveals text a word or a character at a time. Use it for greetings, intake questions and generated summaries. Do not use it for clinical values, errors or anything the person is waiting to read.",
  keywords: "typing animation reveal text streaming word by word type writer",
  Body,
};
