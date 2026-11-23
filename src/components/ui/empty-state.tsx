import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Icon for the thing that is missing: a flask for labs, a calendar for visits. */
  icon?: React.ReactNode;
  /** What this area will hold. */
  title: React.ReactNode;
  /** How it gets filled, in one sentence. */
  description?: React.ReactNode;
  /** The action that fills it. */
  action?: React.ReactNode;
  /** `default` draws the ghost of the content that will be here. `compact` is icon only, for small panels. */
  size?: "default" | "compact";
}

const appear = [0.16, 1, 0.3, 1] as const;

/**
 * The picture is the ghost of what belongs here: three faint rows, with the
 * icon resting on them. The rows settle in one after another and the icon
 * drifts a few pixels, so an empty area reads as waiting, not broken.
 */
function Ghost({ icon }: { icon?: React.ReactNode }) {
  const reduced = useReducedMotion();
  const rows = [
    { w: "100%", x: 0, o: 1 },
    { w: "86%", x: 14, o: 0.7 },
    { w: "72%", x: 28, o: 0.42 },
  ];
  return (
    <div aria-hidden className="relative h-[5.5rem] w-44">
      {rows.map((row, i) => (
        <motion.div
          key={i}
          className="absolute left-0 flex h-7 items-center gap-2 rounded-lg bg-surface px-2 shadow-raised"
          style={{ width: row.w, top: i * 28, left: row.x / 2 }}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: row.o, y: 0 }}
          transition={{ duration: 0.5, ease: appear, delay: 0.05 + i * 0.07 }}
        >
          <span className="size-3 shrink-0 rounded-full bg-secondary-hover" />
          <span className="h-1.5 flex-1 rounded-full bg-secondary-hover" />
          <span className="h-1.5 w-5 rounded-full bg-secondary" />
        </motion.div>
      ))}
      {icon && (
        <motion.div
          className="absolute -top-2 -right-1 grid size-10 place-items-center rounded-full bg-surface text-accent-foreground shadow-risen [&_svg]:size-4.5"
          initial={reduced ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 18, mass: 0.6, stiffness: 320, delay: 0.22 }}
        >
          <motion.span
            className="grid place-items-center"
            animate={reduced ? undefined : { y: [0, -2.5, 0] }}
            transition={{ duration: 3.6, ease: "easeInOut", repeat: Infinity, delay: 0.8 }}
          >
            {icon}
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, description, action, size = "default", className, ...props }: EmptyStateProps) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("flex flex-col items-center text-center", size === "default" ? "gap-5 px-6 py-10" : "gap-3 px-4 py-6", className)} {...props}>
      {size === "default" ? (
        <Ghost icon={icon} />
      ) : (
        icon && <div className="grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground [&_svg]:size-4.5">{icon}</div>
      )}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: appear, delay: size === "default" ? 0.18 : 0 }}
      >
        <div className="flex max-w-sm flex-col gap-1">
          <p className="text-title-md">{title}</p>
          {description && <p className="text-body-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </motion.div>
    </div>
  );
}
