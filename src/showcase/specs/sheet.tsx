import { ArrowUpRight } from "lucide-react";
import { isInstallable } from "../pages";
import type { DocPage } from "../types";
import { type ComponentSpec, SpecSections } from "./kit";

const modules = import.meta.glob<{ spec?: ComponentSpec }>("./*.tsx", { eager: true });
const specs = new Map<string, ComponentSpec>();
for (const m of Object.values(modules)) if (m.spec) specs.set(m.spec.slug, m.spec);

export const findSpec = (slug: string) => specs.get(slug);

const DOCS = "https://rovr-system-design-ro-vr.vercel.app";

/**
 * One component on one sheet: every prop and state as a labelled grid, then the
 * examples from its docs page. Lives at `#/spec/<slug>`; the Figma file is built from it.
 */
export function SpecSheet({ page }: { page: DocPage }) {
  const spec = findSpec(page.slug);
  return (
    <div className="min-h-dvh bg-surface-sunken p-10">
      <div data-spec-sheet={page.slug} className="flex w-max min-w-[1180px] flex-col gap-14 rounded-2xl bg-background p-14">
        <header className="flex items-start justify-between gap-10">
          <div className="flex flex-col gap-3">
            <p className="text-overline text-subtle-foreground">{page.group}</p>
            <h1 className="text-display-lg">{page.title}</h1>
            <p className="max-w-[62ch] text-body-lg text-muted-foreground">{page.summary}</p>
            {isInstallable(page) && <p className="font-mono text-[0.8125rem] text-muted-foreground">pnpm dlx shadcn@latest add @rovr/{page.slug}</p>}
          </div>
          <a
            href={`${DOCS}/#/${page.slug}`}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-surface px-4 text-[0.8125rem] font-semibold text-accent-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--brand)_45%,transparent)]"
          >
            View in docs <ArrowUpRight className="size-4" />
          </a>
        </header>
        {spec && (
          <div data-spec-part="props" className="flex flex-col gap-10">
            <h2 className="border-b border-border pb-3 text-title-lg">Props and states</h2>
            <SpecSections spec={spec} />
          </div>
        )}
        <div data-spec-part="examples" className="flex w-[1068px] flex-col gap-10">
          <h2 className="border-b border-border pb-3 text-title-lg">{spec ? "Examples" : "Reference"}</h2>
          <div className="flex flex-col gap-12">
            <page.Body />
          </div>
        </div>
      </div>
    </div>
  );
}
