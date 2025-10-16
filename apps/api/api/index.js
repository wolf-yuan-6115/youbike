import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { createClient } from "@supabase/supabase-js";

//#region src/lib/supabase.ts
const supabase = createClient(Bun.env.SUPABASE_URL || process.env.SUPABASE_URL || "", Bun.env.SUPABASE_PUBLISHABLE || process.env.SUPABASE_PUBLISHABLE || "");

//#endregion
//#region src/schemas/index.ts
const StationStatusSchema = t.Union([
	t.Literal("NORMAL"),
	t.Literal("EMPTY"),
	t.Literal("FULL")
]);
const StationSchema = t.Object({
	id: t.Number(),
	name: t.String(),
	lat: t.Number(),
	lng: t.Number(),
	address: t.String(),
	total: t.Number(),
	name_en: t.String(),
	address_en: t.String()
});
const CurrentSchema = t.Object({
	station_id: t.Number(),
	unavailable: t.Number(),
	success: t.Number(),
	update: t.String(),
	bikes: t.Number(),
	slots: t.Number(),
	full: t.Number(),
	status: StationStatusSchema,
	types: t.Any()
});
const CurrentWithStationSchema = t.Object({
	station_id: StationSchema,
	unavailable: t.Number(),
	success: t.Number(),
	update: t.String(),
	bikes: t.Number(),
	slots: t.Number(),
	full: t.Number(),
	status: StationStatusSchema,
	types: t.Any()
});
const HistorySchema = t.Object({
	id: t.String(),
	station_id: t.Number(),
	available: t.Number(),
	empty: t.Number(),
	at: t.String(),
	types: t.Any()
});
const ErrorSchema = t.Object({ error: t.String() });

//#endregion
//#region src/routes/stations.ts
const stationsRoutes = new Elysia({ prefix: "/stations" }).get("/", async () => {
	const { data, error } = await supabase.from("stations").select("*");
	if (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
	return data;
}, {
	detail: {
		tags: ["Stations"],
		summary: "Get all stations",
		description: "List of all stations"
	},
	response: {
		200: t.Array(StationSchema),
		500: ErrorSchema
	}
}).get("/:id", async ({ params, set }) => {
	const { id } = params;
	const { data, error } = await supabase.from("stations").select("*").eq("id", parseInt(id)).single();
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
}, {
	detail: {
		tags: ["Stations"],
		summary: "Get station by ID",
		description: "Station details"
	},
	params: t.Object({ id: t.String({
		pattern: "^\\d+$",
		description: "Station ID",
		examples: "500306017"
	}) }),
	response: {
		200: StationSchema,
		400: ErrorSchema,
		404: ErrorSchema,
		500: ErrorSchema
	}
});

//#endregion
//#region src/routes/current.ts
const currentRoutes = new Elysia({ prefix: "/current" }).get("/", async () => {
	const { data, error } = await supabase.from("current").select("*");
	if (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
	return data;
}, {
	detail: {
		tags: ["Current"],
		summary: "Get all current station data",
		description: "List of all current station data"
	},
	response: {
		200: t.Array(CurrentSchema),
		500: ErrorSchema
	}
}).get("/:id", async ({ params, set }) => {
	const { id } = params;
	const { data, error } = await supabase.from("current").select("*, station_id(*)").eq("station_id", parseInt(id)).single();
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
}, {
	detail: {
		tags: ["Current"],
		summary: "Get current data by station ID",
		description: "Current station data with station details"
	},
	params: t.Object({ id: t.String({
		pattern: "^\\d+$",
		description: "Station ID",
		examples: ["500306017"]
	}) }),
	response: {
		200: CurrentWithStationSchema,
		400: ErrorSchema,
		404: ErrorSchema,
		500: ErrorSchema
	}
});

//#endregion
//#region src/routes/history.ts
const historyRoutes = new Elysia({ prefix: "/history" }).get("/:id", async ({ params, query, set }) => {
	const { id } = params;
	const { limit } = query;
	let pendingQuery = supabase.from("history").select("*").eq("station_id", parseInt(id)).order("at", { ascending: false });
	if (limit) pendingQuery = pendingQuery.limit(parseInt(limit));
	const { data, error } = await pendingQuery;
	if (error) {
		console.error(error);
		set.status = 500;
		return { error: "Internal server error" };
	}
	return data;
}, {
	detail: {
		tags: ["History"],
		summary: "Get history by station ID",
		description: "List of historical data for the station"
	},
	params: t.Object({ id: t.String({
		pattern: "^\\d+$",
		description: "Station ID",
		examples: ["500306017"]
	}) }),
	query: t.Object({ limit: t.Optional(t.String({
		pattern: "^\\d+$",
		description: "Limit the results",
		examples: "10"
	})) }),
	response: {
		200: t.Array(HistorySchema),
		400: ErrorSchema,
		500: ErrorSchema
	}
});

//#endregion
//#region src/index.ts
const app = new Elysia().use(openapi({
	documentation: {
		info: {
			title: "YouBike API",
			version: "1.0.0",
			description: "Get access to underlying data used by Cha Bike. For more information, visit [Cha Bike](https://youbike.wolf-yuan.dev/) homepage."
		},
		servers: [{
			url: "https://youbike.wolf-yuan.dev",
			description: "Production server"
		}, {
			url: "http://localhost:3000",
			description: "Local development server"
		}]
	},
	path: "/",
	specPath: "/openapi.json",
	scalar: { theme: "deepSpace" }
})).use(stationsRoutes).use(currentRoutes).use(historyRoutes);
var src_default = app;

//#endregion
export { src_default as default };