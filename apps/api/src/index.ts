import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import stationsRoutes from "./routes/stations";
import currentRoutes from "./routes/current";
import historyRoutes from "./routes/history";

const app = new OpenAPIHono();

app.route("/api/stations", stationsRoutes);
app.route("/api/current", currentRoutes);
app.route("/api/history", historyRoutes);

app.get(
  "/api/",
  Scalar({
    theme: "deepSpace",
    url: "/api/openapi.json",
  }),
);

app.doc("/api/openapi.json", {
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

export default app;
