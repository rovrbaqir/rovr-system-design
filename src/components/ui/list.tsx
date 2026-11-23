import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Glide } from "./glide";

/** A vertical list of rows. One highlight glides between rows under the pointer. */
export function List({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Glide role="list" highlightClassName="rounded-lg" className={cn("flex flex-col", className)} {...props}>
      {children}
    </Glide>
  );
}

export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  leading?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Value, time or badge at the end of the row. */
  trailing?: React.ReactNode;
  /** Renders the row as a link and shows a chevron. */
  href?: string;
}

export function ListItem({ leading, title, description, trailing, href, className, onClick, ...props }: ListItemProps) {
  const interactive = !!href || !!onClick;
  const Tag = (href ? "a" : interactive ? "button" : "div") as "a";
  return (
    <div role="listitem">
      <Tag
        {...(interactive ? { "data-glide": "" } : {})}
        href={href}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left", interactive && "rovr-focus cursor-pointer active:scale-[0.99]", className)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {leading && <span className="shrink-0 [&_svg]:size-4.5 [&_svg]:text-muted-foreground">{leading}</span>}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{title}</span>
          {description && <span className="truncate text-body-sm text-muted-foreground">{description}</span>}
        </span>
        {trailing && <span className="shrink-0 text-body-sm text-muted-foreground">{trailing}</span>}
        {href && <ChevronRight className="size-4 shrink-0 text-subtle-foreground" aria-hidden />}
      </Tag>
    </div>
  );
}
