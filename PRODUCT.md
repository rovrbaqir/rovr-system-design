# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite, React (19 here, components avoid 19-only APIs so they run on 18), Tailwind CSS v4, Base UI primitives, Motion (`motion/react`), distributed as a shadcn registry. Chosen by the user on 2026-11-22 from a recommendation.

## Users

- Patients using the RoVR patient app (`health-frontend`) to manage appointments, labs, medications, records and care plans, often on a phone.
- Clinicians and clinic staff using the RoVR provider app (`provider-frontend`) for schedules, patient charts, tasks, billing and operations, on desktop, for long sessions at high information density.
- RoVR engineers, who install these components into both apps.

## Product Purpose

RoVR is a health OS. This repository is its design system: one set of tokens and components so every RoVR product looks and behaves the same. Success is both apps shipping on these components, with the per-app duplicates (6–7 button components, 2–4 modal systems, ~2,700 hard-coded hex values each) retired.

## Operating Context

Both apps are Vite + React 18 + Tailwind v3 + Radix + framer-motion today and must migrate to Tailwind v4 to consume this library. Both support dark mode and multi-tenant branding (tenant logo today; tenant colour is declared but unused).

## Capabilities and Constraints

- Components are copied into apps from the `@rovr` registry (`shadcn add @rovr/<name>`); they are not an npm dependency.
- Two densities: comfortable (patient) and compact (provider), switched by `data-density`.
- Not yet built: rich text editor, week and multi-provider schedule layouts, kanban board, tree view, PDF viewer, video-call controls.
- The registry host URL is undecided.

## Brand Commitments

- Brand blue `#546EFF`, navy `#152163`. Pulse (AI) identity uses violet.
- On 2026-11-22 the user replaced the first direction (serif display, warm cream, large radii) with the look of the RoVR landing page, rovrstack.ai: DM Sans throughout, ink #161a1c on paper #fbfbfa, hairlines #dfe2e2, small radii, lucide icons at 1.5 stroke, dark palette #0a0e1f / #e9edfa. They asked for the system to look less AI-generated.
- Later the same day the user said the result still felt like stock shadcn, that the colour combination and motion were not premium, and that badges looked generated. They like the mobile app (`health-patient-app`). The system now takes its colour, elevation, glass and springs from that app's theme and keeps DM Sans from the landing page.
- The typeface is Manrope, the same as the mobile app and both web apps. On 2026-11-25 the user asked to drop DM Sans (taken from the landing page) for it. DM Mono stays for identifiers. The token is `--font-sans`.
- References the user and their manager like: america.gov, ndstudio.gov, genesis.energy.gov, trumpaccounts.gov, retire.opm.gov.

## Evidence on Hand

UI audits of both apps and the reference-site measurements were done on 2026-11-22. All names and figures in the showcase are synthetic demonstration data.

## Product Principles

1. One component per job, shared by both apps.
2. Clinical readings are legible first: never animated, always tabular figures, never colour alone.
3. Motion confirms and orients; it never makes someone wait.
4. Every visual decision is a token, so themes and tenants are variable swaps.

## Accessibility & Inclusion

WCAG 2.2 AA: 4.5:1 text contrast, visible focus, `prefers-reduced-motion` respected (movement removed, feedback kept), status never by colour alone.
