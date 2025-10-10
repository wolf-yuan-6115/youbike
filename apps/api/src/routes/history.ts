import { Elysia, t } from "elysia";
import { supabase } from "../lib/supabase";
import { HistorySchema, ErrorSchema } from "../schemas";

export const historyRoutes = new Elysia({ prefix: "/history" }).get(
  "/:id",
  async ({ params, query, set }) => {
    const { id } = params;
    const { limit } = query;

    let pendingQuery = supabase
      .from("history")
      .select("*")
      .eq("station_id", parseInt(id))
      .order("at", { ascending: false });

    if (limit) {
      pendingQuery = pendingQuery.limit(parseInt(limit));
    }

    const { data, error } = await pendingQuery;

    if (error) {
      console.error(error);
      set.status = 500;
      return { error: "Internal server error" };
    }
    return data;
  },
  {
    detail: {
      tags: ["History"],
      summary: "Get history by station ID",
      description: "List of historical data for the station",
    },
    params: t.Object({
      id: t.String({
        pattern: "^\\d+$",
        description: "Station ID",
        examples: ["500306017"],
      }),
    }),
    query: t.Object({
      limit: t.Optional(
        t.String({
          pattern: "^\\d+$",
          description: "Limit the results",
          examples: "10",
        }),
      ),
    }),
    response: {
      200: t.Array(HistorySchema),
      400: ErrorSchema,
      500: ErrorSchema,
    },
  },
);
