import * as React from "react";
import { ChevronsUpDown, PanelLeft } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Glide } from "@/components/ui/glide";
import { Menu, MenuContent, MenuTrigger } from "@/components/ui/menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const SidebarContext = React.createContext<{ expanded: boolean }>({ expanded: true });

/** Whether the sidebar around this component is expanded. Use it in custom sidebar content. */
export const useAppSidebar = () => React.useContext(SidebarContext);

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The `AppSidebar`. */
  sidebar: React.ReactNode;
  /** The `AppHeader`. Leave it out on pages that bring their own header. */
  header?: React.ReactNode;
  /** Height of the shell. The app uses the full viewport; pass a number (px) or a CSS length to frame it. */
  height?: number | string;
  /** Classes for the page area under the header, such as `p-0` for a full-bleed page. */
  contentClassName?: string;
}

/** The frame of both web apps: the sidebar on the left, and on the right a column with the header on top and the page under it. */
export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  { sidebar, header, height = "100dvh", contentClassName, className, style, children, ...props },
  ref,
) {
  return (
    <div ref={ref} style={{ height, ...style }} className={cn("flex w-full overflow-hidden bg-background text-foreground", className)} {...props}>
      {sidebar}
      <div className="flex h-full min-w-0 flex-1 flex-col">
        {header}
        <main className={cn("relative min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-4", contentClassName)}>{children}</main>
      </div>
    </div>
  );
});

export interface AppHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The current page's name. */
  title?: React.ReactNode;
  /** The cluster on the right: report an error, notifications, account. */
  actions?: React.ReactNode;
  /** Custom content for the left side, used instead of `title` (a product mark with a tagline, a progress tracker). */
  children?: React.ReactNode;
}

/** The bar at the top of the content column. It stays in place while the page scrolls: title on the left, actions on the right. */
export const AppHeader = React.forwardRef<HTMLElement, AppHeaderProps>(function AppHeader({ title, actions, children, className, ...props }, ref) {
  return (
    <header ref={ref} className={cn("sticky top-0 z-10 flex min-h-12 w-full shrink-0 items-center justify-between gap-4 px-4 pt-2 pl-6 text-foreground", className)} {...props}>
      <div className="flex min-w-0 flex-1 items-center">{children ?? <h1 className="truncate text-title-lg">{title}</h1>}</div>
      {actions}
    </header>
  );
});

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

export interface AppSidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Controlled state: true shows labels (226px), false shows the icon rail (60px). */
  expanded?: boolean;
  /** Starting state when uncontrolled. */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** The product or clinic logo in the top row. Hidden when collapsed. */
  logo?: React.ReactNode;
  /** Called when the logo is pressed. The logo is a "Go to home" button. */
  onLogoClick?: () => void;
  /** A small line tucked under the logo's right edge, such as `PoweredByRovr`. */
  logoCaption?: React.ReactNode;
  /** Removes the collapse button, for flows where the sidebar must stay open (onboarding). */
  hideCollapse?: boolean;
  /** The scrolling middle: `SidebarSection`s and `SidebarRecent`. */
  children?: React.ReactNode;
  /** The bottom area: `SidebarWorkspaceSwitch`, `SidebarSeparator`, `SidebarAccount`. */
  footer?: React.ReactNode;
}

/**
 * The navigation column of both web apps. It has a fixed width in each state
 * and animates between them. Hidden below the `md` breakpoint, where the apps
 * show navigation in a drawer instead.
 */
