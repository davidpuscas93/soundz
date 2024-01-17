import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";
// import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Soundz",
        short_name: "Soundz",
        theme_color: "#ff5e3a",
        icons: [
          {
            src: "assets/img/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "assets/img/stray.jpg",
            sizes: "3840x2160",
            type: "image/jpeg",
            form_factor: "wide",
          },
          {
            src: "assets/img/night.jpg",
            sizes: "881x881",
            type: "image/jpeg",
          },
        ],
      },
      /** This doesn't work anymore for offline support - conflicting entries while precaching. */
      // workbox: {
      //   globPatterns: ["**/*.{js,css,html,png,jpg,}"],
      // },
    }),
    /** Use for rollup-visualizer. */
    // visualizer({
    //   open: true,
    // }),
  ],
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
