RoVR library builder: a Figma plugin
====================================

It builds the whole RoVR component library inside a Figma file of your own.
It is free, works on the free Figma plan, and has no network access.

You need the Figma DESKTOP app (plugins from a folder do not run in the browser).

1. Unzip this folder somewhere you will keep it.
2. In Figma, create a new design file.
3. Menu: Plugins > Development > Import plugin from manifest...
   Choose the manifest.json in this folder.
4. Menu: Plugins > Development > RoVR library builder
   Press "Build the library". It takes a minute or two.

What you get
- Three pages: Foundations, Components, Examples.
- One section per component, with every example from the docs site as a
  Figma component (find them in the Assets panel), plus open dialogs, menus
  and pickers.
- Colour variables, radius variables and text styles (RoVR/...).

What is left for you
- Layers sit at fixed positions: there is no auto-layout and there are no
  variants. Rebuild the components you will use most with auto-layout and
  variant properties, using these as the exact reference for size, colour,
  radius, shadow and type.
- Not included: tooltips, hover cards, toasts, hover and focus states.
- The free plan allows one variable mode, so only light colours are created.

The live components, with code, are at https://rovr-system-design.vercel.app
Fonts: DM Sans and DM Mono (both are in Figma already).
