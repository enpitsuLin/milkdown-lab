import { fullscreen } from '@milkdown-lab/plugin-fullscreen'
import { splitEditing } from '@milkdown-lab/plugin-split-editing'
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { MilkdownPlugin } from '@milkdown/ctx'
import { nord } from '@milkdown/theme-nord'

async function render(plugins: Plugin[] = []) {
  const root = document.querySelector('#app')

  let editor = Editor.make().config((ctx) => {
    ctx.set(rootCtx, root)
    ctx.set(defaultValueCtx, '# Hello milkdown')
  })

  editor = editor.config(nord).use(commonmark)

  plugins.forEach((item) => {
    editor = editor.use(item.plugin)
  })

  return editor.create()
}
const pluginMapping: Record<'splitEditing' | 'fullscreen', Plugin> = {
  splitEditing: {
    plugin: splitEditing,
  },
  fullscreen: {
    plugin: fullscreen,
  },
}
function getPlugins(name: 'splitEditing' | 'fullscreen') {
  return pluginMapping[name]
}

globalThis.render = render

globalThis.getPlugins = getPlugins

export interface Plugin {
  plugin: MilkdownPlugin | MilkdownPlugin[]
}
