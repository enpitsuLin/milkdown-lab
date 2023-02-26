import { commandsCtx } from '@milkdown/core'
import { Ctx } from '@milkdown/ctx'

export type ButtonConfig = {
  type: 'button'
  content: string | HTMLElement
  key: string
}

export type SelectOptions = {
  id: string
  content: string | HTMLElement
}

export type SelectConfig = {
  type: 'select'
  options: SelectOptions[]
  text: string
}

export type MenuConfigItem = SelectConfig | ButtonConfig

export type MenuConfig = MenuConfigItem[][]

export const button = (config: ButtonConfig, ctx: Ctx) => {
  const $button = document.createElement('button')
  $button.role = 'menuitem'
  $button.setAttribute('type', 'button')
  if (config.content instanceof HTMLElement) {
    $button.appendChild(config.content)
  } else {
    $button.innerText = config.content
  }
  $button.addEventListener('click', () => {
    ctx.get(commandsCtx).call(config.key)
  })
  return [$button]
}

export const divider = () => {
  const $divider = document.createElement('div')
  $divider.role = 'separator'
  return [$divider]
}

export const select = (config: SelectConfig, _ctx: Ctx) => {
  const $button = document.createElement('button')
  $button.role = 'menuitem'
  $button.setAttribute('type', 'button')
  $button.setAttribute('aria-haspopup', 'true')
  $button.setAttribute('aria-expanded', 'false')
  $button.setAttribute('tab-index', '0')
  $button.textContent = config.text

  const $buttonExpand = document.createElement('span')
  $buttonExpand.className = 'material-icons material-icons-outlined'
  $buttonExpand.textContent = 'expand_more'

  $button.append($buttonExpand)

  const $select = document.createElement('ul')
  $select.role = 'menu'
  $select.setAttribute('aria-label', config.text)
  $select.setAttribute('tabindex', '-1')

  $select.append(
    ...config.options.map((item) => {
      const listItem = document.createElement('li')
      listItem.role = 'menuitem'
      listItem.setAttribute('tabindex', '-1')
      if (item.content instanceof HTMLElement) {
        listItem.append(item.content)
      } else {
        listItem.textContent = item.content
      }
      return listItem
    }),
  )
  $button.addEventListener('click', () => {
    const expanded = ($button.getAttribute('aria-expanded') ?? 'false') === 'false' ? false : true
    $button.setAttribute('aria-expanded', !expanded ? 'true' : 'false')
    if (!expanded) {
      $select.classList.add('show')
      ;($select.firstChild as HTMLElement).focus()
    } else {
      $select.classList.remove('show')
      $select.blur()
    }
  })
  return [$button, $select]
}
