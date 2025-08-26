import { supabase } from "@lib/supabase.ts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const { data, error } = await supabase.from("stations").select("*");

  if (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
