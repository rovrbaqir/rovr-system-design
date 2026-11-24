import { Banner, type BannerProps } from "@/components/ui/banner";
import { type ComponentSpec, axis, matrix } from "./kit";

const tones = ["info", "warning", "danger", "neutral"] as const;
const words: Record<string, string> = {
  info: "Flu vaccines are now available at all clinics.",
  warning: "Scheduled maintenance on Sunday from 02:00 to 04:00.",
  danger: "Your session has expired. Sign in again to continue.",
  neutral: "You are viewing this record in read-only mode.",
};
const actions: Record<string, string> = { info: "Book a slot", warning: "Details", danger: "Sign in", neutral: "Request access" };
const noop = () => {};

export const spec: ComponentSpec = {
  slug: "banner",
  sections: [
    matrix({
      title: "Banner",
      note: "A page-wide message. action adds a link after the text and onDismiss adds the close button.",
      rows: axis("tone", tones),
      states: ["default", "action", "dismissible", "action and dismissible"],
      render: (p, s) => (
        <div style={{ width: 576 }}>
          <Banner
            tone={p.tone as BannerProps["tone"]}
            action={s.name.startsWith("action") ? <a href="#/spec/banner" className="underline">{actions[p.tone]}</a> : undefined}
            onDismiss={s.name.endsWith("dismissible") ? noop : undefined}
          >
            {words[p.tone]}
          </Banner>
        </div>
      ),
    }),
    matrix({
      title: "Banner dismiss button",
      note: "States of the close button.",
      rows: axis("tone", tones),
      states: ["default", "hover", "focus", "pressed"],
      target: "button",
      render: (p) => (
        <div style={{ width: 464 }}>
          <Banner tone={p.tone as BannerProps["tone"]} onDismiss={noop}>
            {words[p.tone]}
          </Banner>
        </div>
      ),
    }),
    matrix({
      title: "Banner narrow",
      note: "On a narrow screen the action and close button wrap under the text.",
      rows: axis("tone", tones),
      states: ["default"],
      render: (p) => (
        <div className="w-56">
          <Banner tone={p.tone as BannerProps["tone"]} action={<a href="#/spec/banner" className="underline">{actions[p.tone]}</a>} onDismiss={noop}>
            {words[p.tone]}
          </Banner>
        </div>
      ),
    }),
  ],
};
