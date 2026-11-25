import { Prose } from "@/components/ui/prose";
import { Demo } from "../kit";
import type { DocPage } from "../types";

/** Stands in for HTML that the app has already sanitised, such as a product description from the catalogue. */
const sanitisedHtml = `
<h3>What this test measures</h3>
<p>The lipid panel measures four fats in your blood: <strong>total cholesterol</strong>, <strong>LDL</strong>, <strong>HDL</strong> and <strong>triglycerides</strong>.</p>
<ul>
  <li>Fast for 9 to 12 hours before the draw. Water is fine.</li>
  <li>Take your usual medication unless your clinician says otherwise.</li>
</ul>
<p>Results are ready in two working days. Read more in the <a href="#/prose">preparation guide</a>.</p>
`;

function Body() {
  return (
    <>
      <Demo id="prose-after-visit-summary" files={["ui/prose"]} title="After-visit summary" note="Prose styles the headings, lists, links, quotes and tables inside it. Pass the output of your markdown renderer, or plain elements, as children." className="items-start">
        <Prose className="max-w-[68ch]">
          <h1>After-visit summary</h1>
          <p>
            Amara Osei, seen on 12 November 2026 by Dr. Lena Fischer for a follow-up of high cholesterol. The visit lasted 25 minutes.
          </p>
          <h2>What we found</h2>
          <p>
            Your LDL cholesterol is <strong>131 mg/dL</strong>, down from 148 mg/dL in August. That is progress, and it is still above the goal of 100 mg/dL. Your blood pressure and weight have not changed.
          </p>
          <table>
            <thead>
              <tr>
                <th>Reading</th>
                <th>Today</th>
                <th>August</th>
                <th>Goal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>LDL cholesterol</td>
                <td>131 mg/dL</td>
                <td>148 mg/dL</td>
                <td>Below 100 mg/dL</td>
              </tr>
              <tr>
                <td>Blood pressure</td>
                <td>118/76 mmHg</td>
                <td>120/78 mmHg</td>
                <td>Below 130/80 mmHg</td>
              </tr>
              <tr>
                <td>Weight</td>
                <td>72.4 kg</td>
                <td>72.9 kg</td>
                <td>No goal set</td>
              </tr>
            </tbody>
          </table>
          <h2>What to do next</h2>
          <ol>
            <li>
              Take <strong>atorvastatin 20 mg</strong> once a day, in the evening. This replaces the 10 mg tablets.
            </li>
            <li>
              Book a lipid panel for the week of 4 January 2027.
              <ul>
                <li>Fast for 9 to 12 hours before the blood draw.</li>
                <li>Water and your usual medication are fine.</li>
              </ul>
            </li>
            <li>Keep walking 30 minutes on most days.</li>
          </ol>
          <h3>When to contact us</h3>
          <p>
            Send a message or call the clinic if you have muscle pain, weakness or dark urine. These are rare side effects of statins and should be checked the same day.
          </p>
          <blockquote>
            <p>You are doing the right things. The higher dose should bring the number the rest of the way.</p>
            <p>Dr. Lena Fischer</p>
          </blockquote>
          <hr />
          <p>
            Questions about this summary? <a href="#/prose">Message your care team</a> or read <a href="#/prose">how statins work</a>.
          </p>
        </Prose>
      </Demo>
      <Demo id="prose-care-note" files={["ui/prose"]} title="AI care note" note="Use size sm in chat bubbles, side panels and cards. Model output is markdown: render it with your markdown library and wrap the result." className="items-start">
        <div className="w-full max-w-md rounded-lg bg-surface-sunken p-4">
          <Prose size="sm">
            <h4>Summary for Daniel Reyes, 54</h4>
            <p>
              Three home blood pressure readings this week were above target. The average was <strong>146/92 mmHg</strong>. He reports no headache or chest pain.
            </p>
            <h4>Suggested next steps</h4>
            <ul>
              <li>
                Confirm he takes lisinopril 10 mg every morning. The refill is <em>nine days late</em>.
              </li>
              <li>
                Order a basic metabolic panel, code <code>80048</code>.
              </li>
              <li>Offer a video visit this week to review the dose.</li>
            </ul>
            <p>This note was drafted from the chart and the last four messages. Check it before you sign.</p>
          </Prose>
        </div>
      </Demo>
      <Demo id="prose-sizes" files={["ui/prose"]} title="Sizes" note="Medium is for reading on a page. Small is one step down for every element, with tighter spacing." className="items-start gap-8">
        <Prose className="max-w-xs">
          <h3>Before your blood draw</h3>
          <p>Do not eat for 9 to 12 hours. Drink water as usual.</p>
          <ul>
            <li>Bring your insurance card.</li>
            <li>Wear a top with loose sleeves.</li>
          </ul>
        </Prose>
        <Prose size="sm" className="max-w-xs">
          <h3>Before your blood draw</h3>
          <p>Do not eat for 9 to 12 hours. Drink water as usual.</p>
          <ul>
            <li>Bring your insurance card.</li>
            <li>Wear a top with loose sleeves.</li>
          </ul>
        </Prose>
      </Demo>
      <Demo id="prose-code" files={["ui/prose"]} title="Code and preformatted text" note="Inline code marks identifiers such as billing codes. A pre block keeps line breaks and wraps long lines, for text that arrives already laid out." className="items-start">
        <Prose className="max-w-[68ch]">
          <p>
            Claim <code>CLM-2026-118204</code> was returned by the payer. The diagnosis code <code>E78.5</code> needs a matching procedure code.
          </p>
          <pre>
            <code>{"Payer response, 14 Nov 2026\nStatus:  Denied\nReason:  CO-11 Diagnosis inconsistent with procedure\nAction:  Correct the procedure code and resubmit within 90 days"}</code>
          </pre>
        </Prose>
      </Demo>
      <Demo id="prose-html" files={["ui/prose"]} title="HTML string" note="Pass a string through html when the content arrives as HTML. Prose inserts it as is. Sanitise it first, for example with DOMPurify, and never pass text from a person or a model without doing so." className="items-start">
        <Prose html={sanitisedHtml} className="max-w-[68ch]" />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "prose",
  title: "Prose",
  group: "Components",
  summary: "A wrapper that styles rendered rich text: headings, paragraphs, lists, links, quotes, code and tables. Use it around markdown output or sanitised HTML, such as visit summaries, care notes and product descriptions.",
  keywords: "markdown rich text typography html formatted description article content",
  Body,
};
