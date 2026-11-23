import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { MedicationCard } from "@/components/patterns/medication-card";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="medication-card-statuses" files={["patterns/medication-card", "ui/button"]} title="Statuses" note="Active is the default. Refill due and expired change the badge, and usually the action that goes with it." bare className="flex-col items-stretch">
        <MedicationCard name="Atorvastatin" strength="20 mg tablet" directions="Take one tablet by mouth every morning with food." refillsLeft={2} nextRefill="14 Dec" actions={<Button variant="outline" size="sm">Request refill</Button>} />
        <MedicationCard name="Metformin" strength="500 mg tablet" directions="Take one tablet twice a day with meals." refillsLeft={0} status="refill-due" actions={<Button size="sm">Renew</Button>} />
        <MedicationCard name="Amoxicillin" strength="500 mg capsule" directions="Take one capsule three times a day for 7 days." status="expired" />
      </Demo>
      <Demo id="medication-card-details" files={["patterns/medication-card"]} title="Refill details" note="refillsLeft and nextRefill are each optional. The line shows whichever is given and is left out when neither is." bare className="flex-col items-stretch">
        <MedicationCard name="Lisinopril" strength="10 mg tablet" directions="Take one tablet by mouth every evening." refillsLeft={1} />
        <MedicationCard name="Levothyroxine" strength="50 mcg tablet" directions="Take one tablet on an empty stomach, 30 minutes before breakfast." nextRefill="6 Jan" />
        <MedicationCard name="Salbutamol inhaler" strength="100 mcg per puff" directions="Two puffs when needed for wheezing, up to four times a day." />
      </Demo>
      <Demo id="medication-card-actions" files={["patterns/medication-card", "ui/button", "ui/toast"]} title="With actions" note="Actions sit at the end of the card and wrap under the text on a narrow screen. Press Request refill." bare className="flex-col items-stretch">
        <MedicationCard
          name="Atorvastatin"
          strength="20 mg tablet"
          directions="Take one tablet by mouth every morning with food."
          refillsLeft={2}
          nextRefill="14 Dec"
          actions={
            <>
              <Button variant="ghost" size="sm">
                Details
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.success("Refill requested", { description: "Walgreens, 825 Market St. Ready in about 2 hours." })}>
                Request refill
              </Button>
            </>
          }
        />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "medication-card",
  title: "Medication card",
  group: "Patterns",
  summary: "One medication: name, strength, directions in plain words, refills and status. Use it in medication lists in both apps.",
  keywords: "prescription drug medicine rx refill pharmacy dose",
  Body,
};
