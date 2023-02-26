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

export const button = (config: ButtonConfig) => {
  const $button = document.createElement('button')
  $button.role = 'menuitem'
  $button.setAttribute('type', 'button')
  if (config.content instanceof HTMLElement) {
    $button.appendChild(config.content)
  } else {
    $button.innerText = config.content
  }
  return [$button]
}

export const divider = () => {
  const $divider = document.createElement('div')
  $divider.textContent = '|'
  $divider.role = 'separator'
  return [$divider]
}

export const select = (config: SelectConfig) => {
  const $button = document.createElement('button')
  $button.setAttribute('type', 'button')
  $button.textContent = config.text

  const $select = document.createElement('ul')
  $select.role = 'menu'
  $select.setAttribute('data-option', config.text)
  $select.setAttribute('aria-label', config.text)

  $select.append(
    ...config.options.map((item) => {
      const listItem = document.createElement('li')
      listItem.role = 'menuitem'
      if (item.content instanceof HTMLElement) {
        listItem.append(item.content)
      } else {
        listItem.textContent = item.content
      }
      return listItem
    }),
  )
  return [$button, $select]
}
