import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Glide } from "./glide";

export interface ComboboxItem {
  value: string;
  label: string;
  /** Secondary line, e.g. a specialty or an MRN. */
  description?: string;
  disabled?: boolean;
}

interface Shared<T extends ComboboxItem> {
  items: T[];
  placeholder?: string;
  /** Shown when nothing matches the typed text. */
  emptyText?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  "aria-label"?: string;
}

export interface ComboboxProps<T extends ComboboxItem> extends Shared<T> {
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (value: T | null) => void;
}

export interface MultiComboboxProps<T extends ComboboxItem> extends Shared<T> {
  value?: T[];
  defaultValue?: T[];
  onValueChange?: (value: T[]) => void;
}

const heights = { sm: "min-h-control-sm", md: "min-h-control-md", lg: "min-h-control-lg" } as const;

const shell = [
  "flex w-full items-center gap-1.5 rounded-md border border-input bg-surface px-3 text-sm",
  "transition-[border-color,box-shadow] duration-(--dur-fast) ease-out hover:border-border-strong",
  "focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_22%,transparent)]",
  "data-[invalid]:border-destructive has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-surface-sunken",
].join(" ");

function Popup<T extends ComboboxItem>({ anchor, emptyText }: { anchor: React.RefObject<HTMLDivElement | null>; emptyText: string }) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner anchor={anchor} sideOffset={6} className="z-50 outline-none">
        <BaseCombobox.Popup className="rovr-pop max-h-[min(20rem,var(--available-height))] w-(--anchor-width) overflow-y-auto rounded-md rovr-glass p-1 text-popover-foreground outline-none">
          <BaseCombobox.Empty className="px-2.5 py-6 text-center text-body-sm text-muted-foreground empty:hidden">{emptyText}</BaseCombobox.Empty>
          <Glide follow="data-highlighted">
          <BaseCombobox.List>
            {(item: T) => (
              <BaseCombobox.Item
                key={item.value}
                value={item}
                disabled={item.disabled}
                className={cn(
                  "flex min-h-9 cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-2.5 text-sm outline-none select-none",
                  "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
                )}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{item.label}</span>
                  {item.description && <span className="truncate text-caption text-muted-foreground">{item.description}</span>}
                </span>
                <BaseCombobox.ItemIndicator className="text-primary">
                  <Check className="size-4" />
                </BaseCombobox.ItemIndicator>
              </BaseCombobox.Item>
            )}
          </BaseCombobox.List>
          </Glide>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

/** A searchable dropdown: type to filter, arrow keys to move, Enter to choose. */
export function Combobox<T extends ComboboxItem>({
  items,
  placeholder = "Search",
  emptyText = "No matches. Try a different spelling.",
  size = "md",
  invalid,
  className,
  ...props
}: ComboboxProps<T>) {
  const anchor = React.useRef<HTMLDivElement>(null);
  return (
    <BaseCombobox.Root items={items} {...props}>
      <div ref={anchor} data-invalid={invalid || undefined} className={cn(shell, heights[size], className)}>
        <BaseCombobox.Input
          placeholder={placeholder}
          aria-label={props["aria-label"]}
          aria-invalid={invalid}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        <BaseCombobox.Clear aria-label="Clear" className="grid size-5 cursor-pointer place-items-center rounded-full text-muted-foreground rovr-focus hover:bg-secondary hover:text-foreground">
          <X className="size-3.5" />
        </BaseCombobox.Clear>
        <BaseCombobox.Trigger aria-label="Show options" className="grid size-5 cursor-pointer place-items-center rounded-xs text-muted-foreground rovr-focus">
          <ChevronsUpDown className="size-4" />
        </BaseCombobox.Trigger>
      </div>
      <Popup<T> anchor={anchor} emptyText={emptyText} />
    </BaseCombobox.Root>
  );
}

/** Searchable multi-select. Chosen items become removable chips inside the field. */
export function MultiCombobox<T extends ComboboxItem>({
  items,
  placeholder = "Search",
  emptyText = "No matches. Try a different spelling.",
  size = "md",
  invalid,
  className,
  ...props
}: MultiComboboxProps<T>) {
  const anchor = React.useRef<HTMLDivElement>(null);
  return (
    <BaseCombobox.Root items={items} multiple {...props}>
      <BaseCombobox.Chips ref={anchor} data-invalid={invalid || undefined} className={cn(shell, heights[size], "flex-wrap gap-1 py-1 pl-1.5", className)}>
        <BaseCombobox.Value>
          {(selected: T[]) => (
            <>
              {selected.map((item) => (
                <BaseCombobox.Chip
                  key={item.value}
                  aria-label={item.label}
                  className="flex h-6 items-center gap-1 rounded-sm bg-secondary pr-0.5 pl-2 text-caption font-medium outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                >
                  {item.label}
                  <BaseCombobox.ChipRemove aria-label={`Remove ${item.label}`} className="grid size-5 cursor-pointer place-items-center rounded-xs text-muted-foreground hover:bg-secondary-hover hover:text-foreground">
                    <X className="size-3" />
                  </BaseCombobox.ChipRemove>
                </BaseCombobox.Chip>
              ))}
              <BaseCombobox.Input
                placeholder={selected.length ? "" : placeholder}
                aria-label={props["aria-label"]}
                className="h-6 min-w-16 flex-1 bg-transparent pl-1.5 outline-none placeholder:text-muted-foreground"
              />
            </>
          )}
        </BaseCombobox.Value>
      </BaseCombobox.Chips>
      <Popup<T> anchor={anchor} emptyText={emptyText} />
    </BaseCombobox.Root>
  );
}
