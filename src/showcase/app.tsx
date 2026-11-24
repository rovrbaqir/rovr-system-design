import * as React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ExternalLink, Menu as MenuIcon, Moon, Sun } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { SearchInput } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toast";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { springSnappy } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";
import figmaLinks from "./figma-links.json";
import { findPage, groups, isInstallable, pages, pagesIn } from "./pages";
import type { DocPage } from "./types";

function useTheme() {
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains("dark"));
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("rovr-theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);
  return [dark, setDark] as const;
}

/** Pages live at `#/<slug>`. Any other hash (an in-page anchor) leaves the current page alone. */
const readSlug = () => (window.location.hash.startsWith("#/") ? window.location.hash.slice(2) : null);

function useRoute() {
  const [slug, setSlug] = React.useState(() => readSlug() ?? "");
  React.useEffect(() => {
    const onChange = () => {
      const next = readSlug();
      if (next !== null) setSlug(next);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  React.useEffect(() => {
    window.scrollTo(0, 0);
    const page = findPage(slug);
    document.title = page ? `${page.title} · RoVR design system` : "RoVR design system";
  }, [slug]);
  return slug;
}

function Logo() {
  return (
    <a href="#/" className="flex items-baseline gap-2.5 rounded-xs rovr-focus">
      <span className="text-[1.375rem] leading-none font-bold tracking-[-0.035em]">RoVR</span>
      <span className="text-overline text-muted-foreground">Design system</span>
    </a>
  );
}

const matches = (page: DocPage, query: string) => `${page.title} ${page.slug} ${page.keywords ?? ""}`.toLowerCase().includes(query.trim().toLowerCase());

/** The full list of pages, filterable. Used in the sidebar and in the phone menu. */
function PageNav({ active, id, onNavigate }: { active: string; id: string; onNavigate?: () => void }) {
  const [query, setQuery] = React.useState("");
  const listRef = React.useRef<HTMLDivElement>(null);
  const visible = pages.filter((p) => matches(p, query));

  React.useEffect(() => {
    listRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <SearchInput size="sm" aria-label="Find a component" placeholder="Find a component" value={query} onValueChange={setQuery} />
      <div ref={listRef} className="-mx-1 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-1 pb-10">
        {groups.map((group) => {
          const items = visible.filter((p) => p.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="flex flex-col gap-0.5">
              <p className="mb-1.5 flex items-baseline justify-between px-3 text-overline text-subtle-foreground">
                {group}
                {(group === "Components" || group === "Examples") && <span className="text-data">{items.length}</span>}
              </p>
              {group === "Get started" && !query && <NavLink id={id} slug="" label="Introduction" active={active === ""} onNavigate={onNavigate} />}
              {items.map((p) => (
                <NavLink key={p.slug} id={id} slug={p.slug} label={p.title} active={active === p.slug} onNavigate={onNavigate} />
              ))}
            </div>
          );
        })}
        {visible.length === 0 && <p className="px-3 text-body-sm text-muted-foreground">Nothing is called "{query.trim()}". Try a shorter word.</p>}
      </div>
    </div>
  );
}

function NavLink({ id, slug, label, active, onNavigate }: { id: string; slug: string; label: string; active: boolean; onNavigate?: () => void }) {
  return (
    <a
      href={`#/${slug}`}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn("relative flex h-8 shrink-0 items-center rounded-md px-3 text-sm rovr-focus", active ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
    >
      {active && <motion.span layoutId={`nav-pill-${id}`} transition={springSnappy} className="absolute inset-0 rounded-md bg-secondary" />}
      <span className="relative">{label}</span>
    </a>
  );
}

function InstallLine({ slug }: { slug: string }) {
  const command = `pnpm dlx shadcn@latest add @rovr/${slug}`;
  return (
    <div className="flex max-w-xl items-center justify-between gap-3 rounded-lg bg-surface-sunken py-1.5 pr-1.5 pl-4">
      <code className="min-w-0 truncate font-mono text-[0.8125rem]">{command}</code>
      <CopyButton value={command} label="Copy install command" className="shrink-0" />
    </div>
  );
}

/** Where this page lives in the team's Figma file, if the file has been linked (see figma/README.md). */
function figmaUrl(slug: string): string | null {
  const links = figmaLinks as { file: string; pages: Record<string, string> };
  const node = links.pages[slug];
  if (!links.file || !node) return null;
  return `${links.file.replace(/[?#].*$/, "")}?node-id=${node.replace(":", "-")}`;
}

/** The Figma file is private: the link only opens for people who have been given access to it. */
function FigmaLink({ slug }: { slug: string }) {
  const url = figmaUrl(slug);
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}>
      Open in Figma <ExternalLink />
    </a>
  );
}

function StepLink({ page, direction }: { page: DocPage; direction: "previous" | "next" }) {
  return (
    <a
      href={`#/${page.slug}`}
      className={cn("group flex min-w-0 flex-col gap-1 rounded-lg px-4 py-3 rovr-focus hover:bg-secondary", direction === "next" && "ml-auto items-end text-right")}
    >
      <span className="text-caption text-muted-foreground">{direction === "next" ? "Next" : "Previous"}</span>
      <span className="flex items-center gap-2 text-title-sm">
        {direction === "previous" && <ArrowLeft className="size-4 transition-[translate] duration-(--dur-base) ease-out group-hover:-translate-x-1" />}
        {page.title}
        {direction === "next" && <ArrowRight className="size-4 transition-[translate] duration-(--dur-base) ease-out group-hover:translate-x-1" />}
      </span>
    </a>
  );
}

function PageView({ page }: { page: DocPage }) {
  const at = pages.indexOf(page);
  const previous = pages[at - 1];
  const next = pages[at + 1];
  return (
    <article className="pt-12 pb-24">
      <header className="flex flex-col gap-4 border-b border-border pb-10">
        <p className="text-overline text-subtle-foreground">{page.group}</p>
        <h1 className="text-display-lg">{page.title}</h1>
        <p className="max-w-[62ch] text-body-lg text-muted-foreground">{page.summary}</p>
        {isInstallable(page) && <InstallLine slug={page.slug} />}
        <FigmaLink slug={page.slug} />
        {page.group === "Examples" && (
          <p className="max-w-[62ch] rounded-lg bg-surface-sunken px-4 py-3 text-body-sm text-muted-foreground">
            This is an example of how the base components combine, not a shared component. It cannot be installed. Build your own version in your
            project; the Code view of each example shows how this one is written.
          </p>
        )}
      </header>
      <div className="mt-10 flex flex-col gap-12">
        <page.Body />
      </div>
      <nav aria-label="More pages" className="mt-16 flex gap-4 border-t border-border pt-6">
        {previous && <StepLink page={previous} direction="previous" />}
        {next && <StepLink page={next} direction="next" />}
      </nav>
    </article>
  );
}

function IndexGroup({ title, lead, items }: { title: string; lead: string; items: DocPage[] }) {
  return (
    <section className="border-t border-border pt-10 pb-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-title-lg">
          {title} <span className="text-muted-foreground text-data">{items.length}</span>
        </h2>
        <p className="text-body-sm text-muted-foreground">{lead}</p>
      </div>
      <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <li key={p.slug}>
            <a href={`#/${p.slug}`} className="-mx-3 flex flex-col gap-0.5 rounded-lg px-3 py-2.5 rovr-focus hover:bg-secondary">
              <span className="text-title-sm">{p.title}</span>
              <span className="line-clamp-1 text-body-sm text-muted-foreground">{p.summary}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Introduction() {
  const components = pagesIn("Components");
  return (
    <div className="pb-24">
      <div className="flex flex-col gap-7 py-20 sm:py-24">
        <h1 className="max-w-[16ch] text-display-xl sm:text-[4.25rem]">The parts every RoVR screen is built from.</h1>
        <p className="max-w-[54ch] text-body-lg text-muted-foreground">
          One look and one feel across the mobile app, the patient app and the provider app. Every base component has its own page with live examples, so
          press them, hover them and tab through them, then copy the code.
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-body-lg">
          <a href={`#/${components[0]?.slug ?? ""}`} className="group inline-flex items-center gap-2 rounded-xs rovr-focus">
            Browse components
            <ArrowRight className="size-4.5 transition-[translate] duration-(--dur-base) ease-out group-hover:translate-x-1" />
          </a>
          <a href="#/install" className="group inline-flex items-center gap-2 rounded-xs text-muted-foreground rovr-focus hover:text-foreground">
            Install
            <ArrowRight className="size-4.5 transition-[translate] duration-(--dur-base) ease-out group-hover:translate-x-1" />
          </a>
        </div>
      </div>
      <IndexGroup title="Foundations" lead="Colour, type, shape and motion tokens." items={pagesIn("Foundations")} />
      <IndexGroup title="Components" lead="Single-purpose parts." items={components} />
      <IndexGroup title="Example usages of our components" lead="Not shared or installable. Each project builds its own." items={pagesIn("Examples")} />
    </div>
  );
}

/** Keeps one broken example from taking the whole site down. */
class PageBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex flex-col items-start gap-3 py-24">
        <h1 className="text-display-md">This page could not be shown</h1>
        <p className="text-body-lg text-muted-foreground">One of its examples threw an error. The browser console has the details; the other pages still work.</p>
      </div>
    );
  }
}

function NotFound({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col items-start gap-4 py-24">
      <h1 className="text-display-lg">No page called "{slug}"</h1>
      <p className="text-body-lg text-muted-foreground">It may have been renamed. Every page is listed in the introduction.</p>
      <a href="#/" className="group inline-flex items-center gap-2 rounded-xs text-body-lg rovr-focus">
        <ArrowLeft className="size-4.5 transition-[translate] duration-(--dur-base) ease-out group-hover:-translate-x-1" />
        Back to the introduction
      </a>
    </div>
  );
}

// Dev only: `await __rovrFigma()` in the console exports every page for the Figma plugin (see figma/README.md).
if (import.meta.env.DEV) {
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const save = (name: string, data: unknown) => fetch(`/__figma/save?name=${name}`, { method: "POST", body: JSON.stringify(data) }).then((r) => r.ok);
  (window as unknown as { __rovrFigma: (only?: string[]) => Promise<unknown> }).__rovrFigma = async (only) => {
    const { extractPage, extractTokens } = await import("./figma-extract");
    document.documentElement.classList.remove("dark");
    await sleep(200);
    await save("tokens", extractTokens());
    const report: Record<string, number | string> = {};
    for (const page of pages) {
      if (page.slug === "install" || (only && !only.includes(page.slug))) continue;
      window.location.hash = `#/${page.slug}`;
      // Long enough for entrance animations (chart lines, bars, empty states) to finish.
      await sleep(1700);
      try {
        const data = await extractPage({ slug: page.slug, title: page.title, group: page.group, summary: page.summary });
        await save(page.slug, data);
        report[page.slug] = data.demos.length;
      } catch (error) {
        report[page.slug] = `failed: ${String(error)}`;
      }
    }
    return report;
  };
}

// Dev only: `await __rovrSnapshot()` writes a self-contained HTML copy of each page's examples to figma/html/.
if (import.meta.env.DEV) {
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  (window as unknown as { __rovrSnapshot: (only?: string[]) => Promise<unknown> }).__rovrSnapshot = async (only) => {
    const { snapshotPage } = await import("./figma-extract");
    document.documentElement.classList.remove("dark");
    const report: Record<string, string[] | string> = {};
    for (const page of pages) {
      if (page.slug === "install" || (only && !only.includes(page.slug))) continue;
      window.location.hash = `#/${page.slug}`;
      await sleep(1700);
      try {
        const { html, names } = await snapshotPage({ slug: page.slug, title: page.title });
        await fetch(`/__figma/save?name=${page.slug}&kind=html`, { method: "POST", body: html });
        report[page.slug] = names;
      } catch (error) {
        report[page.slug] = `failed: ${String(error)}`;
      }
    }
    await fetch("/__figma/save?name=_names", { method: "POST", body: JSON.stringify(report) });
    return report;
  };
}

export function App() {
  const [dark, setDark] = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const slug = useRoute();
  const page = findPage(slug);

  return (
    <TooltipProvider delay={300}>
      <div className="min-h-dvh">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-[88rem] items-center justify-between gap-4 px-4 sm:px-8">
            <div className="flex items-center gap-2">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger
                  render={
                    <Button variant="ghost" size="sm" className="-ml-2 lg:hidden">
                      <MenuIcon /> Menu
                    </Button>
                  }
                />
                <SheetContent side="left" className="flex flex-col gap-5">
                  <SheetTitle>All pages</SheetTitle>
                  <PageNav id="sheet" active={slug} onNavigate={() => setMenuOpen(false)} />
                </SheetContent>
              </Sheet>
              <Logo />
            </div>
            <div className="flex items-center gap-1">
              <Tooltip content={dark ? "Switch to light theme" : "Switch to dark theme"}>
                <Button variant="ghost" size="icon-sm" aria-label="Toggle theme" aria-pressed={dark} onClick={() => setDark((d) => !d)}>
                  {dark ? <Sun /> : <Moon />}
                </Button>
              </Tooltip>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-[88rem] gap-x-12 px-4 sm:px-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <nav aria-label="Pages" className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] flex-col pt-8 lg:flex">
            <PageNav id="sidebar" active={slug} />
          </nav>
          {/* Keyed so each page starts with fresh example state. */}
          <main key={slug} className="min-w-0">
            <PageBoundary>{slug === "" ? <Introduction /> : page ? <PageView page={page} /> : <NotFound slug={slug} />}</PageBoundary>
          </main>
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
