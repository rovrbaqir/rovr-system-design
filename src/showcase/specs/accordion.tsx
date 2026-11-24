import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const faqs = [
  { value: "prepare", q: "How do I prepare for a video visit?", a: "Find a quiet, well-lit place and join five minutes early. Have your medication list and any home readings to hand." },
  { value: "results", q: "When will I see my lab results?", a: "Most results appear within two working days. Your clinician adds a note if anything needs a follow-up." },
  { value: "refill", q: "How do I request a refill?", a: "Open Medications, choose the prescription and select Request refill. Your pharmacy is told once it is approved." },
];

export const spec: ComponentSpec = {
  slug: "accordion",
  sections: [
    matrix({
      title: "Accordion",
      note: "One panel is open at a time unless multiple is set. Disabled items cannot be opened or closed.",
      rows: axis("multiple", ["false", "true"]),
      states: ["closed", "open", "disabled"],
      render: (p, s) => (
        <div className="w-96">
          <Accordion multiple={p.multiple === "true"} disabled={s.disabled} defaultValue={s.is("closed") ? [] : p.multiple === "true" ? ["prepare", "results"] : ["prepare"]}>
            {faqs.map((f) => (
              <AccordionItem key={f.value} value={f.value}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ),
    }),
    matrix({
      title: "Accordion item",
      note: "The plus turns into a cross while the panel is open.",
      rows: axis("open", ["false", "true"]),
      states: ["default", "hover", "focus", "pressed", "disabled"],
      render: (p, s) => (
        <div className="w-80">
          <Accordion defaultValue={p.open === "true" ? ["results"] : []}>
            <AccordionItem value="results" disabled={s.disabled}>
              <AccordionTrigger>When will I see my lab results?</AccordionTrigger>
              <AccordionContent>Most results appear within two working days.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    }),
    list({
      title: "Content",
      items: [
        {
          label: "Rich panel",
          code: "<AccordionContent>…</AccordionContent>",
          render: () => (
            <div className="w-96">
              <Accordion defaultValue={["meds"]}>
                <AccordionItem value="meds">
                  <AccordionTrigger>Current medications</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-1">
                    <span>Atorvastatin 20 mg, once daily</span>
                    <span>Lisinopril 10 mg, once daily</span>
                    <span>Metformin 500 mg, twice daily with food</span>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ),
        },
      ],
    }),
  ],
};
