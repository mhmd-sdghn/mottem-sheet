import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@appTypes": path.resolve(__dirname, "./types"),
      "@examples": path.resolve(__dirname, "./examples"),
    },
  },
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname),
    },
  },
});
