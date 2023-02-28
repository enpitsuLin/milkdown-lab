# @milkdown-lab/plugin-menu

Plugin add menubar for milkdown editor

## Usage

```sh
pnpm add @milkdown-lab/plugin-menu
```

```javascript
import { menu, menuDefaultConfig } from '@milkdown-lab/plugin-menu'
// ...
const editor = await Editor.make()
  .config(menuDefaultConfig)
  .config(() => {
    ctx.set(rootCtx, document.querySelector('#app'))
  })
  .use(menu)
  .create()
```

## Options

### Styling

`@milkdown-lab/plugin-menu` is now headless as same as `milkdown` v7, see [here](https://saul-mirone.github.io/a-brief-introduction-to-milkdown-v7/) for reason, so you need styling by yourself.

The style might be complex, this package offered a .css file `@milkdown-lab/plugin-menu/style.css` for reference

Menubar create by this plugin will create HTML structure like:

<details>
  <summary>HTML</summary>
 
```html
<div class="milkdown-menu">
    <ul role="menubar" aria-label="Editor menubar">
        <!-- for button menuitem -->
        <li role="none">
            <button role="menuitem" type="button">
                <span class="material-icons material-icons-outlined">turn_left</span>
            </button>
        </li>
        <!-- for select menuitem -->
        <li role="none">
            <button role="menuitem" type="button" aria-haspopup="true" aria-expanded="false" tab-index="0">
                Heading<span class="material-icons material-icons-outlined">expand_more</span>
            </button>
            <ul role="menu" data-option="Heading" aria-label="Heading" tabindex="-1" class="">
                <li role="menuitem" tabindex="-1">Large Heading</li>
                <li role="menuitem" tabindex="-1">Medium Heading</li>
                <li role="menuitem" tabindex="-1">Small Heading</li>
                <li role="menuitem" tabindex="-1">Plain Text</li>
            </ul>
        </li>
        <!-- for separator -->
        <li role="none">
            <div role="separator"></div>
        </li>
    </ul>
</div>
```

</details>

### Adding custom attributes

You can also add attributes to menu element which was `div.milkdown-menu` by default configuration.

```javascript
import { menu, menuConfigCtx, defaultConfigItems } from '@milkdown-lab/plugin-menu'
// ...
const editor = await Editor.make()
  .config(() => {
    ctx.set(menuConfigCtx.key, {
      attributes: { class: 'milkdown-menu', 'data-menu': 'true' },
      items: defaultConfigItems,
    })
    ctx.set(rootCtx, document.querySelector('#app'))
  })
  .use(menu)
  .create()
```

### configuration menubar defaultConfigItems

menu items type just reference `MenuConfigItem`

```javascript
import { menu, menuConfigCtx, MenuConfigItem } from '@milkdown-lab/plugin-menu'
// ...

const menuItems: MenuConfigItem[][] = [
  [
    {
      type: 'select',
      text: 'Heading',
      options: [
        { id: 1, content: 'Large Heading' },
        { id: 2, content: 'Medium Heading' },
        { id: 3, content: 'Small Heading' },
        { id: 0, content: 'Plain Text' },
      ],
      // return [commandKey,payload] or commandKey
      onSelect: (id) => (!!id ? ['WrapInHeading', id] : 'TurnIntoText'),
    },
  ],
  [
    {
      type: 'button',
      content: 'B',
      // commandKey
      key: 'ToggleStrong',
    },
    {
      type: 'button',
      content: 'I',
      key: 'ToggleEmphasis',
    },
    {
      type: 'button',
      content: 'S',
      key: 'ToggleStrikeThrough',
    },
  ],
]

const editor = await Editor.make()
  .config(() => {
    ctx.set(menuConfigCtx.key, {
      attributes: { class: 'milkdown-menu', 'data-menu': 'true' },
      items: menuItems,
    })
    ctx.set(rootCtx, document.querySelector('#app'))
  })
  .use(menu)
  .create()
```