export const AppSidebar = React.forwardRef<HTMLElement, AppSidebarProps>(function AppSidebar(
  { expanded: expandedProp, defaultExpanded = true, onExpandedChange, logo, onLogoClick, logoCaption, hideCollapse = false, children, footer, className, ...props },
  ref,
) {
  const [inner, setInner] = React.useState(defaultExpanded);
  const expanded = expandedProp ?? inner;
  const toggle = () => {
    setInner(!expanded);
    onExpandedChange?.(!expanded);
  };
  const context = React.useMemo(() => ({ expanded }), [expanded]);
  const toggleLabel = expanded ? "Collapse sidebar" : "Expand sidebar";

  return (
    <SidebarContext.Provider value={context}>
      <aside
        ref={ref}
        data-expanded={expanded}
        className={cn(
          "relative z-10 hidden h-full shrink-0 border-r border-border bg-surface md:flex",
          "transition-[width] duration-(--dur-slow) ease-panel motion-reduce:transition-none",
          expanded ? "w-[226px]" : "w-[60px]",
          className,
        )}
        {...props}
      >
        <div className="relative flex h-full w-full min-w-0 flex-col">
          <header className={cn("flex h-[76px] shrink-0 items-center justify-between px-3", !expanded && "justify-center")}>
            <div className={cn("relative min-w-0", !expanded && "hidden")}>
              <button type="button" onClick={onLogoClick} aria-label="Go to home" className="flex max-w-40 cursor-pointer items-center rounded-xs py-2 rovr-focus">
                {logo}
              </button>
              {logoCaption ? <div className="absolute right-0 bottom-0">{logoCaption}</div> : null}
            </div>
            {!hideCollapse && (
              <Tooltip side="right" content={toggleLabel}>
                <Button variant="ghost" size="icon-lg" aria-label={toggleLabel} aria-expanded={expanded} onClick={toggle} className="text-subtle-foreground hover:text-foreground">
                  <PanelLeft />
                </Button>
              </Tooltip>
            )}
          </header>

          <div className="min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto">
            {/* One highlight glides between the items instead of each lighting up. */}
            <Glide highlightClassName="rounded-full">{children}</Glide>
          </div>

          {footer ? (
            <Glide highlightClassName="rounded-full" className={cn("mt-auto flex shrink-0 flex-col gap-2 px-3 pt-2 pb-5", !expanded && "items-center px-1")}>
              {footer}
            </Glide>
          ) : null}
        </div>
      </aside>
    </SidebarContext.Provider>
  );
});

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Group heading. Shown only while the sidebar is expanded; it still names the group for assistive technology when collapsed. */
  label?: string;
  /** Draws a rule above the group, for a second and later group. */
  divided?: boolean;
}

/** A group of sidebar items with an optional small heading. */
export function SidebarSection({ label, divided = false, className, children, ...props }: SidebarSectionProps) {
  const { expanded } = useAppSidebar();
  return (
    <nav aria-label={label} className={cn("flex h-fit flex-col px-3 py-1", className)} {...props}>
      <div className={cn(divided && "mt-2 border-t border-border pt-2")}>
        {label && expanded && <h2 className="py-2 text-overline text-subtle-foreground">{label}</h2>}
        <ul className="flex flex-col">{children}</ul>
      </div>
    </nav>
  );
}

export interface SidebarItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** A Lucide icon element. */
  icon: React.ReactNode;
  label: string;
  /** The current page. */
  active?: boolean;
  /** A count on the icon's corner (unread messages, open tasks). Hidden when collapsed. */
  badge?: number;
  /** A dot at the end of the row for something happening now, such as a visit that can be joined. Pass its meaning as the string. */
  dot?: string;
}

