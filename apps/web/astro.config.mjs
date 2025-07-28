// @ts-check
import alpinejs from "@astrojs/alpinejs";
import cloudflare from "@astrojs/cloudflare";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",
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
          "cloudflarepages",
          "cloudflareworkers",
        ],
        "material-symbols": [
          "favorite-rounded",
          "pedal-bike-outline-rounded",
          "add-rounded",
        ],
        "fa7-regular": ["sad-cry", "angry", "face-smile"],
      },
    }),
    alpinejs({ entrypoint: "/src/scripts/main" }),
    preact(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
