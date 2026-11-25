import * as React from "react";
import { ArrowUpRight, BadgeAlert, BadgeCheck, BadgeMinus, Clock, IdCard } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** A link to the patient in another tool. */
export interface PatientLink {
  /** Link text, e.g. "RoVR Work" or "Zendesk". */
  label: string;
  /** Where it goes. Without it the link is hidden (header) or shown as plain muted text (tile). */
  href?: string | null;
  /** Opens in a new tab. Leave off for a route inside the app. */
  external?: boolean;
}

const linkTone = "rounded-xs text-accent-foreground rovr-focus";
const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

/* ------------------------------------------------------------------ */
/* Name                                                                */
/* ------------------------------------------------------------------ */

interface PatientNameProps {
  /** Makes the name a link to the patient's chart. */
  href?: string;
  /** Makes the name a button that opens the patient summary. Wins over `href`. */
  onOpen?: () => void;
  className?: string;
  children: React.ReactNode;
}

const nameLink = "inline-flex max-w-full min-w-0 items-center gap-1.5 text-left underline decoration-[color-mix(in_oklab,var(--brand)_60%,transparent)] underline-offset-2 hover:decoration-brand hover:opacity-80";

/** The patient's name: a button when it opens the summary, a link when it goes to the chart, plain text otherwise. */
function PatientName({ href, onOpen, className, children }: PatientNameProps) {
  if (onOpen) {
    return (
      <button
        type="button"
        title="Open patient summary"
        onClick={(event) => {
          // The header often sits inside a clickable row. Opening the summary must not also open the row.
          event.stopPropagation();
          event.preventDefault();
          onOpen();
        }}
        className={cn(nameLink, linkTone, "cursor-pointer", className)}
      >
        <span className="min-w-0 truncate">{children}</span>
        <span aria-hidden className="inline-flex shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--brand)_9%,transparent)] p-1 shadow-[inset_0_0_0_0.5px_color-mix(in_oklab,var(--brand)_32%,transparent)]">
          <IdCard className="size-3" />
        </span>
        <span className="sr-only">, open patient summary</span>
      </button>
    );
  }
  if (href) {
    return (
      <a href={href} title="Open patient chart" onClick={(event) => event.stopPropagation()} className={cn(nameLink, linkTone, className)}>
        <span className="min-w-0 truncate">{children}</span>
      </a>
    );
  }
  return <span className={cn("max-w-full min-w-0 truncate text-foreground", className)}>{children}</span>;
}

/* ------------------------------------------------------------------ */
/* Payer status badge                                                  */
/* ------------------------------------------------------------------ */

/** Where the eligibility check for a payer stands. */
export type PayerEligibilityStatus = "verified" | "failed" | "verifying" | "review" | "none";

export interface PatientPayer {
  /** Payer name shown in the badge: "Aetna PPO". */
  name?: string | null;
  /** Sets the badge's tone and icon. Defaults to `verifying`, as an unchecked payer is still being verified. */
  status?: PayerEligibilityStatus;
}

const payerStatus: Record<PayerEligibilityStatus, { tone: NonNullable<BadgeProps["tone"]>; icon: typeof BadgeCheck; label: string }> = {
  verified: { tone: "success", icon: BadgeCheck, label: "Eligibility verified" },
  failed: { tone: "danger", icon: BadgeAlert, label: "Verification failed" },
  verifying: { tone: "warning", icon: Clock, label: "Verifying" },
  review: { tone: "neutral", icon: BadgeMinus, label: "Manual review" },
  none: { tone: "neutral", icon: BadgeMinus, label: "Not found" },
};

