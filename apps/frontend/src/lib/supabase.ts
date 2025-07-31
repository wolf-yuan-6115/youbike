import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE, SUPABASE_URL } from "astro:env/server";
import type { Database } from "./database.types";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE,
);
