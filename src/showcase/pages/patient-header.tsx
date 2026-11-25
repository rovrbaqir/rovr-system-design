import { PatientHeaderCard, type PatientHeaderInfo, PatientTile } from "@/components/patterns/patient-header";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const amara: PatientHeaderInfo = {
  id: 20418,
  fullName: "Amara Osei",
  age: 38,
  gender: "Female",
  pronouns: "she/her",
  address: "2140 Fulton Street Apt 6, San Francisco, CA, 94117",
  phone: "(415) 555-0142",
  ehrLink: "https://ehr.example.com/patients/20418",
  rovrWorkLink: { label: "RoVR Work", href: "#/patient-header" },
  aehrLink: "#/patient-header",
  subscriptionName: "RoVR Complete",
};

const daniel: PatientHeaderInfo = {
  id: 20733,
  fullName: "Daniel Reyes-Whitfield",
  preferredName: "Danny Reyes-Whitfield",
  age: 61,
  gender: "Male",
  pronouns: "he/him",
  address: "88 Alder Court, Oakland, CA, 94611",
  phone: "(510) 555-0187",
  rovrWorkLink: { label: "Zendesk", href: "https://support.example.com/users/20733", external: true },
  aehrLink: "#/patient-header",
  subscriptionName: "RoVR Essentials",
};

function Body() {
  return (
    <>
      <Demo
        id="patient-header-card"
        files={["patterns/patient-header", "ui/avatar", "ui/badge", "ui/toast"]}
        title="Patient header"
        note="Four rows beside a 64px avatar: name and demographics, address and phone, links to the other tools, then the payer and the plan. The address truncates; the phone never does."
        className="items-start gap-10"
      >
        <PatientHeaderCard className="w-full" patient={amara} payer={{ name: "Aetna PPO", status: "verified" }} nameHref="#/patient-header" />
        <PatientHeaderCard className="w-full" patient={daniel} payer={{ name: "Blue Shield of California", status: "verifying" }} statusTone="warning" onOpenPatient={() => toast.message("Patient summary opened")} />
      </Demo>
      <Demo
        id="patient-header-options"
        files={["patterns/patient-header", "ui/avatar", "ui/badge"]}
        title="Optional rows"
        note="showLinks and showSubscription drop a row each. hidePayerStatusBadge keeps the plan name without the payer. statusTone colours the dot beside the avatar. The payer badge takes its tone and icon from the eligibility check."
        className="items-start gap-10"
      >
        <PatientHeaderCard className="w-full" patient={amara} showLinks={false} payer={{ name: "Aetna PPO", status: "failed" }} statusTone="danger" />
        <PatientHeaderCard className="w-full" patient={amara} hidePayerStatusBadge statusTone="success" />
        <PatientHeaderCard className="w-full" patient={{ ...amara, address: undefined }} showSubscription={false} statusTone="neutral" />
      </Demo>
      <Demo
        id="patient-header-compact"
        files={["patterns/patient-header", "ui/avatar", "ui/badge"]}
        title="Compact"
        note="A 40px avatar, centred on the rows, with tighter spacing and no width limit. Use it where the patient is context for the page, such as above a claim or a task."
        className="items-start gap-8"
      >
        <PatientHeaderCard className="w-full" compact patient={amara} payer={{ name: "Aetna PPO", status: "verified" }} nameHref="#/patient-header" />
        <PatientHeaderCard className="w-full" compact showSubscription={false} patient={daniel} />
      </Demo>
      <Demo
        id="patient-header-tile"
        files={["patterns/patient-header", "ui/avatar", "ui/toast"]}
        title="Patient tile"
        note="The small form for list rows and side panels: a 40px avatar, the name with muted demographics, and a row of small links. A link the patient does not have stays in place as muted text."
        className="flex-col items-stretch gap-5"
      >
        <PatientTile
          nameHref="#/patient-header"
          patient={{ id: 20418, name: "Amara Osei", age: 38, gender: "F", pronouns: "she/her", ehrLink: "https://ehr.example.com/patients/20418", rovrWorkLink: { label: "RoVR Work", href: "#/patient-header" }, aehrLink: "#/patient-header" }}
        />
        <PatientTile onOpenPatient={() => toast.message("Patient summary opened")} patient={{ id: 20733, name: "Danny Reyes-Whitfield", age: 61, gender: "M", pronouns: "he/him", rovrWorkLink: { label: "Zendesk" }, aehrLink: "#/patient-header" }} />
        <PatientTile className="max-w-64" nameHref="#/patient-header" patient={{ id: 21190, name: "Priya Raghunathan", age: 29, gender: "F", ehrLink: "https://ehr.example.com/patients/21190", rovrWorkLink: { label: "RoVR Work", href: "#/patient-header" }, aehrLink: "#/patient-header" }} />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "patient-header",
  title: "Patient header",
  group: "Examples",
  summary: "Provider app. Replaces PatientHeaderCard and PatientTile. Says who the patient is at the top of a visit, a task or a claim, with links to the EHR, RoVR Work and AEHR.",
  keywords: "patient identity demographics avatar payer eligibility subscription tile ehr aehr rovr work zendesk",
  Body,
};
