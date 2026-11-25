import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { GradientText } from "@/components/ui/gradient-text";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Spinner } from "@/components/ui/spinner";
import { duration, ease } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

/** The RoVR wordmark. It takes the text colour; the slash keeps the brand blue. Size it with a height class. */
export function RovrWordmark({ className, ...props }: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 15" fill="none" role="img" aria-label="RoVR" className={cn("h-4 w-auto text-foreground", className)} {...props}>
      <path
        fill="currentColor"
        d="M0 14.4648V0H5.31066C6.46785 0 7.4184 0.199752 8.1623 0.599257C8.91999 0.984986 9.48481 1.51536 9.85676 2.19039C10.2287 2.85164 10.4147 3.58865 10.4147 4.40144C10.4147 5.2831 10.1805 6.089 9.71211 6.81913C9.2575 7.54926 8.54115 8.07963 7.56305 8.41026L10.5593 14.4648H7.52172L4.83539 8.76155H2.645V14.4648H0ZM2.645 6.81913H5.14535C6.02702 6.81913 6.67449 6.6056 7.08777 6.17854C7.50105 5.75149 7.7077 5.18667 7.7077 4.48409C7.7077 3.79529 7.50105 3.24425 7.08777 2.83097C6.68827 2.41769 6.03391 2.21105 5.12469 2.21105H2.645V6.81913Z"
      />
      <path
        fill="currentColor"
        d="M15.8653 14.7128C14.8734 14.7128 13.978 14.4855 13.179 14.0309C12.3938 13.5763 11.7669 12.9495 11.2986 12.1504C10.844 11.3377 10.6166 10.4009 10.6166 9.34014C10.6166 8.27938 10.8508 7.3495 11.3192 6.55049C11.7876 5.73771 12.4144 5.10401 13.1997 4.6494C13.9987 4.1948 14.8941 3.96749 15.886 3.96749C16.8641 3.96749 17.7457 4.1948 18.531 4.6494C19.33 5.10401 19.9568 5.73771 20.4114 6.55049C20.8798 7.3495 21.114 8.27938 21.114 9.34014C21.114 10.4009 20.8798 11.3377 20.4114 12.1504C19.9568 12.9495 19.33 13.5763 18.531 14.0309C17.732 14.4855 16.8434 14.7128 15.8653 14.7128ZM15.8653 12.4191C16.5541 12.4191 17.1534 12.1642 17.6631 11.6545C18.1728 11.131 18.4277 10.3596 18.4277 9.34014C18.4277 8.32071 18.1728 7.55614 17.6631 7.04643C17.1534 6.52294 16.561 6.2612 15.886 6.2612C15.1834 6.2612 14.5773 6.52294 14.0675 7.04643C13.5716 7.55614 13.3236 8.32071 13.3236 9.34014C13.3236 10.3596 13.5716 11.131 14.0675 11.6545C14.5773 12.1642 15.1765 12.4191 15.8653 12.4191Z"
      />
      <path fill="currentColor" d="M24.337 14.4648L20.2925 4.23459H23.1235L25.9695 11.7578L30.0816 0H32.8713L27.5813 14.4648H24.337Z" />
      <path
        fill="currentColor"
        d="M33.3511 14.4648V0H38.6617C39.8189 0 40.7695 0.199752 41.5134 0.599257C42.2711 0.984986 42.8359 1.51536 43.2078 2.19039C43.5798 2.85164 43.7658 3.58865 43.7658 4.40144C43.7658 5.2831 43.5316 6.089 43.0632 6.81913C42.6086 7.54926 41.8922 8.07963 40.9141 8.41026L43.9104 14.4648H40.8728L38.1865 8.76155H35.9961V14.4648H33.3511ZM35.9961 6.81913H38.4964C39.3781 6.81913 40.0256 6.6056 40.4389 6.17854C40.8521 5.75149 41.0588 5.18667 41.0588 4.48409C41.0588 3.79529 40.8521 3.24425 40.4389 2.83097C40.0394 2.41769 39.385 2.21105 38.4758 2.21105H35.9961V6.81913Z"
      />
      <path fill="var(--brand)" d="M24.3281 14.4843L30.0727 0.0195312H32.8624L27.5724 14.4843H24.3281Z" />
    </svg>
  );
}

export interface PoweredByRovrProps {
  /** `xs` is the tiny line under a sidebar logo. `sm` is the line under a tenant logo header. */
  size?: "xs" | "sm";
  /** Render plain text and the mark instead of a link to the RoVR site. */
  disableLink?: boolean;
  className?: string;
}

/** The "powered by RoVR" line shown next to a tenant's own logo. */
export function PoweredByRovr({ size = "xs", disableLink = false, className }: PoweredByRovrProps) {
  const content = (
    <>
      <span className={cn("text-foreground", size === "xs" ? "text-[0.5rem] leading-none" : "relative top-0.5 text-body-sm")}>powered by</span>
      <RovrWordmark aria-hidden className={size === "xs" ? "h-2" : "h-4"} />
    </>
  );
  if (disableLink) {
    return (
      <div aria-label="Powered by RoVR" role="img" className={cn("flex items-center gap-1", className)}>
        {content}
      </div>
    );
  }
  return (
    <a
      href="https://rovrstack.ai/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Powered by RoVR"
      className={cn("flex items-center gap-1 rounded-xs rovr-focus hover:opacity-80", className)}
    >
      {content}
    </a>
  );
}

