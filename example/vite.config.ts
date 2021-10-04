import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@humpf': path.resolve(process.cwd(), 'src', 'mod.ts'),
    },
  },
});
