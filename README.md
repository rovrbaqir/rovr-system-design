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

To tag a new example, give its `<Demo>` an `id` and `files={["ui/<name>"]}`.

## What is here

| Path | Contents |
| --- | --- |
| `src/styles/rovr.css` | Every token: colour, type, radius, density, depth, motion, plus shared motion recipes |
| `src/components/ui/` | 59 primitives built on Base UI |
| `src/components/patterns/` | 11 composites: app shell, page and patient headers, stat, vital, lab, appointment and medication cards, time slots, day schedule, chat |
| `src/lib/motion.ts` | Motion tokens for `motion/react`, matching the CSS tokens |
| `src/showcase/` | The documentation site |
| `registry.json`, `public/r/` | The shadcn registry (generated) |
| `DESIGN.md` | The rules: when to use what |

## Use it in an app

The app needs Tailwind CSS v4. Add the registry to its `components.json`:

```json
"registries": { "@rovr": "https://<your-registry-host>/r/{name}.json" }
```

Then:

```bash
pnpm dlx shadcn@latest add @rovr/theme
pnpm dlx shadcn@latest add @rovr/button @rovr/dialog
```

Import `rovr.css` once, load the fonts (`@fontsource-variable/dm-sans`, `@fontsource/dm-mono`), and mount `<TooltipProvider>` and `<Toaster />` at the root.

## Publish the registry

```bash
pnpm registry:build   # regenerates registry.json and public/r/*.json
```

Host `public/r/` anywhere static, or use a private GitHub registry.

## Themes

- Dark: add `class="dark"` to `<html>`.
- Provider density: add `data-density="compact"` to a container.
- Tenant accent: override `--brand` and `--primary` on a container.
