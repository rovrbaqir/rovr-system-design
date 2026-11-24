import { Calendar, Mail, Search } from "lucide-react";
import { Input, type InputProps, SearchInput, Textarea } from "@/components/ui/input";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const sizes = ["sm", "md", "lg"] as const;
const states = ["default", "hover", "focus", "invalid", "disabled", "read-only"] as const;

export const spec: ComponentSpec = {
  slug: "input",
  sections: [
    matrix({
      title: "Input",
      note: "size sets the height. Invalid is aria-invalid, set by the form or the Field around it.",
      rows: axis("size", sizes),
      groups: axis("value", ["empty", "filled"]),
      states,
      render: (p, s) => (
        <div className="w-52">
          <Input
            size={p.size as InputProps["size"]}
            placeholder="Full name"
            defaultValue={p.value === "filled" ? "Amara Osei" : undefined}
            aria-label="Full name"
            aria-invalid={s.is("invalid") || undefined}
            disabled={s.disabled}
            readOnly={s.is("read-only")}
          />
        </div>
      ),
    }),
    matrix({
      title: "Input with adornment",
      note: "leading and trailing put an icon or a unit inside the field.",
      rows: axis("adornment", ["leading", "trailing", "both"]),
      groups: axis("value", ["empty", "filled"]),
      states: ["default", "hover", "focus", "invalid", "disabled"],
      render: (p, s) => (
        <div className="w-52">
          <Input
            leading={p.adornment !== "trailing" ? <Mail /> : undefined}
            trailing={p.adornment === "trailing" ? "mg/dL" : p.adornment === "both" ? "Work" : undefined}
            placeholder={p.adornment === "trailing" ? "Glucose" : "Email"}
            defaultValue={p.value === "filled" ? (p.adornment === "trailing" ? "104" : "amara@osei.me") : undefined}
            aria-label={p.adornment === "trailing" ? "Glucose" : "Email"}
            aria-invalid={s.is("invalid") || undefined}
            disabled={s.disabled}
          />
        </div>
      ),
    }),
    matrix({
      title: "Search input",
      note: "A pill-shaped field. The clear button shows once there is text, and loading swaps the search icon for a spinner.",
      rows: axis("size", sizes),
      groups: axis("value", ["empty", "filled"]),
      states: ["default", "hover", "focus", "loading", "disabled"],
      render: (p, s) => (
        <div className="w-52">
          <SearchInput
            size={p.size as InputProps["size"]}
            value={p.value === "filled" ? "Metformin" : ""}
            onValueChange={() => {}}
            loading={s.is("loading")}
            disabled={s.disabled}
            placeholder="Search medications"
            aria-label="Search medications"
          />
        </div>
      ),
    }),
    matrix({
      title: "Textarea",
      note: "Resizes vertically. rows sets the starting height.",
      rows: axis("value", ["empty", "filled"]),
      states: ["default", "hover", "focus", "invalid", "disabled"],
      render: (p, s) => (
        <div className="w-64">
          <Textarea
            rows={3}
            placeholder="Symptoms, questions, changes since your last visit"
            defaultValue={p.value === "filled" ? "Headaches most mornings since starting lisinopril two weeks ago." : undefined}
            aria-label="Anything your clinician should know"
            aria-invalid={s.is("invalid") || undefined}
            disabled={s.disabled}
          />
        </div>
      ),
    }),
    list({
      title: "Content",
      note: "Use type and inputMode for the right keyboard. Numbers and IDs take the text-data class for tabular figures.",
      items: [
        {
          label: "Leading icon",
          code: "<Input leading={<Search />} />",
          render: () => (
            <div className="w-64">
              <Input leading={<Search />} placeholder="Find a clinician" aria-label="Find a clinician" />
            </div>
          ),
        },
        {
          label: "Trailing unit",
          code: '<Input trailing="kg" />',
          render: () => (
            <div className="w-64">
              <Input trailing="kg" defaultValue="72.5" inputMode="decimal" className="text-data" aria-label="Weight" />
            </div>
          ),
        },
        {
          label: "Trailing icon",
          code: "<Input trailing={<Calendar />} />",
          render: () => (
            <div className="w-64">
              <Input trailing={<Calendar />} defaultValue="12 Nov 2026" aria-label="Date of birth" />
            </div>
          ),
        },
        {
          label: "Tabular value",
          code: '<Input className="text-data" />',
          render: () => (
            <div className="w-64">
              <Input defaultValue="RVR-2041-88317" className="text-data" aria-label="Member ID" />
            </div>
          ),
        },
        {
          label: "Tall textarea",
          code: "<Textarea rows={6} />",
          render: () => (
            <div className="w-64">
              <Textarea rows={6} defaultValue="Patient reports improved sleep and no dizziness. Continue lisinopril 10 mg daily and recheck blood pressure in four weeks." aria-label="Visit note" />
            </div>
          ),
        },
      ],
    }),
  ],
};
