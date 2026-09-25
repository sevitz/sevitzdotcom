import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://sevitz.com",
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
  }),
});
