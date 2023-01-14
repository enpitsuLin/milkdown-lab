import { fullscreen } from '@milkdown-js/plugin-fullscreen'
import { twoColumns } from '@milkdown-js/plugin-two-columns'
import { Editor, rootCtx } from '@milkdown/core'
import { defaultConfig, menu, menuPlugin } from '@milkdown/plugin-menu'
import { commonmark } from '@milkdown/preset-commonmark'
import { overrideNord } from './theme'

async function main() {
  const root = document.querySelector('#app')

  const editor = await Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
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
              icon: 'twoColumns',
              key: 'ToggleTwoColumn',
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
    .use(twoColumns)
    .create()
}

main()
