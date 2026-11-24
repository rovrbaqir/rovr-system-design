# RoVR in Figma

The Figma library is generated from the component code. This folder holds the tools that do it.

The file is **RoVR system Design by Baqir**, in the RoVR Technologies team:
https://www.figma.com/design/NzaPbdS0iqbZ5sZOROCwcX

It is private. The "Open in Figma" links on the docs site only open for people the file has been shared with.

## What is in the file

- **Cover** and **Getting started** (how a designer uses the file).
- **Foundations**: Colour, Typography, Shape and density, Motion, Icons.
- **Components**: one page per base component, 63 in all, named and ordered like the docs.
- **Examples**: the 11 example screens.

Each component page has two parts:

- **Props and states**: a labelled grid of the real component in every variant, size and state. Each grid is a Figma component set, and each cell is a variant named with the props from code, for example `variant=secondary, size=lg, state=hover`.
- **Examples**: the examples from the component's docs page, with dialogs, menus and pickers drawn open.

Colours are bound to the `RoVR colour` variables (Light and Dark modes), text uses the `RoVR/…` text styles, and corner radii are in `RoVR radius`.

## Where the grids come from

Every component has a spec in `src/showcase/specs/<slug>.tsx`. A spec lists the props to show as rows and column groups, and the states to show as columns. The page at `#/spec/<slug>` renders it with the real component in every cell. Hover, focus and pressed are forced with CSS, so they can be shown without a pointer.

`src/showcase/specs/kit.tsx` is the API, and `button.tsx` is the example to copy.

Ten components have no spec because they only exist in a portal or have nothing static to show: alert-dialog, dialog, sheet, popover, hover-card, tooltip, toast, blur-swap, smooth-height and motion. Their pages show the examples only.

## Refresh the file after components change

This needs Claude with the Figma connector, on a Figma plan with a Full seat (the free plan allows too few calls). One page costs one import call.

1. Update or add the spec in `src/showcase/specs/`.
2. Start the docs site (`pnpm dev`), open `http://localhost:5199`, and run in the browser console:

   ```js
   await __rovrSheets(["button", "input"])   // or no argument for every page
   ```

   This writes `figma/html/sheet-<slug>.html` (a self-contained copy of each spec sheet) and `figma/data/tokens.json`.

3. Ask Claude to import those sheets into the file. For each sheet it calls Figma's HTML importer once, posts the HTML with `node figma/upload.mjs <slug>=<uploadId>`, then runs `figma/process.js` inside the file.

`process.js` reads the description each sheet carries, turns its grids into component sets, applies the text styles, and moves the sheet to the page named after the component, replacing what was there. It only touches frames it imported.

4. If a page is new, add its Figma page id to `src/showcase/figma-links.json` so the docs link to it.

## What the file does not have

- **Live states and motion.** Hover, focus and pressed are fixed variants. Animation is not shown.
- **Tooltips, hover cards and toasts** as components. They appear only where an example shows them.
- **Layers named for designers.** Layer names come from the HTML (`Button`, `Container`, `Text`).
- **A file thumbnail.** Right-click the Cover frame in Figma and choose "Set as thumbnail".
