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
      name: "mottem-sheet",
      entry: path.resolve(__dirname, "lib/index.ts"),
      fileName: (format) =>
        format === "es" ? "[name].js" : `mottem-sheet.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@emotion/react",
        "@emotion/styled",
        "@react-spring/web",
        "@use-gesture/react",
        "react/jsx-runtime",
      ],
      output: [
        {
          interop: "auto",
          format: "es",
          preserveModules: true,
          preserveModulesRoot: "lib",
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          inlineDynamicImports: false,
          exports: "named",
        },
        {
          name: "mottem-sheet",
          interop: "auto",
          format: "umd",
          inlineDynamicImports: true,
          entryFileNames: "mottem-sheet.umd.js",
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "@emotion/react": "EmotionReact",
            "@emotion/styled": "EmotionStyled",
            "@react-spring/web": "ReactSpringWeb",
            "@use-gesture/react": "ReactGesture",
          },
        },
      ],
    },
  },
});
