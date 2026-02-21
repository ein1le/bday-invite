import { getServiceClient } from "./supabase";

export type Guest = {
  id: string;
  username: string;
  display_name: string;
  is_attending: boolean | null;
};

export type PublicGuest = {
  username: string;
  displayName: string;
};

export type GuestWithResponse = {
  id: string;
  displayName: string;
  isAttending: boolean;
};

export async function getAllGuestsForLogin(): Promise<PublicGuest[]> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("guests")
    .select("username, display_name")
    .order("display_name", { ascending: true });

  if (error) {
    console.error("Error fetching guests for login:", error);
    throw new Error("Unable to load guest list.");
  }

  return (
    data?.map((row) => ({
      username: row.username,
      displayName: row.display_name,
    })) ?? []
  );
}

export async function getGuestById(id: string): Promise<Guest | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("guests")
    .select("id, username, display_name, is_attending")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching guest by id:", error);
    throw new Error("Unable to load guest.");
  }

  return data as Guest | null;
}

export async function updateGuestRsvp(
  guestId: string,
  isAttending: boolean
): Promise<void> {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from("guests")
    .update({
      is_attending: isAttending,
      responded_at: new Date().toISOString(),
    })
    .eq("id", guestId);

  if (error) {
    console.error("Error updating RSVP:", error);
    throw new Error("Unable to update RSVP.");
  }
}

export async function getGuestsWithResponses(): Promise<GuestWithResponse[]> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("guests")
    .select("id, display_name, is_attending")
    .not("is_attending", "is", null)
    .order("display_name", { ascending: true });

  if (error) {
    console.error("Error fetching guests with responses:", error);
    throw new Error("Unable to load guest responses.");
  }

  return (
    data?.map((row) => ({
      id: row.id as string,
      displayName: row.display_name as string,
      isAttending: Boolean(row.is_attending),
    })) ?? []
  );
}
