import { fullscreen } from '@milkdown-lab/plugin-fullscreen'
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'

import { nord } from '@milkdown/theme-nord'
import '@milkdown/theme-nord/style.css'

async function main() {
  const root = document.querySelector('#app')

  const editor = await Editor.make()
    .config(nord)
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, '# Hello milkdown-lab')
    })
    .use(commonmark)
    .use(fullscreen)
    .create()
}

main()
