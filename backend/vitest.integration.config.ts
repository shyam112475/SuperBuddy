import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    // Integration tests hit a real database sequentially by design (shared
    // fixtures, cleanup ordering) — no point parallelizing across files.
    fileParallelism: false,
  },
});
