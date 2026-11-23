import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

const manager = BaseToast.createToastManager();

type ToastOptions = { description?: string; timeout?: number; action?: { label: string; onClick: () => void } };

const add = (type: string) => (title: string, options: ToastOptions = {}) =>
  manager.add({
    title,
    description: options.description,
    type,
    timeout: options.timeout,
    actionProps: options.action ? { children: options.action.label, onClick: options.action.onClick } : undefined,
  });

/**
 * toast.success("Appointment booked", { description: "Thu 3 Dec, 10:30 with Dr. Okafor" })
 * Use toasts to confirm an action. Errors the person must act on belong inline, next to the cause.
 */
export const toast = {
  message: add("message"),
  success: add("success"),
  error: add("error"),
  warning: add("warning"),
  info: add("info"),
  dismiss: (id?: string) => manager.close(id as string),
};

const icons: Record<string, React.ReactNode> = {
  success: <CircleCheck className="text-success-fg" />,
  error: <CircleAlert className="text-destructive-fg" />,
  warning: <TriangleAlert className="text-warning-fg" />,
  info: <Info className="text-accent-foreground" />,
};

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((item) => (
    <BaseToast.Root
      key={item.id}
      toast={item}
      swipeDirection={["right", "down"]}
      className={cn(
        "absolute right-0 bottom-0 w-full select-none",
        "rounded-xl rovr-glass p-4 pr-10 text-popover-foreground",
        "[transition:translate_var(--dur-slow)_var(--ease-out),opacity_var(--dur-base)_var(--ease-out),scale_var(--dur-slow)_var(--ease-out)]",
        // Stack upward: each toast sits above the combined height of the ones in front of it.
        "translate-x-(--toast-swipe-movement-x) translate-y-[calc(var(--toast-swipe-movement-y)-var(--toast-offset-y)-var(--toast-index)*0.625rem)]",
        "data-[starting-style]:translate-y-[calc(100%+1rem)] data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        "data-[ending-style]:translate-x-[calc(100%+2rem)] data-[ending-style]:opacity-0",
        "data-[limited]:opacity-0",
        "after:absolute after:top-full after:left-0 after:h-3 after:w-full",
      )}
    >
      <BaseToast.Content className="flex gap-3">
        {item.type && icons[item.type] && <span className="mt-0.5 shrink-0 [&_svg]:size-4.5">{icons[item.type]}</span>}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <BaseToast.Title className="text-title-sm" />
          <BaseToast.Description className="text-body-sm text-muted-foreground" />
          {item.actionProps && (
            <BaseToast.Action className="mt-2 w-fit cursor-pointer rounded-xs text-label text-accent-foreground underline decoration-transparent rovr-focus hover:decoration-current" />
          )}
        </div>
      </BaseToast.Content>
      <BaseToast.Close
        aria-label="Dismiss"
        className="absolute top-3 right-3 grid size-6 cursor-pointer place-items-center rounded-full text-muted-foreground rovr-focus hover:bg-secondary hover:text-foreground"
      >
        <X className="size-3.5" />
      </BaseToast.Close>
    </BaseToast.Root>
  ));
}

/** Mount once near the root of the app. */
export function Toaster() {
  return (
    <BaseToast.Provider toastManager={manager} limit={4}>
      <BaseToast.Portal>
        <BaseToast.Viewport className="fixed right-4 bottom-4 z-[60] w-[min(24rem,calc(100vw-2rem))]">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}
