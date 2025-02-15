import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";
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
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ["lib", "types"],
    }),
    react(),
    visualizer(),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, "lib/index.ts"),
      name: "mottem-sheet",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@emotion/react",
        "@emotion/styled",
        "@react-spring/web",
        "@use-gesture/react",
      ],
      output: {
        interop: "auto",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "styled-components": "StyledComponent",
          "@emotion/react": "EmotionReact",
          "@emotion/styled": "EmotionStyled",
          "@react-spring/web": "ReactSpringWeb",
          "@use-gesture/react": "ReactGesture",
        },
      },
    },
  },
});
