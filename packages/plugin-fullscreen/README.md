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

Plugins add keyboard shortcuts, you can use `F11` to toggle fullscreen when editor was be focused.

## Options

### Styling

`@milkdown-lab/plugin-fullscreen` is now headless as same as `milkdown` v7, see [here](https://saul-mirone.github.io/a-brief-introduction-to-milkdown-v7/) for reason, so you need styling by yourself.

you should styling `.milkdown.fullscreen` selector by default option, for example:

```css
.milkdown.fullscreen {
  position: fixed;
  inset: 0;
  overflow-y: scroll;
}
```

### Adding custom attributes

You can also add attributes to fullscreen element if you want if you want to build your own style logic or using atom css library like tailwindcss.

```javascript
import { fullscreen } from '@milkdown-lab/plugin-fullscreen'
// ...
const editor = await Editor.make()
  .config(() => {
    ctx.set(fullscreenOptionsCtx.key, { attributes: { class: 'fixed inset-0 overflow-y-scroll' } })
    ctx.set(rootCtx, document.querySelector('#app'))
  })
  .use(fullscreen)
  .create()
```
