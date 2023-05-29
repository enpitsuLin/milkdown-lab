import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetUno, presetTypography, transformerDirectives } from 'unocss'

export default defineConfig({
  plugins: [
    Unocss({
      presets: [presetUno(), presetTypography()],
      transformers: [transformerDirectives()],
    }),
  ],
})
