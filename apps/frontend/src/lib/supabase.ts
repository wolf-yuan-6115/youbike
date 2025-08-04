import { createClient } from "@supabase/supabase-js";
import type { Database } from "@typing/database.types";

export const supabase = createClient<Database>(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_PUBLISHABLE,
);
