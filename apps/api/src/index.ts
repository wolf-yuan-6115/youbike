import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { stationsRoutes } from "./routes/stations";
import { currentRoutes } from "./routes/current";
import { historyRoutes } from "./routes/history";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: "YouBike API",
          version: "1.0.0",
          description:
            "Get access to underlying data used by Cha Bike. For more information, visit [Cha Bike](https://youbike.wolf-yuan.dev/) homepage.",
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
      },
      path: "/api",
      scalar: {
        theme: "deepSpace",
      },
    }),
  )
  .use(stationsRoutes)
  .use(currentRoutes)
  .use(historyRoutes);

export default app;
