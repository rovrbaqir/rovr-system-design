import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { cn } from "@/lib/utils";

export interface SectionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * `default` is the white surface that floats on the page. `lighter` is an outline only.
   * `darker` is tinted; inner cards inside it turn white so they still read as a step.
   */
  variant?: "default" | "lighter" | "darker";
  /** Adds a title row above the content. Without it the card is a plain padded surface. */
  title?: React.ReactNode;
  /** Right side of the title row: a link, a note, one action. */
  aside?: React.ReactNode;
}

const surfaces = {
  default: { card: "risen", className: "" },
  lighter: { card: "outline", className: "" },
  // Card's sunken variant is the inner-card radius; an outer card keeps the outer radius.
  darker: { card: "sunken", className: "rounded-xl [--inner-card-bg:var(--surface-raised)]" },
} as const;

/**
 * The outer surface of a section. Holds content directly or a stack of `InnerCard`s.
 * Pass `title` (and `aside`) for a title row; the content then sits in a column under it.
 */
export const SectionCard = React.forwardRef<HTMLDivElement, SectionCardProps>(function SectionCard(
  { variant = "default", title, aside, className, children, ...props },
  ref,
) {
  const surface = surfaces[variant];
  const hasHeader = title != null || aside != null;
  return (
    <Card
      ref={ref}
      variant={surface.card}
      className={cn("self-stretch p-3", hasHeader ? "gap-3" : "block", surface.className, className)}
      {...props}
    >
      {hasHeader && (
        <CardHeader className="items-center gap-2">
          <h2 className="text-title-sm">{title}</h2>
          {aside}
        </CardHeader>
      )}
      {children}
    </Card>
  );
});

export type InnerCardProps = React.HTMLAttributes<HTMLDivElement>;

/** The quieter surface nested inside a `SectionCard`: one record, one group of fields, one tile. */
export const InnerCard = React.forwardRef<HTMLDivElement, InnerCardProps>(function InnerCard({ className, ...props }, ref) {
  return (
    <Card
      ref={ref}
      variant="sunken"
      className={cn("block bg-[color:var(--inner-card-bg,var(--surface-sunken))] p-3", className)}
      {...props}
    />
  );
});

export interface HeaderBarCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  /** Only when it adds a fact the title does not: a total, a source, a rule. */
  description?: React.ReactNode;
  /** Right side of the header bar: tabs, a select, a link, one action. */
  aside?: React.ReactNode;
  /** Body classes. The body is a padded column by default. Tables pass `p-0 gap-0`. */
  bodyClassName?: string;
}

/**
 * A section card with a tinted header bar and a hairline under it.
 * The card does not clip, so a menu inside it can extend past its edge. The bar rounds
 * its own top corners, and the last child of a flush (`p-0`) body rounds the bottom ones.
 */
export const HeaderBarCard = React.forwardRef<HTMLDivElement, HeaderBarCardProps>(function HeaderBarCard(
  { title, description, aside, bodyClassName, className, children, ...props },
  ref,
) {
  return (
    <Card ref={ref} className={cn("min-w-0 gap-0 p-0", className)} {...props}>
      <CardHeader className="shrink-0 flex-wrap items-center gap-3 rounded-t-[inherit] border-b border-border bg-surface-sunken px-3.5 py-3">
        <div className="min-w-0">
          <h2 className="text-title-md">{title}</h2>
          {description != null && <div className="text-caption text-muted-foreground">{description}</div>}
        </div>
        {aside != null && <div className="flex max-w-full min-w-0 flex-wrap items-center gap-2">{aside}</div>}
      </CardHeader>
      <div className={cn("flex min-w-0 flex-1 flex-col gap-4 rounded-b-[inherit] p-4 [&.p-0>:last-child]:rounded-b-[inherit]", bodyClassName)}>{children}</div>
    </Card>
  );
});

export interface KeyValueItem {
  label: string;
  value: React.ReactNode;
  /** Codes, IDs and NPIs render in mono. */
  mono?: boolean;
  /** Small note after the label, e.g. a CMS-1500 box number. */
  hint?: string;
}

const isEmpty = (value: React.ReactNode) => value === null || value === undefined || value === "";

/** Label and value rows with hairline dividers: label left, value right. An empty value reads as a dash. */
export function KeyValueList({ items, className }: { items: KeyValueItem[]; className?: string }) {
  return (
    <DescriptionList className={cn("flex flex-col gap-0", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline justify-between gap-4 border-b border-border py-2 last:border-b-0">
          <dt className="shrink-0 text-caption text-muted-foreground">
            {item.label}
            {item.hint ? <span className="ml-1.5 text-[0.6875rem] text-subtle-foreground">{item.hint}</span> : null}
          </dt>
          <dd className={cn("min-w-0 text-right text-caption", isEmpty(item.value) ? "text-subtle-foreground" : "text-foreground", item.mono && "font-mono")}>
            {isEmpty(item.value) ? "—" : item.value}
          </dd>
        </div>
      ))}
    </DescriptionList>
  );
}
