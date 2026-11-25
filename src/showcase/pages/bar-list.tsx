import { BarList } from "@/components/ui/bar-list";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const denials = [
  { label: "Missing prior authorisation", value: 148 },
  { label: "Eligibility not active", value: 96 },
  { label: "Duplicate claim", value: 61 },
  { label: "Coding mismatch", value: 44 },
  { label: "Timely filing", value: 12 },
];

const minutes = (value: number) => `${value} min`;
const dollars = (value: number) => `$${value.toLocaleString("en-US")}`;

function Body() {
  return (
    <>
      <Demo id="bar-list-basic" files={["ui/bar-list"]} title="Ranked rows" note="Pass the rows largest first. Every bar is scaled to the largest value, so lengths compare down the list." className="items-stretch">
        <BarList aria-label="Claim denials by reason, last 30 days" rows={denials} className="max-w-xl" />
      </Demo>
      <Demo id="bar-list-hint" files={["ui/bar-list"]} title="Hint, format and value label" note="hint adds a muted note after the label. format writes every value; valueLabel replaces the text of one row." className="items-stretch">
        <BarList
          aria-label="Average time per intake step"
          format={minutes}
          className="max-w-xl"
          rows={[
            { label: "Insurance check", value: 42, hint: "human step" },
            { label: "Record request", value: 31, hint: "human step" },
            { label: "Intake form", value: 9 },
            { label: "Scheduling", value: 4 },
            { label: "Reminder", value: 0.5, valueLabel: "Under 1 min" },
          ]}
        />
      </Demo>
      <Demo id="bar-list-tones" files={["ui/bar-list"]} title="Tones" note="One tone for the whole list. Use a status tone only when every row carries that judgement." className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        <BarList
          aria-label="Visits completed by clinic"
          tone="success"
          rows={[
            { label: "Riverside", value: 312 },
            { label: "Northgate", value: 268 },
            { label: "Harbour Street", value: 194 },
          ]}
        />
        <BarList
          aria-label="Overdue lab reviews by provider"
          tone="warning"
          rows={[
            { label: "Dr. Imani Clarke", value: 14 },
            { label: "Dr. Leo Tanaka", value: 9 },
            { label: "Dr. Sara Haddad", value: 3 },
          ]}
        />
      </Demo>
      <Demo id="bar-list-max" files={["ui/bar-list"]} title="Fixed maximum" note="Set max when a full bar stands for a known amount, such as a target or a capacity, instead of the largest row." className="items-stretch">
        <BarList
          aria-label="Slots booked today, out of 40 per clinic"
          max={40}
          className="max-w-xl"
          rows={[
            { label: "Riverside", value: 38, valueLabel: "38 of 40" },
            { label: "Northgate", value: 27, valueLabel: "27 of 40" },
            { label: "Harbour Street", value: 11, valueLabel: "11 of 40" },
          ]}
        />
      </Demo>
      <Demo id="bar-list-in-a-card" files={["ui/bar-list", "ui/card"]} title="In a card" note="A heading says what is ranked and over what period." bare className="items-stretch">
        <Card className="max-w-lg flex-1">
          <CardHeader>
            <div>
              <CardTitle>Billed by payer</CardTitle>
              <CardDescription>1 to 24 November 2026</CardDescription>
            </div>
          </CardHeader>
          <BarList
            aria-label="Billed by payer"
            format={dollars}
            rows={[
              { label: "Commercial", value: 184200 },
              { label: "Medicare", value: 96400 },
              { label: "Medicaid", value: 51800 },
              { label: "Self-pay", value: 17350 },
            ]}
          />
        </Card>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "bar-list",
  title: "Bar list",
  group: "Components",
  summary: "Ranked horizontal bars: a label, a bar scaled to the largest value, and the value. Use it to compare a few named amounts; use BarChart for categories along an axis.",
  keywords: "bar rows ranking top list horizontal bars breakdown leaderboard",
  Body,
};
