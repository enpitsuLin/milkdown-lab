import { fullscreen, ToggleFullscreen } from '@milkdown-js/plugin-fullscreen'
import { Editor, rootCtx, commandsCtx } from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { commonmark } from '@milkdown/preset-commonmark'
import { twoColumns } from '@milkdown-js/plugin-two-columns'
import { menu } from '@milkdown/plugin-menu'

async function main() {
  const root = document.querySelector('#app')

  const editor = await Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
    })
    .use(nord)
    .use(commonmark)
    .use(fullscreen)
    .use(menu)
    .use(twoColumns)
    .create()

  const button = document.createElement('button')
  button.innerHTML = `fullscreen`
  button.addEventListener('click', () => {
    editor.action((ctx) => {
      const commandManager = ctx.get(commandsCtx)

      commandManager.call(ToggleFullscreen)
    })
  })

  root?.append(button)
}

main()
