import * as React from "react";
import { Button } from "@/components/ui/button";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function IntakeProgress() {
  const [progress, setProgress] = React.useState(48);
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-4">
        <Progress value={progress} aria-label="Intake form progress" />
        <span className="w-10 text-right text-body-sm font-medium text-data">{progress}%</span>
      </div>
      <div className="flex items-center gap-4">
        <ProgressRing value={progress} label="Intake form progress">
          {progress}
        </ProgressRing>
        <Button variant="secondary" size="sm" onClick={() => setProgress((p) => (p >= 100 ? 12 : Math.min(100, p + 18)))}>
          Advance
        </Button>
      </div>
    </div>
  );
}

function UploadProgress() {
  const [value, setValue] = React.useState<number | null>(0);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => {
    if (!running) return;
    // Unknown size first, then a measured upload.
    setValue(null);
    let timer: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      setValue(0);
      timer = setInterval(() => setValue((v) => Math.min(100, (v ?? 0) + 20)), 450);
    }, 1600);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [running]);
  React.useEffect(() => {
    if (value === 100) setRunning(false);
  }, [value]);
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-label">insurance-card-front.jpg</p>
        <p className="text-body-sm text-muted-foreground text-data">{value === null ? "Preparing" : value === 100 ? "Uploaded" : `${value}%`}</p>
      </div>
      <Progress value={value} tone={value === 100 ? "success" : "primary"} aria-label="Uploading insurance card" />
      <Button variant="secondary" size="sm" className="w-fit" disabled={running} onClick={() => setRunning(true)}>
        {value === 100 ? "Upload again" : "Upload"}
      </Button>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="progress-bar" files={["ui/progress", "ui/button"]} title="Bar and ring" note="Both take a value from 0 to 100 and glide to it. Show the figure next to a bar; a ring holds it in the centre. Give each a label." className="items-start">
        <IntakeProgress />
      </Demo>
      <Demo id="progress-sizes" files={["ui/progress"]} title="Sizes and tones" note="Medium is the default. Small is for cards and table rows. Tone follows the meaning of the value, never decoration." className="flex-col items-stretch gap-5">
        <Progress value={64} aria-label="Care plan completion" />
        <Progress value={64} size="sm" aria-label="Care plan completion" />
        <Progress value={92} tone="success" aria-label="Medication adherence" />
        <Progress value={58} tone="warning" aria-label="Fluid intake" />
        <Progress value={21} tone="danger" aria-label="Refill supply remaining" />
      </Demo>
      <Demo id="progress-indeterminate" files={["ui/progress", "ui/button"]} title="Indeterminate" note="Pass value={null} while the amount of work is unknown, then switch to a number as soon as there is one. Press Upload." className="flex-col items-stretch gap-6">
        <Progress value={null} aria-label="Checking coverage" />
        <Progress value={null} size="sm" aria-label="Syncing results" />
        <UploadProgress />
      </Demo>
      <Demo id="progress-ring-tones" files={["ui/progress"]} title="Ring tones and sizes" note="Four tones. size and strokeWidth are in pixels; the children sit in the centre.">
        <ProgressRing value={64} label="Care plan completion">
          64
        </ProgressRing>
        <ProgressRing value={92} tone="success" label="Medication adherence">
          92
        </ProgressRing>
        <ProgressRing value={58} tone="warning" label="Fluid intake">
          58
        </ProgressRing>
        <ProgressRing value={21} tone="danger" label="Refill supply remaining">
          21
        </ProgressRing>
        <ProgressRing value={75} size={32} strokeWidth={4} label="Intake form progress" />
        <ProgressRing value={75} size={88} strokeWidth={7} tone="success" label="Sleep goal">
          6 h
        </ProgressRing>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "progress",
  title: "Progress",
  group: "Components",
  summary: "A bar or a ring for work that is under way: a form being filled in, a file uploading. Use Meter for a measured amount and Segments for a few known steps.",
  keywords: "progress bar loading ring circular indeterminate upload percent",
  Body,
};
