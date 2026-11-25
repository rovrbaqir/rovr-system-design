import { MaskedInput, type MaskedInputProps, PhoneInput } from "@/components/ui/masked-input";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const sizes = ["sm", "md", "lg"] as const;
const states = ["default", "hover", "focus", "invalid", "disabled"] as const;

const masks: Record<string, { mask: string; label: string; placeholder?: string; filled: string }> = {
  date: { mask: "__/__/____", label: "Date of birth", placeholder: "MM/DD/YYYY", filled: "04/14/1988" },
  zip: { mask: "_____", label: "ZIP code", filled: "94115" },
  code: { mask: "__-_____", label: "Pharmacy NCPDP number", filled: "05-12345" },
};

export const spec: ComponentSpec = {
  slug: "masked-input",
  sections: [
    matrix({
      title: "Phone input",
      note: "The US phone preset. size sets the height. The mask is the placeholder until the first digit is typed.",
      rows: axis("size", sizes),
      groups: axis("value", ["empty", "filled"]),
      states,
      render: (p, s) => (
        <div className="w-52">
          <PhoneInput
            size={p.size as MaskedInputProps["size"]}
            defaultValue={p.value === "filled" ? "4155550142" : undefined}
            aria-label="Mobile number"
            aria-invalid={s.is("invalid") || undefined}
            disabled={s.disabled}
          />
        </div>
      ),
    }),
    matrix({
      title: "Masked input",
      note: "mask sets the pattern. An underscore is a digit slot and every other character is written for the person.",
      rows: axis("mask", Object.keys(masks)),
      groups: axis("value", ["empty", "filled"]),
      states,
      render: (p, s) => {
        const m = masks[p.mask];
        return (
          <div className="w-52">
            <MaskedInput
              mask={m.mask}
              placeholder={m.placeholder}
              defaultValue={p.value === "filled" ? m.filled : undefined}
              aria-label={m.label}
              aria-invalid={s.is("invalid") || undefined}
              disabled={s.disabled}
            />
          </div>
        );
      },
    }),
    list({
      title: "Content",
      note: "A partly typed value never ends in punctuation. Bare digits passed as the value are shown masked.",
      items: [
        {
          label: "Partly typed",
          code: '<PhoneInput defaultValue="41555" />',
          render: () => (
            <div className="w-64">
              <PhoneInput defaultValue="41555" aria-label="Mobile number" />
            </div>
          ),
        },
        {
          label: "No icon",
          code: "<PhoneInput leading={null} />",
          render: () => (
            <div className="w-64">
              <PhoneInput leading={null} defaultValue="4155550142" aria-label="Clinic phone" />
            </div>
          ),
        },
        {
          label: "Own placeholder",
          code: '<MaskedInput mask="__/__/____" placeholder="MM/DD/YYYY" />',
          render: () => (
            <div className="w-64">
              <MaskedInput mask="__/__/____" placeholder="MM/DD/YYYY" aria-label="Date of birth" />
            </div>
          ),
        },
        {
          label: "Trailing text",
          code: '<MaskedInput mask="____" trailing="ext." />',
          render: () => (
            <div className="w-64">
              <MaskedInput mask="____" trailing="ext." defaultValue="2041" aria-label="Desk extension" />
            </div>
          ),
        },
      ],
    }),
  ],
};
