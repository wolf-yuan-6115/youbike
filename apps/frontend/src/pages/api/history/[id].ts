import { supabase } from "@lib/supabase.ts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, params }) => {
  const { id } = params;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  if (!id) return new Response(null, { status: 400 });
  if (!/^\d+$/.test(id)) return new Response(null, { status: 400 });

  const limit = searchParams.get("limit");
  const pendingQuery = supabase
    .from("history")
    .select("*")
    .eq("station_id", parseInt(id))
    .order("at", { ascending: false });

  if (limit) {
    if (!/^\d+$/.test(limit))
      return new Response(null, { status: 400 });

    pendingQuery.limit(parseInt(limit));
  }

  const { data, error } = await pendingQuery;

  if (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
