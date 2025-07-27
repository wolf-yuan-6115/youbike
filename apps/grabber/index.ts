import { createClient } from "@supabase/supabase-js";
import hourJob from "./jobs/hour.ts";
import minuteJob from "./jobs/minute.ts";
import type { Env } from "./types/env.types.ts";

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    const supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_KEY,
    );
    const stations = await supabase.from("stations").select("*");

    switch (controller.cron) {
      case "* * * * *":
        await minuteJob(stations.data, env);
        break;
      case "0 * * * *":
        await hourJob(stations.data, env);
        break;
    }
  },
};
