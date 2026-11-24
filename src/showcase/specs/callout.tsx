import { Button } from "@/components/ui/button";
import { Callout, type CalloutProps } from "@/components/ui/callout";
import { type ComponentSpec, axis, matrix } from "./kit";

const tones = ["info", "success", "warning", "danger"] as const;
const titles: Record<string, string> = {
  info: "Fasting required",
  success: "Appointment confirmed",
  warning: "Refill due soon",
  danger: "Payment failed",
};
const bodies: Record<string, string> = {
  info: "Do not eat or drink anything except water for 8 hours before your lipid panel.",
  success: "Dr. Okafor will see you on Monday 23 November at 10:30.",
  warning: "Your atorvastatin runs out in 5 days. Request a refill to avoid a gap.",
  danger: "We could not charge the card ending 4821 for your visit on 12 November.",
};
const actions: Record<string, string> = { info: "Learn more", success: "Add to calendar", warning: "Request refill", danger: "Update card" };

export const spec: ComponentSpec = {
  slug: "callout",
  sections: [
    matrix({
      title: "Callout",
      note: "tone sets the icon and its colour. title and children are both optional; action sits at the end of the row.",
      rows: axis("tone", tones),
      states: ["title and body", "title only", "body only", "action"],
      render: (p, s) => (
        <div style={{ width: 416 }}>
          <Callout
            tone={p.tone as CalloutProps["tone"]}
            title={s.is("body only") ? undefined : titles[p.tone]}
            action={s.is("action") ? <Button variant="outline" size="sm">{actions[p.tone]}</Button> : undefined}
          >
            {s.is("title only") ? undefined : bodies[p.tone]}
          </Callout>
        </div>
      ),
    }),
    matrix({
      title: "Callout narrow",
      note: "In a narrow column the action wraps under the text.",
      rows: axis("tone", tones),
      states: ["default"],
      render: (p) => (
        <div className="w-72">
          <Callout tone={p.tone as CalloutProps["tone"]} title={titles[p.tone]} action={<Button variant="outline" size="sm">{actions[p.tone]}</Button>}>
            {bodies[p.tone]}
          </Callout>
        </div>
      ),
    }),
  ],
};
