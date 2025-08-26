import { supabase } from "@lib/supabase.ts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) return new Response(null, { status: 400 });
  if (!/^\d+$/.test(id)) return new Response(null, { status: 400 });

  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error) {
    // Not sure why, but Supabase just throw error when no rows found with .single()
    if (error.code === "PGRST116") {
      return new Response(null, { status: 404 });
    }

    console.error(error);
    return new Response(null, { status: 500 });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
