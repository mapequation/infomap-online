import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: "./vitest.setup.ts",
    css: false,
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts?(x)"],
  },
});
