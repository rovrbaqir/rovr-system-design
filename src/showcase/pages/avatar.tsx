import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="avatar-sizes" files={["ui/avatar"]} title="Sizes" note="Extra small for inline mentions, small for table rows, medium for lists and headers, large for a profile. Medium is the default.">
        <Avatar name="Amara Osei" size="xs" />
        <Avatar name="Amara Osei" size="sm" />
        <Avatar name="Amara Osei" />
        <Avatar name="Amara Osei" size="lg" />
      </Demo>
      <Demo id="avatar-initials" files={["ui/avatar"]} title="Initials" note="Initials come from the full name. Titles and credentials are left out, so Dr. Ngozi Okafor, MD is NO. A single name gives one letter.">
        <Avatar name="Dr. Ngozi Okafor, MD" />
        <Avatar name="Sam Whitfield" />
        <Avatar name="Prof. Leila Haddad" />
        <Avatar name="Mrs Priya Raman" />
        <Avatar name="Tomás" />
      </Demo>
      <Demo id="avatar-image" files={["ui/avatar"]} title="Image with fallback" note="Pass src for a photo; name becomes its alt text. The initials show while the photo loads and stay if it fails, as here, where the file does not exist.">
        <Avatar name="Dr. Ngozi Okafor" src="/avatars/ngozi-okafor.jpg" size="lg" />
        <Avatar name="Sam Whitfield" src="/avatars/sam-whitfield.jpg" />
        <Avatar name="Leila Haddad" src="/avatars/leila-haddad.jpg" size="sm" />
      </Demo>
      <Demo id="avatar-group" files={["ui/avatar"]} title="Group" note="Overlapping avatars for a care team or attendee list. Show three or four and count the rest in words.">
        <AvatarGroup>
          <Avatar name="Ngozi Okafor" />
          <Avatar name="Sam Whitfield" />
          <Avatar name="Leila Haddad" />
        </AvatarGroup>
        <div className="flex items-center gap-2.5">
          <AvatarGroup>
            <Avatar name="Ngozi Okafor" size="sm" />
            <Avatar name="Sam Whitfield" size="sm" />
            <Avatar name="Leila Haddad" size="sm" />
            <Avatar name="Daniel Mensah" size="sm" />
          </AvatarGroup>
          <span className="text-body-sm text-muted-foreground">and 3 more</span>
        </div>
      </Demo>
      <Demo id="avatar-with-details" files={["ui/avatar", "ui/badge"]} title="With details" note="The usual pairing: a name, a role and a status beside the avatar." className="flex-col items-stretch gap-4">
        <div className="flex items-center gap-3">
          <Avatar name="Dr. Ngozi Okafor" />
          <div className="min-w-0 flex-1">
            <p className="text-title-sm">Dr. Ngozi Okafor</p>
            <p className="text-body-sm text-muted-foreground">Internal medicine · Mission St Clinic</p>
          </div>
          <Badge variant="status" tone="info" live>
            In call
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Avatar name="Sam Whitfield" />
          <div className="min-w-0 flex-1">
            <p className="text-title-sm">Sam Whitfield</p>
            <p className="text-body-sm text-muted-foreground">Nurse practitioner</p>
          </div>
          <Badge variant="status" tone="success">
            Available
          </Badge>
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "avatar",
  title: "Avatar",
  group: "Components",
  summary: "A person's photo, or their initials when there is no photo. Use it wherever a patient or clinician is named.",
  keywords: "profile picture photo initials user person care team",
  Body,
};
