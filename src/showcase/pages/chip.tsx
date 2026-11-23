import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chip, ChipGroup } from "@/components/ui/chip";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const allFilters = ["Status: Open", "Payer: Aetna", "Last 30 days"];

function FilterChips() {
  const [filters, setFilters] = React.useState(allFilters);
  return (
    <ChipGroup
      items={filters.map((f) => {
        const [label, value] = f.includes(": ") ? f.split(": ") : [undefined, f];
        return {
          key: f,
          node: (
            <Chip label={label} onRemove={() => setFilters((list) => list.filter((x) => x !== f))}>
              {value}
            </Chip>
          ),
        };
      })}
      trailing={
        filters.length < allFilters.length ? (
          <Button variant="link" size="sm" onClick={() => setFilters(allFilters)}>
            Reset filters
          </Button>
        ) : undefined
      }
    />
  );
}

function Recipients() {
  const team = ["Ngozi Okafor", "Sam Whitfield", "Leila Haddad"];
  const [people, setPeople] = React.useState(team);
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-label">Shared with</span>
      <ChipGroup
        items={people.map((name) => ({
          key: name,
          node: (
            <Chip className="pl-1" onRemove={() => setPeople((list) => list.filter((x) => x !== name))}>
              <Avatar name={name} size="xs" /> {name}
            </Chip>
          ),
        }))}
        trailing={
          people.length === 0 ? (
            <Button variant="link" size="sm" onClick={() => setPeople(team)}>
              Share with care team again
            </Button>
          ) : undefined
        }
      />
      <p className="text-body-sm text-muted-foreground">{people.length === 0 ? "Only you can see this result." : "These clinicians can see the lipid panel from 12 November."}</p>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="chip-basic" files={["ui/chip"]} title="Chip" note="A plain chip shows a value. label adds a lighter prefix, and onRemove adds the remove button.">
        <Chip>Last 30 days</Chip>
        <Chip label="Status">Open</Chip>
        <Chip label="Payer" onRemove={() => {}}>
          Aetna
        </Chip>
      </Demo>
      <Demo id="chip-group" files={["ui/chip", "ui/button"]} title="Chip group" note="Remove a filter: the chip shrinks away and its neighbours slide over. Give each item a stable key. trailing holds what follows the chips." className="items-start">
        <FilterChips />
      </Demo>
      <Demo id="chip-people" files={["ui/chip", "ui/avatar", "ui/button"]} title="Selected people" note="A chip can hold an avatar or an icon before its text." className="items-start">
        <Recipients />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "chip",
  title: "Chip",
  group: "Components",
  summary: "An applied filter or a selected person that can be removed. ChipGroup animates chips as they are added and taken away. For a status that cannot be removed, use a Badge.",
  keywords: "filter tag pill token removable applied filters",
  Body,
};