/** The payer's name in a pill whose tone and icon say where the eligibility check stands. Renders nothing without a payer name. */
export function PayerStatusBadge({ payer, className }: { payer?: PatientPayer | null; className?: string }) {
  const name = payer?.name?.trim();
  if (!name) return null;
  const { tone, icon: Icon, label } = payerStatus[payer?.status ?? "verifying"];
  const quiet = tone === "neutral";
  return (
    <Badge tone={tone} className={cn("h-7 gap-2 px-3", className)}>
      <Icon aria-hidden className={cn(quiet && "opacity-40")} />
      <span className="sr-only">{label}: </span>
      {name}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* PatientHeaderCard                                                   */
/* ------------------------------------------------------------------ */

export interface PatientHeaderInfo {
  /** Patient id. Not shown; use it as a key. */
  id?: number | string;
  /** Photo URL. Without it the avatar shows the patient's initials. */
  photoPath?: string;
  fullName: string;
  /** Shown instead of the full name when set and not "-". */
  preferredName?: string;
  age: string | number;
  gender: string;
  pronouns: string;
  /** External EHR chart. The EHR link is hidden without it. */
  ehrLink?: string;
  /** RoVR Work (or Zendesk) link. Hidden when it has no href. */
  rovrWorkLink?: PatientLink;
  /** The patient's chart in AEHR. The AEHR link is hidden without it. */
  aehrLink?: string;
  /** Plan name, shown in brackets on the last row. */
  subscriptionName?: string;
  /** One-line address. Truncates at 200px. */
  address?: string;
  /** Formatted phone number. */
  phone?: string;
}

const statusTones = {
  info: "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  neutral: "bg-subtle-foreground",
} as const;

export interface PatientHeaderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  patient: PatientHeaderInfo;
  /** Shows the EHR, RoVR Work and AEHR links. On by default. */
  showLinks?: boolean;
  /** Shows the payer badge and the plan name. On by default; the row needs `patient.subscriptionName`. */
  showSubscription?: boolean;
  /** Colour of the dot beside the avatar. */
  statusTone?: keyof typeof statusTones;
  /** Hides the payer badge and keeps the plan name. */
  hidePayerStatusBadge?: boolean;
  /** The appointment's payer, for the badge on the last row. */
  payer?: PatientPayer | null;
  /** Tighter avatar and spacing for surfaces where the header is context, not content. */
  compact?: boolean;
  /** Makes the name a link to the patient's chart. */
  nameHref?: string;
  /** Makes the name a button that opens the patient summary. */
  onOpenPatient?: () => void;
}

/** Who the patient is, at the top of a visit, a task or a claim: photo, name and demographics, contact, links to other tools, and the plan. */
export const PatientHeaderCard = React.forwardRef<HTMLDivElement, PatientHeaderCardProps>(function PatientHeaderCard(
  { patient, showLinks = true, showSubscription = true, statusTone = "info", hidePayerStatusBadge = false, payer, compact = false, nameHref, onOpenPatient, className, ...props },
  ref,
) {
  const displayName = patient.preferredName && patient.preferredName !== "-" ? patient.preferredName : patient.fullName;

  const ageGender = [patient.age, patient.gender].map((value) => String(value ?? "").trim()).filter((value) => value && value !== "-");
  const pronouns = String(patient.pronouns ?? "").trim();
  const demographics = [ageGender.length ? ageGender.join(" YO ") : null, pronouns && pronouns !== "-" ? pronouns : null].filter((segment): segment is string => Boolean(segment));

  const address = patient.address?.trim();
  const phone = patient.phone?.trim();
  const rovrWork = patient.rovrWorkLink;
  const toolLink = cn("flex items-center gap-1 text-body-sm hover:text-foreground", linkTone);

  return (
    <div ref={ref} className={cn(compact ? "flex items-center gap-3" : "flex max-w-[500px] items-start gap-4", className)} {...props}>
      <div className="relative flex shrink-0 items-center justify-center">
        <span aria-hidden className={cn("size-3 rounded-full border-2 border-surface", statusTones[statusTone])} />
        <Avatar src={patient.photoPath || undefined} name={displayName} size={compact ? "md" : "lg"} className={cn(!compact && "size-16 text-title-lg")} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <PatientName href={nameHref} onOpen={onOpenPatient} className="text-title-sm text-foreground">
            {displayName}
          </PatientName>
          {demographics.map((segment) => (
            <React.Fragment key={segment}>
              <span aria-hidden className="text-subtle-foreground">
                •
              </span>
              <span className="text-body text-muted-foreground">{segment}</span>
            </React.Fragment>
          ))}
        </div>

        {(address || phone) && (
          <div className="mt-1 flex items-baseline justify-between gap-4">
            {address ? <p className="max-w-[200px] min-w-0 truncate text-body-sm text-muted-foreground">{address}</p> : <span />}
            {phone ? <p className="shrink-0 text-body-sm text-data text-muted-foreground">{phone}</p> : null}
          </div>
        )}

        {showLinks && (
          <div className="mt-1 flex items-center gap-3">
            {patient.ehrLink ? (
              <a href={patient.ehrLink} {...newTab} className={toolLink}>
                EHR <ArrowUpRight aria-hidden className="size-3" />
              </a>
            ) : null}
            {rovrWork?.href ? (
              <a href={rovrWork.href} {...(rovrWork.external ? newTab : {})} className={toolLink}>
                {rovrWork.label} <ArrowUpRight aria-hidden className="size-3" />
              </a>
            ) : null}
            {patient.aehrLink ? (
              <a href={patient.aehrLink} className={toolLink}>
                AEHR <ArrowUpRight aria-hidden className="size-3" />
              </a>
            ) : null}
          </div>
        )}

        {showSubscription && patient.subscriptionName && (
          <div className="flex items-center justify-start gap-2">
            {!hidePayerStatusBadge && <PayerStatusBadge payer={payer} />}
            <p className="mt-1 text-caption text-muted-foreground">({patient.subscriptionName})</p>
          </div>
        )}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* PatientTile                                                         */
/* ------------------------------------------------------------------ */

export interface PatientTileInfo {
  /** Patient id. Not shown; use it as a key. */
  id?: number | string;
  /** Display name. */
  name: string;
  /** Photo URL. Without it the avatar shows the patient's initials. */
  photoPath?: string;
  /** Age in years. Shown only together with `gender`, as "34 YO F". */
  age?: number | null;
  /** Short gender, e.g. "F". */
  gender?: string | null;
  pronouns?: string | null;
  /** External EHR chart. Without it "EHR" is plain muted text. */
  ehrLink?: string | null;
  /** RoVR Work (or Zendesk) link. Without an href its label is plain muted text. */
  rovrWorkLink?: PatientLink;
  /** The patient's chart in AEHR. */
  aehrLink: string;
}

export interface PatientTileProps extends React.HTMLAttributes<HTMLDivElement> {
  patient: PatientTileInfo;
  /** Makes the name a link to the patient's chart. */
  nameHref?: string;
  /** Makes the name a button that opens the patient summary. */
  onOpenPatient?: () => void;
  /** What the AEHR link opens, shown in brackets after the links. */
  meta?: string;
}

const tileSize = "text-[0.6875rem]";

/** Patient identity in a list row or a side panel: avatar, name, demographics, and the EHR, RoVR Work and AEHR links. */
export const PatientTile = React.forwardRef<HTMLDivElement, PatientTileProps>(function PatientTile({ patient, nameHref, onOpenPatient, meta = "Personal Health Agent", className, ...props }, ref) {
  const gender = patient.gender?.trim();
  const pronouns = patient.pronouns?.trim();
  const demographics = [patient.age != null && gender ? `${patient.age} YO ${gender}` : gender || null, pronouns].filter(Boolean).join(" • ");
  const rovrWork = patient.rovrWorkLink ?? { label: "RoVR Work" };
  const miniLink = cn("inline-flex items-center gap-0.5 underline decoration-transparent hover:decoration-current", linkTone);
  const off = "text-subtle-foreground";

  return (
    <div ref={ref} className={cn("flex items-center gap-3", className)} {...props}>
      <Avatar src={patient.photoPath || undefined} name={patient.name} size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
          <PatientName href={nameHref} onOpen={onOpenPatient} className="text-label text-accent-foreground">
            {patient.name}
          </PatientName>
          {demographics ? <span className="truncate text-caption text-muted-foreground">{demographics}</span> : null}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-accent-foreground">
          {patient.ehrLink ? (
            <a href={patient.ehrLink} {...newTab} className={miniLink}>
              EHR
              <ArrowUpRight aria-hidden className="size-2.5" />
            </a>
          ) : (
            <span className={off}>EHR</span>
          )}
          {rovrWork.href ? (
            <a href={rovrWork.href} {...(rovrWork.external ? newTab : {})} className={miniLink}>
              {rovrWork.label}
              <ArrowUpRight aria-hidden className="size-2.5" />
            </a>
          ) : (
            <span className={off}>{rovrWork.label}</span>
          )}
          <a href={patient.aehrLink} className={miniLink}>
            AEHR
            <ArrowUpRight aria-hidden className="size-2.5" />
          </a>
          {meta ? <span className={cn(tileSize, "text-muted-foreground")}>({meta})</span> : null}
        </div>
      </div>
    </div>
  );
});
