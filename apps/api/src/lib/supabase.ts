import { createClient } from "@supabase/supabase-js";
import type { Database } from "../typing/database.types";

export const supabase = createClient<Database>(
  Bun.env.SUPABASE_URL || "",
  Bun.env.SUPABASE_PUBLISHABLE || "",
);
