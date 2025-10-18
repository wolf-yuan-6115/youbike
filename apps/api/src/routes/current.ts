import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { supabase } from "../lib/supabase.js";
import {
  CurrentSchema,
  CurrentWithStationSchema,
  ErrorSchema,
} from "../schemas/index.js";

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

const getAllCurrentRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Current"],
  summary: "Get all current station data",
  description: "List of all current station data",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(CurrentSchema),
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

const getCurrentByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Current"],
  summary: "Get current data by station ID",
  description: "Current station data with station details",
  request: {
    params: ParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CurrentWithStationSchema,
        },
      },
      description: "Successful response",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Current data not found",
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

export const currentRoutes = new OpenAPIHono()
  .openapi(getAllCurrentRoute, async (c) => {
    const { data, error } = await supabase.from("current").select("*");

    if (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
    return c.json(data, 200);
  })
  .openapi(getCurrentByIdRoute, async (c) => {
    const { id } = c.req.valid("param");

    const { data, error } = await supabase
      .from("current")
      .select("*, station_id(*)")
      .eq("station_id", parseInt(id))
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Current data not found" }, 404);
      }
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
    return c.json(data, 200);
  });
