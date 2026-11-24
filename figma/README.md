# RoVR in Figma

How the component library gets from the docs site into a private Figma file, and how the docs link back to it.

The file is **RoVR Design System** in Baqir's Figma drafts:
https://www.figma.com/design/PJiM9Tnb7hN2R74OESBl7x

It is private. The "Open in Figma" links on the docs site only open for people the file has been shared with.

## How the file is organised

The free Figma plan allows three pages, so there is no page per component. Instead:

- three pages: **Foundations**, **Components**, **Examples**;
- one **section** per component on its page, named after the component;
- inside a section: the component's examples, each as a Figma component, with open dialogs, menus and pickers beside the example that opens them;
- colour variables (`RoVR colour`), radius variables (`RoVR radius`) and text styles (`RoVR/…`). The plan allows one variable mode, so dark values sit in a second collection, `RoVR colour (dark reference)`.

## Finish the build (about two minutes)

14 components were brought in through Figma's own HTML importer, which keeps auto-layout. Figma's free plan then ran out of Claude calls for the month, so the remaining 65 are built by a small local plugin, which has no such limit. The plugin also tidies the 14 imported ones into their sections.

1. Open the file in the **Figma desktop app**.
2. Menu: **Plugins → Development → Import plugin from manifest…** and choose `figma/plugin/manifest.json` from this repo.
3. Menu: **Plugins → Development → RoVR library builder**, then press **Build the library**. It takes a minute or two.

The plugin runs inside your own file and has no network access. It fills empty sections and leaves any section that already has content alone, so it is safe to run again.

## How it works

1. **Export.** With the docs site running, the page reads every live example and writes it to `figma/data/` (layer data for the plugin) and `figma/html/` (self-contained HTML for Figma's importer).
2. **Build.** `figma/build.mjs` bundles the data with `figma/builder.js` into `figma/plugin/code.js`.
3. **Link.** `src/showcase/figma-links.json` maps each docs page to its Figma section, which puts an "Open in Figma" button on the page.

## Refresh after components change

```bash
pnpm dev                 # the docs site must be running at localhost:5199
```

Open `http://localhost:5199`, open the browser console and run:

```js
await __rovrFigma()      // layer data for the plugin
```

Then:

```bash
pnpm figma:build         # bundles figma/data into figma/plugin/code.js
pnpm figma:test          # runs the builder against a stand-in for Figma's API
```

In Figma, delete the contents of the sections you want rebuilt (or tick "Rebuild sections this plugin built before") and run the plugin again.

## Two import routes, two qualities

| | HTML importer (through Claude's Figma connector) | Local plugin |
| --- | --- | --- |
| Layout | Auto-layout, like a hand-built file | Layers at fixed positions |
| Limit | A few dozen calls a month on the free plan | None |
| Used for | 14 components so far | The other 65 |

To move a component to the better route later: delete its section's contents, ask Claude to import `figma/html/<slug>.html` into that section, and run the plugin once to tidy it. This needs the Figma connector's monthly allowance to have reset, or a paid Figma plan.

## What you do not get

- **Variants.** Each example is one component. Combining them into a single component with variant properties is design work.
- **Not captured:** tooltips and hover cards (they need a real pointer), toasts, photos in avatars, hover and focus states.
- **Gradients** from the plugin route (the aurora surface) arrive as an image fill, so they look right but have no editable stops.
- **Dark mode switching.** One variable mode on this plan; the dark values are there for reference only.
