import { getCurrentGuest } from "@/lib/current-guest";
import RsvpForm from "./RsvpForm";
import { CircleCardPage } from "@/components/CircleCardPage";
import { PageSection } from "@/components/PageSection";

export const dynamic = "force-dynamic";

export default async function RsvpPage() {
  const guest = await getCurrentGuest();
  const firstName = guest?.display_name?.split(" ")[0] ?? "there";

  return (
    <CircleCardPage>
      <PageSection
        title={`Hi, ${firstName}!`}
        description="Can you make it to the celebration?"
      >
        <RsvpForm initialStatus={guest?.is_attending ?? null} />
      </PageSection>
    </CircleCardPage>
  );
}
