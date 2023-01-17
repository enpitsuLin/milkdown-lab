import { fullscreen } from '@milkdown-lab/plugin-fullscreen'
import { splitEditing } from '@milkdown-lab/plugin-split-editing'
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { defaultConfig, menu, menuPlugin } from '@milkdown/plugin-menu'
import { commonmark } from '@milkdown/preset-commonmark'
import { overrideNord } from './theme'

async function main() {
  const root = document.querySelector('#app')

  const editor = await Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, '# Hello milkdown')
    })
    .use(overrideNord)
    .use(commonmark)
    .use(fullscreen)
    .use(
      menu.configure(menuPlugin, {
        config: [
          ...defaultConfig,
          [
            {
              type: 'button',
              icon: 'splitEditing',
              key: 'ToggleSplitEditing',
            },
            {
              type: 'button',
              icon: 'fullscreen',
              key: 'ToggleFullscreen',
            },
          ],
        ],
      }),
    )
    .use(splitEditing)
    .create()
}

main()
