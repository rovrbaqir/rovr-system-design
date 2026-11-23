import * as React from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function DeleteNote() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Delete note
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this note?"
        description="The note from 12 November will be removed from the chart. This cannot be undone."
        confirmLabel="Delete note"
        cancelLabel="Keep note"
        onConfirm={() => {
          toast.message("Note deleted");
        }}
      />
    </>
  );
}

function SignOrder() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Sign order</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        variant="primary"
        title="Sign this lab order?"
        description="A fasting lipid panel for Amara Osei will be sent to Quest Diagnostics. Signed orders cannot be edited."
        confirmLabel="Sign order"
        onConfirm={() => {
          toast.success("Order signed", { description: "Sent to Quest Diagnostics." });
        }}
      />
    </>
  );
}

function RemoveMember() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Remove from care team
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Remove Sam Whitfield?"
        description="Sam will lose access to Amara Osei's chart straight away. You can add him again later."
        confirmLabel="Remove Sam"
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1400));
          toast.message("Sam Whitfield removed from the care team");
        }}
      />
    </>
  );
}

function Body() {
  return (
    <>
      <Demo id="alert-dialog-destructive" files={["ui/alert-dialog", "ui/button", "ui/toast"]} title="Destructive" note="The title names the action as a question and the confirm button repeats its verb. It does not close on an outside click: the person has to choose.">
        <DeleteNote />
      </Demo>
      <Demo id="alert-dialog-variant" files={["ui/alert-dialog", "ui/button", "ui/toast"]} title="Confirm variant" note="The confirm button is solid red by default. Pass any Button variant when the action is final but not destructive.">
        <SignOrder />
      </Demo>
      <Demo id="alert-dialog-async" files={["ui/alert-dialog", "ui/button", "ui/toast"]} title="Waiting for the server" note="Return a promise from onConfirm. The button shows its spinner and the dialog stays open until the promise settles.">
        <RemoveMember />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "alert-dialog",
  title: "Alert dialog",
  group: "Components",
  summary: "ConfirmDialog is a blocking question before an action that cannot be undone. Use it for deleting, signing and removing; use a toast with Undo when the action can be reversed.",
  keywords: "confirm confirmation delete destructive modal are you sure",
  Body,
};