/** One navigation row: icon, label, and an optional count or live dot. */
export const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(function SidebarItem(
  { icon, label, active = false, badge, dot, disabled, className, ...props },
  ref,
) {
  const { expanded } = useAppSidebar();
  return (
    <li>
      <button
        ref={ref}
        type="button"
        title={label}
        disabled={disabled}
        aria-current={active ? "page" : undefined}
        data-glide={disabled || active ? undefined : ""}
        className={cn(
          "group relative flex min-h-8 w-full cursor-pointer items-center rounded-full p-1.5 text-foreground rovr-focus rovr-press",
          "[&_svg]:size-5 [&_svg]:shrink-0",
          active && "bg-accent text-accent-foreground",
          disabled && "cursor-not-allowed text-subtle-foreground",
          !expanded && "justify-center px-0",
          className,
        )}
        {...props}
      >
        <span className="relative inline-flex shrink-0">
          {icon}
          {badge != null && badge > 0 && expanded && (
            <Badge variant="count" tone="info" className="absolute -top-1 -right-1.5 h-4 min-w-4">
              {badge > 99 ? "99+" : badge}
            </Badge>
          )}
        </span>
        <span
          className={cn(
            "truncate text-left text-body-sm leading-tight whitespace-nowrap transition-[opacity,width,margin] duration-(--dur-fast) motion-reduce:transition-none",
            active && "font-semibold",
            expanded ? "ml-1 w-auto opacity-100" : "ml-0 w-0 overflow-hidden opacity-0",
          )}
        >
          {label}
        </span>
        {dot && <span role="img" aria-label={dot} className={cn("size-2 shrink-0 rounded-full bg-primary", expanded ? "ml-auto" : "absolute top-1 right-1")} />}
      </button>
    </li>
  );
});

export interface SidebarRecentItem {
  id: string;
  title: string;
  /** Shows the unread dot. */
  unread?: boolean;
  /** The conversation is being opened: shows a spinner and blocks the row. */
  opening?: boolean;
}

export interface SidebarRecentProps extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Heading above the list. */
  label?: string;
  items: SidebarRecentItem[];
  /** Shows five placeholder rows while the list loads. */
  loading?: boolean;
  /** Shown when there are no items. */
  emptyText?: string;
  onSelect?: (item: SidebarRecentItem) => void;
}

