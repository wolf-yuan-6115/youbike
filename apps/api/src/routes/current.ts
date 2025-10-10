import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { supabase } from "../lib/supabase";
import {
  CurrentSchema,
  CurrentWithStationSchema,
  ErrorSchema,
  IdParamSchema,
} from "../schemas";

const app = new OpenAPIHono();

const getAllCurrentRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Current"],
  summary: "Get all current station data",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(CurrentSchema),
        },
      },
      description: "List of all current station data",
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

app.openapi(getAllCurrentRoute, async (c) => {
  const { data, error } = await supabase.from("current").select("*");

  if (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
  return c.json(data, 200);
});

const getCurrentByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Current"],
  summary: "Get current data by station ID",
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CurrentWithStationSchema,
        },
      },
      description: "Current station data with station details",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Invalid station ID",
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

app.openapi(getCurrentByIdRoute, async (c) => {
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

export default app;
