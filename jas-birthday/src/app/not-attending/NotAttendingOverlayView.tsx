"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import pageAttendance from "@/Birthday Assets/page-attendance.png";
import iconWishlist from "@/Birthday Assets/icon-wishlist.png";
import iconGuestlist from "@/Birthday Assets/icon-guestlist.png";
import iconAttend from "@/Birthday Assets/icon-attend.png";
import iconHelp from "@/Birthday Assets/icon-help.png";
import { CircleCardPage } from "@/components/CircleCardPage";
import { PageSection } from "@/components/PageSection";
import { TextCard } from "@/components/TextCard";
import { ConfirmRsvpChange } from "@/components/ConfirmRsvpChange";
import type { GuestWithResponse } from "@/lib/guests";
import type { Product } from "@/lib/products";
import { BannerPanel } from "../attending/AttendingOverlayView";
import { OverlayShell } from "@/components/OverlayShell";

type Panel = "wishlist" | "guestlist" | "help" | "confirm";

type NotAttendingOverlayViewProps = {
  name: string;
  guests: GuestWithResponse[];
  products: Product[];
};

export function NotAttendingOverlayView({
  name,
  guests,
  products,
}: NotAttendingOverlayViewProps) {
  const [panel, setPanel] = useState<Panel | null>(null);

  const icons = [
    {
      src: iconWishlist,
      alt: "Wishlist icon",
      label: "Wishlist",
      onClick: () => setPanel("wishlist"),
    },
    {
      src: iconGuestlist,
      alt: "Guest list icon",
      label: "Guestlist",
      onClick: () => setPanel("guestlist"),
    },
    {
      src: iconAttend,
      alt: "Attending icon",
      label: "Attending",
      onClick: () => setPanel("confirm"),
    },
    {
      src: iconHelp,
      alt: "Help icon",
      label: "Help",
      onClick: () => setPanel("help"),
    },
  ];

  return (
    <>
      <CircleCardPage withCard={false}>
        <PageSection
          title={`We will miss you!`}
          description=""
          align="center"
        >
          <div className="relative flex w-full justify-center">
            <Image
              src={pageAttendance}
              alt="Attendance page illustration"
              className="h-[32rem] w-auto rounded-2xl object-cover shadow-lg"
              priority
            />
          </div>
          <nav className="mt-6 flex items-center justify-between gap-1 px-4">
            {icons.map((icon) => (
              <button
                key={icon.label}
                type="button"
                onClick={icon.onClick}
                className="flex flex-1 items-center justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 shadow-sm">
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    className="h-8 w-8 object-contain"
                  />
                </div>
              </button>
            ))}
          </nav>
        </PageSection>
      </CircleCardPage>

      <AnimatePresence>
        {panel && (
          <motion.div
            key={panel}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
            >
              <OverlayShell onClose={() => setPanel(null)}>
                {panel === "confirm" ? (
                  <TextCard>
                    <PageSection
                      title="Change your RSVP?"
                      description={`Confirm that you'll be attending after all, ${name}.`}
                      align="center"
                    >
                      <ConfirmRsvpChange
                        isAttending={true}
                        confirmLabel="Confirm"
                        cancelHref="/not-attending"
                        onCancel={() => setPanel(null)}
                      />
                    </PageSection>
                  </TextCard>
                ) : (
                  <BannerPanel
                    panel={panel}
                    guests={guests}
                    products={products}
                    onClose={() => setPanel(null)}
                  />
                )}
              </OverlayShell>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
