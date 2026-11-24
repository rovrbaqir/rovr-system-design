import { Calendar } from "@/components/ui/calendar";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const noop = () => {};
const dec = (day: number) => new Date(2026, 11, day);
const weekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
const isThe15th = (d: Date) => d.getMonth() === 11 && d.getDate() === 15;

export const spec: ComponentSpec = {
  slug: "calendar",
  sections: [
    matrix({
      title: "Calendar",
      note: "empty opens on the current month with a dot under today. blocked uses isDisabled to rule out weekends.",
      rows: axis("mode", ["single", "range"]),
      states: ["empty", "selected", "blocked"],
      render: (p, s) => {
        const isDisabled = s.is("blocked") ? weekend : undefined;
        if (p.mode === "range") return <Calendar mode="range" value={s.is("empty") ? { from: null, to: null } : { from: dec(8), to: dec(17) }} onValueChange={noop} isDisabled={isDisabled} />;
        return <Calendar value={s.is("empty") ? null : dec(3)} onValueChange={noop} isDisabled={isDisabled} />;
      },
    }),
    matrix({
      title: "Calendar day",
      note: "The states are shown on 15 December. In range is a day between the two ends of a chosen range.",
      rows: axis("day", ["default", "selected", "in range"]),
      states: ["default", "hover", "focus", "pressed", "disabled"],
      target: '[aria-label*="December 15"]',
      render: (p, s) => {
        const isDisabled = s.disabled ? isThe15th : undefined;
        if (p.day === "in range") return <Calendar mode="range" value={{ from: dec(12), to: dec(18) }} onValueChange={noop} isDisabled={isDisabled} />;
        return <Calendar value={p.day === "selected" ? dec(15) : dec(3)} onValueChange={noop} isDisabled={isDisabled} />;
      },
    }),
    list({
      title: "Other props",
      items: [
        { label: "Week starts on Monday", code: "weekStartsOn={1}", render: () => <Calendar value={dec(3)} onValueChange={noop} weekStartsOn={1} /> },
        { label: "Bounded", code: "min={…} max={…}", render: () => <Calendar value={dec(10)} onValueChange={noop} min={dec(7)} max={dec(24)} /> },
        { label: "Range with one end chosen", code: 'mode="range" value={{ from, to: null }}', render: () => <Calendar mode="range" value={{ from: dec(8), to: null }} onValueChange={noop} /> },
      ],
    }),
  ],
};
