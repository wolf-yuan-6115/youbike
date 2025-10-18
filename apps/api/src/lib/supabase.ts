import { createClient } from "@supabase/supabase-js";
import type { Database } from "../typing/database.types";

let SUPABASE_URL = Bun ? Bun.env.SUPABASE_URL : process.env.SUPABASE_URL;
let SUPABASE_PUBLISHABLE = Bun
  ? Bun.env.SUPABASE_PUBLISHABLE
  : process.env.SUPABASE_PUBLISHABLE;

export const supabase = createClient<Database>(
  SUPABASE_URL!,
  SUPABASE_PUBLISHABLE!,
);
