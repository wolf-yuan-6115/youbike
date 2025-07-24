// @ts-check
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [
    icon({
      include: {
        "simple-icons": [
          "supabase",
          "tailwindcss",
          "astro",
          "facebook",
          "instagram",
          "discord",
          "gitlab",
        ],
        "material-symbols": [
          "favorite-rounded",
          "pedal-bike-outline-rounded",
        ],
        "fa7-regular": ["angry"],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
