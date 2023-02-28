import { commandsCtx, editorViewCtx } from '@milkdown/core'
import { Ctx } from '@milkdown/ctx'

type CommandPayload = unknown

export type ButtonConfig = {
  type: 'button'
  content: string | HTMLElement
  key: string | [string, CommandPayload]
  active?: (ctx: Ctx) => boolean
  disabled?: (ctx: Ctx) => boolean
}

export type SelectOptions = {
  id: string | number
  content: string | HTMLElement
}

export type SelectConfig = {
  type: 'select'
  options: SelectOptions[]
  text: string
  onSelect: (id: SelectOptions['id']) => [string, CommandPayload] | string
  disabled?: (ctx: Ctx) => boolean
}

export type MenuConfigItem = SelectConfig | ButtonConfig

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
    if (typeof config.key === 'string') ctx.get(commandsCtx).call(config.key)
    else ctx.get(commandsCtx).call(config.key[0], config.key[1])
  })

  return [$button]
}

export const divider = () => {
  const $divider = document.createElement('div')
  $divider.role = 'separator'
  return [$divider]
}

export const select = (config: SelectConfig, ctx: Ctx) => {
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
      listItem.addEventListener('click', () => {
        const command = config.onSelect(item.id)
        if (typeof command === 'string') {
          ctx.get(commandsCtx).call(command)
        } else {
          ctx.get(commandsCtx).call(command[0], command[1])
        }
        $button.setAttribute('aria-expanded', 'false')
        $select.classList.remove('show')
        $select.blur()
      })
      return listItem
    }),
  )
  $button.addEventListener('click', () => {
    const expanded = ($button.getAttribute('aria-expanded') ?? 'false') === 'false' ? false : true
    $button.setAttribute('aria-expanded', !expanded ? 'true' : 'false')
    if (!expanded) {
      $select.classList.add('show')
      ctx.get(editorViewCtx).dom.addEventListener('click', onClickOutside)
    } else {
      $select.classList.remove('show')
      $select.blur()
      ctx.get(editorViewCtx).dom.removeEventListener('click', onClickOutside)
    }
    function onClickOutside() {
      $button.setAttribute('aria-expanded', 'false')
      $select.classList.remove('show')
      $select.blur()
    }
  })

  return [$button, $select]
}
