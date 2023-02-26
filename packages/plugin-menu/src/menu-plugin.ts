import { rootDOMCtx } from '@milkdown/core'
import { Ctx } from '@milkdown/ctx'
import { Plugin, PluginKey } from '@milkdown/prose/state'
import { $ctx, $prose } from '@milkdown/utils'
import { button, divider, MenuConfig, MenuConfigItem, select } from './menu-item'

// menu container HTMLElement
export const menuDomCtx = $ctx({}, 'menuDom')

// menu config context
export const menuConfigCtx = $ctx([] as MenuConfig, 'menuConfig')

const key = new PluginKey('MILKDOWN_PLUGIN_MENU')

const createContainer = () => {
  const container = document.createElement('div')
  container.classList.add('milkdown-menu')
  return container
}

const createMenuBar = (ctx: Ctx) => {
  const menubar = document.createElement('ul')
  menubar.role = 'menubar'
  menubar.setAttribute('aria-label', 'Editor menubar')

  const config = ctx.get(menuConfigCtx.key)
  const itemsWithDivider = config.reduce((acc, curr, index) => {
    if (index === config.length - 1) return acc.concat(...curr)

    return acc.concat(...curr).concat('divider')
  }, [] as (MenuConfigItem | 'divider')[])
  menubar.append(
    ...itemsWithDivider.map((item) => {
      const listItem = document.createElement('li')
      listItem.role = 'none'
      const createItem = () => {
        if (typeof item === 'string') return divider()
        else if (item.type === 'button') return button(item, ctx)
        else return select(item, ctx)
      }
      listItem.append(...createItem())

      return listItem
    }),
  )
  return menubar
}

export const menuView = $prose((ctx) => {
  const prosePlugin = new Plugin({
    key,
    view: (editorView) => {
      const root = ctx.get(rootDOMCtx)
      const container = createContainer()
      ctx.set(menuDomCtx.key, container)

      const editor = editorView.dom

      root.insertBefore(container, editor)

      container.append(createMenuBar(ctx))

      return {
        destroy: () => {
          container?.remove()
        },
      }
    },
  })
  return prosePlugin
})
