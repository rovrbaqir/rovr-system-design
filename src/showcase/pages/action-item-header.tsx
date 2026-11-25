import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ActionItemDetails, ActionItemHeader } from "@/components/patterns/action-item-header";
import { Demo } from "../kit";
import type { DocPage } from "../types";

/** Stands in for the action item modal, which gives the step a fixed height. */
function ModalFrame({ children }: { children: React.ReactNode }) {
  return <Card className="h-[30rem] w-full max-w-2xl gap-0 overflow-hidden p-4">{children}</Card>;
}

function ConfirmAppointment() {
  const [confirmed, setConfirmed] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    if (!saving) return;
    const t = setTimeout(() => {
      setSaving(false);
      setConfirmed(true);
    }, 900);
    return () => clearTimeout(t);
  }, [saving]);

  return (
    <ModalFrame>
      {/* A new key remounts the wrapper, as the app does when it moves to another step. */}
      <ActionItemDetails key={step} className="justify-start overflow-y-auto py-6 max-2xl:py-3">
        <div className="w-full">
          {!confirmed && (
            <div className="flex w-full items-center justify-start">
              <Button variant="ghost" size="sm" className="-ml-2" onClick={() => setStep((n) => n + 1)}>
                <ArrowLeft />
                Back
              </Button>
            </div>
          )}
          <ActionItemHeader title={confirmed ? "Appointment confirmed" : "Confirm appointment"} displayName="Dr. Amara Okafor" appDate="2026-12-03T10:30:00" />
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-start">
          <section className="flex w-full flex-1 items-center justify-center gap-4 overflow-hidden py-10">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-start pr-4 text-body-sm text-data">
                <p className="text-accent-foreground">December 3</p>
                <p>Thursday</p>
                <p>10:30AM</p>
              </div>
              <Separator orientation="vertical" className="h-16" />
              <div className="flex items-center gap-4 pl-5">
                <Avatar size="lg" name="Dr. Amara Okafor" />
                <div>
                  <p className="text-body-sm">Dr. Amara Okafor</p>
                  <p className="text-body-sm text-muted-foreground">Cardiology</p>
                </div>
                <p className="text-caption font-medium">Virtual</p>
              </div>
            </div>
          </section>
          {confirmed && <p className="w-[78%] pb-6 text-center text-body font-semibold">Your appointment has been scheduled.</p>}
        </div>

        <section className="mb-4 flex w-full flex-none flex-col items-center justify-start gap-3">
          <Button
            size="lg"
            loading={saving}
            onClick={() => {
              if (confirmed) {
                setConfirmed(false);
                setStep((n) => n + 1);
              } else setSaving(true);
            }}
          >
            {confirmed ? "Continue" : "Confirm"}
          </Button>
        </section>
      </ActionItemDetails>
    </ModalFrame>
  );
}

function GeneralActionItem() {
  return (
    <ModalFrame>
      <ActionItemDetails className="justify-start py-6 max-2xl:py-3">
        <ActionItemHeader title="General action item" displayName="Dr. Samuel Reyes" appDate="2026-11-18" />
        <div className="mx-auto flex w-full max-w-[34rem] flex-1 flex-col items-center justify-center overflow-y-auto px-10 max-[1099px]:px-0">
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="text-title-md">Check your blood pressure each morning for two weeks and bring the readings to your next visit.</p>
          </div>
          <div className="pb-7">
            <Button size="lg">Mark as done</Button>
          </div>
        </div>
      </ActionItemDetails>
    </ModalFrame>
  );
}

function Body() {
  return (
    <>
      <Demo
        id="action-item-header-step"
        files={["patterns/action-item-header", "ui/button", "ui/avatar", "ui/separator", "ui/card"]}
        title="In a step"
        note="ActionItemDetails frames one step of an action item. It fades in and shows a loader for half a second, then the header, the content and the button. Back and Continue remount it, as moving between steps does in the app."
        bare
      >
        <ConfirmAppointment />
      </Demo>
      <Demo
        id="action-item-header-general"
        files={["patterns/action-item-header", "ui/button", "ui/card"]}
        title="Title only"
        note="A general action item has no description. The clinician and the visit date stay at the top right."
        bare
      >
        <GeneralActionItem />
      </Demo>
      <Demo
        id="action-item-header-description"
        files={["patterns/action-item-header"]}
        title="With a description"
        note="The description sits under the title at 95% of the width and keeps the line breaks in the text. The date is left out when there is none."
        className="flex-col items-stretch gap-8"
      >
        <ActionItemHeader
          title="Lab order"
          displayName="Dr. Amara Okafor"
          appDate="2026-11-12T09:00:00"
          description={"A lipid panel and HbA1c have been ordered for you.\nChoose a lab near you or book a home visit. Fast for 10 hours before the draw."}
        />
        <ActionItemHeader title="Prescription" displayName="Dr. Samuel Reyes" description="Atorvastatin 20 mg, one tablet each evening. Pick it up at your pharmacy or send it to a different one." />
      </Demo>
      <Demo
        id="action-item-header-doctor-name"
        files={["patterns/action-item-header"]}
        title="Clinician name in the text"
        note="addDoctorNameToTheEndOfTitle adds the name to the title. needDoctorNameFirstOfDescription starts the description with it."
        className="flex-col items-stretch gap-8"
      >
        <ActionItemHeader title="Follow-up with" addDoctorNameToTheEndOfTitle displayName="Dr. Amara Okafor" appDate="2026-11-12T09:00:00" description="Choose a time in the next four weeks." />
        <ActionItemHeader
          title="Imaging order"
          needDoctorNameFirstOfDescription
          displayName="Dr. Samuel Reyes"
          appDate="2026-11-18T14:00:00"
          description="has ordered a chest X-ray. Confirm the imaging center or ask for a different one."
        />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "action-item-header",
  title: "Action item header",
  group: "Examples",
  summary:
    "Patient app. The header of every action item step (labs, pharmacy, follow-up, referrals, imaging, records) and the frame the step sits in. Replaces SelectedActionItemHeader and ActionItemDetailsSmoothWrapper.",
  keywords: "action item step header modal post visit follow-up lab pharmacy referral imaging doctor date wrapper",
  Body,
};
