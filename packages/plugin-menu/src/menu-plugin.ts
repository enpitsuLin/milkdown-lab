import { rootDOMCtx } from '@milkdown/core'
import { Ctx } from '@milkdown/ctx'
import { Plugin, PluginKey } from '@milkdown/prose/state'
import { $ctx, $prose } from '@milkdown/utils'
import { button, divider, MenuConfigItem, select } from './menu-item'

export type MenuPluginConfig = {
  items?: MenuConfigItem[][]
  attributes?: Record<string, string>
}

// menu container HTMLElement
export const menuDomCtx = $ctx({}, 'menuDom')

// menu config context
export const menuConfigCtx = $ctx(
  { items: [], attributes: { class: 'milkdown-menu' } } as Required<MenuPluginConfig>,
  'menuConfig',
)

const key = new PluginKey('MILKDOWN_PLUGIN_MENU')

const createContainer = (ctx: Ctx) => {
  const config = ctx.get(menuConfigCtx.key)
  const container = document.createElement('div')
  Object.entries(config.attributes).forEach(([key, val]) => {
    if (key === 'class') container.classList.add(val)
    else container.setAttribute(key, val)
  })
  return container
}

const createMenuBar = (ctx: Ctx) => {
  const menubar = document.createElement('ul')
  menubar.role = 'menubar'
  menubar.setAttribute('aria-label', 'Editor menubar')

  const config = ctx.get(menuConfigCtx.key)
  const itemsWithDivider = config.items.reduce((acc, curr, index) => {
    if (index === config.items.length - 1) return acc.concat(...curr)

    return acc.concat(...curr).concat('divider')
  }, [] as (MenuConfigItem | 'divider')[])

  const menuBarItems = itemsWithDivider.map((item) => {
    const listItem = document.createElement('li')
    listItem.role = 'none'
    const createItem = () => {
      if (typeof item === 'string') return divider()
      else if (item.type === 'button') return button(item, ctx)
      else return select(item, ctx)
    }
    listItem.append(...createItem())

    return { $: listItem, config: item }
  })
  menubar.append(...menuBarItems.map((item) => item.$))
  return { dom: menubar, items: menuBarItems }
}

export const menuView = $prose((ctx) => {
  const prosePlugin = new Plugin({
    key,
    view: (editorView) => {
      const root = ctx.get(rootDOMCtx)
      const container = createContainer(ctx)
      ctx.set(menuDomCtx.key, container)

      const editor = editorView.dom

      root.insertBefore(container, editor)

      const menubar = createMenuBar(ctx)
      if (menubar.dom.children.length !== 0) {
        container.append(menubar.dom)
      }

      return {
        update: () => {
          menubar.items.forEach((item) => {
            if (typeof item.config !== 'string') {
              if (item.config.type === 'button' && item.config.active) {
                const isActive = item.config.active(ctx)
                if (isActive) {
                  item.$.querySelector('button')?.classList.add('active')
                } else {
                  item.$.querySelector('button')?.classList.remove('active')
                }
              }
              if (typeof item.config.disabled != 'undefined') {
                const isEnabled = item.config.disabled(ctx)
                if (!isEnabled) {
                  item.$.remove()
                }
              }
            }
          })
        },
        destroy: () => {
          container?.remove()
        },
      }
    },
  })
  return prosePlugin
})
