# @milkdown-lab/plugin-split-editing

Plugin add `split editing view` or saying `two-columns editing view`, you can edit each pane individually. Both panes have synced content.

That raw content view editor is render by `codemirror`

## Preview

![preview](https://user-images.githubusercontent.com/29378026/212620000-6c8ec43e-bb8f-4cab-92bf-cf997451baf7.png)

## Usage

```sh
pnpm add @milkdown-lab/plugin-split-editing
```

```javascript
import { splitEditing } from '@milkdown-lab/plugin-split-editing'
// ...
const editor = await Editor.make()
  .config(() => {
    ctx.set(rootCtx, document.querySelector('#app'))
  })
  .use(splitEditing)
  .create()
```

This plugins also provide a command key named `ToggleSplitEditing` can integrate easily with the official plugin `@milkdown/plugin-menu`. If you want use command programmatically please reference [doc](https://milkdown.dev/commands)

```javascript
import { defaultConfig, menu, menuPlugin } from '@milkdown/plugin-menu'
import { splitEditing } from '@milkdown-lab/plugin-split-editing'
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
            icon: 'splitEditing',
            key: 'ToggleSplitEditing',
          },
        ],
      ],
    }),
  )
  .use(splitEditing)
  .create()
```

## Options

`None`
