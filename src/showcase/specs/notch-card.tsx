import { CalendarPlus } from "lucide-react";
import { NotchCard, RoundAction, type NotchCardProps, type RoundActionProps } from "@/components/ui/notch-card";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const tones = ["surface", "sunken", "aurora", "tint", "ink"] as const;
const titles: Record<string, string> = { surface: "Visit summary", sunken: "Intake form", aurora: "Your care plan", tint: "Lipid panel", ink: "Video visit" };
const lines: Record<string, string> = { surface: "12 November", sunken: "4 of 6 pages", aurora: "For December", tint: "Results ready", ink: "Starts in 10 minutes" };
// The action tone that reads on each card tone, as on the docs page.
const actionTone: Record<string, RoundActionProps["tone"]> = { surface: "primary", sunken: "primary", aurora: "surface", tint: "ink", ink: "primary" };
const actionTones = ["primary", "ink", "surface"] as const;
const states = ["default", "hover", "focus", "pressed"] as const;

export const spec: ComponentSpec = {
  slug: "notch-card",
  sections: [
    matrix({
      title: "Notch card",
      note: "tone sets the surface. With an action, the bottom-right corner is cut away and the action rests in the cut; the notch grows to fit it.",
      rows: axis("tone", tones),
      states: ["default", "action", "icon action"],
      render: (p, s) => (
        <NotchCard
          tone={p.tone as NotchCardProps["tone"]}
          className="min-h-40 w-72 justify-between gap-6"
          action={s.is("default") ? undefined : <RoundAction size="md" tone={actionTone[p.tone]} href="#/spec/notch-card" label="Open" iconOnly={s.is("icon action")} />}
        >
          <p className="text-title-md">{titles[p.tone]}</p>
          <p className="pr-24 text-body-sm opacity-70">{lines[p.tone]}</p>
        </NotchCard>
      ),
    }),
    matrix({
      title: "Round action",
      note: "The pill that sits in the notch. Its arrow leans up and right on hover.",
      rows: axis("tone", actionTones),
      groups: axis("size", ["md", "lg"]),
      states,
      render: (p) => <RoundAction href="#/spec/notch-card" tone={p.tone as RoundActionProps["tone"]} size={p.size as RoundActionProps["size"]} label="Book now" />,
    }),
    matrix({
      title: "Round action icon only",
      note: "iconOnly hides the words where the card already says what the action does.",
      rows: axis("tone", actionTones),
      groups: axis("size", ["md", "lg"]),
      states,
      render: (p) => <RoundAction href="#/spec/notch-card" iconOnly tone={p.tone as RoundActionProps["tone"]} size={p.size as RoundActionProps["size"]} label="Open lipid panel" />,
    }),
    list({
      title: "Content",
      items: [
        {
          label: "Custom icon",
          code: '<RoundAction label="New appointment" icon={<CalendarPlus />} />',
          render: () => <RoundAction href="#/spec/notch-card" tone="ink" size="md" label="New appointment" icon={<CalendarPlus aria-hidden />} />,
        },
        {
          label: "Large action",
          code: '<NotchCard tone="aurora" action={<RoundAction label="Book now" />} />',
          render: () => (
            <NotchCard tone="aurora" className="min-h-56 justify-between gap-6" style={{ width: 320 }} action={<RoundAction href="#/spec/notch-card" label="Book now" />}>
              <p className="text-title-lg text-white">Annual check-up</p>
              <p className="pr-36 text-body-sm text-white/85">Monday 23 November at 10:30</p>
            </NotchCard>
          ),
        },
        {
          label: "Inside another surface",
          code: '<div className="[--notch-bg:var(--surface-sunken)]"><NotchCard … /></div>',
          render: () => (
            <div className="rounded-xl bg-surface-sunken p-4 [--notch-bg:var(--surface-sunken)]">
              <NotchCard className="min-h-40 w-72 justify-between gap-6" action={<RoundAction size="md" href="#/spec/notch-card" label="Request refill" />}>
                <p className="text-title-md">Atorvastatin 20 mg</p>
                <p className="pr-36 text-body-sm text-muted-foreground">2 refills left</p>
              </NotchCard>
            </div>
          ),
        },
      ],
    }),
  ],
};
