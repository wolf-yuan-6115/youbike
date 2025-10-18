import { z } from "@hono/zod-openapi";

export const StationStatusSchema = z.enum(["NORMAL", "EMPTY", "FULL"]).openapi({
  description: "Station status indicating availability",
  example: "NORMAL",
});

export const StationSchema = z
  .object({
    id: z.number().openapi({
      description: "Unique station identifier",
      example: 500306017,
    }),
    name: z.string().openapi({
      description: "Station name in Chinese",
      example: "桃園火車站(前站)",
    }),
    lat: z.number().openapi({
      description: "Latitude coordinate",
      example: 24.98962,
    }),
    lng: z.number().openapi({
      description: "Longitude coordinate",
      example: 121.31302,
    }),
    address: z.string().openapi({
      description: "Station address in Chinese",
      example: "桃園市桃園區中正路1號面火車站右方人行道",
    }),
    total: z.number().openapi({
      description: "Total number of bike slots",
      example: 66,
    }),
    name_en: z.string().openapi({
      description: "Station name in English",
      example: "TRA Taoyuan Station (Front)",
    }),
    address_en: z.string().openapi({
      description: "Station address in English",
      example: "No.1, Zhongzheng Rd., Taoyuan Dist., Taoyuan City",
    }),
  })
  .openapi("Station");

export const CurrentSchema = z
  .object({
    station_id: z.number().openapi({
      description: "Station identifier",
      example: 500306017,
    }),
    unavailable: z.number().openapi({
      description:
        "How many times the station has been marked no bikes available",
      example: 10000,
    }),
    full: z.number().openapi({
      description: "How many times the station has been marked full",
      example: 0,
    }),
    success: z.number().openapi({
      description:
        "How many times the station has successfully logged into the system",
      example: 1,
    }),
    update: z.string().openapi({
      description: "Last update timestamp",
      example: "2025-10-18T12:00:00Z",
    }),
    bikes: z.number().openapi({
      description: "Number of bikes currently available",
      example: 15,
    }),
    slots: z.number().openapi({
      description: "Number of return bike slots currently available",
      example: 25,
    }),
    status: StationStatusSchema,
    types: z.any().openapi({
      description: "Bike types available, a JSON object",
    }),
  })
  .openapi("Current");

export const CurrentWithStationSchema = z
  .object({
    station_id: z.object({
      id: z.number(),
      name: z.string(),
      lat: z.number(),
      lng: z.number(),
      address: z.string(),
      total: z.number(),
      name_en: z.string(),
      address_en: z.string(),
    }),
    unavailable: z.number().openapi({
      description:
        "How many times the station has been marked no bikes available",
      example: 2,
    }),
    full: z.number().openapi({
      description: "How many times the station has been marked full",
      example: 0,
    }),
    success: z.number().openapi({
      description:
        "How many times the station has successfully logged into the system",
      example: 1,
    }),
    update: z.string().openapi({
      description: "Last update timestamp",
      example: "2025-10-18T12:00:00Z",
    }),
    bikes: z.number().openapi({
      description: "Number of bikes currently available",
      example: 15,
    }),
    slots: z.number().openapi({
      description: "Number of return bike slots currently available",
      example: 25,
    }),
    status: StationStatusSchema,
    types: z.any().openapi({
      description: "Bike types available, a JSON object",
    }),
  })
  .openapi("CurrentWithStation");

export const HistorySchema = z
  .object({
    id: z.string().openapi({
      description: "Unique history record identifier",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    station_id: z.number().openapi({
      description: "Station identifier",
      example: 500306017,
    }),
    available: z.number().openapi({
      description: "Number of available bikes at that time",
      example: 15,
    }),
    empty: z.number().openapi({
      description: "Number of empty slots at that time",
      example: 25,
    }),
    at: z.string().openapi({
      description: "Timestamp of the record",
      example: "2025-10-18T12:00:00Z",
    }),
    types: z.any().openapi({
      description: "Bike types available, a JSON object",
    }),
  })
  .openapi("History");

export const ErrorSchema = z
  .object({
    error: z.string().openapi({
      description: "Error message",
      example: "Internal server error",
    }),
  })
  .openapi("Error");
