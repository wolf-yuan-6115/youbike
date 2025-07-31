import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

interface Env {
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE: string;
}

export function createSupabaseClient(env: Env) {
  return createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE,
  );
}
