import dotenv from "dotenv";
import cron from "node-cron";
import minuteJob from "./jobs/minute.ts";
import { logCurrentTime } from "./utils/currentTime.ts";
import { supabase } from "./utils/supabaseClient.ts";

dotenv.config();

const stations = await supabase.from("stations").select("*");

if (!stations.data) {
  console.error("No stations configured!");
  process.exit(1);
}

cron.schedule("* * * * *", async () => {
  await minuteJob(stations.data);
});

logCurrentTime("Server started, waiting for next cron start");
