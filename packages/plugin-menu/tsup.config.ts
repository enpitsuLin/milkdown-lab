import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm'],
  outDir: 'lib',
  dts: true,
  clean: true,
})
