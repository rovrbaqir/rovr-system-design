import { Prose, type ProseProps } from "@/components/ui/prose";
import { type ComponentSpec, axis, list, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "prose",
  sections: [
    matrix({
      title: "Prose",
      note: "size sets the type scale and spacing for every element inside. Prose has no states of its own; links take the focus ring.",
      rows: axis("size", ["sm", "md"]),
      states: ["default"],
      render: (p) => (
        <Prose size={p.size as ProseProps["size"]} className="w-96">
          <h2>What to do next</h2>
          <p>
            Take <strong>atorvastatin 20 mg</strong> once a day, in the evening. <a href="#/prose">Read how statins work</a>.
          </p>
          <ol>
            <li>Book a lipid panel for the week of 4 January 2027.</li>
            <li>Fast for 9 to 12 hours before the blood draw.</li>
          </ol>
        </Prose>
      ),
    }),
    matrix({
      title: "Headings",
      component: "Prose headings",
      note: "Four heading levels. Each maps to a RoVR type role, one step smaller at size sm.",
      rows: axis("level", ["h1", "h2", "h3", "h4"]),
      groups: axis("size", ["sm", "md"]),
      states: ["default"],
      render: (p) => {
        const Heading = p.level as "h1" | "h2" | "h3" | "h4";
        return (
          <Prose size={p.size as ProseProps["size"]} className="w-56">
            <Heading>After-visit summary</Heading>
          </Prose>
        );
      },
    }),
    list({
      title: "Elements",
      note: "What Prose styles. All shown at size md.",
      items: [
        {
          label: "Paragraph and inline",
          render: () => (
            <Prose className="w-72">
              <p>
                Your LDL is <strong>131 mg/dL</strong>, which is <em>lower</em> than in August. See the <a href="#/prose">full report</a>.
              </p>
            </Prose>
          ),
        },
        {
          label: "Bulleted list, nested",
          render: () => (
            <Prose className="w-72">
              <ul>
                <li>
                  Before the draw
                  <ul>
                    <li>Fast for 9 to 12 hours.</li>
                    <li>Drink water as usual.</li>
                  </ul>
                </li>
                <li>Bring your insurance card.</li>
              </ul>
            </Prose>
          ),
        },
        {
          label: "Numbered list",
          render: () => (
            <Prose className="w-72">
              <ol>
                <li>Order the kit.</li>
                <li>Collect your sample.</li>
                <li>Post it back the same day.</li>
              </ol>
            </Prose>
          ),
        },
        {
          label: "Blockquote",
          render: () => (
            <Prose className="w-72">
              <blockquote>
                <p>The higher dose should bring the number the rest of the way.</p>
              </blockquote>
            </Prose>
          ),
        },
        {
          label: "Inline code",
          render: () => (
            <Prose className="w-72">
              <p>
                Diagnosis code <code>E78.5</code> on claim <code>CLM-2026-118204</code>.
              </p>
            </Prose>
          ),
        },
        {
          label: "Preformatted",
          render: () => (
            <Prose className="w-72">
              <pre>
                <code>{"Status:  Denied\nReason:  CO-11\nAction:  Resubmit within 90 days"}</code>
              </pre>
            </Prose>
          ),
        },
        {
          label: "Rule",
          render: () => (
            <Prose className="w-72">
              <p>Seen on 12 November 2026.</p>
              <hr />
              <p>Next visit in January 2027.</p>
            </Prose>
          ),
        },
        {
          label: "Table",
          render: () => (
            <Prose className="w-80">
              <table>
                <thead>
                  <tr>
                    <th>Reading</th>
                    <th>Today</th>
                    <th>Goal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>LDL</td>
                    <td>131 mg/dL</td>
                    <td>Below 100</td>
                  </tr>
                  <tr>
                    <td>HbA1c</td>
                    <td>5.6 %</td>
                    <td>Below 5.7</td>
                  </tr>
                </tbody>
              </table>
            </Prose>
          ),
        },
      ],
    }),
  ],
};
