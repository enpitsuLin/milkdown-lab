# @milkdown-lab/plugin-fullscreen

Plugin add `fullscreen` feature to milkdown editor.

## Usage

```sh
pnpm add @milkdown-lab/plugin-fullscreen
```

```javascript
import { fullscreen } from '@milkdown-lab/plugin-fullscreen'
// ...
const editor = await Editor.make()
  .config(() => {
    ctx.set(rootCtx, document.querySelector('#app'))
  })
  .use(fullscreen)
  .create()
```

Plugins add keyboard shortcuts, you can use `F11` to toggle fullscreen when editor was be active.

This plugins also provide a command key named `ToggleSplitEditing` can integrate easily with the official plugin `@milkdown/plugin-menu`. If you want use command programmatically please reference [doc](https://milkdown.dev/commands)

```javascript
import { defaultConfig, menu, menuPlugin } from '@milkdown/plugin-menu'
import { fullscreen } from '@milkdown-lab/plugin-split-editing'
// ...
const editor = await Editor.make()
  .config(() => {
    ctx.set(rootCtx, document.querySelector('#app'))
  })
  .use(
    menu.configure(menuPlugin, {
      config: [
        ...defaultConfig,
        [
          {
            type: 'button',
            icon: 'fullscreen',
            key: 'ToggleFullscreen',
          },
        ],
      ],
    }),
  )
  .use(fullscreen)
  .create()
```
