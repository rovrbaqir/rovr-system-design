import { CopyButton } from "@/components/ui/copy-button";
import { Token } from "../kit";
import type { DocPage } from "../types";

function Command({ children }: { children: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-surface-sunken py-2 pr-2 pl-4">
      <pre className="min-w-0 overflow-x-auto py-1.5 font-mono text-[0.8125rem] leading-relaxed">{children}</pre>
      <CopyButton value={children} label="Copy" className="shrink-0" />
    </div>
  );
}

function Body() {
  return (
    <ol className="flex max-w-[70ch] flex-col gap-8 text-body">
      <li className="flex flex-col gap-2">
        <p className="text-title-sm">1. Point the app at the registry</p>
        <p className="text-muted-foreground">
          Add the <Token>@rovr</Token> namespace to <Token>components.json</Token>, pointing at the RoVR registry.
        </p>
        <Command>{`"registries": {\n  "@rovr": "https://rovr-system-design-ro-vr.vercel.app/r/{name}.json"\n}`}</Command>
        <p className="text-body-sm text-muted-foreground">
          Copy it exactly, with <Token>{"{name}"}</Token> left as written. The shadcn command fills it in: <Token>@rovr/button</Token> is fetched
          from <Token>/r/button.json</Token>.
        </p>
      </li>
      <li className="flex flex-col gap-2">
        <p className="text-title-sm">2. Add the theme once</p>
        <p className="text-muted-foreground">The theme is the token file every component reads: colour, type, radius, density and motion.</p>
        <Command>pnpm dlx shadcn@latest add @rovr/theme</Command>
      </li>
      <li className="flex flex-col gap-2">
        <p className="text-title-sm">3. Add components as you need them</p>
        <p className="text-muted-foreground">
          Each component page shows its own command. Only base components are in the registry; the pages under Examples are not. Anything a component depends on is added with it. You can also copy the files by hand from the
          Code view of any example.
        </p>
        <Command>pnpm dlx shadcn@latest add @rovr/button @rovr/dialog @rovr/select</Command>
      </li>
      <li className="flex flex-col gap-2">
        <p className="text-title-sm">Or add every component at once</p>
        <p className="text-muted-foreground">
          <Token>@rovr/all</Token> installs all the base components in one go, with the theme and helpers. Add <Token>--overwrite</Token> to update
          the ones a project already has.
        </p>
        <Command>pnpm dlx shadcn@latest add @rovr/all</Command>
      </li>
    </ol>
  );
}

export const page: DocPage = {
  slug: "install",
  title: "Install",
  group: "Get started",
  summary: "Components are distributed the shadcn way: the source is copied into each app from the RoVR registry, so teams own and can read every line.",
  keywords: "setup registry shadcn cli theme",
  Body,
};
