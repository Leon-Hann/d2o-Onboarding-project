import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS and can call the Admin API
// (auth.admin.listUsers, etc). NEVER import this from client components or
// expose SUPABASE_SERVICE_ROLE_KEY to the browser - server-only code
// (Route Handlers, scripts) only.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
