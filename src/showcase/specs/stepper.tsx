import { Stepper } from "@/components/ui/stepper";
import { type ComponentSpec, axis, matrix } from "./kit";

const steps = [
  { label: "Reason", description: "Your concern" },
  { label: "Clinician", description: "Who you see" },
  { label: "Time", description: "Pick a slot" },
  { label: "Confirm", description: "Review" },
];
const position: Record<string, number> = { first: 0, second: 1, last: 3, finished: 4 };

export const spec: ComponentSpec = {
  slug: "stepper",
  sections: [
    matrix({
      title: "Stepper",
      note: "current is the zero-based index of the step in progress. Steps before it are done; setting it past the end marks every step done.",
      rows: axis("description", ["false", "true"]),
      states: ["first", "second", "last", "finished"],
      render: (p, s) => (
        <div className="w-[26rem]">
          <Stepper current={position[s.name]} steps={p.description === "true" ? steps : steps.map((step) => ({ label: step.label }))} />
        </div>
      ),
    }),
    matrix({
      title: "Step",
      note: "One step in each of its three states.",
      rows: axis("description", ["false", "true"]),
      states: ["upcoming", "current", "done"],
      render: (p, s) => (
        <div>
          <Stepper current={s.is("upcoming") ? -1 : s.is("current") ? 0 : 1} steps={[p.description === "true" ? { label: "Clinician", description: "Who you see" } : { label: "Clinician" }]} />
        </div>
      ),
    }),
    matrix({
      title: "Stepper length",
      rows: axis("steps", ["2", "3", "4"]),
      states: ["default"],
      render: (p) => (
        <div className="w-[26rem]">
          <Stepper current={1} steps={steps.slice(0, Number(p.steps)).map((step) => ({ label: step.label }))} />
        </div>
      ),
    }),
  ],
};
