import { Elysia, t } from "elysia";
import { supabase } from "../lib/supabase";
import { StationSchema, ErrorSchema } from "../schemas";

export const stationsRoutes = new Elysia({ prefix: "/stations" })
  .get(
    "/",
    async () => {
      const { data, error } = await supabase.from("stations").select("*");

      if (error) {
        console.error(error);
        return { error: "Internal server error" };
      }
      return data;
    },
    {
      detail: {
        tags: ["Stations"],
        summary: "Get all stations",
        description: "List of all stations",
      },
      response: {
        200: t.Array(StationSchema),
        500: ErrorSchema,
      },
    },
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const { id } = params;

      const { data, error } = await supabase
        .from("stations")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          set.status = 404;
          return { error: "Station not found" };
        }
        console.error(error);
        set.status = 500;
        return { error: "Internal server error" };
      }
      return data;
    },
    {
      detail: {
        tags: ["Stations"],
        summary: "Get station by ID",
        description: "Station details",
      },
      params: t.Object({
        id: t.String({
          pattern: "^\\d+$",
          description: "Station ID",
          examples: "500306017",
        }),
      }),
      response: {
        200: StationSchema,
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
  );
