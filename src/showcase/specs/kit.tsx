import * as React from "react";
import { cn } from "@/lib/utils";

// A spec sheet shows one component in every combination of its props and
// states, as a labelled grid. The sheets are what the Figma library is built
// from (figma/README.md), so every cell renders the real component.

export interface Axis {
  /** The prop as written in code, e.g. `variant`. */
  prop: string;
  values: readonly string[];
}

export interface SpecState {
  /** The state's name as listed in the section, e.g. `hover` or `checked`. */
  name: string;
  /** True for the `disabled` state: pass it to the component's `disabled` prop. */
  disabled: boolean;
  is: (name: string) => boolean;
}

export interface MatrixSection {
  kind: "matrix";
  title: string;
  note?: string;
  /** The Figma component set's name. Defaults to the title. */
  component?: string;
  rows: Axis;
  /** A second prop, shown as groups of columns (usually `size`). */
  groups?: Axis;
  /**
   * Columns. `hover`, `focus` and `pressed` are forced with CSS on the cell's
   * control; `disabled` sets `state.disabled`; any other name (`checked`,
   * `invalid`, `loading`…) is for `render` to act on.
   */
  states: readonly string[];
  /** CSS selector for the element that takes hover, focus and pressed. Defaults to the first control in the cell. */
  target?: string;
  render: (props: Record<string, string>, state: SpecState) => React.ReactNode;
}

export interface ListSection {
  kind: "list";
  title: string;
  note?: string;
  items: { label: string; code?: string; render: () => React.ReactNode }[];
}

export type SpecSection = MatrixSection | ListSection;

export interface ComponentSpec {
  /** The docs page this belongs to. */
  slug: string;
  sections: SpecSection[];
}

export const axis = (prop: string, values: readonly string[]): Axis => ({ prop, values });
export const matrix = (section: Omit<MatrixSection, "kind">): MatrixSection => ({ kind: "matrix", ...section });
export const list = (section: Omit<ListSection, "kind">): ListSection => ({ kind: "list", ...section });

const FORCED: Record<string, string> = { hover: "is-hover", focus: "is-focus", pressed: "is-active" };
const CONTROL =
  "[data-spec-target], button, a[href], input:not([type=hidden]), textarea, [role=button], [role=checkbox], [role=switch], [role=radio], [role=tab], [role=slider], [role=combobox], [role=option], [role=menuitem], [tabindex]";

let forced = false;
/**
 * Gives every `:hover`, `:focus-visible` and `:active` rule on the page a twin
 * that answers to a class, so a state can be shown without a pointer.
 */
export function forceStateCss() {
  if (forced) return;
  forced = true;
  const test = /(?<!\\):(hover|focus-visible|focus-within|active|focus)(?![\w-])/;
  const swap = (text: string) =>
    text
      // Figma's importer renders without a pointer, where `(hover: hover)` is false.
      .replace(/@media \(hover: ?hover\)/g, "@media all")
      .replace(/(?<!\\):hover(?![\w-])/g, ".is-hover")
      .replace(/(?<!\\):focus-visible(?![\w-])/g, ".is-focus")
      .replace(/(?<!\\):focus-within(?![\w-])/g, ":is(.is-focus, :has(.is-focus))")
      .replace(/(?<!\\):active(?![\w-])/g, ".is-active")
      .replace(/(?<!\\):focus(?![\w-])/g, ".is-focus");
  const twin = (rule: CSSRule): string => {
    if (rule instanceof CSSFontFaceRule || rule instanceof CSSKeyframesRule) return "";
    if (rule instanceof CSSStyleRule) return test.test(rule.cssText) ? swap(rule.cssText) : "";
    if (rule instanceof CSSLayerBlockRule || rule instanceof CSSMediaRule || rule instanceof CSSSupportsRule) {
      const inner = [...rule.cssRules].map(twin).filter(Boolean).join("\n");
      if (!inner) return "";
      const head = rule instanceof CSSLayerBlockRule ? `@layer ${rule.name}` : rule instanceof CSSMediaRule ? `@media ${/^\(hover: ?hover\)$/.test(rule.conditionText.trim()) ? "all" : rule.conditionText}` : `@supports ${rule.conditionText}`;
      return `${head} {\n${inner}\n}`;
    }
    return "";
  };
  const out: string[] = [];
  for (const sheet of document.styleSheets) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of rules) {
      const text = twin(rule);
      if (text) out.push(text);
    }
  }
  const style = document.createElement("style");
  style.dataset.specStates = "";
  style.textContent = out.join("\n");
  document.head.appendChild(style);
}

