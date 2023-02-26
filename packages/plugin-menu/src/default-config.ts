import { Ctx } from '@milkdown/ctx'
import { MenuConfig } from './menu-item'
import { menuConfigCtx } from './menu-plugin'

const createIconContent = (icon: string) => {
  const span = document.createElement('span')
  span.className = 'material-icons material-icons-outlined'
  span.textContent = icon
  return span
}

export const defaultConfig: MenuConfig = [
  [
    {
      type: 'button',
      content: createIconContent('turn_left'),
      key: 'Undo',
    },
    {
      type: 'button',
      content: createIconContent('turn_right'),
      key: 'Redo',
    },
  ],
  [
    {
      type: 'select',
      text: 'Heading',
      options: [
        { id: '1', content: 'Large Heading' },
        { id: '2', content: 'Medium Heading' },
        { id: '3', content: 'Small Heading' },
        { id: '0', content: 'Plain Text' },
      ],
    },
  ],
  [
    {
      type: 'button',
      content: createIconContent('format_bold'),
      key: 'ToggleBold',
    },
    {
      type: 'button',
      content: createIconContent('format_italic'),
      key: 'ToggleItalic',
    },
    {
      type: 'button',
      content: createIconContent('strikethrough_s'),
      key: 'ToggleStrikeThrough',
    },
  ],
  [
    {
      type: 'button',
      content: createIconContent('format_list_bulleted'),
      key: 'WrapInBulletList',
    },
    {
      type: 'button',
      content: createIconContent('format_list_numbered'),
      key: 'WrapInOrderedList',
    },
    {
      type: 'button',
      content: createIconContent('checklist'),
      key: 'TurnIntoTaskList',
    },
    {
      type: 'button',
      content: createIconContent('format_indent_decrease'),
      key: 'LiftListItem',
    },
    {
      type: 'button',
      content: createIconContent('format_indent_increase'),
      key: 'SinkListItem',
    },
  ],
  [
    {
      type: 'button',
      content: createIconContent('link'),
      key: 'ToggleLink',
    },
    {
      type: 'button',
      content: createIconContent('image'),
      key: 'InsertImage',
    },
    {
      type: 'button',
      content: createIconContent('table_chart'),
      key: 'InsertTable',
    },
    {
      type: 'button',
      content: createIconContent('code'),
      key: 'TurnIntoCodeFence',
    },
  ],
  [
    {
      type: 'button',
      content: createIconContent('format_quote'),
      key: 'WrapInBlockquote',
    },
    {
      type: 'button',
      content: createIconContent('horizontal_rule'),
      key: 'InsertHr',
    },
    {
      type: 'button',
      content: createIconContent('select_all'),
      key: 'SelectParent',
    },
  ],
]

export const menuDefaultConfig = (ctx: Ctx) => {
  ctx.set(menuConfigCtx.key, defaultConfig)
}
