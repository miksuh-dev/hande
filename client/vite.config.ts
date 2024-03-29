import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import eslint from "vite-plugin-eslint";
import tsconfigPaths from "vitest-tsconfig-paths";

export default defineConfig({
  base: "",
  plugins: [
    solidPlugin(),
    eslint({ failOnError: true, failOnWarning: false }),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    outDir: "../dist/client",
    emptyOutDir: true,
  },
});
