import { getCurrentGuest } from "@/lib/current-guest";
import { getGuestsWithResponses } from "@/lib/guests";
import { getProductsWithReservationState } from "@/lib/products";
import { NotAttendingOverlayView } from "./NotAttendingOverlayView";

export const dynamic = "force-dynamic";

export default async function NotAttendingPage() {
  const guest = await getCurrentGuest();
  const guestId = guest?.id ?? null;
  const [guests, products] = await Promise.all([
    getGuestsWithResponses(),
    getProductsWithReservationState(guestId),
  ]);

  const name =
    guest?.display_name?.split(" ")[0] ??
    guest?.display_name ??
    "Friend";

  return (
    <NotAttendingOverlayView
      name={name}
      guests={guests}
      products={products}
    />
  );
}
