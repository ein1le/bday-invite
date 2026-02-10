import { compare } from "bcryptjs";
import { getServiceClient } from "./supabase";

type GuestAuthRecord = {
  id: string;
  username: string;
  display_name: string;
  password_hash: string;
  is_attending: boolean | null;
};

export type AuthenticatedGuest = {
  id: string;
  displayName: string;
  isAttending: boolean | null;
};

export async function authenticateGuest(
  username: string,
  password: string
): Promise<AuthenticatedGuest | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("guests")
    .select("id, username, display_name, password_hash, is_attending")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    console.error("Error during guest authentication:", error);
    throw new Error("Unable to authenticate guest.");
  }

  const record = data as GuestAuthRecord | null;

  if (!record) {
    return null;
  }

  const isValid = await compare(password, record.password_hash);
  if (!isValid) {
    return null;
  }

  return {
    id: record.id,
    displayName: record.display_name,
    isAttending: record.is_attending,
  };
}

