import { getServiceClient } from "./supabase";

export type Product = {
  id: string;
  name: string;
  image_url: string | null;
  link: string | null;
  price: number | null;
  reservedByGuestId?: string | null;
  reservedByName?: string | null;
  reservedByCurrentGuest?: boolean;
  splitByNames?: string[];
  splitByCurrentGuest?: boolean;
  splitCount?: number;
};

export async function getAllProducts(): Promise<Product[]> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, image_url, link, price")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error("Unable to load wishlist.");
  }

  return (data ?? []).map((row: any) => ({
    id: row.id as string,
    name: row.name as string,
    image_url: (row.image_url as string | null) ?? null,
    link: (row.link as string | null) ?? null,
    price:
      typeof row.price === "number" ? (row.price as number) : null,
    reservedByGuestId: null,
    reservedByName: null,
    reservedByCurrentGuest: false,
  }));
}

export async function getProductsWithReservationState(
  currentGuestId: string | null
): Promise<Product[]> {
  const supabase = getServiceClient();

  const { data: productRows, error: productError } = await supabase
    .from("products")
    .select("id, name, image_url, link, price")
    .order("name", { ascending: true });

  if (productError) {
    console.error("Error fetching products with reservations:", productError);
    throw new Error("Unable to load wishlist.");
  }

  const { data: reservationRows, error: reservationError } = await supabase
    .from("reservations")
    .select("product_id, guest_id, type");

  if (reservationError) {
    console.error("Error fetching reservations:", reservationError);
    throw new Error("Unable to load wishlist.");
  }

  const singleByProduct = new Map<string, string>();
  const splitByProduct = new Map<string, string[]>();

  (reservationRows ?? []).forEach((row: any) => {
    const productId = row.product_id as string | undefined;
    const guestId = row.guest_id as string | undefined;
    const type = row.type as string | undefined;

    if (!productId || !guestId || !type) return;

    if (type === "single") {
      if (!singleByProduct.has(productId)) {
        singleByProduct.set(productId, guestId);
      }
    } else if (type === "split") {
      const existing = splitByProduct.get(productId) ?? [];
      if (!existing.includes(guestId)) {
        existing.push(guestId);
        splitByProduct.set(productId, existing);
      }
    }
  });

  const guestIds = Array.from(
    new Set([
      ...Array.from(singleByProduct.values()),
      ...Array.from(splitByProduct.values()).flat(),
    ])
  );

  let guestDisplayNames = new Map<string, string>();

  if (guestIds.length > 0) {
    const { data: guestRows, error: guestsError } = await supabase
      .from("guests")
      .select("id, display_name")
      .in("id", guestIds);

    if (guestsError) {
      console.error("Error fetching guest names:", guestsError);
      throw new Error("Unable to load wishlist.");
    }

    guestDisplayNames = new Map(
      (guestRows ?? []).map((row: any) => [
        row.id as string,
        (row.display_name as string) ?? "",
      ])
    );
  }

  return (productRows ?? []).map((row: any) => {
    const basePrice =
      typeof row.price === "number"
        ? (row.price as number)
        : row.price === null || typeof row.price === "undefined"
        ? null
        : Number(row.price) || null;

    const productId = row.id as string;

    const reservedByGuestId = singleByProduct.get(productId) ?? null;
    const reservedByName =
      (reservedByGuestId && guestDisplayNames.get(reservedByGuestId)) ?? null;

    const reservedByCurrentGuest =
      Boolean(reservedByGuestId) &&
      Boolean(currentGuestId) &&
      reservedByGuestId === currentGuestId;

    const splitGuestIds = splitByProduct.get(productId) ?? [];
    const splitByNames =
      splitGuestIds.length > 0
        ? splitGuestIds
            .map((id) => guestDisplayNames.get(id))
            .filter((name): name is string => Boolean(name))
        : [];

    const splitByCurrentGuest =
      Boolean(currentGuestId) && splitGuestIds.includes(currentGuestId);

    const splitCount = splitGuestIds.length;

    return {
      id: row.id as string,
      name: row.name as string,
      image_url: (row.image_url as string | null) ?? null,
      link: (row.link as string | null) ?? null,
      price: basePrice,
      reservedByGuestId,
      reservedByName,
      reservedByCurrentGuest,
      splitByNames,
      splitByCurrentGuest,
      splitCount,
    };
  });
}
