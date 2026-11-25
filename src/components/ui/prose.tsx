import * as React from "react";
import { cn } from "@/lib/utils";

/** Rules that do not depend on size. Every colour, radius and face is a token, so both themes work. */
const base = [
  "max-w-full min-w-0 break-words text-foreground",
  "[&>:first-child]:mt-0 [&>:last-child]:mb-0",
  // Lists. Preflight strips markers and indentation; they are put back here.
  "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5",
  "[&_ul_ul]:list-[circle] [&_ul_ul_ul]:list-[square]",
  "[&_li]:marker:text-subtle-foreground [&_ol>li]:marker:text-data",
  "[&_li>ul]:my-1 [&_li>ol]:my-1 [&_li>p]:my-1",
  // Inline
  "[&_a]:rounded-xs [&_a]:text-accent-foreground [&_a]:underline [&_a]:decoration-[color-mix(in_oklab,currentColor_40%,transparent)] [&_a]:outline-2 [&_a]:outline-offset-2 [&_a]:outline-transparent",
  "[&_a]:transition-[text-decoration-color,outline-color] [&_a]:duration-(--dur-fast) [&_a:hover]:decoration-current [&_a:focus-visible]:outline-ring",
  "[&_strong]:font-semibold [&_b]:font-semibold [&_em]:italic",
  "[&_:not(pre)>code]:rounded-xs [&_:not(pre)>code]:bg-secondary [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em]",
  // Blocks
  "[&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
  "[&_blockquote>:first-child]:mt-0 [&_blockquote>:last-child]:mb-0",
  "[&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-surface-sunken [&_pre]:font-mono [&_pre]:break-words [&_pre]:whitespace-pre-wrap",
  "[&_hr]:border-border",
  "[&_img]:max-w-full [&_img]:rounded-md",
  // Tables
  "[&_table]:w-full [&_table]:border-collapse [&_table]:text-left",
  "[&_th]:border-b [&_th]:border-border-strong [&_th]:text-overline [&_th]:text-muted-foreground",
  "[&_td]:border-b [&_td]:border-border [&_td]:align-top [&_td]:text-data [&_tr:last-child>td]:border-b-0",
  "[&_:is(th,td)]:pr-4 [&_:is(th,td):last-child]:pr-0",
].join(" ");

const sizes = {
  sm: [
    "text-body-sm",
    "[&_h1]:mt-5 [&_h1]:mb-1.5 [&_h1]:text-title-lg",
    "[&_h2]:mt-5 [&_h2]:mb-1.5 [&_h2]:text-title-md",
    "[&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:text-title-sm",
    "[&_h4]:mt-4 [&_h4]:mb-1 [&_h4]:text-label",
    "[&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5",
    "[&_blockquote]:my-3 [&_pre]:my-3 [&_pre]:p-2.5 [&_pre]:text-caption [&_table]:my-3 [&_hr]:my-4",
    "[&_:is(th,td)]:py-1.5",
  ].join(" "),
  md: [
    "text-body",
    "[&_h1]:mt-7 [&_h1]:mb-2 [&_h1]:text-display-sm",
    "[&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-title-lg",
    "[&_h3]:mt-5 [&_h3]:mb-1.5 [&_h3]:text-title-md",
    "[&_h4]:mt-5 [&_h4]:mb-1 [&_h4]:text-title-sm",
    "[&_p]:my-3 [&_ul]:my-3 [&_ol]:my-3 [&_li]:my-1",
    "[&_blockquote]:my-4 [&_pre]:my-4 [&_pre]:p-3 [&_pre]:text-body-sm [&_table]:my-4 [&_hr]:my-6",
    "[&_:is(th,td)]:py-2",
  ].join(" "),
} as const;

export interface ProseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "dangerouslySetInnerHTML"> {
  /** `md` for reading on a page. `sm` for chat bubbles, side panels and cards. */
  size?: keyof typeof sizes;
  /**
   * An HTML string to render in place of children. It is inserted as is, so the
   * caller must sanitise it first (for example with DOMPurify). Never pass
   * text that came from a person or a model without sanitising it.
   */
  html?: string;
}

/**
 * Styles rendered rich text: headings, paragraphs, lists, links, quotes, code,
 * rules and tables. It does not parse markdown. Pass the output of a markdown
 * renderer as children, or sanitised HTML through `html`.
 */
export const Prose = React.forwardRef<HTMLDivElement, ProseProps>(function Prose({ size = "md", html, className, children, ...props }, ref) {
  const classes = cn(base, sizes[size], className);
  if (html !== undefined) return <div ref={ref} className={classes} dangerouslySetInnerHTML={{ __html: html }} {...props} />;
  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});
