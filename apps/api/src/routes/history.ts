import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { supabase } from "../lib/supabase.js";
import { HistorySchema, ErrorSchema } from "../schemas/index.js";

const ParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Station ID must be numeric")
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "500306017",
    }),
});

const QuerySchema = z.object({
  limit: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .openapi({
      param: {
        name: "limit",
        in: "query",
      },
      example: "10",
    }),
});

const getHistoryByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["History"],
  summary: "Get history by station ID",
  description: "List of historical data for the station",
  request: {
    params: ParamSchema,
    query: QuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(HistorySchema),
        },
      },
      description: "Successful response",
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

export const historyRoutes = new OpenAPIHono().openapi(
  getHistoryByIdRoute,
  async (c) => {
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
  },
);
