import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    threads: false, // needed for canvas https://github.com/vitest-dev/vitest/issues/740
  },
});
