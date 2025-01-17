import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Port for Vite
    proxy: {
      "/chat": {
        target: "http://localhost:3000", // Express server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
