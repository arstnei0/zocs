import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { site } from "./src/config";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  experimental: {
    contentCollections: true
  },
  integrations: [mdx(), solidJs()],
  site: site.url
});