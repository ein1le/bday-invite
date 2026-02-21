import Link from "next/link";
import { getCurrentGuest } from "@/lib/current-guest";
import { CircleCardPage } from "@/components/CircleCardPage";
import { PageSection } from "@/components/PageSection";
import { ConfirmRsvpChange } from "@/components/ConfirmRsvpChange";

export const dynamic = "force-dynamic";

export default async function ConfirmNotAttendingPage() {
  const guest = await getCurrentGuest();

  const name =
    guest?.display_name?.split(" ")[0] ??
    guest?.display_name ??
    "Friend";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <CircleCardPage>
        <div className="relative">
          <Link
            href="/attending"
            className="absolute right-0 top-0 text-sm font-semibold"
            aria-label="Close"
          >
            ×
          </Link>
          <PageSection
            title="Change your RSVP?"
            description={`Confirm that you're no longer able to attend, ${name}.`}
            align="center"
          >
            <ConfirmRsvpChange
              isAttending={false}
              confirmLabel="Yes, I'm not attending"
              cancelHref="/attending"
            />
          </PageSection>
        </div>
      </CircleCardPage>
    </div>
  );
}
