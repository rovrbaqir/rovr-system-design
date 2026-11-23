import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { CornerDownLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Glide } from "./glide";
import { Kbd } from "./kbd";

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  icon?: React.ReactNode;
  /** Extra words that should match, e.g. "rx" for Prescriptions. */
  keywords?: string;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
}

/** Search-and-jump for the whole app. Bind it to ⌘K with `useCommandShortcut`. */
export function CommandPalette({ open, onOpenChange, items, placeholder = "Search patients, pages and actions" }: CommandPaletteProps) {
  const [query, setQuery] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const list = React.useRef<HTMLDivElement>(null);

  const matches = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => `${i.label} ${i.keywords ?? ""} ${i.group}`.toLowerCase().includes(q)) : items;
  }, [items, query]);
  const groups = React.useMemo(() => [...new Set(matches.map((m) => m.group))], [matches]);

  React.useEffect(() => setIndex(0), [query, open]);
  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);
  React.useEffect(() => {
    list.current?.querySelector("[data-active]")?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const run = (item: CommandItem | undefined) => {
    if (!item) return;
    onOpenChange(false);
    item.onSelect();
  };

  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="rovr-backdrop fixed inset-0 z-50" />
        <BaseDialog.Popup
          aria-label="Command palette"
          className="rovr-dialog origin-top fixed top-[14vh] left-1/2 z-50 flex max-h-[min(28rem,70vh)] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 flex-col overflow-hidden rounded-2xl rovr-glass [background:color-mix(in_oklab,var(--chrome)_90%,transparent)] outline-none"
        >
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-4.5 shrink-0 text-muted-foreground" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setIndex((i) => (i + 1) % Math.max(1, matches.length));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setIndex((i) => (i - 1 + matches.length) % Math.max(1, matches.length));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  run(matches[index]);
                }
              }}
              role="combobox"
              aria-expanded
              aria-controls="rovr-command-list"
              aria-activedescendant={matches[index] ? `cmd-${matches[index].id}` : undefined}
              placeholder={placeholder}
              className="h-13 min-w-0 flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-muted-foreground"
            />
            <Kbd>esc</Kbd>
          </div>
          <div ref={list} id="rovr-command-list" role="listbox" className="overflow-y-auto p-1.5">
            {matches.length === 0 && <p className="px-3 py-8 text-center text-body-sm text-muted-foreground">Nothing matches “{query}”. Try a name, an MRN or a page.</p>}
            <Glide follow="data-active" highlightClassName="rounded-md">
              {groups.map((group) => (
                <div key={group} role="group" aria-label={group}>
                  <p className="px-2.5 pt-2.5 pb-1.5 text-overline text-subtle-foreground">{group}</p>
                  {matches
                    .filter((m) => m.group === group)
                    .map((item) => {
                      const i = matches.indexOf(item);
                      const active = i === index;
                      return (
                        <div
                          key={item.id}
                          id={`cmd-${item.id}`}
                          role="option"
                          aria-selected={active}
                          data-active={active || undefined}
                          onPointerMove={() => setIndex(i)}
                          onClick={() => run(item)}
                          className="flex h-10 cursor-default items-center gap-3 rounded-md px-2.5 text-sm select-none [&_svg]:size-4 [&_svg]:text-muted-foreground"
                        >
                          {item.icon}
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.shortcut && <span className="text-caption text-subtle-foreground">{item.shortcut}</span>}
                          <CornerDownLeft className={cn("transition-opacity duration-(--dur-fast)", active ? "opacity-100" : "opacity-0")} aria-hidden />
                        </div>
                      );
                    })}
                </div>
              ))}
            </Glide>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

/** The search field that opens the palette. Sits in a header or the top of a sidebar. */
export function CommandTrigger({ className, children = "Search", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-control-md w-full max-w-80 cursor-pointer items-center gap-2.5 rounded-full bg-secondary pr-2 pl-3.5 text-left text-sm text-muted-foreground rovr-focus hover:bg-secondary-hover",
        className,
      )}
      {...props}
    >
      <Search className="size-4 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <span className="flex shrink-0 gap-1" aria-hidden>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}

/** Opens the palette on ⌘K / Ctrl+K. */
export function useCommandShortcut(toggle: () => void) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);
}
