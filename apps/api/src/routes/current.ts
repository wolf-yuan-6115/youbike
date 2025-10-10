import { Elysia, t } from "elysia";
import { supabase } from "../lib/supabase";
import {
  CurrentSchema,
  CurrentWithStationSchema,
  ErrorSchema,
} from "../schemas";

export const currentRoutes = new Elysia({ prefix: "/api/current" })
  .get(
    "/",
    async () => {
      const { data, error } = await supabase.from("current").select("*");

      if (error) {
        console.error(error);
        return { error: "Internal server error" };
      }
      return data;
    },
    {
      detail: {
        tags: ["Current"],
        summary: "Get all current station data",
        description: "List of all current station data",
      },
      response: {
        200: t.Array(CurrentSchema),
        500: ErrorSchema,
      },
    },
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const { id } = params;

      const { data, error } = await supabase
        .from("current")
        .select("*, station_id(*)")
        .eq("station_id", parseInt(id))
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          set.status = 404;
          return { error: "Current data not found" };
        }
        console.error(error);
        set.status = 500;
        return { error: "Internal server error" };
      }
      return data;
    },
    {
      detail: {
        tags: ["Current"],
        summary: "Get current data by station ID",
        description: "Current station data with station details",
      },
      params: t.Object({
        id: t.String({
          pattern: "^\\d+$",
          description: "Station ID",
          examples: ["500306017"],
        }),
      }),
      response: {
        200: CurrentWithStationSchema,
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
  );
