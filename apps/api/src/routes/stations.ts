import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { supabase } from "../lib/supabase";
import { StationSchema, ErrorSchema, IdParamSchema } from "../schemas";

const app = new OpenAPIHono();

const getAllStationsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Stations"],
  summary: "Get all stations",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(StationSchema),
        },
      },
      description: "List of all stations",
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

app.openapi(getAllStationsRoute, async (c) => {
  const { data, error } = await supabase.from("stations").select("*");

  if (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
  return c.json(data, 200);
});

const getStationByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Stations"],
  summary: "Get station by ID",
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: StationSchema,
        },
      },
      description: "Station details",
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
      description: "Station not found",
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

app.openapi(getStationByIdRoute, async (c) => {
  const { id } = c.req.valid("param");

  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return c.json({ error: "Station not found" }, 404);
    }
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
  return c.json(data, 200);
});

export default app;
