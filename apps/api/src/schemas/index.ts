import { z } from "@hono/zod-openapi";

export const StationStatusSchema = z
  .enum(["NORMAL", "EMPTY", "FULL"])
  .openapi("StationStatus");

export const BikeTypeSchema = z
  .object({
    yb2: z.number().int().describe("YouBike 2.0"),
    eyb: z.number().int().describe("Electric YouBike (2.0E)"),
  })
  .openapi("BikeType");

export const StationSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
    total: z.string(),
    name_en: z.string(),
    address_en: z.string(),
  })
  .openapi("StationInfo");

export const CurrentSchema = z
  .object({
    station_id: z.number().int(),
    unavailable: z.number().int(),
    success: z.number().int(),
    update: z.string(),
    bikes: z.number().int(),
    slots: z.number().int(),
    full: z.number().int(),
    status: StationStatusSchema,
    types: BikeTypeSchema,
  })
  .openapi("RealtimeRecord");

export const CurrentWithStationSchema = z
  .object({
    station_id: StationSchema,
    unavailable: z.number().int(),
    success: z.number().int(),
    update: z.string(),
    bikes: z.number().int(),
    slots: z.number().int(),
    full: z.number().int(),
    status: StationStatusSchema,
    types: BikeTypeSchema,
  })
  .openapi("RealtimeRecordWithInfo");

export const HistorySchema = z
  .object({
    id: z.string(),
    station_id: z.number().int(),
    available: z.number().int(),
    empty: z.number().int(),
    at: z.string(),
    types: BikeTypeSchema,
  })
  .openapi("HistoryRecord");

export const ErrorSchema = z
  .object({
    error: z.string(),
  })
  .openapi("Error");

export const IdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a number")
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1",
    }),
});

export const LimitQuerySchema = z.object({
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .optional()
    .openapi({
      param: {
        name: "limit",
        in: "query",
      },
      example: "10",
      description: "Limit the results",
    }),
});
