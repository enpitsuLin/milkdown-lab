import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  outDir: 'lib',
  rollup: { emitCJS: false },
})
