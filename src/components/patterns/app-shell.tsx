import { PanelLeft } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Glide } from "@/components/ui/glide";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ShellContext {
  collapsed: boolean;
  toggle: () => void;
}
const Context = React.createContext<ShellContext>({ collapsed: false, toggle: () => {} });
export const useAppShell = () => React.useContext(Context);

/** Sidebar plus content frame shared by the patient and provider apps. */
export function AppShell({
  sidebar,
  children,
  defaultCollapsed = false,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { sidebar: React.ReactNode; defaultCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const value = React.useMemo(() => ({ collapsed, toggle: () => setCollapsed((c) => !c) }), [collapsed]);
  return (
    <Context.Provider value={value}>
      <div
        data-collapsed={collapsed || undefined}
        className={cn(
          "group/shell grid min-h-full bg-background transition-[grid-template-columns] duration-300 ease-panel",
          "grid-cols-[17rem_minmax(0,1fr)] data-[collapsed]:grid-cols-[5rem_minmax(0,1fr)] max-md:grid-cols-[minmax(0,1fr)]!",
          className,
        )}
        {...props}
      >
        {sidebar}
        <main className="min-w-0">{children}</main>
      </div>
    </Context.Provider>
  );
}

export function Sidebar({
  className,
  header,
  footer,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { header?: React.ReactNode; footer?: React.ReactNode }) {
  const { toggle, collapsed } = useAppShell();
  return (
    <aside className={cn("sticky top-0 h-dvh p-2 max-md:hidden", className)} {...props}>
      <div className="flex h-full flex-col gap-2 overflow-hidden rounded-xl rovr-risen p-3">
        {/* Collapsed, the rail is one column of 40px circles: the toggle, every item and the footer share its centre line. */}
        <div className="flex h-10 items-center justify-between gap-2 pl-3 group-data-[collapsed]/shell:justify-center group-data-[collapsed]/shell:pl-0">
          <div className="min-w-0 group-data-[collapsed]/shell:hidden">{header}</div>
          <Button
            variant="ghost"
            size="icon-md"
            onClick={toggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className="shrink-0 text-muted-foreground"
          >
            <PanelLeft />
          </Button>
        </div>
        <nav aria-label="Main" className="flex-1 overflow-y-auto pt-2">
          <Glide className="flex flex-col gap-0.5" highlightClassName="rounded-full">
            {children}
          </Glide>
        </nav>
        {footer}
      </div>
    </aside>
  );
}

export function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 flex flex-col gap-0.5 first:mt-0">
      <p className="flex h-6 items-center px-3 text-overline whitespace-nowrap text-subtle-foreground group-data-[collapsed]/shell:hidden">
        {label}
      </p>
      {/* Collapsed, the label becomes a short rule so the groups still read as groups. */}
      <span aria-hidden className="mx-auto mb-2 hidden h-px w-5 bg-border-strong group-data-[collapsed]/shell:block" />
      {children}
    </div>
  );
}

export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  /** Count or short status shown at the end of the row. */
  badge?: React.ReactNode;
}

export function SidebarItem({ icon, label, active, badge, className, ...props }: SidebarItemProps) {
  const { collapsed } = useAppShell();
  const link = (
    <a
      data-glide
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-10 cursor-pointer items-center gap-3 rounded-full px-3 text-sm font-medium whitespace-nowrap rovr-focus",
        "group-data-[collapsed]/shell:w-10 group-data-[collapsed]/shell:justify-center group-data-[collapsed]/shell:px-0",
        "text-muted-foreground hover:text-foreground [&_svg]:size-4.5 [&_svg]:shrink-0",
        active && "bg-accent font-semibold text-accent-foreground hover:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {icon}
      <span className="flex-1 truncate group-data-[collapsed]/shell:hidden">{label}</span>
      {badge && <span className="text-caption text-data text-muted-foreground group-data-[collapsed]/shell:hidden">{badge}</span>}
    </a>
  );
  return collapsed ? (
    <Tooltip content={label} side="right">
      {link}
    </Tooltip>
  ) : (
    link
  );
}
