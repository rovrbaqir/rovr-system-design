import * as React from "react";
import { CalendarDays, FlaskConical, MessageSquare, Pill, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/input";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const patients = ["Amara Osei", "Daniel Mensah", "Priya Raman", "Tomás Rivera"];

function PatientSearch() {
  const [query, setQuery] = React.useState("Okonkwo");
  const matches = patients.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <SearchInput value={query} onValueChange={setQuery} placeholder="Search patients" aria-label="Search patients" />
      {matches.length > 0 ? (
        <ul className="flex flex-col">
          {matches.map((name) => (
            <li key={name} className="border-b border-border py-2.5 text-body last:border-b-0">
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          size="compact"
          icon={<Search />}
          title={`No patients match "${query}"`}
          description="Check the spelling, or search by date of birth or MRN."
          action={
            <Button size="sm" variant="outline" onClick={() => setQuery("")}>
              Clear search
            </Button>
          }
        />
      )}
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="empty-state-default" files={["ui/empty-state", "ui/card", "ui/button"]} title="Default" note="The picture is the ghost of what belongs here: three faint rows with the icon resting on them. The title says what the area will hold, the description how it gets filled, and the action fills it." className="items-stretch">
        <Card variant="sunken" className="min-w-60 flex-1 p-0">
          <EmptyState
            icon={<FlaskConical />}
            title="No lab results yet"
            description="Results appear here as soon as the lab releases them."
            action={<Button size="sm" variant="outline">Order a test</Button>}
          />
        </Card>
      </Demo>
      <Demo id="empty-state-compact" files={["ui/empty-state", "ui/card", "ui/button"]} title="Compact" note="Icon only, for small panels, table bodies and sidebars." className="items-stretch">
        <Card variant="sunken" className="min-w-56 flex-1 p-0">
          <EmptyState size="compact" icon={<MessageSquare />} title="No messages" description="Questions for your care team start here." />
        </Card>
        <Card variant="sunken" className="min-w-56 flex-1 p-0">
          <EmptyState
            size="compact"
            icon={<Pill />}
            title="No active medications"
            action={<Button size="sm" variant="outline">Add medication</Button>}
          />
        </Card>
      </Demo>
      <Demo id="empty-state-content" files={["ui/empty-state", "ui/card", "ui/button"]} title="Optional parts" note="Only the title is required. Leave the action off when there is nothing the person can do, and the icon off when the heading above already names the thing." className="items-stretch">
        <Card variant="sunken" className="min-w-60 flex-1 p-0">
          <EmptyState icon={<CalendarDays />} title="No upcoming visits" description="Dr. Okafor has asked to see you again in three months. We will remind you in February." />
        </Card>
        <Card variant="sunken" className="min-w-60 flex-1 p-0">
          <EmptyState title="Nothing to review" description="Every result from this week has been signed." />
        </Card>
      </Demo>
      <Demo id="empty-state-no-results" files={["ui/empty-state", "ui/input", "ui/button"]} title="No results" note="After a search or filter, say what was searched for and offer the way back. Clear the search to see the list." className="items-start">
        <PatientSearch />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "empty-state",
  title: "Empty state",
  group: "Components",
  summary: "What an area shows before it has content, or when a search finds nothing. It says what will be here and offers the action that fills it.",
  keywords: "empty no results no data blank placeholder zero state",
  Body,
};
