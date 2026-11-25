import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { AppModal, FormModal, SideDrawer } from "@/components/patterns/modal-layouts";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function BasicModal() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Visit summary
      </Button>
      <AppModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Visit summary"
        footer={
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="outline">Download PDF</Button>
          </div>
        }
      >
        <div className="mt-4 flex flex-col gap-3 text-body">
          <p>Follow-up with Dr. Ngozi Okafor on 12 November 2026.</p>
          <p>
            We reviewed your lipid panel. LDL cholesterol has come down from 162 to 128 mg/dL since August. HDL and triglycerides are within range.
          </p>
          <p>Continue atorvastatin 20 mg every morning. We will repeat the panel in three months and talk about the dose then.</p>
        </div>
      </AppModal>
    </>
  );
}

function HeaderVariants() {
  const [open, setOpen] = React.useState<"corner" | "none" | "locked" | null>(null);
  const close = () => setOpen(null);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen("corner")}>
        Close in the corner
      </Button>
      <Button variant="secondary" onClick={() => setOpen("none")}>
        No header
      </Button>
      <Button variant="secondary" onClick={() => setOpen("locked")}>
        No close button
      </Button>

      <AppModal
        isOpen={open === "corner"}
        onClose={close}
        width="sm"
        closeButtonCorner
        header={
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-title-md">Lipid panel, 12 November</DialogTitle>
            <p className="text-body-sm text-muted-foreground">Ordered by Dr. Okafor. Collected at Northside Family Health, fasting.</p>
          </div>
        }
      >
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-body">
          <dt className="text-muted-foreground">LDL cholesterol</dt>
          <dd className="text-right text-data">128 mg/dL</dd>
          <dt className="text-muted-foreground">HDL cholesterol</dt>
          <dd className="text-right text-data">54 mg/dL</dd>
          <dt className="text-muted-foreground">Triglycerides</dt>
          <dd className="text-right text-data">141 mg/dL</dd>
        </dl>
      </AppModal>

      <AppModal isOpen={open === "none"} onClose={close} width="sm" showHeader={false}>
        <div className="flex flex-col gap-2">
          <DialogTitle className="text-title-lg">You are checked in</DialogTitle>
          <p className="text-body text-muted-foreground">Dr. Okafor will join the video visit at 10:30. Keep this page open.</p>
          <Button className="mt-4 self-end" onClick={close}>
            Got it
          </Button>
        </div>
      </AppModal>

      <AppModal isOpen={open === "locked"} onClose={close} width="sm" title="Share results with your care team?" noCloseButton>
        <p className="mt-2 text-body text-muted-foreground">Dr. Okafor, Sam Whitfield and Leila Haddad will see new lab results as they are released.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>
            Do not share
          </Button>
          <Button onClick={close}>Share results</Button>
        </div>
      </AppModal>
    </>
  );
}

function LoadingAndPlacement() {
  const [open, setOpen] = React.useState<"loading" | "right" | null>(null);
  const [saving, setSaving] = React.useState(false);
  const close = () => setOpen(null);
  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(null);
      toast.success("Appointment moved", { description: "Thursday 3 December at 14:00 with Dr. Okafor." });
    }, 1600);
  };
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen("loading")}>
        Loading cover
      </Button>
      <Button variant="secondary" onClick={() => setOpen("right")}>
        Right placement
      </Button>

      <AppModal isOpen={open === "loading"} onClose={close} width="sm" title="Move this appointment?" isLoading={saving}>
        <p className="mt-2 text-body text-muted-foreground">Your follow-up moves from Thursday 3 December at 10:30 to the same day at 14:00.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>
            Keep 10:30
          </Button>
          <Button onClick={save}>Move to 14:00</Button>
        </div>
      </AppModal>

      <AppModal isOpen={open === "right"} onClose={close} placement="right" title="Eligibility check">
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 text-body">
          <p>Amara Osei, member ID RVR-2041-88317. Blue Shield PPO, active since 1 January 2026.</p>
          <p className="text-muted-foreground">Office visits are covered at 80 percent after a $40 copay. The deductible of $1,500 has $320 remaining this year.</p>
        </div>
      </AppModal>
    </>
  );
}

