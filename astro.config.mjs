// @ts-check
import process from "node:process";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || "/",
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
