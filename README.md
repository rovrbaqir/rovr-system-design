# RoVR UI

The RoVR design system: tokens, components and a registry shared by the patient app and the provider app.

## Run the showcase

```bash
pnpm install
pnpm dev        # http://localhost:5199
```

Scripts call `node ./node_modules/...` directly because this folder's name contains `:`, which breaks `PATH`-based bin lookup. If you move the project to a folder without `:` or `/` in its name, plain `vite` works too.

## Copying a component from the showcase

Every example in the showcase has a **Preview / Code** switch. Code shows one tab per file:

- **Usage**: how the example itself is written.
- The component file(s), then every file they import (`utils.ts`, `spinner.tsx`, and so on), each with its path under `src/`.
- **rovr.css**: the tokens every component depends on.

"Copy" copies the whole file. Under a component file is the `pnpm add` line for the npm packages it needs. The code is read from the real source files when the page is built, so it cannot drift from what the showcase runs.

## Figma

`figma/` turns the docs site into a private Figma file: one Figma page per component, with colour variables and text styles, and an "Open in Figma" link back from each docs page. See [figma/README.md](figma/README.md).

## Adding a page

The showcase has one page per component, listed in the sidebar and reached at `#/<slug>`. To document a new component, add `src/showcase/pages/<slug>.tsx` that exports a `page` (see `pages/button.tsx`). It is picked up automatically: there is no list to edit.

Each example is a `<Demo>` with an `id` that starts with the slug and `files={["ui/<name>"]}`; that is what gives it a Code view.

## What is here

| Path | Contents |
| --- | --- |
| `src/styles/rovr.css` | Every token: colour, type, radius, density, depth, motion, plus shared motion recipes |
| `src/components/ui/` | 59 primitives built on Base UI |
| `src/components/patterns/` | Examples only, not in the registry and not shared between apps. 11 compositions of the base components that each project builds for itself: app shell, page and patient headers, stat, vital, lab, appointment and medication cards, time slots, day schedule, chat |
| `src/lib/motion-tokens.ts` | Motion tokens for `motion/react`, matching the CSS tokens |
| `src/showcase/` | The documentation site |
| `registry.json`, `public/r/` | The shadcn registry (generated) |
| `DESIGN.md` | The rules: when to use what |

## Use it in an app

The app needs Tailwind CSS v4. Add the registry to its `components.json`:

```json
"registries": { "@rovr": "https://rovr-system-design.vercel.app/r/{name}.json" }
```

Then:

```bash
pnpm dlx shadcn@latest add @rovr/theme
pnpm dlx shadcn@latest add @rovr/button @rovr/dialog
```

To add every base component in one command:

```bash
pnpm dlx shadcn@latest add @rovr/all
```

Import `rovr.css` once, load the fonts (`@fontsource-variable/manrope`, `@fontsource/dm-mono`), and mount `<TooltipProvider>` and `<Toaster />` at the root.

## Publish the registry

```bash
pnpm registry:build   # regenerates registry.json and public/r/*.json
```

The site and the registry are deployed together on Vercel at https://rovr-system-design.vercel.app. `vercel.json` sets the build to `pnpm registry:build && pnpm build`, so every push to `main` republishes both and the registry cannot go stale.

## Themes

- Dark: add `class="dark"` to `<html>`.
- Provider density: add `data-density="compact"` to a container.
- Tenant accent: override `--brand` and `--primary` on a container.
