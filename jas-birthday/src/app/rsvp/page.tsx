import { getCurrentGuest } from "@/lib/current-guest";
import RsvpForm from "./RsvpForm";

export const dynamic = "force-dynamic";

export default async function RsvpPage() {
  const guest = await getCurrentGuest();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-500">
          RSVP for Jas&apos;s birthday
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {guest ? `Hi, ${guest.display_name.split(" ")[0]}!` : "Hi there!"}
        </h1>
        <p className="text-sm text-slate-600">
          Can you make it to the celebration?
        </p>
      </div>

      <RsvpForm initialStatus={guest?.is_attending ?? null} />
    </div>
  );
}

