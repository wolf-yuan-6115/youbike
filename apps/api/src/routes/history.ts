import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { supabase } from "../lib/supabase";
import {
  HistorySchema,
  ErrorSchema,
  IdParamSchema,
  LimitQuerySchema,
} from "../schemas";

const app = new OpenAPIHono();

const getHistoryByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["History"],
  summary: "Get history by station ID",
  request: {
    params: IdParamSchema,
    query: LimitQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(HistorySchema),
        },
      },
      description: "List of historical data for the station",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Invalid station ID or limit",
    },
    500: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Internal server error",
    },
  },
});

app.openapi(getHistoryByIdRoute, async (c) => {
  const { id } = c.req.valid("param");
  const { limit } = c.req.valid("query");

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
    return c.json({ error: "Internal server error" }, 500);
  }
  return c.json(data, 200);
});

export default app;
