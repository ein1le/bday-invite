import { cookies } from "next/headers";
import { getGuestById } from "./guests";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";

export async function getCurrentGuestId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = await verifySessionToken(token);
  return payload?.guestId ?? null;
}

export async function getCurrentGuest() {
  const guestId = await getCurrentGuestId();
  if (!guestId) return null;

  return getGuestById(guestId);
}
