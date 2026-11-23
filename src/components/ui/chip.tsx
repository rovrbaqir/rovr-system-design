import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Shown before the value in a lighter weight: "Status". */
  label?: string;
  /** Makes the chip removable. */
  onRemove?: () => void;
}

/** An applied filter or a selected entity that can be removed. */
export function Chip({ label, onRemove, className, children, ...props }: ChipProps) {
  return (
    <span className={cn("inline-flex h-7 items-center gap-1 rounded-full bg-surface pr-1 pl-3 text-[0.8125rem] font-medium shadow-raised", !onRemove && "pr-3", className)} {...props}>
      {label && <span className="font-normal text-muted-foreground">{label}</span>}
      {children}
      {onRemove && (
        <button type="button" aria-label="Remove filter" onClick={onRemove} className="grid size-5 cursor-pointer place-items-center rounded-full text-muted-foreground rovr-focus rovr-press hover:bg-secondary-hover hover:text-foreground">
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}

export interface ChipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** One entry per chip. Keys must be stable so chips animate when they are added or removed. */
  items: { key: string; node: React.ReactNode }[];
  /** Shown after the chips, e.g. a "Clear all" link. */
  trailing?: React.ReactNode;
}

/** A row of chips that makes room smoothly: a removed chip shrinks away and its neighbours slide over. */
export function ChipGroup({ items, trailing, className, ...props }: ChipGroupProps) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} {...props}>
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <motion.span
            key={item.key}
            layout={reduced ? false : "position"}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.85 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1], layout: { type: "spring", damping: 26, stiffness: 320, mass: 0.7 } }}
            className="inline-flex"
          >
            {item.node}
          </motion.span>
        ))}
        {trailing && (
          <motion.span key="__trailing" layout={reduced ? false : "position"} transition={{ type: "spring", damping: 26, stiffness: 320, mass: 0.7 }} className="inline-flex">
            {trailing}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
