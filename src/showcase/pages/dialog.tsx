import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function AddNoteDialog() {
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Add a note</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a note to this result</DialogTitle>
          <DialogDescription>Amara Osei will see the note next to her lipid panel from 12 November.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(false);
            setNote("");
            toast.success("Note added", { description: "Shared with Amara Osei and her care team." });
          }}
        >
          <Field>
            <FieldLabel>Subject</FieldLabel>
            <Input defaultValue="Lipid panel, 12 November" autoComplete="off" />
          </Field>
          <Field>
            <FieldLabel>Note</FieldLabel>
            <Textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} placeholder="What the result means and what happens next" />
            <FieldDescription>Write it for the patient. Avoid abbreviations.</FieldDescription>
          </Field>
          <DialogFooter>
            <DialogClose render={<Button variant="secondary">Discard</Button>} />
            <Button type="submit" disabled={note.trim().length === 0}>
              Save note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Body() {
  return (
    <>
      <Demo id="dialog-basic" files={["ui/dialog", "ui/button", "ui/toast"]} title="Footer actions" note="The title asks the question and the buttons answer it with the same verb. The safe choice sits first; on a phone the buttons stack with the main action on top.">
        <Dialog>
          <DialogTrigger render={<Button variant="outline">Cancel appointment</Button>} />
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Cancel this appointment?</DialogTitle>
              <DialogDescription>
                Your follow-up with Dr. Okafor on Thursday 3 December at 10:30 will be released. You can book a new time whenever you like.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="secondary">Keep appointment</Button>} />
              <DialogClose
                render={
                  <Button variant="destructive-solid" onClick={() => toast.message("Appointment cancelled", { action: { label: "Undo", onClick: () => toast.success("Appointment restored") } })}>
                    Cancel appointment
                  </Button>
                }
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Demo>
      <Demo id="dialog-sizes" files={["ui/dialog", "ui/button"]} title="Sizes" note="Small for a question, medium for a short form, large for content that needs room to read. Medium is the default.">
        <Dialog>
          <DialogTrigger render={<Button variant="secondary">Small</Button>} />
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Send a reminder?</DialogTitle>
              <DialogDescription>Amara Osei will get a text message about her fasting lipid panel on Thursday.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="secondary">Not now</Button>} />
              <DialogClose render={<Button>Send reminder</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger render={<Button variant="secondary">Medium</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Before your video visit</DialogTitle>
              <DialogDescription>
                Find a quiet, well-lit place and open the visit page five minutes early. Have your medication list and any home readings to hand.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button>Got it</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger render={<Button variant="secondary">Large</Button>} />
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Visit summary</DialogTitle>
              <DialogDescription>Follow-up with Dr. Ngozi Okafor, 12 November 2026</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 text-body">
              <p>
                We reviewed your lipid panel. LDL cholesterol has come down from 162 to 128 mg/dL since August, which is the direction we want. HDL and triglycerides are
                within range.
              </p>
              <p>Continue atorvastatin 20 mg every morning. We will repeat the panel in three months and talk about the dose then.</p>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="secondary">Close</Button>} />
              <Button variant="outline">Download PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Demo>
      <Demo id="dialog-with-form" files={["ui/dialog", "ui/field", "ui/input", "ui/button", "ui/toast"]} title="With a form" note="Controlled with open and onOpenChange, so the dialog closes only once the form has been submitted. Save stays disabled until there is something to save.">
        <AddNoteDialog />
      </Demo>
      <Demo id="dialog-hide-close" files={["ui/dialog", "ui/button"]} title="Without the close button" note="hideClose removes the corner button for a step the person must answer. Escape and the footer still close it.">
        <Dialog>
          <DialogTrigger render={<Button variant="outline">Review consent</Button>} />
          <DialogContent size="sm" hideClose>
            <DialogHeader className="pr-0">
              <DialogTitle>Share results with your care team?</DialogTitle>
              <DialogDescription>Dr. Okafor, Sam Whitfield and Leila Haddad will be able to see new lab results as they are released.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="secondary">Do not share</Button>} />
              <DialogClose render={<Button>Share results</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "dialog",
  title: "Dialog",
  group: "Components",
  summary: "A window over the page for a task that needs the person's full attention: a question, a short form, a summary. Use a sheet when the page should stay in view.",
  keywords: "modal popup window overlay form",
  Body,
};
