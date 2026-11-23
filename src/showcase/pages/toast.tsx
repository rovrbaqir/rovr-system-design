import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="toast-types" files={["ui/toast", "ui/button"]} title="Types" note="Each type has its own icon; message has none. They stack upward, four at most, and can be swiped away to the right or down.">
        <Button variant="secondary" onClick={() => toast.success("Refill requested", { description: "Atorvastatin 20 mg. Ready for pickup tomorrow." })}>
          Success
        </Button>
        <Button variant="secondary" onClick={() => toast.warning("Insurance card expires soon", { description: "Upload the new card before 31 December." })}>
          Warning
        </Button>
        <Button variant="secondary" onClick={() => toast.error("Could not send message", { description: "Check your connection and try again." })}>
          Error
        </Button>
        <Button variant="secondary" onClick={() => toast.info("New lab result", { description: "Lipid panel from 12 November has been released." })}>
          Info
        </Button>
        <Button variant="secondary" onClick={() => toast.message("Note saved to chart")}>
          Message
        </Button>
      </Demo>
      <Demo id="toast-with-action" files={["ui/toast", "ui/button"]} title="With an action" note="One action, in words: Undo for something reversible, Retry for something that failed. An undo toast often replaces a confirmation dialog.">
        <Button variant="secondary" onClick={() => toast.message("Appointment cancelled", { description: "Thursday 3 December, 10:30 with Dr. Okafor", action: { label: "Undo", onClick: () => toast.success("Appointment restored") } })}>
          Cancel with undo
        </Button>
        <Button variant="secondary" onClick={() => toast.error("Could not send message", { description: "Check your connection and try again.", action: { label: "Retry", onClick: () => toast.success("Message sent") } })}>
          Error with retry
        </Button>
      </Demo>
      <Demo id="toast-timeout" files={["ui/toast", "ui/button"]} title="Timeout and dismiss" note="Toasts leave by themselves. Pass timeout in milliseconds to change how long one stays, or 0 to keep it until it is dismissed. toast.dismiss() clears every toast.">
        <Button variant="secondary" onClick={() => toast.success("Copied member ID", { timeout: 2000 })}>
          Two seconds
        </Button>
        <Button variant="secondary" onClick={() => toast.warning("You are offline", { description: "Changes will be sent when the connection returns.", timeout: 0 })}>
          Stays until dismissed
        </Button>
        <Button variant="outline" onClick={() => toast.dismiss()}>
          Dismiss all
        </Button>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "toast",
  title: "Toast",
  group: "Components",
  summary: "A brief message that confirms what just happened, called with toast.success() and friends from anywhere. Errors the person must fix belong inline, next to their cause.",
  keywords: "notification snackbar alert message undo toaster",
  Body,
};
