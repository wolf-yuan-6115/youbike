// @ts-check
import alpinejs from "@astrojs/alpinejs";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
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
  ],
  env: {
    schema: {
      SUPABASE_URL: envField.string({
        context: "server",
        access: "public",
      }),
      SUPABASE_PUBLISHABLE: envField.string({
        context: "server",
        access: "public",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
