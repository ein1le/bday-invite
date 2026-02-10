import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serviceClient: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (serviceClient) return serviceClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
    );
  }

  serviceClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  return serviceClient;
}

