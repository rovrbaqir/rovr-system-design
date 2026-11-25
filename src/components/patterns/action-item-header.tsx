import * as React from "react";
import { motion } from "motion/react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { duration, ease } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

const shortDate = (d: Date) => new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).format(d);

export interface ActionItemHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** What the step is: "Confirm appointment". Stays on one line and scrolls sideways on a desktop; wraps below 1100px. */
  title: string;
  /** One or two sentences under the title. Line breaks in the text are kept. */
  description?: string;
  /** The clinician the action item comes from. Shown at the top right. */
  displayName?: string;
  /** The date of the visit the action item comes from. Shown under the name; left out when it is missing or not a date. */
  appDate?: string | Date;
  /** Starts the description with the clinician's name: "Dr. Okafor, has ordered…". */
  needDoctorNameFirstOfDescription?: boolean;
  /** Adds the clinician's name to the end of the title. */
  addDoctorNameToTheEndOfTitle?: boolean;
}

/** The top of every action item step: the title on the left, the clinician and visit date on the right, and a description below. */
export function ActionItemHeader({
  title,
  description,
  displayName,
  appDate,
  needDoctorNameFirstOfDescription = false,
  addDoctorNameToTheEndOfTitle = false,
  className,
  ...props
}: ActionItemHeaderProps) {
  const date = appDate ? new Date(appDate) : null;
  const validDate = date && !Number.isNaN(date.getTime()) ? date : null;
  return (
    <section className={cn("flex w-full flex-none flex-col items-start justify-start gap-1", className)} {...props}>
      <div className="flex w-full items-center justify-between">
        <h2 className="overflow-x-auto text-title-lg font-semibold whitespace-nowrap max-2xl:text-title-md max-2xl:font-semibold max-[1099px]:w-[70%] max-[1099px]:text-body max-[1099px]:font-semibold max-[1099px]:whitespace-normal">
          {title}
          {addDoctorNameToTheEndOfTitle && <> {displayName}</>}
        </h2>
        <div className="flex flex-col items-end justify-start text-caption">
          <span>{displayName}</span>
          {validDate && (
            <time dateTime={validDate.toISOString()} className="text-data">
              {shortDate(validDate)}
            </time>
          )}
        </div>
      </div>
      {description && (
        <p className="inline-block w-[95%] text-body-sm whitespace-pre-line max-2xl:text-caption">
          {needDoctorNameFirstOfDescription ? `${displayName}, ${description}` : description}
        </p>
      )}
    </section>
  );
}

export interface ActionItemDetailsProps extends Omit<React.ComponentProps<typeof motion.div>, "children"> {
  children: React.ReactNode;
  /** Milliseconds the loader shows before the content replaces it. */
  delay?: number;
}

/**
 * The frame of one action item step: a centred column that fades in and shows
 * a loader for half a second before its content, so moving between steps reads as one motion.
 * Give it a new `key` for each step.
 */
export function ActionItemDetails({ children, delay = 500, className, ...props }: ActionItemDetailsProps) {
  const [isLoading, setIsLoading] = React.useState(delay > 0);

  React.useEffect(() => {
    if (delay <= 0) return;
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0.2 }}
      animate={{ opacity: 1, transition: { duration: duration.slow, delay: 0.1, ease: ease.inOut } }}
      exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.out } }}
      className={cn("relative my-auto flex h-full w-full flex-1 flex-col items-center justify-center gap-7 overflow-hidden px-2 pt-0 pb-3 max-2xl:gap-3 max-2xl:pb-1", className)}
      {...props}
    >
      {isLoading ? (
        <div className="relative flex h-full w-full flex-1 items-center justify-center">
          <LoadingOverlay />
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
}
