import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types.ts";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error("Supabase connection information not provided");
  process.exit(1);
}

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);
