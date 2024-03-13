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

## Options

`@milkdown-lab/plugin-split-editing` is now headless as same as `milkdown` v7, see [here](https://saul-mirone.github.io/a-brief-introduction-to-milkdown-v7/) for reason, so you need styling by yourself.

there are some selector necessary, for example:

```css
.split-editor {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
}

.split-editor:has(.milkdown-split-editor.hidden) {
  grid-template-columns: repeat(1, 1fr);
}

.milkdown-split-editor.hidden {
  display: none;
}
```

### Adding custom attributes


You can also add attributes to split edit view element if you want to build your own style logic or using atom css library like tailwindcss.

```javascript
import { splitEditing, splitEditingOptionsCtx } from '@milkdown-lab/plugin-fullscreen'
// ...
const editor = await Editor.make()
  .config(() => {
    ctx.set(splitEditingOptionsCtx.key, {
      wrapperAttributes: { class: 'grid grid-cols-2 grid-rows-none' },
      attributes: { class: 'bg-#eee' },
      hiddenAttribute: { class: 'hidden' },
      hiddenWrapperAttributes: { class: 'grid-cols-none' },
    })
    ctx.set(rootCtx, document.querySelector('#app'))
  })
  .use(splitEditing)
  .create()
```
