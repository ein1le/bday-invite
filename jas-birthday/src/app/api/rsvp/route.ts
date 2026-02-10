import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { updateGuestRsvp } from "@/lib/guests";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!cookie) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated." },
      { status: 401 }
    );
  }

  const payload = await verifySessionToken(cookie);

  if (!payload?.guestId) {
    return NextResponse.json(
      { ok: false, error: "Invalid session." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { isAttending } = body as {
    isAttending?: boolean;
  };

  if (typeof isAttending !== "boolean") {
    return NextResponse.json(
      { ok: false, error: "Missing RSVP selection." },
      { status: 400 }
    );
  }

  try {
    await updateGuestRsvp(payload.guestId, isAttending);

    const nextPath = isAttending ? "/attending" : "/not-attending";

    return NextResponse.json({ ok: true, nextPath });
  } catch (error) {
    console.error("RSVP update error:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to save your RSVP." },
      { status: 500 }
    );
  }
}

