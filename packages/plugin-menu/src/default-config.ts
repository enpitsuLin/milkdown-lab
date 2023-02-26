import { Ctx } from '@milkdown/ctx'
import { MenuConfig } from './menu-item'
import { menuConfigCtx } from './menu-plugin'

export const defaultConfig: MenuConfig = [
  [
    {
      type: 'button',
      content: 'undo',
      key: 'Undo',
    },
    {
      type: 'button',
      content: 'redo',
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
      content: 'bold',
      key: 'ToggleBold',
    },
    {
      type: 'button',
      content: 'italic',
      key: 'ToggleItalic',
    },
    {
      type: 'button',
      content: 'strikeThrough',
      key: 'ToggleStrikeThrough',
    },
  ],
  [
    {
      type: 'button',
      content: 'bulletList',
      key: 'WrapInBulletList',
    },
    {
      type: 'button',
      content: 'orderedList',
      key: 'WrapInOrderedList',
    },
    {
      type: 'button',
      content: 'taskList',
      key: 'TurnIntoTaskList',
    },
    {
      type: 'button',
      content: 'liftList',
      key: 'LiftListItem',
    },
    {
      type: 'button',
      content: 'sinkList',
      key: 'SinkListItem',
    },
  ],
  [
    {
      type: 'button',
      content: 'link',
      key: 'ToggleLink',
    },
    {
      type: 'button',
      content: 'image',
      key: 'InsertImage',
    },
    {
      type: 'button',
      content: 'table',
      key: 'InsertTable',
    },
    {
      type: 'button',
      content: 'code',
      key: 'TurnIntoCodeFence',
    },
  ],
  [
    {
      type: 'button',
      content: 'quote',
      key: 'WrapInBlockquote',
    },
    {
      type: 'button',
      content: 'divider',
      key: 'InsertHr',
    },
    {
      type: 'button',
      content: 'select',
      key: 'SelectParent',
    },
  ],
]

export const menuDefaultConfig = (ctx: Ctx) => {
  ctx.set(menuConfigCtx.key, defaultConfig)
}
