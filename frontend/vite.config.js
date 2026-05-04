import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 3000,
    strictPort: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  preview: {
    host: "localhost",
    port: 3000,
    strictPort: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  optimizeDeps: {
    include: ["@mediapipe/tasks-vision"],
  },
});
