# RoVR design system

One product across the phone and the web. The brand blue, the typeface (DM Sans) and the motion springs carry over from the mobile app and the landing page. Everything else follows one idea: soft forms resting on a calm canvas, with one rich surface per page. Source of truth for values is `src/styles/rovr.css`; this file is the rules.

## Why it looks this way

- **The mobile app's palette.** Navy ink (`#152163`) on warm paper (`#FCFBFA`), white forms that float on a soft warm shadow, and a lavender step (`#F2F3FE`) for rows inside a form. Web and mobile are one product, so they share one palette.
- **Every action says what it does.** Buttons carry words ("Book now", "Details", "Join"), never an icon alone. Each form has at most one filled blue button, and the single next thing to do is labelled "Do this next".
- **Generous curves.** Forms are 28px, the hero 36px, controls are full pills, and single actions are circles. Round shapes read as approachable, which matters on a health screen read by someone anxious.
- **The notch.** A card's one action sits in a corner cut out of the card in a concave curve, as a labelled pill. It is the system's signature, and it means the next step is always in the same place.
- **One rich surface.** Each page gets at most one aurora surface: the brand gradient, navy opening to blue. It holds the most important thing on the page. Glass panes sit on it, because glass needs something behind it to be glass.
- **Blue only for action.** `#546EFF` marks what can be pressed, what is selected, or what is done. The current page in the sidebar is a blue-tinted pill.
- **Big, two-tone headlines.** A headline says the fact in full strength and the consequence at half strength, on one type size.
- **Red means wrong.** Red appears only for errors, destructive actions and critical values. Amber asks for attention; green confirms.
- **Things have weight.** Controls sink and spring back, arrows lean toward where they go, panels land softly.

## Colour

- Text: `--foreground` navy, never black; `--muted-foreground` for secondary text; `--subtle-foreground` for decoration, group labels and disabled marks only.
- Surfaces: `--background` (warm paper), `--surface` (forms, white), `--surface-sunken` (lavender rows and wells inside a form), `--surface-raised` (controls that sit on a sunken row).
- Lines are navy at low alpha (`--border`, `--border-strong`). Prefer elevation and tone to borders for forms.
- `--primary` is one step deeper than the brand blue so white text passes AA.
- Status has two steps each: the hue (`--success`, `--warning`, `--destructive`) for fills, dots and borders, and a text-safe `-fg` step for words.
- Hover and selection fills are neutral (`--secondary`), never brand-tinted.
- Dark theme: black canvas, `#171717` forms, as in the app.
- Charts use `--chart-1` to `--chart-5` in that fixed order. Never reuse status colours for a series.
- Never write a hex value or a Tailwind palette colour in a component.

## Elevation and material

- `rovr-risen`: the one card shadow, wide, soft and warm. `rovr-lift`: add to a card that is a click target.
- `rovr-aurora`: the rich brand surface. One per page. Text on it is white, secondary text is white at 55 to 70 percent.
- `rovr-frost` (`Frost`, `FrostDisc`): a clear glass pane. Only on the aurora surface or on imagery.
- `rovr-glass`: milky frost for small floating UI: menus, selects, popovers, toasts, chart tooltips.
- `rovr-chrome`: near-opaque panel for dialogs and sheets.
- Scrims are neutral black, never tinted.

## Type

- DM Sans for everything; DM Mono for identifiers (MRN, claim numbers, codes).
- Headlines (`text-display-*`) are weight 500 and tighten as they grow.
- Base 15px. `text-body-lg` for patient-facing reading. `text-overline` is a small sentence-case label for table headers and group labels only; no uppercase or wide tracking anywhere.
- `text-data` (tabular figures) on vitals, labs, doses, money, times, counts.
- Weights: 400 body, 500 labels and titles, 600 only for buttons, the smallest title and the active nav item. Size and colour carry the hierarchy, not weight.

## Shape

- Pills for buttons, chips, toggles, nav items and step rows. `RoundAction` is the labelled pill for a notch; pass `iconOnly` only where the card around it already says what it does.
- Fields 14px, inner cards and list rows 20px, forms 28px, hero 36px. Badges and segmented controls are full pills, like buttons.
- Alignment: every card uses the same title row and padding; every list row is 64px tall with a 44px round marker; rows of cards sit on one 12-column grid so card edges line up from row to row.
- `NotchCard`: use when a card has exactly one action, on the aurora, tint or ink tones (a white form's shadow would outline the missing corner). The notch is drawn in the colour behind the card (the canvas by default; set `--notch-bg` when the card sits inside another surface). A card with several actions, or none, is a plain form.
- `Segments`: progress through a small, known number of steps. Use `Progress` for continuous amounts.
- Control heights are tokens (`h-control-sm|md|lg`): 32/40/48 comfortable, 28/32/40 compact (`data-density="compact"`).

## Motion

Two registers, kept apart on purpose.

**Things you touch respond physically.** They use the mobile app's two springs.
- `--spring-snappy`: presses, toggles, the segmented pill, the switch thumb.
- `--spring-gentle`: a card lifting, a meter filling, layout settling.
- Every pressable uses `rovr-press`: down fast, back on the spring.
- One highlight glides between items in menus, selects, lists, the sidebar and the command palette (`Glide`). It is quick and does not overshoot. Do not give items their own hover background.
- The light under a primary button follows the pointer.

**Things that appear arrive plainly.** No bounce, no blur, no travel.
- Menus, selects, popovers, tooltips (`rovr-pop`): fade with a scale from 0.96, 180 ms, from the trigger. Exit 110 ms.
- Dialogs (`rovr-dialog`): fade with a scale from 0.965 in place, about 240 ms. Exit 140 ms.
- Sheets and the sidebar (`rovr-sheet`, `--ease-panel`): slide the full distance on the iOS sheet curve, 420 ms in and 280 ms out, fully opaque throughout.
- Context menus do not animate.
- Exits are always shorter and quieter than entrances. Never `ease-in`.

**Lists and data.**
- When a search or filter changes a table, the frame animates its height (`SmoothHeight`, 320 ms), rows that stay are not touched, removed rows leave at once and new rows fade in (`rovr-enter`, 240 ms). Rows and the empty state are never on screen together. Sorting is instant.
- Filter chips shrink away and neighbours slide over (`ChipGroup`).
- Empty states settle in once: the ghost rows, then the icon, then the text.
- Clinical readings are never animated. `Reveal`, `Parallax`, `NumberTicker` and `SuccessBurst` are for overview pages and finished flows.

Reduced motion removes travel and scale and keeps opacity and colour.

## Components

- One primary button per view. `destructive` is tinted and outlined; `destructive-solid` is only for the confirming button in `ConfirmDialog`.
- Badge: `tag` (default, small squared, tinted) for status on cards; `status` (dot and text) in tables; `count` for numbers.
- Tabs: `underline` for page sections, `boxed` for equal stages, `segmented` for view switches.
- `DataTable` when rows sort, select or paginate; `Table` for static rows; `List` for rows that navigate.
- Skeleton for loading content; Spinner for a short wait inside a control.
- Empty states show the ghost of the content that belongs there, say what it is, and offer the action that fills it.
- No icon inside a tinted rounded square. An icon stands on its own or not at all.
- Radii are concentric: a container's radius is its item's radius plus the padding between them.
- Toasts confirm. Errors someone must fix go inline, next to the cause.
- Icons: lucide at 1.5 stroke, 16px in controls.

## Not built yet

Rich text editor, week and multi-provider schedule layouts (compose `ScheduleDay`), kanban board, tree view, PDF viewer, video-call controls.
