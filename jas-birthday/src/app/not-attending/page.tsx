import Image from "next/image";
import { getCurrentGuest } from "@/lib/current-guest";
import pageAttendance from "@/Birthday Assets/page-attendance.png";
import iconWishlist from "@/Birthday Assets/icon-wishlist.png";
import iconGuestlist from "@/Birthday Assets/icon-guestlist.png";
import iconAttend from "@/Birthday Assets/icon-attend.png";
import iconHelp from "@/Birthday Assets/icon-help.png";
import { CircleCardPage } from "@/components/CircleCardPage";
import { PageSection } from "@/components/PageSection";

export const dynamic = "force-dynamic";

export default async function NotAttendingPage() {
  const guest = await getCurrentGuest();

  const name =
    guest?.display_name?.split(" ")[0] ??
    guest?.display_name ??
    "Friend";

  const icons = [
    { src: iconWishlist, alt: "Wishlist icon", label: "Wishlist" },
    { src: iconGuestlist, alt: "Guest list icon", label: "Guestlist" },
    { src: iconAttend, alt: "Attending icon", label: "Attending" },
    { src: iconHelp, alt: "Help icon", label: "Help" },
  ];

  return (
    <CircleCardPage
      withCard={false}
      footer={
        <nav className="flex items-center justify-between gap-4">
          {icons.map((icon) => (
            <div
              key={icon.label}
              className="flex flex-1 flex-col items-center gap-1 text-xs font-medium text-slate-700"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 shadow-sm">
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span>{icon.label}</span>
            </div>
          ))}
        </nav>
      }
    >
      <PageSection
        title={`We’ll miss you, ${name}.`}
        description="Thank you for letting us know. We’ll celebrate together another time."
      >
        <div className="relative flex w-full justify-center">
          <Image
            src={pageAttendance}
            alt="Attendance page illustration"
            className="h-80 w-auto rounded-2xl object-cover shadow-lg scale-[1.3]"
            priority
          />
        </div>
      </PageSection>
    </CircleCardPage>
  );
}
