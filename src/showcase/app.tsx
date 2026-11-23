import * as React from "react";
import { motion } from "motion/react";
import { ArrowRight, Moon, Rows3, Rows4, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toast";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Components } from "./components";
import { Foundations } from "./foundations";
import { Section, Token } from "./kit";

const nav = [
  { group: "Foundations", items: [["colour", "Colour"], ["type", "Typography"], ["shape", "Shape and density"], ["motion", "Motion"]] },
  { group: "Components", items: [["actions", "Buttons"], ["forms", "Forms"], ["navigation", "Navigation"], ["overlays", "Overlays"], ["feedback", "Status and feedback"], ["data", "Data display"], ["pickers", "Pickers"], ["tables", "Tables and files"], ["charts", "Charts"], ["workspace", "Workspace"], ["shell", "App shell"]] },
  { group: "Use", items: [["install", "Install"]] },
] as const;

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

function useActiveSection() {
  const [active, setActive] = React.useState("colour");
  React.useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-section]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return active;
}

function Logo() {
  return (
    <a href="#top" className="flex items-baseline gap-2.5 rounded-xs rovr-focus">
      <span className="text-[1.375rem] leading-none font-bold tracking-[-0.035em]">RoVR</span>
      <span className="text-overline text-muted-foreground">Design system</span>
    </a>
  );
}

export function App() {
  const [dark, setDark] = useTheme();
  const [compact, setCompact] = React.useState(false);
  const active = useActiveSection();

  return (
    <TooltipProvider delay={300}>
      <div id="top" data-density={compact ? "compact" : "comfortable"} className="min-h-dvh">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-[84rem] items-center justify-between gap-4 px-4 sm:px-8">
            <Logo />
            <div className="flex items-center gap-1">
              <Tooltip content={compact ? "Switch to comfortable density" : "Switch to compact density"}>
                <Button variant="ghost" size="icon-sm" aria-label="Toggle density" aria-pressed={compact} onClick={() => setCompact((c) => !c)}>
                  {compact ? <Rows4 /> : <Rows3 />}
                </Button>
              </Tooltip>
              <Tooltip content={dark ? "Switch to light theme" : "Switch to dark theme"}>
                <Button variant="ghost" size="icon-sm" aria-label="Toggle theme" aria-pressed={dark} onClick={() => setDark((d) => !d)}>
                  {dark ? <Sun /> : <Moon />}
                </Button>
              </Tooltip>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-[84rem] gap-x-12 px-4 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <nav aria-label="Sections" className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] flex-col gap-6 overflow-y-auto py-10 lg:flex">
            {nav.map(({ group, items }) => (
              <div key={group} className="flex flex-col gap-0.5">
                <p className="mb-1.5 px-3 text-overline text-subtle-foreground">{group}</p>
                {items.map(([id, label]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    aria-current={active === id ? "location" : undefined}
                    className={cn(
                      "relative flex h-8 items-center rounded-md px-3 text-sm rovr-focus",
                      active === id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active === id && <motion.span layoutId="nav-pill" transition={springSnappy} className="absolute inset-0 rounded-md bg-secondary" />}
                    <span className="relative">{label}</span>
                  </a>
                ))}
              </div>
            ))}
          </nav>

          <main className="min-w-0 pb-24">
            <div className="flex flex-col gap-7 py-20 sm:py-28">
              <h1 className="max-w-[16ch] text-display-xl sm:text-[4.25rem]">The parts every RoVR screen is built from.</h1>
              <p className="max-w-[54ch] text-body-lg text-muted-foreground">
                One look and one feel across the mobile app, the patient app and the provider app. Everything below is the real component, so press it,
                hover it and tab through it.
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-body-lg">
                <a href="#actions" className="group inline-flex items-center gap-2 rounded-xs rovr-focus">
                  Browse components
                  <ArrowRight className="size-4.5 transition-[translate] duration-(--dur-base) ease-out group-hover:translate-x-1" />
                </a>
                <a href="#install" className="group inline-flex items-center gap-2 rounded-xs text-muted-foreground rovr-focus hover:text-foreground">
                  Install
                  <ArrowRight className="size-4.5 transition-[translate] duration-(--dur-base) ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            <Foundations />
            <Components />

            <Section
              id="install"
              title="Install"
              lead="Components are distributed the shadcn way: the source is copied into each app from the RoVR registry, so teams own and can read every line."
            >
              <ol className="flex max-w-[70ch] flex-col gap-6 text-body">
                <li className="flex flex-col gap-2">
                  <p className="text-title-sm">Point the app at the registry</p>
                  <p className="text-muted-foreground">
                    Add the <Token>@rovr</Token> namespace to <Token>components.json</Token>, with the URL where the built registry is hosted.
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-surface-sunken p-4 font-mono text-[0.8125rem] leading-relaxed">{`"registries": {\n  "@rovr": "https://<your-registry-host>/r/{name}.json"\n}`}</pre>
                </li>
                <li className="flex flex-col gap-2">
                  <p className="text-title-sm">Add the theme once</p>
                  <pre className="overflow-x-auto rounded-lg bg-surface-sunken p-4 font-mono text-[0.8125rem] leading-relaxed">pnpm dlx shadcn@latest add @rovr/theme</pre>
                </li>
                <li className="flex flex-col gap-2">
                  <p className="text-title-sm">Add components as you need them</p>
                  <pre className="overflow-x-auto rounded-lg bg-surface-sunken p-4 font-mono text-[0.8125rem] leading-relaxed">pnpm dlx shadcn@latest add @rovr/button @rovr/dialog @rovr/appointment-card</pre>
                </li>
              </ol>
            </Section>
          </main>
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
