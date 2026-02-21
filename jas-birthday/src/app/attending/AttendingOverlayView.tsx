"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import pageAttendance from "@/Birthday Assets/page-attendance.png";
import iconWishlist from "@/Birthday Assets/icon-wishlist.png";
import iconGuestlist from "@/Birthday Assets/icon-guestlist.png";
import iconNotAttend from "@/Birthday Assets/icon-not-attend.png";
import iconHelp from "@/Birthday Assets/icon-help.png";
import bannerGuest from "@/Birthday Assets/banner-guest.png";
import bannerWishlist from "@/Birthday Assets/banner-wishlist.png";
import bannerGuide from "@/Birthday Assets/banner-guide.png";
import pageGuide from "@/Birthday Assets/page-guide.png";
import { CircleCardPage } from "@/components/CircleCardPage";
import { PageSection } from "@/components/PageSection";
import { TextCard } from "@/components/TextCard";
import { ConfirmRsvpChange } from "@/components/ConfirmRsvpChange";
import { OverlayShell } from "@/components/OverlayShell";
import type { GuestWithResponse } from "@/lib/guests";
import type { Product } from "@/lib/products";
import type { StaticImageData } from "next/image";
import matchaSet from "@/Birthday Assets/icons/matcha-set.png";
import diorLipOil from "@/Birthday Assets/icons/dior-lip-oil.png";
import dancePassStudio808 from "@/Birthday Assets/icons/dance-pass-studio808.png";
import dancePassVentures from "@/Birthday Assets/icons/dance-pass-ventures.png";
import dancePassKmdc from "@/Birthday Assets/icons/dance-pass-kmdc.png";
import tennisBracelet from "@/Birthday Assets/icons/tennis-bracelet.png";
import pandoraCharm from "@/Birthday Assets/icons/pandora-charm.png";
import pandoraEarring from "@/Birthday Assets/icons/pandora-earring.png";
import jellycatBunny from "@/Birthday Assets/icons/jellycat-bunny.png";
import jellycatCloud from "@/Birthday Assets/icons/jellycat-cloud.png";
import hairPerfume from "@/Birthday Assets/icons/hair-perfume.png";
import hoops from "@/Birthday Assets/icons/hoops.png";
import amethystRing from "@/Birthday Assets/icons/amethyst-ring.png";
import neckPillow from "@/Birthday Assets/icons/neck-pillow.png";
import pillowcase from "@/Birthday Assets/icons/pillowcase.png";
import giftCard from "@/Birthday Assets/icons/gift-card.png";
import danceTop from "@/Birthday Assets/icons/dance-top.png";
import laneigeLipMask from "@/Birthday Assets/icons/laneige-lip-mask.png";
import magazine from "@/Birthday Assets/icons/magazine.png";
import controller from "@/Birthday Assets/icons/controller.png";
import spyxfamGame from "@/Birthday Assets/icons/spyxfam-game.png";

const productImageMap: Record<string, StaticImageData> = {
  "src/Birthday Assets/icons/matcha-set.png": matchaSet,
  "src/Birthday Assets/icons/dior-lip-oil.png": diorLipOil,
  "src/Birthday Assets/icons/dance-pass-studio808.png": dancePassStudio808,
  "src/Birthday Assets/icons/dance-pass-ventures.png": dancePassVentures,
  "src/Birthday Assets/icons/dance-pass-kmdc.png": dancePassKmdc,
  "src/Birthday Assets/icons/tennis-bracelet.png": tennisBracelet,
  "src/Birthday Assets/icons/pandora-charm.png": pandoraCharm,
  "src/Birthday Assets/icons/pandora-earring.png": pandoraEarring,
  "src/Birthday Assets/icons/jellycat-bunny.png": jellycatBunny,
  "src/Birthday Assets/icons/jellycat-cloud.png": jellycatCloud,
  "src/Birthday Assets/icons/hair-perfume.png": hairPerfume,
  "src/Birthday Assets/icons/hoops.png": hoops,
  "src/Birthday Assets/icons/amethyst-ring.png": amethystRing,
  "src/Birthday Assets/icons/neck-pillow.png": neckPillow,
  "src/Birthday Assets/icons/pillowcase.png": pillowcase,
  "src/Birthday Assets/icons/gift-card.png": giftCard,
  "src/Birthday Assets/icons/dance-top.png": danceTop,
  "src/Birthday Assets/icons/laneige-lip-mask.png": laneigeLipMask,
  "src/Birthday Assets/icons/magazine.png": magazine,
  "src/Birthday Assets/icons/controller.png": controller,
  "src/Birthday Assets/icons/spyxfam-game.png": spyxfamGame,
};