function Cell({ name, state, target, size, children }: { name: string; state: string; target?: string; size: { w: number; h: number } | null; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  // No dependency list: a re-render rewrites className, so the class is put back each time.
  React.useLayoutEffect(() => {
    const cls = FORCED[state];
    const root = ref.current;
    if (!cls || !root) return;
    const el = (target ? root.querySelector(target) : null) ?? root.querySelector(CONTROL) ?? root.firstElementChild;
    el?.classList.add(cls);
    return () => el?.classList.remove(cls);
  });
  return (
    <div
      ref={ref}
      data-spec-cell={name}
      className="flex shrink-0 items-center justify-center"
      style={size ? { width: size.w, height: size.h } : { width: "max-content" }}
    >
      {children}
    </div>
  );
}

const say = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

function Matrix({ section }: { section: MatrixSection }) {
  const grid = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);
  const groups = section.groups ?? { prop: "", values: [""] };

  // Every cell takes the size of the largest one, so the columns and the row labels line up.
  React.useLayoutEffect(() => {
    if (size) return;
    const measure = () => {
      let w = 72;
      let h = 24;
      for (const cell of grid.current?.querySelectorAll<HTMLElement>("[data-spec-cell]") ?? []) {
        const box = cell.getBoundingClientRect();
        w = Math.max(w, box.width);
        h = Math.max(h, box.height);
      }
      setSize({ w: Math.ceil(w) + 32, h: Math.ceil(h) + 28 });
    };
    // After the web fonts are in: measuring with the fallback font gives cells that are too wide.
    Promise.all([document.fonts.load('600 14px "DM Sans Variable"'), document.fonts.load('400 12px "DM Mono"')])
      .catch(() => null)
      .then(() => document.fonts.ready)
      // A timer, not an animation frame: frames do not fire in a background tab.
      .then(() => setTimeout(measure, 30));
  }, [size]);

  const name = (row: string, group: string, state: string) =>
    [`${section.rows.prop}=${row}`, section.groups ? `${groups.prop}=${group}` : "", `state=${state}`].filter(Boolean).join(", ");

  return (
    <div className="flex" style={{ visibility: size ? "visible" : "hidden" }}>
      <div className="flex shrink-0 flex-col pr-5">
        <div className="flex h-17 items-end pb-3 text-caption text-subtle-foreground">{section.rows.prop}</div>
        {section.rows.values.map((row) => (
          <div key={row} className="flex items-center font-mono text-[0.75rem] text-muted-foreground" style={{ height: size?.h }}>
            {row}
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <div className="flex h-17">
          {groups.values.map((group) => (
            <div key={group} className="flex flex-col justify-end" style={{ width: size ? size.w * section.states.length : undefined }}>
              {section.groups && (
                <div className="mx-2 mb-2 flex justify-center border-b border-border pb-2 font-mono text-[0.75rem] text-muted-foreground">
                  {groups.prop}={group}
                </div>
              )}
              <div className="flex pb-3">
                {section.states.map((state) => (
                  <div key={state} className="text-center text-caption text-subtle-foreground" style={{ width: size?.w }}>
                    {say(state)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          ref={grid}
          data-spec-set={section.component ?? section.title}
          data-spec-axes={JSON.stringify({ rp: section.rows.prop, rows: section.rows.values, gp: section.groups?.prop ?? "", groups: section.groups?.values ?? [], states: section.states })}
          className="flex flex-col rounded-lg border border-dashed border-border-strong">
          {section.rows.values.map((row) => (
            <div key={row} className="flex">
              {groups.values.map((group) =>
                section.states.map((state) => {
                  const props = { [section.rows.prop]: row, ...(section.groups ? { [groups.prop]: group } : {}) };
                  const info: SpecState = { name: state, disabled: state === "disabled", is: (n) => n === state };
                  return (
                    <Cell key={`${group}-${state}`} name={name(row, group, state)} state={state} target={section.target} size={size}>
                      {section.render(props, info)}
                    </Cell>
                  );
                }),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function List({ section }: { section: ListSection }) {
  return (
    <div className="flex max-w-[1100px] flex-wrap gap-4">
      {section.items.map((item) => (
        <div key={item.label} data-spec-item={item.label} className="flex flex-col gap-3 rounded-lg border border-dashed border-border-strong p-5">
          <div className="flex min-h-12 flex-1 items-center justify-center">{item.render()}</div>
          <div className="flex flex-col gap-0.5">
            <span className="text-label">{item.label}</span>
            {item.code && <span className="font-mono text-[0.6875rem] text-muted-foreground">{item.code}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SpecSections({ spec }: { spec: ComponentSpec }) {
  React.useLayoutEffect(forceStateCss, []);
  return (
    <>
      {spec.sections.map((section) => (
        <section key={section.title} data-spec-section={section.title} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-title-md">{section.title}</h3>
            {section.note && <p className={cn("max-w-[70ch] text-body-sm text-muted-foreground")}>{section.note}</p>}
          </div>
          {section.kind === "matrix" ? <Matrix section={section} /> : <List section={section} />}
        </section>
      ))}
    </>
  );
}
