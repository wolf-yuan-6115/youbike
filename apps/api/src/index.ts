import { Hono } from "hono";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import stationsRoutes from "./routes/stations";
import currentRoutes from "./routes/current";
import historyRoutes from "./routes/history";

// Weird Vercel, a weird workaround
const app = new Hono();
const api = new OpenAPIHono();

api.route("/api/stations", stationsRoutes);
api.route("/api/current", currentRoutes);
api.route("/api/history", historyRoutes);

api.get(
  "/api/",
  Scalar({
    theme: "deepSpace",
    url: "/api/openapi.json",
  }),
);

api.doc("/api/openapi.json", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "YouBike API",
    description:
      "Get access to underlying data used by Cha Bike. For more information, visit [Cha Bike](https://youbike.wolf-yuan.dev/).",
  },
  servers: [
    {
      url: "https://youbike.wolf-yuan.dev/api/",
      description: "Production server",
    },
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
});

app.route("/", api);

export default app;
