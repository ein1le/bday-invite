import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE_NAME = "guest_session";

type SessionPayload = {
  guestId: string;
};

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET must be set in the environment for session handling."
    );
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(guestId: string): Promise<string> {
  const secret = getSessionSecret();

  return new SignJWT({ guestId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const secret = getSessionSecret();
    const { payload } = await jwtVerify<SessionPayload>(token, secret);

    if (!payload.guestId || typeof payload.guestId !== "string") {
      return null;
    }

    return { guestId: payload.guestId };
  } catch {
    return null;
  }
}

