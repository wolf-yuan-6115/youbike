import hourJob from "./jobs/hour.ts";
import minuteJob from "./jobs/minute.ts";
import type { Env } from "./types/env.types.ts";

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    switch (controller.cron) {
      case "* * * * *":
        await minuteJob(env);
        break;
      case "0 * * * *":
        await hourJob(env);
        break;
    }
  },

  async fetch(_request: Request) {
    return new Response("Grabber is running (probably)!");
  },
};
