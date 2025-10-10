import { t } from "elysia";

export const StationStatusSchema = t.Union([
  t.Literal("NORMAL"),
  t.Literal("EMPTY"),
  t.Literal("FULL"),
]);

export const StationSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  lat: t.Number(),
  lng: t.Number(),
  address: t.String(),
  total: t.Number(),
  name_en: t.String(),
  address_en: t.String(),
});

export const CurrentSchema = t.Object({
  station_id: t.Number(),
  unavailable: t.Number(),
  success: t.Number(),
  update: t.String(),
  bikes: t.Number(),
  slots: t.Number(),
  full: t.Number(),
  status: StationStatusSchema,
  types: t.Any(),
});

export const CurrentWithStationSchema = t.Object({
  station_id: StationSchema,
  unavailable: t.Number(),
  success: t.Number(),
  update: t.String(),
  bikes: t.Number(),
  slots: t.Number(),
  full: t.Number(),
  status: StationStatusSchema,
  types: t.Any(),
});

export const HistorySchema = t.Object({
  id: t.String(),
  station_id: t.Number(),
  available: t.Number(),
  empty: t.Number(),
  at: t.String(),
  types: t.Any(),
});

export const ErrorSchema = t.Object({
  error: t.String(),
});
