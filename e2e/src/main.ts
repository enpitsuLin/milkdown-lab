import { fullscreen } from '@milkdown-lab/plugin-fullscreen'
import { splitEditing } from '@milkdown-lab/plugin-split-editing'
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { Config, ConfigItem, defaultConfig, menu, menuPlugin } from '@milkdown/plugin-menu'
import { commonmark } from '@milkdown/preset-commonmark'
import { overrideNord } from './theme'

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

const filterTruthy = <T>(value: T): value is Truthy<T> => {
  return Boolean(value)
}
async function render(plugins: Plugin[] = [], showMenu = false) {
  const root = document.querySelector('#app')

  let editor = Editor.make().config((ctx) => {
    ctx.set(rootCtx, root)
    ctx.set(defaultValueCtx, '# Hello milkdown')
  })

  if (showMenu) {
    const extraMenu: Config = Object.values(plugins)
      .map((i) => i.menuConfig)
      .filter(filterTruthy)

    const menuConfig = defaultConfig.concat(extraMenu)
    editor = editor.use(menu.configure(menuPlugin, { config: menuConfig }))
  }

  editor = editor.use(overrideNord).use(commonmark)

  plugins.forEach((item) => {
    editor = editor.use(item.plugin)
  })

  return editor.create()
}
const pluginMapping: Record<'spliteEditing' | 'fullscreen', Plugin> = {
  spliteEditing: {
    plugin: splitEditing,
    menuConfig: [{ type: 'button', icon: 'splitEditing', key: 'ToggleSplitEditing' }],
  },
  fullscreen: {
    plugin: fullscreen,
    menuConfig: [{ type: 'button', icon: 'fullscreen', key: 'ToggleFullscreen' }],
  },
}
function getPlugins(name: 'spliteEditing' | 'fullscreen') {
  return pluginMapping[name]
}

globalThis.render = render

globalThis.getPlugins = getPlugins

export interface Plugin {
  plugin: import('@milkdown/core').MilkdownPlugin | import('@milkdown/core').MilkdownPlugin[]
  menuConfig?: ConfigItem[]
}
