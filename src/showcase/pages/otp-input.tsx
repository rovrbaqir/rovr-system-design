import * as React from "react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function VerifyCode() {
  const [code, setCode] = React.useState("418");
  const [state, setState] = React.useState<"idle" | "wrong" | "ok">("idle");
  return (
    <div className="flex flex-col items-start gap-3">
      <span className="text-label">Verification code</span>
      <OtpInput
        aria-label="Verification code"
        value={code}
        invalid={state === "wrong"}
        onValueChange={(v) => {
          setCode(v);
          setState("idle");
        }}
        onValueComplete={(v) => setState(v === "418205" ? "ok" : "wrong")}
      />
      {state === "wrong" && <p className="text-body-sm text-destructive-fg">That code does not match. Check the text we sent to the number ending 0142.</p>}
      {state === "ok" && <p className="text-body-sm text-success-fg">Code accepted. You are signed in.</p>}
      {state === "idle" && <p className="text-body-sm text-muted-foreground">We sent a 6-digit code to the number ending 0142. For this example the code is 418205.</p>}
      <Button
        variant="link"
        size="sm"
        onClick={() => {
          setCode("");
          setState("idle");
        }}
      >
        Send a new code
      </Button>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="otp-input-basic" files={["ui/otp-input", "ui/button"]} title="Six digits" note="Typing moves to the next box and Backspace moves back. Pasting a code fills every box. onValueComplete fires once the last digit is in." className="items-start">
        <VerifyCode />
      </Demo>
      <Demo id="otp-input-length" files={["ui/otp-input"]} title="Length" note="Set length for shorter codes, such as a four-digit kiosk check-in PIN. The gap sits at the halfway point." className="items-start">
        <div className="flex flex-col gap-2">
          <span className="text-label">Check-in PIN</span>
          <OtpInput length={4} aria-label="Check-in PIN" />
        </div>
      </Demo>
      <Demo id="otp-input-masked" files={["ui/otp-input"]} title="Masked" note="mask hides the digits on shared screens, such as the tablet at the front desk." className="items-start">
        <div className="flex flex-col gap-2">
          <span className="text-label">Staff PIN</span>
          <OtpInput length={4} mask defaultValue="20" aria-label="Staff PIN" />
        </div>
      </Demo>
      <Demo id="otp-input-states" files={["ui/otp-input"]} title="Invalid and disabled" className="flex-col items-start gap-5">
        <div className="flex flex-col gap-2">
          <OtpInput defaultValue="418200" invalid aria-label="Expired code" />
          <p className="text-body-sm text-destructive-fg">This code has expired. Request a new one.</p>
        </div>
        <OtpInput defaultValue="418205" disabled aria-label="Code being checked" />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "otp-input",
  title: "OTP input",
  group: "Components",
  summary: "One box per digit for one-time codes at sign-in and kiosk check-in. It accepts a pasted code and tells you when every digit is filled.",
  keywords: "one-time code verification pin two-factor 2fa passcode sms",
  Body,
};
