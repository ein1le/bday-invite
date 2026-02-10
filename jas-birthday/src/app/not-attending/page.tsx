import { getCurrentGuest } from "@/lib/current-guest";

export const dynamic = "force-dynamic";

export default async function NotAttendingPage() {
  const guest = await getCurrentGuest();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          RSVP received
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {guest
            ? `We&apos;ll miss you, ${guest.display_name}.`
            : "We&apos;ll miss you."}
        </h1>
        <p className="text-sm text-slate-600">
          Thank you for letting us know. We&apos;ll celebrate together another
          time, but we&apos;re so glad you were part of planning this one.
        </p>
      </div>

      <div className="space-y-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-700">
        <p className="font-semibold uppercase tracking-wide text-slate-500">
          Stay in the loop
        </p>
        <p>
          We&apos;ll still share a few photos and moments from the night so you
          don&apos;t miss out completely.
        </p>
      </div>

      <div className="space-y-2 text-xs text-slate-500">
        <p>
          If your plans change, you can always update your answer. No pressure
          either way.
        </p>
        <a
          href="/rsvp"
          className="inline-flex text-xs font-medium text-slate-800 underline underline-offset-4"
        >
          Change my RSVP
        </a>
      </div>
    </div>
  );
}