export type IntakePageProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Width wrapper for intake and onboarding pages: full width on small screens,
 * a centred 40rem column with side padding on desktop.
 */
export const IntakePage = React.forwardRef<HTMLDivElement, IntakePageProps>(function IntakePage({ className, ...props }, ref) {
  return <div ref={ref} className={cn("mx-auto w-full min-[1100px]:max-w-[40rem] min-[1100px]:px-10", className)} {...props} />;
});

export interface TenantLogoHeaderProps {
  /** `full`: centred block with the "powered by RoVR" line. `inline`: the logo only, for tight toolbars. */
  variant?: "full" | "inline";
  /** URL of the clinic's logo. Without a logo the RoVR wordmark is shown. */
  logoSrc?: string;
  /** Alt text for `logoSrc`. */
  logoAlt?: string;
  /** A logo element (an inline SVG, for example) used instead of `logoSrc`. */
  logo?: React.ReactNode;
  /** Shown under the RoVR wordmark when the clinic has no logo. `full` variant only. */
  tenantName?: string;
  /** The logo is still being fetched. */
  loading?: boolean;
  /** Show the "powered by RoVR" line. Turn it off for RoVR's own pages. `full` variant only. */
  showPoweredBy?: boolean;
  className?: string;
}

/** The clinic's logo at the top of onboarding, activation and intake pages. */
export function TenantLogoHeader({
  variant = "full",
  logoSrc,
  logoAlt = "Clinic logo",
  logo,
  tenantName,
  loading = false,
  showPoweredBy = true,
  className,
}: TenantLogoHeaderProps) {
  const hasLogo = Boolean(logo || logoSrc);

  if (variant === "inline") {
    return (
      <div aria-busy={loading || undefined} className={cn("relative flex min-h-8 shrink-0 items-center justify-center", className)}>
        <div className={cn("flex items-center justify-center [&>img]:h-8 [&>img]:w-auto [&>img]:max-w-40 [&>img]:object-contain [&>img]:object-left [&>svg]:h-8 [&>svg]:w-auto [&>svg]:max-w-40", loading && "opacity-0")}>
          {logo ?? (logoSrc ? <img src={logoSrc} alt={logoAlt} /> : <RovrWordmark className="h-6! max-w-none!" />)}
        </div>
        {loading && (
          <span className="absolute inset-0 grid place-items-center">
            <Spinner label="Loading logo" className="size-5 text-primary" />
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative mx-auto flex w-[550px] max-w-[95%] flex-col items-center justify-center rounded-lg p-4", className)}>
      <LoadingOverlay open={loading} className="p-0" />
      <div className="flex w-fit flex-col items-center justify-end">
        {hasLogo ? (
          <div className="flex w-full justify-center [&>img]:h-auto [&>img]:max-h-28 [&>img]:w-full [&>img]:object-contain [&>svg]:h-auto [&>svg]:max-h-28 [&>svg]:w-full">
            {logo ?? <img src={logoSrc} alt={logoAlt} />}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <RovrWordmark className="h-16" />
            {tenantName && tenantName.trim().length > 0 && tenantName !== "-" && <p className="text-label text-muted-foreground">{tenantName}</p>}
          </div>
        )}
        {showPoweredBy && (
          <div className="mt-1 flex w-full items-center justify-end">
            <PoweredByRovr size="sm" />
          </div>
        )}
      </div>
    </div>
  );
}

export interface ActivationShellProps extends Pick<TenantLogoHeaderProps, "logoSrc" | "logoAlt" | "logo" | "tenantName" | "loading" | "showPoweredBy"> {
  /** The page headline, set in the brand gradient. */
  title: string;
  /** One or two sentences under the headline. */
  subtitle?: string;
  /** The step itself: a form, a code field, a confirmation. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Page frame for account activation: a centred column with the clinic logo,
 * a gradient headline, an optional subtitle, then the step. It fills its
 * parent and scrolls inside it.
 */
export function ActivationShell({ title, subtitle, children, className, ...logoProps }: ActivationShellProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={cn("h-full w-full overflow-y-auto bg-background px-6 pb-10", className)}
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, ease: ease.out }}
    >
      <div className="mx-auto w-full max-w-[32rem]">
        <div className="mt-6 flex flex-col items-center text-center">
          <TenantLogoHeader {...logoProps} className="max-w-[28rem] rounded-md p-3" />
          <GradientText as="h2" className="mt-5">
            {title}
          </GradientText>
          {subtitle ? <p className="mt-4 max-w-[29rem] text-body text-muted-foreground">{subtitle}</p> : null}
        </div>
        <div className="mx-auto mt-10 w-full max-w-[28rem]">{children}</div>
      </div>
    </motion.div>
  );
}
