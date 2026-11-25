import * as React from "react";
import { Info } from "lucide-react";
import { EditableField, type EditableFieldProps } from "@/components/ui/editable-field";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type PanelProps = React.HTMLAttributes<HTMLDivElement>;

/** A bordered box for one group of settings. Holds a `PanelHeader` and a `PanelBody`. */
export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(function Panel({ className, ...props }, ref) {
  return <div ref={ref} className={cn("w-full overflow-hidden rounded-lg border border-border bg-surface text-card-foreground", className)} {...props} />;
});

export type PanelHeaderProps = React.HTMLAttributes<HTMLHeadingElement>;

/** The tinted strip at the top of a panel that names the group. */
export function PanelHeader({ className, ...props }: PanelHeaderProps) {
  return <h2 className={cn("border-b border-border bg-surface-sunken px-4 py-3 text-title-md", className)} {...props} />;
}

export type PanelBodyProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Two columns: labels on the left, values on the right. The label column is 200px wide
 * on desktop (1100px and up) and half the panel below that. Each `PanelRow` fills one row;
 * any other pair of children does the same.
 */
export function PanelBody({ className, ...props }: PanelBodyProps) {
  return (
    <div
      className={cn("grid grid-cols-2 gap-x-2 gap-y-6 px-2 py-6 min-[1100px]:grid-cols-[200px_1fr] min-[1100px]:gap-x-8 min-[1100px]:px-4", className)}
      {...props}
    />
  );
}

export interface PanelRowProps {
  /** Names the value. Shown in the left column, aligned to its right edge. */
  label: string;
  value: string;
  /** Makes the value editable in place. Called with the new value on save; return a promise to show a pending state. */
  onUpdate?: EditableFieldProps["onSave"];
  /** Explains the row, e.g. why a value cannot be changed here. Shown from an info button after the label. */
  tooltip?: string;
  /** Classes for a value that is not editable. */
  valueClassName?: string;
  /** The kind of input shown while editing. */
  type?: EditableFieldProps["type"];
  /** A digit pattern for the editable value, such as `"(___) ___-____"`. */
  mask?: string;
  /** Shows an editable value without its edit button, e.g. on a deactivated account. */
  disabled?: boolean;
  /** Shown in place of an empty editable value. */
  emptyText?: string;
}

/** One label and value pair inside a `PanelBody`. Renders two grid cells. */
export function PanelRow({ label, value, onUpdate, tooltip, valueClassName, type, mask, disabled, emptyText }: PanelRowProps) {
  return (
    <>
      <div className="flex items-center justify-end gap-2 text-body-sm font-medium min-[1100px]:text-body">
        {label}
        {tooltip && (
          <Tooltip content={tooltip} className="max-w-[300px]">
            <button
              type="button"
              aria-label={`About ${label}`}
              // The hit area extends past the 16px icon so it is easy to press.
              className="relative grid size-4 shrink-0 cursor-pointer place-items-center rounded-full text-accent-foreground rovr-focus after:absolute after:-inset-2.5"
            >
              <Info aria-hidden className="size-4" strokeWidth={1.5} />
            </button>
          </Tooltip>
        )}
      </div>
      <div className="flex min-w-0 items-center text-body-sm min-[1100px]:text-body">
        {onUpdate ? (
          // The negative margin keeps an editable row the same height as a plain one.
          <EditableField
            label={label}
            value={value}
            onSave={onUpdate}
            type={type}
            mask={mask}
            disabled={disabled}
            emptyText={emptyText}
            size="sm"
            className="-my-1 min-[1100px]:text-body"
          />
        ) : (
          <p className={cn("capitalize", valueClassName)}>{value}</p>
        )}
      </div>
    </>
  );
}
