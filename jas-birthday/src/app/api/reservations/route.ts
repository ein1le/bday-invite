import { NextResponse, type NextRequest } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export const runtime = "nodejs";

type ReservationAction = "reserve" | "unreserve" | "split" | "unsplit";

type RequestBody = {
  productId?: string;
  action?: ReservationAction;
};

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

  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { productId, action } = body;

  if (
    !productId ||
    (action !== "reserve" &&
      action !== "unreserve" &&
      action !== "split" &&
      action !== "unsplit")
  ) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid reservation action." },
      { status: 400 }
    );
  }

  const supabase = getServiceClient();

  if (action === "reserve") {
    const { data: existingRows, error: existingError } = await supabase
      .from("reservations")
      .select("id, guest_id, type")
      .eq("product_id", productId);

    if (existingError) {
      console.error("Error checking existing reservation:", existingError);
      return NextResponse.json(
        { ok: false, error: "Unable to check reservation status." },
        { status: 500 }
      );
    }

    const existingSingle = existingRows?.find(
      (row) => row.type === "single"
    ) ?? null;

    const existingSplit = (existingRows ?? []).filter(
      (row) => row.type === "split"
    );

    if (existingSingle && existingSingle.guest_id !== payload.guestId) {
      const reservedByGuestId = existingSingle.guest_id as string;

      let reservedByName: string | null = null;

      if (reservedByGuestId) {
        const { data: guestRow } = await supabase
          .from("guests")
          .select("display_name")
          .eq("id", reservedByGuestId)
          .maybeSingle();

        reservedByName =
          (guestRow?.display_name as string | undefined) ?? null;
      }

      return NextResponse.json(
        {
          ok: false,
          error: "already_reserved",
          productId,
          reservedByGuestId,
          reservedByName,
        },
        { status: 409 }
      );
    }

    if (!existingSingle && existingSplit.length > 0) {
      const splitGuestIds = existingSplit
        .map((row) => row.guest_id as string | undefined)
        .filter((id): id is string => Boolean(id));

      let splitNames: string[] = [];

      if (splitGuestIds.length > 0) {
        const { data: guestRows } = await supabase
          .from("guests")
          .select("id, display_name")
          .in("id", splitGuestIds);

        const nameMap = new Map<string, string>();

        (guestRows ?? []).forEach((row) => {
          if (row.id) {
            nameMap.set(
              row.id as string,
              (row.display_name as string | undefined) ?? ""
            );
          }
        });

        splitNames = splitGuestIds
          .map((id) => nameMap.get(id))
          .filter((name): name is string => Boolean(name));
      }

      return NextResponse.json(
        {
          ok: false,
          error: "already_split",
          productId,
          splitByNames: splitNames,
        },
        { status: 409 }
      );
    }

    if (!existingSingle) {
      const { error: insertError } = await supabase
        .from("reservations")
        .insert({
          product_id: productId,
          guest_id: payload.guestId,
          type: "single",
        });

      if (insertError) {
        console.error("Error creating reservation:", insertError);
        return NextResponse.json(
          { ok: false, error: "Unable to reserve this item." },
          { status: 500 }
        );
      }
    }
  } else if (action === "unreserve") {
    const { error: deleteError } = await supabase
      .from("reservations")
      .delete()
      .eq("product_id", productId)
      .eq("guest_id", payload.guestId)
      .eq("type", "single");

    if (deleteError) {
      console.error("Error removing reservation:", deleteError);
      return NextResponse.json(
        { ok: false, error: "Unable to remove your reservation." },
        { status: 500 }
      );
    }
  } else if (action === "split") {
    const { data: existingRows, error: existingError } = await supabase
      .from("reservations")
      .select("id, guest_id, type")
      .eq("product_id", productId);

    if (existingError) {
      console.error("Error checking existing split reservations:", existingError);
      return NextResponse.json(
        { ok: false, error: "Unable to check split status." },
        { status: 500 }
      );
    }

    const singleReservation =
      existingRows?.find((row) => row.type === "single") ?? null;

    const splitReservations =
      existingRows?.filter((row) => row.type === "split") ?? [];

    const splitRowForGuest = splitReservations.find(
      (row) => row.guest_id === payload.guestId
    );

    const splitCount = splitReservations.length;

    if (singleReservation && singleReservation.guest_id !== payload.guestId) {
      const reservedByGuestId = singleReservation.guest_id as string;

      let reservedByName: string | null = null;

      if (reservedByGuestId) {
        const { data: guestRow } = await supabase
          .from("guests")
          .select("display_name")
          .eq("id", reservedByGuestId)
          .maybeSingle();

        reservedByName =
          (guestRow?.display_name as string | undefined) ?? null;
      }

      return NextResponse.json(
        {
          ok: false,
          error: "already_reserved",
          productId,
          reservedByGuestId,
          reservedByName,
        },
        { status: 409 }
      );
    }

    if (!splitRowForGuest && splitCount >= 3) {
      return NextResponse.json(
        {
          ok: false,
          error: "split_limit_reached",
          productId,
        },
        { status: 409 }
      );
    }

    if (!splitRowForGuest) {
      const { error: insertError } = await supabase
        .from("reservations")
        .insert({
          product_id: productId,
          guest_id: payload.guestId,
          type: "split",
        });

      if (insertError) {
        console.error("Error creating split reservation:", insertError);
        return NextResponse.json(
          { ok: false, error: "Unable to join this split." },
          { status: 500 }
        );
      }
    }
  } else if (action === "unsplit") {
    const { error: deleteError } = await supabase
      .from("reservations")
      .delete()
      .eq("product_id", productId)
      .eq("guest_id", payload.guestId)
      .eq("type", "split");

    if (deleteError) {
      console.error("Error removing split reservation:", deleteError);
      return NextResponse.json(
        { ok: false, error: "Unable to leave this split." },
        { status: 500 }
      );
    }
  }

  const { data: currentRows, error: currentError } = await supabase
    .from("reservations")
    .select("guest_id, type")
    .eq("product_id", productId);

  if (currentError) {
    console.error("Error fetching reservation status:", currentError);
    return NextResponse.json(
      { ok: false, error: "Unable to load reservation status." },
      { status: 500 }
    );
  }

  const singleReservation =
    currentRows?.find((row) => row.type === "single") ?? null;

  const splitReservations =
    currentRows?.filter((row) => row.type === "split") ?? [];

  const reservedByGuestId =
    (singleReservation?.guest_id as string | undefined) ?? null;

  const splitGuestIds = splitReservations
    .map((row) => row.guest_id as string | undefined)
    .filter((id): id is string => Boolean(id));

  const allIds = new Set<string>();
  if (reservedByGuestId) allIds.add(reservedByGuestId);
  splitGuestIds.forEach((id) => allIds.add(id));

  let reservedByName: string | null = null;
  let splitByNames: string[] = [];

  if (allIds.size > 0) {
    const { data: guestRows } = await supabase
      .from("guests")
      .select("id, display_name")
      .in("id", Array.from(allIds));

    const nameMap = new Map<string, string>();

    (guestRows ?? []).forEach((row) => {
      if (row.id) {
        nameMap.set(
          row.id as string,
          (row.display_name as string | undefined) ?? ""
        );
      }
    });

    if (reservedByGuestId) {
      reservedByName = nameMap.get(reservedByGuestId) ?? null;
    }

    splitByNames = splitGuestIds
      .map((id) => nameMap.get(id))
      .filter((name): name is string => Boolean(name));
  }

  const reservedByCurrentGuest =
    Boolean(reservedByGuestId) && reservedByGuestId === payload.guestId;

  return NextResponse.json({
    ok: true,
    productId,
    reservedByGuestId,
    reservedByName,
    reservedByCurrentGuest,
    splitByNames,
    splitByCurrentGuest: splitGuestIds.includes(payload.guestId),
    splitCount: splitGuestIds.length,
  });
}
