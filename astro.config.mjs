import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_URL || "https://yingjieshi.rth1.me",
  base: process.env.BASE_PATH || "/",
  output: "static",
  trailingSlash: "always",
  vite: {
    build: { cssMinify: "lightningcss" },
  },
});
