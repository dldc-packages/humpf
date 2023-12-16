import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: { poolOptions: { threads: { singleThread: true } } },
});
