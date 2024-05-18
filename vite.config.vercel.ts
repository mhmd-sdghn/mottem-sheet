import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@appTypes": path.resolve(__dirname, "./types"),
      "@examples": path.resolve(__dirname, "./examples"),
    },
  },
  plugins: [react(), typescript()],
  build: {
    outDir: "./dist-vercel",
  },
});
