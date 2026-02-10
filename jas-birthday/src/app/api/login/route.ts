import { NextResponse, type NextRequest } from "next/server";
import { authenticateGuest } from "@/lib/auth";
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
} from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { username, password } = body as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    return NextResponse.json(
      { ok: false, error: "Missing username or password." },
      { status: 400 }
    );
  }

  try {
    const guest = await authenticateGuest(username, password);

    if (!guest) {
      return NextResponse.json(
        { ok: false, error: "Invalid name or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(guest.id);
    const response = NextResponse.json({ ok: true });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to log in right now." },
      { status: 500 }
    );
  }
}

