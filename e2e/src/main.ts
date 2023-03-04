import { fullscreen } from '@milkdown-lab/plugin-fullscreen'
import { splitEditing } from '@milkdown-lab/plugin-split-editing'
import { menu, menuDefaultConfig } from '@milkdown-lab/plugin-menu'
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { MilkdownPlugin } from '@milkdown/ctx'
import { nord } from '@milkdown/theme-nord'
import { gfm } from '@milkdown/preset-gfm'
import '@milkdown-lab/plugin-menu/style.css'

async function render(plugins: Plugin[] = []) {
  const root = document.querySelector('#app')

  let editor = Editor.make().config((ctx) => {
    ctx.set(rootCtx, root)
    ctx.set(defaultValueCtx, '# Hello milkdown')
  })

  editor = editor.config(nord).config(menuDefaultConfig).use(commonmark).use(gfm)

  plugins.forEach((item) => {
    editor = editor.use(item.plugin)
  })

  return editor.create()
}
const pluginMapping: Record<'splitEditing' | 'fullscreen' | 'menu', Plugin> = {
  splitEditing: {
    plugin: splitEditing,
  },
  fullscreen: {
    plugin: fullscreen,
  },
  menu: {
    plugin: menu,
  },
}
function getPlugins(name: 'splitEditing' | 'fullscreen' | 'menu') {
  return pluginMapping[name]
}

globalThis.render = render

globalThis.getPlugins = getPlugins

export interface Plugin {
  plugin: MilkdownPlugin | MilkdownPlugin[]
}
