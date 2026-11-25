import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ClampText } from "@/components/ui/clamp-text";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const note =
  "Follow-up for hyperlipidaemia. LDL 131 mg/dL on 12 November, down from 148 in August. Tolerating atorvastatin 20 mg with no muscle pain or weakness. Blood pressure 124/78 at home over the last two weeks. Walking 30 minutes on most days. Advised to continue the current dose, keep the food diary and recheck the lipid panel in 12 weeks. Patient asked about stopping the statin if the next result is under 100; explained that the result reflects the medication and that stopping would be reviewed at the next visit.";

function Body() {
  return (
    <>
      <Demo id="clamp-text-lines" files={["ui/clamp-text", "ui/button"]} title="Lines" note="Three lines is the default. The button says whether the rest is shown, with aria-expanded." className="flex-col items-stretch gap-6">
        <ClampText className="max-w-prose text-body">{note}</ClampText>
        <ClampText lines={1} className="max-w-prose text-body">
          {note}
        </ClampText>
      </Demo>
      <Demo id="clamp-text-fits" files={["ui/clamp-text", "ui/button"]} title="Only when it is cut off" note="Text that fits gets no button. It is checked again when the width changes, so narrow the window to see the button appear." className="flex-col items-stretch">
        <ClampText lines={2} className="text-body">
          Reason for visit: headache for three days, worse in the morning. No fever. Took ibuprofen 400 mg twice with some relief.
        </ClampText>
      </Demo>
      <Demo id="clamp-text-in-a-card" files={["ui/clamp-text", "ui/card", "ui/avatar", "ui/button"]} title="In a card" note="Set the type on the component or on its parent. Pass moreLabel and lessLabel to say what is hidden." bare className="items-start">
        <Card className="max-w-md">
          <div className="flex items-center gap-3">
            <Avatar name="Dr. Ngozi Okafor, MD" />
            <div className="min-w-0">
              <p className="text-title-sm">Dr. Ngozi Okafor, MD</p>
              <p className="text-caption text-muted-foreground">Visit note, 14 November</p>
            </div>
          </div>
          <ClampText lines={4} moreLabel="Read the full note" lessLabel="Show less of the note" className="text-body text-muted-foreground">
            {note}
          </ClampText>
        </Card>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "clamp-text",
  title: "Clamp text",
  group: "Components",
  summary: "Cuts long text to a set number of lines and adds a Show more button, only when the text is really cut off. For notes, messages and descriptions in cards and rows.",
  keywords: "truncate line clamp show more read more expand ellipsis clamped text",
  Body,
};
