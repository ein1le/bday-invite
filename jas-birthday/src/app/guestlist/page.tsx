import bannerGuest from "@/Birthday Assets/banner-guest.png";
import { BannerPage } from "@/components/BannerPage";
import { TextCard } from "@/components/TextCard";
import { getGuestsWithResponses } from "@/lib/guests";

export const dynamic = "force-dynamic";

type GuestlistPageProps = {
  searchParams?: {
    from?: string;
  };
};

export default async function GuestlistPage({ searchParams }: GuestlistPageProps) {
  const guests = await getGuestsWithResponses();

  const from = searchParams?.from === "not-attending" ? "/not-attending" : "/attending";

  return (
    <BannerPage
      banner={bannerGuest}
      alt="Guestlist banner"
      closeHref={from}
    >
      <div className="mt-4 space-y-4">
        {guests.map((guest) => (
          <TextCard
            key={guest.id}
            className="flex items-center justify-between gap-3"
          >
            <span className="text-base font-semibold">
              {guest.displayName}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                guest.isAttending
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {guest.isAttending ? "Attending" : "Not attending"}
            </span>
          </TextCard>
        ))}
        {guests.length === 0 ? (
          <TextCard>
            <p className="text-sm">
              No one has responded yet. Check back again soon!
            </p>
          </TextCard>
        ) : null}
      </div>
    </BannerPage>
  );
}