/** The list of recent conversations under the navigation. It is not rendered while the sidebar is collapsed. */
export function SidebarRecent({ label = "Recent", items, loading = false, emptyText = "No recent conversations", onSelect, className, ...props }: SidebarRecentProps) {
  const { expanded } = useAppSidebar();
  if (!expanded) return null;
  return (
    <section aria-label={label} className={cn("mt-2 w-full px-3 pt-2", className)} {...props}>
      <h2 className="py-2 text-overline text-subtle-foreground">{label}</h2>
      <div className="mt-2">
        {loading ? (
          <div role="status" aria-label={`Loading ${label.toLowerCase()}`} className="flex flex-col gap-1 px-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="py-1.5">
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="px-2 py-1 text-body-sm text-subtle-foreground">{emptyText}</p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={item.opening}
                  onClick={() => onSelect?.(item)}
                  data-glide=""
                  className={cn("w-full cursor-pointer rounded-full px-2 py-1.5 text-left rovr-focus rovr-press", item.opening && "cursor-wait bg-secondary")}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate text-body-sm leading-tight text-foreground">{item.title}</span>
                    {item.opening ? (
                      <Spinner label="Opening conversation" className="size-2.5 shrink-0 text-primary" />
                    ) : (
                      item.unread && <span role="img" aria-label="Unread" className="size-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/** A rule in the sidebar footer. Hidden while the sidebar is collapsed. */
export function SidebarSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useAppSidebar();
  if (!expanded) return null;
  return <div role="separator" className={cn("h-px w-full shrink-0 bg-border", className)} {...props} />;
}

export interface SidebarWorkspaceSwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** A Lucide icon element. */
  icon: React.ReactNode;
  /** The workspace it switches to, such as "RCM home". */
  label: string;
  /** What pressing it does, such as "Go to workspace". */
  description?: string;
}

/** A two-line row between rules in the sidebar footer that switches to another workspace. */
export const SidebarWorkspaceSwitch = React.forwardRef<HTMLButtonElement, SidebarWorkspaceSwitchProps>(function SidebarWorkspaceSwitch(
  { icon, label, description, className, ...props },
  ref,
) {
  const { expanded } = useAppSidebar();
  return (
    <div className="w-full border-y border-border py-2">
      <Tooltip side="right" content={label}>
        <button
          ref={ref}
          type="button"
          data-glide=""
          className={cn(
            "flex w-full cursor-pointer items-center gap-2.5 rounded-full p-1.5 text-left text-foreground rovr-focus rovr-press [&_svg]:size-5 [&_svg]:shrink-0",
            !expanded && "min-h-8 justify-center p-0",
            className,
          )}
          {...props}
        >
          {icon}
          <span className={cn("flex min-w-0 flex-1 flex-col", !expanded && "sr-only")}>
            <span className="block truncate text-label leading-tight">{label}</span>
            {description && <span className="mt-0.5 block truncate text-caption leading-tight text-subtle-foreground">{description}</span>}
          </span>
        </button>
      </Tooltip>
    </div>
  );
});

export interface SidebarAccountProps {
  /** The signed-in person's full name. Also gives the initials when there is no photo. */
  name: string;
  /** The line under the name: a role, a plan or an email address. */
  detail?: string;
  /** Profile photo. */
  src?: string;
  /** `sm` is the provider app's tight row. `md` is the patient app's roomier one. */
  size?: "sm" | "md";
  /** Shows placeholders while the profile loads. */
  loading?: boolean;
  /** Repeats the avatar, name and detail at the top of the menu, above a rule. */
  menuHeader?: boolean;
  /** The menu's items: `MenuItem`, `MenuSeparator`. */
  children?: React.ReactNode;
  className?: string;
}

/** The account row at the bottom of the sidebar: avatar, name, detail and a chevron. Pressing it opens a menu above the row. */
export function SidebarAccount({ name, detail, src, size = "sm", loading = false, menuHeader = false, children, className }: SidebarAccountProps) {
  const { expanded } = useAppSidebar();
  const identity = (
    <>
      <Avatar name={name} src={src} size="sm" className="size-9" />
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="block truncate text-label leading-tight font-semibold text-foreground">{name}</span>
        {detail && <span className="mt-0.5 block truncate text-caption leading-tight text-subtle-foreground">{detail}</span>}
      </span>
    </>
  );
  return (
    <div className="relative w-full">
      <Menu>
        <MenuTrigger
          data-glide=""
          aria-label={expanded ? undefined : `Account: ${name}`}
          className={cn(
            "flex w-full cursor-pointer items-center text-left outline-none rovr-focus rovr-press data-[popup-open]:bg-secondary",
            size === "sm" ? "gap-2.5 rounded-full p-1.5" : "gap-3 rounded-lg px-4 py-3",
            !expanded && (size === "sm" ? "justify-center p-0" : "justify-center px-2"),
            className,
          )}
        >
          {loading ? (
            <span role="status" aria-label="Loading profile" className={cn("flex min-w-0 items-center", size === "sm" ? "gap-2.5" : "gap-3")}>
              <Skeleton className="size-9 shrink-0 rounded-full" />
              {expanded && (
                <span className="flex min-w-0 flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </span>
              )}
            </span>
          ) : (
            <>
              <Avatar name={name} src={src} size="sm" className="size-9" />
              <span className={cn("flex min-w-0 flex-1 flex-col text-left", !expanded && "hidden")}>
                <span className="block truncate text-label leading-tight font-semibold text-foreground">{name}</span>
                {detail && <span className="mt-0.5 block truncate text-caption leading-tight text-subtle-foreground">{detail}</span>}
              </span>
            </>
          )}
          <ChevronsUpDown aria-hidden className={cn("size-3.5 shrink-0 text-subtle-foreground", (!expanded || (loading && size === "sm")) && "hidden")} />
        </MenuTrigger>
        <MenuContent side="top" align="start" sideOffset={8} className="w-(--anchor-width) min-w-[200px]">
          {menuHeader && (
            <>
              <div className="flex items-center gap-3 px-2 py-2">{identity}</div>
              <div role="separator" className="-mx-1 my-1 h-px bg-border" />
            </>
          )}
          {children}
        </MenuContent>
      </Menu>
    </div>
  );
}
