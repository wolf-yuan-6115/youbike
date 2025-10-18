import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { supabase } from "../lib/supabase.js";
import { StationSchema, ErrorSchema } from "../schemas/index.js";

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

const getAllStationsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Stations"],
  summary: "Get all stations",
  description: "List of all stations",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(StationSchema),
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

const getStationByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Stations"],
  summary: "Get station by ID",
  description: "Station details",
  request: {
    params: ParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: StationSchema,
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

export const stationsRoutes = new OpenAPIHono()
  .openapi(getAllStationsRoute, async (c) => {
    const { data, error } = await supabase.from("stations").select("*");

    if (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
    return c.json(data, 200);
  })
  .openapi(getStationByIdRoute, async (c) => {
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
