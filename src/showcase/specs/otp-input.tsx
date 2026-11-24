import { OtpInput } from "@/components/ui/otp-input";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const codes: Record<string, string> = { "4": "2041", "6": "418205" };

export const spec: ComponentSpec = {
  slug: "otp-input",
  sections: [
    matrix({
      title: "OTP input",
      note: "length sets the number of boxes. Focus is shown on the first box. There is no hover style.",
      rows: axis("length", ["4", "6"]),
      states: ["default", "focus", "filled", "invalid", "disabled"],
      render: (p, s) => (
        <OtpInput
          length={Number(p.length)}
          defaultValue={s.is("filled") || s.is("invalid") || s.disabled ? codes[p.length] : undefined}
          invalid={s.is("invalid")}
          disabled={s.disabled}
          aria-label="Verification code"
        />
      ),
    }),
    list({
      title: "Content",
      note: "mask hides the digits, for a PIN typed at a shared kiosk.",
      items: [
        { label: "Partly filled", code: '<OtpInput defaultValue="418" />', render: () => <OtpInput defaultValue="418" aria-label="Verification code" /> },
        { label: "Masked", code: "<OtpInput length={4} mask />", render: () => <OtpInput length={4} mask defaultValue="2041" aria-label="Staff PIN" /> },
        {
          label: "With error text",
          code: "<OtpInput invalid />",
          render: () => (
            <div className="flex flex-col gap-2">
              <OtpInput defaultValue="418200" invalid aria-label="Expired code" />
              <p className="text-body-sm text-destructive-fg">That code has expired. Send a new one.</p>
            </div>
          ),
        },
      ],
    }),
  ],
};
