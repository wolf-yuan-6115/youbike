import { createClient } from "@supabase/supabase-js";
import type { Database } from "../typing/database.types";

const isRunningOnBun = typeof Bun !== "undefined";

const SUPABASE_URL = isRunningOnBun
  ? Bun.env.SUPABASE_URL
  : process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE = isRunningOnBun
  ? Bun.env.SUPABASE_PUBLISHABLE
  : process.env.SUPABASE_PUBLISHABLE;

export const supabase = createClient<Database>(
  SUPABASE_URL!,
  SUPABASE_PUBLISHABLE!,
);