type AttendingOverlayViewProps = {
  name: string;
  guests: GuestWithResponse[];
  products: Product[];
};

type Panel = "wishlist" | "guestlist" | "help" | "confirm";

export function AttendingOverlayView({
  name,
  guests,
  products,
}: AttendingOverlayViewProps) {
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
      src: iconNotAttend,
      alt: "Not attending icon",
      label: "Not-attending",
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
            title={`Thank You for Coming!`}
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
          <nav className="mt-6 flex items-center justify-between gap-2 px-4">
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
                    description={`Confirm that you're no longer able to attend, ${name}.`}
                    align="center"
                  >
                    <ConfirmRsvpChange
                      isAttending={false}
                      confirmLabel="Confirm"
                      cancelHref="/attending"
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

type BannerPanelProps = {
  panel: Exclude<Panel, "confirm">;
  guests: GuestWithResponse[];
  products: Product[];
  onClose: () => void;
};

export function BannerPanel({ panel, guests, products, onClose }: BannerPanelProps) {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>(products);
  const [pendingProductId, setPendingProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setWishlistProducts(products);
  }, [products]);

  async function handleToggleReserve(product: Product) {
    if (pendingProductId) return;

    const action: "reserve" | "unreserve" = product.reservedByCurrentGuest
      ? "unreserve"
      : "reserve";

    setPendingProductId(product.id);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, action }),
      });

      const data = await response
        .json()
        .catch(() => ({ ok: false, error: "Unable to update reservation." }));

      if (!response.ok || !data.ok) {
        if (data.error === "already_reserved") {
          setWishlistProducts((prev) =>
            prev.map((p) =>
              p.id === product.id
                ? {
                    ...p,
                    reservedByGuestId: data.reservedByGuestId ?? p.reservedByGuestId ?? null,
                    reservedByName: data.reservedByName ?? p.reservedByName ?? null,
                    reservedByCurrentGuest: false,
                  }
                : p
            )
          );

          const reservedByName: string | null =
            (data.reservedByName as string | null | undefined) ?? null;

          if (typeof window !== "undefined") {
            window.alert(
              reservedByName
                ? `Sorry, this item has just been reserved by ${reservedByName}.`
                : "Sorry, this item has just been reserved."
            );
          }
        } else if (typeof window !== "undefined") {
          const message =
            (data && typeof data.error === "string" && data.error) ||
            "Unable to update reservation. Please try again.";
          window.alert(message);
        }

        return;
      }

      setWishlistProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                reservedByGuestId:
                  (data.reservedByGuestId as string | null | undefined) ?? null,
                reservedByName:
                  (data.reservedByName as string | null | undefined) ?? null,
                reservedByCurrentGuest: Boolean(data.reservedByCurrentGuest),
              }
            : p
        )
      );
    } catch {
      if (typeof window !== "undefined") {
        window.alert("Unable to update reservation. Please try again.");
      }
    } finally {
      setPendingProductId(null);
    }
  }

  async function handleToggleSplit(product: Product) {
    if (pendingProductId) return;

    const splitByCurrentGuest = Boolean(product.splitByCurrentGuest);

    const action: "split" | "unsplit" = splitByCurrentGuest
      ? "unsplit"
      : "split";

    setPendingProductId(product.id);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, action }),
      });

      const data = await response
        .json()
        .catch(() => ({ ok: false, error: "Unable to update split." }));

      if (!response.ok || !data.ok) {
        if (data.error === "split_limit_reached") {
          if (typeof window !== "undefined") {
            window.alert(
              "This item already has the maximum number of people splitting it."
            );
          }
        } else if (data.error === "already_reserved") {
          if (typeof window !== "undefined") {
            window.alert(
              "Sorry, this item has been reserved and can no longer be split."
            );
          }
        } else if (typeof window !== "undefined") {
          const message =
            (data && typeof data.error === "string" && data.error) ||
            "Unable to update split. Please try again.";
          window.alert(message);
        }

        return;
      }

      setWishlistProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                reservedByGuestId:
                  (data.reservedByGuestId as string | null | undefined) ??
                  p.reservedByGuestId ??
                  null,
                reservedByName:
                  (data.reservedByName as string | null | undefined) ??
                  p.reservedByName ??
                  null,
                reservedByCurrentGuest:
                  typeof data.reservedByCurrentGuest === "boolean"
                    ? data.reservedByCurrentGuest
                    : p.reservedByCurrentGuest ?? false,
                splitByNames: Array.isArray(data.splitByNames)
                  ? (data.splitByNames as string[])
                  : p.splitByNames ?? [],
                splitByCurrentGuest:
                  typeof data.splitByCurrentGuest === "boolean"
                    ? data.splitByCurrentGuest
                    : p.splitByCurrentGuest ?? false,
                splitCount:
                  typeof data.splitCount === "number"
                    ? data.splitCount
                    : Array.isArray(data.splitByNames)
                    ? (data.splitByNames as unknown[]).length
                    : p.splitCount ?? 0,
              }
            : p
        )
      );
    } catch {
      if (typeof window !== "undefined") {
        window.alert("Unable to update split. Please try again.");
      }
    } finally {
      setPendingProductId(null);
    }
  }

  let banner: StaticImageData;
  let content: ReactNode;

  if (panel === "guestlist") {
    banner = bannerGuest;
    content = (
      <div className="space-y-4">
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
    );
  } else if (panel === "wishlist") {
    banner = bannerWishlist;
    content = (
      <div className="grid grid-cols-1 gap-4">
          {wishlistProducts.map((product) => {
            const image =
              (product.image_url &&
                productImageMap[product.image_url as string]) ||
              null;

            const hasPrice =
              typeof product.price === "number" && product.price > 0;
            const formattedPrice = hasPrice
              ? `£${product.price!.toFixed(2)}`
              : "NA";

            const href =
              product.link && product.link.trim().length > 0
                ? product.link.trim()
                : null;

            const isReserved =
              typeof product.reservedByGuestId === "string" &&
              product.reservedByGuestId.length > 0;

            const reservedByCurrentGuest = Boolean(
              product.reservedByCurrentGuest
            );

            const splitByNames = product.splitByNames ?? [];
            const splitByCurrentGuest = Boolean(
              product.splitByCurrentGuest
            );
            const splitCount =
              typeof product.splitCount === "number"
                ? product.splitCount
                : splitByNames.length;

            const reserveLabel = reservedByCurrentGuest
              ? "Unreserve"
              : isReserved
              ? `Reserved by ${product.reservedByName ?? "guest"}`
              : "Reserve";

            const reserveDisabled =
              pendingProductId === product.id ||
              isReserved ||
              splitCount > 0;

            const splitDisabled =
              pendingProductId === product.id ||
              isReserved ||
              (!splitByCurrentGuest && splitCount >= 3);

            const splitLabel = splitByCurrentGuest ? "Leave split" : "Split";

            const lockIcon = reservedByCurrentGuest
              ? "🔓"
              : isReserved
              ? "🔒"
              : null;

            const card = (
              <TextCard
                className="flex flex-col items-center gap-2 text-center text-sm"
                onClick={href ? () => window.open(href, "_blank") : undefined}
              >
                <div className="font-semibold">{product.name}</div>
                {image ? (
                  <div className="relative w-full">
                    <Image
                      src={image}
                      alt={product.name}
                      className="h-auto w-full object-contain"
                    />
                  </div>
                ) : null}
                <div className="mt-1 text-xs">
                  Price: <span className="font-medium">{formattedPrice}</span>
                </div>
                {splitByNames.length > 0 ? (
                  <div className="mt-1 text-[0.7rem] text-slate-500">
                    Split by:{" "}
                    <span className="font-semibold">
                      {splitByNames.join(", ")}
                    </span>
                  </div>
                ) : null}
                <div className="mt-2 flex w-full gap-2">
                  <button
                    type="button"
                    className="btn-pink flex-1 text-xs"
                    disabled={reserveDisabled}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (!reserveDisabled) {
                        void handleToggleReserve(product);
                      }
                    }}
                  >
                    {lockIcon ? (
                      <span aria-hidden="true" className="mr-1">
                        {lockIcon}
                      </span>
                    ) : null}
                    <span>{reserveLabel}</span>
                  </button>
                  <button
                    type="button"
                    className="btn-pink flex-1 text-xs"
                    disabled={splitDisabled}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (!splitDisabled) {
                        void handleToggleSplit(product);
                      }
                    }}
                  >
                    {splitLabel}
                  </button>
                </div>
              </TextCard>
            );

            return (
              <div key={product.id}>
                {card}
              </div>
            );
          })}
      </div>
    );
  } else {
    banner = bannerGuide;
    content = (
      <a
        href="/guide.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block h-full w-full"
      >
        <div className="relative h-full w-full">
          <Image
            src={pageGuide}
            alt="Open guide"
            className="h-full w-full rounded-3xl object-contain"
            priority
          />
        </div>
      </a>
    );
  }

  return (
    <div className="flex max-h-[46rem] flex-col">
      <div className="relative flex w-full justify-center">
        <Image
          src={banner}
          alt="Banner"
          className="w-full rounded-3xl object-cover"
          priority
        />
      </div>
      <div className="mt-4 flex-1 min-h-0 overflow-y-auto pr-1">
        {content}
      </div>
    </div>
  );
}
