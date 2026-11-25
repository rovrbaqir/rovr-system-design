import * as React from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ActivationShell, IntakePage, TenantLogoHeader } from "@/components/patterns/intake-page";
import { Demo } from "../kit";
import type { DocPage } from "../types";

/** A stand-in clinic logo: a simple mark and the clinic's name, drawn inline. */
function ClinicLogo(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 236 48" role="img" aria-label="Northside Family Health" {...props}>
      <rect x="2" y="4" width="40" height="40" rx="12" fill="var(--brand)" />
      <path d="M22 14v20M12 24h20" stroke="var(--on-solid)" strokeWidth="5" strokeLinecap="round" />
      <text x="54" y="22" fontSize="17" fontWeight="600" fill="currentColor" fontFamily="inherit">
        Northside
      </text>
      <text x="54" y="40" fontSize="13" fill="currentColor" fontFamily="inherit" opacity="0.7">
        Family Health
      </text>
    </svg>
  );
}

function ActivationDemo() {
  const [dob, setDob] = React.useState("");
  return (
    <div className="h-[560px] w-full overflow-hidden rounded-xl border border-border">
      <ActivationShell
        logo={<ClinicLogo />}
        title="Activate your account"
        subtitle="Northside Family Health invited you to their patient app. Confirm your date of birth so we can match you to your chart."
      >
        <form className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
          <Field>
            <FieldLabel>Date of birth</FieldLabel>
            <Input value={dob} onChange={(event) => setDob(event.target.value)} placeholder="MM/DD/YYYY" inputMode="numeric" autoComplete="bday" className="text-data" />
            <FieldDescription>Use the date on file with the clinic.</FieldDescription>
          </Field>
          <Button type="submit" size="lg" disabled={dob.trim().length === 0}>
            Continue
          </Button>
        </form>
      </ActivationShell>
    </div>
  );
}

function LoadingDemo() {
  const [loading, setLoading] = React.useState(true);
  return (
    <>
      <TenantLogoHeader logo={<ClinicLogo />} loading={loading} />
      <div className="flex w-full items-center justify-between gap-4 rounded-lg bg-surface-sunken px-4 py-3">
        <TenantLogoHeader variant="inline" logo={<ClinicLogo />} loading={loading} />
        <Button variant="secondary" size="sm" onClick={() => setLoading((value) => !value)}>
          {loading ? "Finish loading" : "Load again"}
        </Button>
      </div>
    </>
  );
}

function Body() {
  return (
    <>
      <Demo
        id="intake-page-activation"
        files={["patterns/intake-page", "ui/gradient-text", "ui/field", "ui/input", "ui/button"]}
        title="Activation shell"
        note="A centred column: the clinic logo, a gradient headline, a subtitle, then the step. It fills its parent and scrolls inside it, so the page behind never scrolls."
        bare
        className="flex-col items-stretch"
      >
        <ActivationDemo />
      </Demo>
      <Demo
        id="intake-page-logo"
        files={["patterns/intake-page"]}
        title="Tenant logo header"
        note="Full is the centred block with the powered by RoVR line. Without a clinic logo it shows the RoVR wordmark and the clinic's name. Inline is the logo alone, for a toolbar."
        className="flex-col items-stretch gap-6"
      >
        <TenantLogoHeader logo={<ClinicLogo />} />
        <TenantLogoHeader tenantName="Harbor Street Clinic" />
        <div className="flex w-full items-center justify-between gap-4 rounded-lg bg-surface-sunken px-4 py-3">
          <TenantLogoHeader variant="inline" logo={<ClinicLogo />} />
          <span className="text-body-sm text-muted-foreground">Step 2 of 5</span>
        </div>
      </Demo>
      <Demo
        id="intake-page-loading"
        files={["patterns/intake-page", "ui/loading-overlay", "ui/spinner", "ui/button"]}
        title="Loading"
        note="Set loading while the logo is fetched. The full header is covered by a spinner; the inline one swaps the logo for a spinner and keeps its height."
        className="flex-col items-stretch gap-6"
      >
        <LoadingDemo />
      </Demo>
      <Demo
        id="intake-page-wrapper"
        files={["patterns/intake-page", "ui/field", "ui/input", "ui/button"]}
        title="Page width wrapper"
        note="IntakePage keeps intake questions in one readable column: full width on small screens, 40rem with side padding on desktop."
        className="flex-col items-stretch"
      >
        <IntakePage className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-title-lg">Your current medications</h2>
            <p className="text-body text-muted-foreground">List what you take regularly, including vitamins. Your clinician reviews this before the visit.</p>
          </div>
          <Field>
            <FieldLabel>Medication and dose</FieldLabel>
            <Input defaultValue="Atorvastatin 20 mg, once a day" />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="secondary">Back</Button>
            <Button>Save and continue</Button>
          </div>
        </IntakePage>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "intake-page",
  title: "Intake page",
  group: "Examples",
  summary:
    "Patient app. The frame of onboarding, activation and intake pages. Replaces IntakePageWidthWrapper, TenantLogoHeader and ActivationShell.",
  keywords: "onboarding activation tenant logo clinic powered by rovr wrapper shell signup",
  Body,
};
