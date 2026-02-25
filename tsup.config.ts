import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/client/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'es2022',
});
