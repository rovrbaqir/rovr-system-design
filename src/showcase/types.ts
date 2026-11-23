import type * as React from "react";

export type PageGroup = "Get started" | "Foundations" | "Components" | "Examples";

/** One page of the documentation site. Every file in `pages/` exports one as `page` (or several as `pages`). */
export interface DocPage {
  /** URL slug: the page lives at `#/<slug>`. For a component it is the file name, e.g. `number-field`. */
  slug: string;
  /** Sidebar label and page heading, e.g. "Number field". */
  title: string;
  group: PageGroup;
  /** One or two sentences under the heading: what it is and when to reach for it. */
  summary: string;
  /** Other words people search for, e.g. "dropdown" for Select or "alert" for Callout. */
  keywords?: string;
  /** Fixes the order inside a group. Pages without it sort by title. */
  order?: number;
  /** The examples. */
  Body: React.ComponentType;
}
