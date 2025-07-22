import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      config: path.resolve(__dirname, "./src/config"),
      components: path.resolve(__dirname, "./src/components"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      lib: path.resolve(__dirname, "./src/lib"),
      types: path.resolve(__dirname, "./src/types"),
      services: path.resolve(__dirname, "./src/services"),
      store: path.resolve(__dirname, "./src/store"),
    },
  },
});
