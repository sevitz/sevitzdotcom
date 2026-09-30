import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://sevitz.com",
  // /hero-images/ is an unlinked admin view, so keep it out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes("/hero-images/") })],
});
