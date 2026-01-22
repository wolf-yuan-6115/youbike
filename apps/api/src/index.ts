import { OpenAPIHono } from "@hono/zod-openapi";
import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { Scalar } from "@scalar/hono-api-reference";
import { stationsRoutes } from "./routes/stations.js";
import { currentRoutes } from "./routes/current.js";
import { historyRoutes } from "./routes/history.js";

const app = new Hono();
const api = new OpenAPIHono();

api.use(trimTrailingSlash());
api.route("/api/stations", stationsRoutes);
api.route("/api/current", currentRoutes);
api.route("/api/history", historyRoutes);

api.doc("/api/openapi.json", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Cha Bike API",
    description:
      "Get access to underlying data used by Cha Bike. For more information, visit [Cha Bike](https://youbike.wolf-yuan.dev/) homepage.\n" +
      "Data provided as-is, with no warranties.",
  },
  servers: [
    {
      url: "https://youbike.wolf-yuan.dev",
      description: "Production server",
    },
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
});

api.get(
  "/api",
  Scalar({
    theme: "deepSpace",
    url: "/api/openapi.json",
    hideClientButton: true,
  }),
);

app.route("/", api);

export default app;
