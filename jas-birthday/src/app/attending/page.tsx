import { getCurrentGuest } from "@/lib/current-guest";

export const dynamic = "force-dynamic";

export default async function AttendingPage() {
  const guest = await getCurrentGuest();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
          RSVP received
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {guest ? `Amazing, ${guest.display_name}!` : "Amazing!"}
        </h1>
        <p className="text-sm text-slate-600">
          We&apos;re so excited to celebrate with you. You&apos;ll get a
          reminder with full details closer to the day.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
        <p className="font-semibold uppercase tracking-wide text-emerald-700">
          Event details
        </p>
        <p>
          <span className="font-medium">When:</span> Saturday · 7:00 PM
        </p>
        <p>
          <span className="font-medium">Where:</span> Address will be sent to
          you directly.
        </p>
        <p>
          <span className="font-medium">Dress code:</span> Soft party — comfy
          but cute.
        </p>
      </div>

      <div className="space-y-2 text-xs text-slate-500">
        <p>
          Plans changed? You can update your answer at any time — just head
          back to the RSVP page.
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

