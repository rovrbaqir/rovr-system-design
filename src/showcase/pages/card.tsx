import { CalendarDays, FlaskConical, MessageSquare } from "lucide-react";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="card-variants" files={["ui/card"]} title="Variants" note="Risen floats on the page and is the default. Outline is the quietest. Sunken groups content inside another card." bare className="items-stretch">
        <Card className="min-w-56 flex-1">
          <CardTitle>Risen</CardTitle>
          <CardDescription>A white card that floats on the paper.</CardDescription>
        </Card>
        <Card variant="outline" className="min-w-56 flex-1">
          <CardTitle>Outline</CardTitle>
          <CardDescription>A hairline border and no lift, for secondary content.</CardDescription>
        </Card>
        <Card className="min-w-56 flex-1">
          <CardTitle>With a sunken card</CardTitle>
          <Card variant="sunken">
            <CardDescription>Sunken sits inside another card to group a few lines.</CardDescription>
          </Card>
        </Card>
      </Demo>
      <Demo id="card-parts" files={["ui/card", "ui/badge", "ui/button"]} title="Header, content and footer" note="The header puts the title on one side and a status or control on the other. The footer holds the card's actions and sticks to the bottom when cards share a row." bare className="items-stretch">
        <Card className="min-w-72 flex-1">
          <CardHeader>
            <div>
              <CardTitle>Lipid panel</CardTitle>
              <CardDescription>Collected 12 November 2026, fasting</CardDescription>
            </div>
            <Badge tone="success">Final</Badge>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-body">
              <dt className="text-muted-foreground">LDL cholesterol</dt>
              <dd className="text-data">128 mg/dL</dd>
              <dt className="text-muted-foreground">HDL cholesterol</dt>
              <dd className="text-data">54 mg/dL</dd>
              <dt className="text-muted-foreground">Triglycerides</dt>
              <dd className="text-data">142 mg/dL</dd>
            </dl>
          </CardContent>
          <CardFooter>
            <Button size="sm">View report</Button>
            <Button size="sm" variant="ghost">
              Download PDF
            </Button>
          </CardFooter>
        </Card>
        <Card className="min-w-72 flex-1">
          <CardHeader>
            <div>
              <CardTitle>Care team</CardTitle>
              <CardDescription>3 clinicians follow your plan</CardDescription>
            </div>
            <AvatarGroup>
              <Avatar name="Ngozi Okafor" size="sm" />
              <Avatar name="Sam Whitfield" size="sm" />
              <Avatar name="Leila Haddad" size="sm" />
            </AvatarGroup>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-muted-foreground">Dr. Okafor leads your care. Sam and Leila answer messages on weekdays.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              Message the team
            </Button>
          </CardFooter>
        </Card>
      </Demo>
      <Demo id="card-interactive" files={["ui/card", "ui/toast"]} title="Interactive" note="For a card that is one click target. It lifts under the pointer and presses in. Give it tabIndex and a key handler, or render a link inside that covers it." bare className="items-stretch">
        <Card
          interactive
          role="button"
          tabIndex={0}
          className="min-w-56 flex-1"
          onClick={() => toast.message("Opening the booking flow")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toast.message("Opening the booking flow");
            }
          }}
        >
          <CardHeader>
            <div>
              <CardTitle>Book a visit</CardTitle>
              <CardDescription>In person or by video</CardDescription>
            </div>
            <CalendarDays className="size-5 text-muted-foreground" />
          </CardHeader>
        </Card>
        <Card interactive role="button" tabIndex={0} className="min-w-56 flex-1" onClick={() => toast.message("Opening lab orders")}>
          <CardHeader>
            <div>
              <CardTitle>Order a test</CardTitle>
              <CardDescription>Labs near you, no referral needed</CardDescription>
            </div>
            <FlaskConical className="size-5 text-muted-foreground" />
          </CardHeader>
        </Card>
        <Card interactive variant="outline" role="button" tabIndex={0} className="min-w-56 flex-1" onClick={() => toast.message("Opening messages")}>
          <CardHeader>
            <div>
              <CardTitle>Ask a question</CardTitle>
              <CardDescription>Replies within one working day</CardDescription>
            </div>
            <MessageSquare className="size-5 text-muted-foreground" />
          </CardHeader>
        </Card>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "card",
  title: "Card",
  group: "Components",
  summary: "A surface that groups related content: a result, a team, an appointment. Cards are white and float on the paper; three variants set how loud they are.",
  keywords: "panel surface container tile box",
  Body,
};
