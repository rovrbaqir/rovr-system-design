import { CalendarPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type CardProps } from "@/components/ui/card";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const variants = ["risen", "sunken", "outline"] as const;

export const spec: ComponentSpec = {
  slug: "card",
  sections: [
    matrix({
      title: "Card",
      note: "risen floats on the page, sunken groups content inside another card, outline is the quietest.",
      rows: axis("variant", variants),
      states: ["default"],
      render: (p) => (
        <Card variant={p.variant as CardProps["variant"]} style={{ width: 320 }}>
          <CardHeader>
            <div>
              <CardTitle>Next appointment</CardTitle>
              <CardDescription>Dr. Ngozi Okafor, cardiology</CardDescription>
            </div>
            <Badge tone="info">Scheduled</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm">Monday 23 November at 10:30, Riverside Clinic, room 4.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Check in</Button>
            <Button size="sm" variant="ghost">
              Reschedule
            </Button>
          </CardFooter>
        </Card>
      ),
    }),
    matrix({
      title: "Card interactive",
      note: "interactive makes the whole card one click target. It lifts under the pointer and presses in.",
      rows: axis("variant", variants),
      states: ["default", "hover", "focus", "pressed"],
      render: (p) => (
        <Card interactive role="button" tabIndex={0} variant={p.variant as CardProps["variant"]} style={{ width: 256 }}>
          <CardHeader>
            <div>
              <CardTitle>Book a visit</CardTitle>
              <CardDescription>In person or by video</CardDescription>
            </div>
            <CalendarPlus className="size-5 text-muted-foreground" />
          </CardHeader>
        </Card>
      ),
    }),
    list({
      title: "Parts",
      note: "A card is built from CardHeader, CardTitle, CardDescription, CardContent and CardFooter. Use only the parts the content needs.",
      items: [
        {
          label: "Header only",
          code: "<Card><CardHeader>…</CardHeader></Card>",
          render: () => (
            <Card className="w-72">
              <CardHeader>
                <div>
                  <CardTitle>Lipid panel</CardTitle>
                  <CardDescription>Collected 12 November</CardDescription>
                </div>
                <Badge tone="success">In range</Badge>
              </CardHeader>
            </Card>
          ),
        },
        {
          label: "Header and content",
          code: "<Card><CardHeader>…</CardHeader><CardContent>…</CardContent></Card>",
          render: () => (
            <Card className="w-72">
              <CardHeader>
                <div>
                  <CardTitle>Atorvastatin 20 mg</CardTitle>
                  <CardDescription>One tablet every morning</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-muted-foreground">2 refills left, next due 14 December.</p>
              </CardContent>
            </Card>
          ),
        },
        {
          label: "With footer",
          code: "<Card>…<CardFooter><Button /></CardFooter></Card>",
          render: () => (
            <Card className="w-72">
              <CardHeader>
                <div>
                  <CardTitle>Atorvastatin 20 mg</CardTitle>
                  <CardDescription>One tablet every morning</CardDescription>
                </div>
              </CardHeader>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Request refill
                </Button>
              </CardFooter>
            </Card>
          ),
        },
        {
          label: "Sunken inside risen",
          code: '<Card><Card variant="sunken">…</Card></Card>',
          render: () => (
            <Card className="w-72">
              <CardTitle>Visit summary</CardTitle>
              <Card variant="sunken">
                <p className="text-body-sm">Blood pressure 124/78. Continue current medication and return in 3 months.</p>
              </Card>
            </Card>
          ),
        },
      ],
    }),
  ],
};