function ReferralForm() {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const submit = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      setReason("");
      toast.success("Referral sent", { description: "Bay Cardiology will contact Amara Osei to book." });
    }, 1400);
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>New referral</Button>
      <FormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="New referral"
        description="Amara Osei, MRN 204188. The receiving clinic gets her demographics and insurance with this request."
        closeDisabled={saving}
        footer={
          <>
            <Button variant="secondary" disabled={saving} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} disabled={reason.trim().length === 0} onClick={submit}>
              Send referral
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <Field>
            <FieldLabel>Refer to</FieldLabel>
            <Input defaultValue="Bay Cardiology, Dr. Hyun-woo Park" autoComplete="off" />
          </Field>
          <Field>
            <FieldLabel>Diagnosis code</FieldLabel>
            <Input defaultValue="E78.5" autoComplete="off" className="font-mono" />
            <FieldDescription>Hyperlipidaemia, unspecified.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Reason for referral</FieldLabel>
            <Textarea rows={4} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="What you want the specialist to assess" />
          </Field>
        </div>
      </FormModal>
    </>
  );
}

function ClaimDrawer() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open claim
      </Button>
      <SideDrawer
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Claim CLM-2026-004871"
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            <Badge tone="warning">Denied</Badge>
            <span>Amara Osei, visit on 12 November 2026</span>
          </span>
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.success("Appeal started", { description: "The claim moved to your appeals queue." });
              }}
            >
              Start appeal
            </Button>
          </>
        }
      >
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-body">
          <dt className="text-muted-foreground">Payer</dt>
          <dd>Blue Shield PPO</dd>
          <dt className="text-muted-foreground">Billed</dt>
          <dd className="text-data">$248.00</dd>
          <dt className="text-muted-foreground">Procedure</dt>
          <dd>
            <span className="font-mono">99214</span>, office visit, established patient
          </dd>
          <dt className="text-muted-foreground">Denial reason</dt>
          <dd>
            <span className="font-mono">CO-197</span>, precertification or authorisation absent
          </dd>
          <dt className="text-muted-foreground">Appeal by</dt>
          <dd className="text-data">11 January 2027</dd>
        </dl>
        <p className="mt-5 text-body text-muted-foreground">
          The payer has no prior authorisation on file for this visit. An authorisation was approved on 4 November under reference PA-77120; attach it to the appeal.
        </p>
      </SideDrawer>
    </>
  );
}

function Body() {
  return (
    <>
      <Demo
        id="modal-layouts-app-modal"
        files={["patterns/modal-layouts", "ui/dialog", "ui/button"]}
        title="App modal"
        note="The modal most screens use: the title on the left and close on the right in one row, then the body, then an optional footer. The body scrolls when it is taller than the screen."
      >
        <BasicModal />
      </Demo>
      <Demo
        id="modal-layouts-header"
        files={["patterns/modal-layouts", "ui/dialog", "ui/button"]}
        title="Header options"
        note="closeButtonCorner moves close to the corner so a custom header can use the full width. showHeader false leaves the title to the body. noCloseButton removes close and stops a press outside from closing it."
      >
        <HeaderVariants />
      </Demo>
      <Demo
        id="modal-layouts-loading-placement"
        files={["patterns/modal-layouts", "ui/loading-overlay", "ui/sheet", "ui/button", "ui/toast"]}
        title="Loading and placement"
        note="isLoading covers the modal with a spinner and blocks closing until the work is done. placement right docks a full-height panel to the right edge."
      >
        <LoadingAndPlacement />
      </Demo>
      <Demo
        id="modal-layouts-form-modal"
        files={["patterns/modal-layouts", "ui/field", "ui/input", "ui/button", "ui/toast"]}
        title="Form modal"
        note="A dialog for forms: title and description with a round close, a scrolling body, and the actions on a tinted bar. closeDisabled blocks Escape and close while the form is being sent."
      >
        <ReferralForm />
      </Demo>
      <Demo
        id="modal-layouts-side-drawer"
        files={["patterns/modal-layouts", "ui/sheet", "ui/badge", "ui/button", "ui/toast"]}
        title="Side drawer"
        note="A detail panel docked to the right: title and subtitle over a rule, a scrolling body, and actions pinned to the bottom. Use it when the list behind should stay in view."
      >
        <ClaimDrawer />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "modal-layouts",
  title: "Modal layouts",
  group: "Examples",
  summary:
    "Both apps. The modal shells every feature builds on. AppModal replaces CustomModal in the patient and provider apps; FormModal and SideDrawer replace the provider app's FormModal and SideDrawer.",
  keywords: "custom modal dialog drawer sheet form popup overlay side panel footer",
  Body,
};
