import { resolve } from "node:path";
import { defineConfig } from "vite-plus";

const root = import.meta.dirname;

export default defineConfig({
  // Tests import the package through its own public entry (`../mod.ts`),
  // exactly like the JSR export map used to. The alias points those
  // self-references at the sources so tests run against the same code the
  // package is built from.
  resolve: {
    alias: {
      "@dldc/humpf": resolve(root, "src"),
    },
  },

  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
    },
  },

  fmt: {
    // Test-owned fixtures (image snapshots and the JSON data they are compared
    // against) are written by the tests; prose docs and CI files are kept out
    // of the formatter's churn to avoid unrelated diffs.
    ignorePatterns: [
      "**/__snapshots__/**",
      "tests/data/**",
      "tests/images/**",
      "**/*.md",
      ".github/**",
      "coverage/**",
      "dist/**",
      "node_modules/**",
    ],
  },

  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      // `any` was the only excluded rule in the previous Deno lint config.
      "no-explicit-any": "off",
    },
  },

  // Library build (tsdown). The entry map mirrors the export map in
  // package.json, so the root export emits its own module and types.
  pack: {
    entry: {
      mod: "mod.ts",
    },
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
  },
});
