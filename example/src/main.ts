import { menu, menuDefaultConfig } from '@milkdown-lab/plugin-menu'
import { toggleSplitEditing } from '@milkdown-lab/plugin-split-editing'
import { commandsCtx, defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'

import { nord } from '@milkdown/theme-nord'
import '@milkdown/theme-nord/style.css'
import './style.css'

async function main() {
  const root = document.querySelector('#app')
  const button = document.createElement('button')
  button.innerText = 'hide split editing view'
  button.addEventListener('click', () => {
    editor.ctx.get(commandsCtx).call(toggleSplitEditing.key)
  })
  root?.appendChild(button)
  const editor = await Editor.make()
    .config(nord)
    .config(menuDefaultConfig)
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, '# Hello milkdown-lab')
    })
    .use(menu)
    .use(commonmark)
    .use(gfm)
    .create()
}

main()
