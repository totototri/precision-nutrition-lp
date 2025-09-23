// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/create-checkout-session": "http://localhost:4242",
      "/create-subscription-session": "http://localhost:4242",
    },
  },
});

