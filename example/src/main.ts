import { fullscreen, ToggleFullscreen } from 'milkdown-plugin-fullscreen'
import { Editor, rootCtx, commandsCtx } from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { commonmark } from '@milkdown/preset-commonmark'

const root = document.querySelector('#app')

const editor = await Editor.make()
  .config((ctx) => {
    ctx.set(rootCtx, root)
  })
  .use(nord)
  .use(commonmark)
  .use(fullscreen)
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
