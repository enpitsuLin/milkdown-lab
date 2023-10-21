import { editorStateCtx, prosePluginsCtx, schemaCtx } from '@milkdown/core'
import { Ctx } from '@milkdown/ctx'
import { MarkType } from '@milkdown/prose/model'
import { EditorState } from '@milkdown/prose/state'
import { MenuConfigItem } from './menu-item'
import { MenuPluginConfig, menuConfigCtx } from './menu-plugin'

const createIconContent = (icon: string) => {
  const span = document.createElement('span')
  span.className = 'material-icons material-icons-outlined'
  span.textContent = icon
  return span
}

const hasMark = (state: EditorState, type: MarkType | undefined): boolean => {
  if (!type) return false
  const { from, $from, to, empty } = state.selection
  if (empty) return !!type.isInSet(state.storedMarks || $from.marks())

  return state.doc.rangeHasMark(from, to, type)
}

const getUndoDepth = (ctx: Ctx): number => {
  const historyKey = ctx.get(prosePluginsCtx).find(
    //@ts-expect-error: inner property
    (i) => i.key === 'history$',
  )

  const state = ctx.get(editorStateCtx)
  const hist = historyKey?.getState(state)
  return hist ? hist.done.eventCount : 0
}

const getRedoDepth = (ctx: Ctx): number => {
  const historyKey = ctx.get(prosePluginsCtx).find(
    //@ts-expect-error: inner property
    (i) => i.key === 'history$',
  )

  const state = ctx.get(editorStateCtx)
  const hist = historyKey?.getState(state)
  return hist ? hist.undone.eventCount : 0
}

export const defaultConfigItems: MenuConfigItem[][] = [
  [
    {
      type: 'button',
      content: createIconContent('turn_left'),
      key: 'Undo',
      disabled: (ctx) => {
        try {
          if (!!ctx.get('historyProviderConfig')) {
            const undoDepth = getUndoDepth(ctx)
            return undoDepth <= 0
          }
        } catch (error) {
          return true
        }
        return true
      },
    },
    {
      type: 'button',
      content: createIconContent('turn_right'),
      key: 'Redo',
      disabled: (ctx) => {
        try {
          if (!!ctx.get('historyProviderConfig')) {
            const redoDepth = getRedoDepth(ctx)
            return redoDepth <= 0
          }
        } catch (error) {
          return true
        }
        return true
      },
    },
  ],
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
      onSelect: (id) => (!!id ? ['WrapInHeading', id] : 'TurnIntoText'),
    },
  ],
  [
    {
      type: 'button',
      content: createIconContent('format_bold'),
      key: 'ToggleStrong',
      active: (ctx) => {
        const state = ctx.get(editorStateCtx)
        const schema = ctx.get(schemaCtx)
        return hasMark(state, schema.marks.strong)
      },
    },
    {
      type: 'button',
      content: createIconContent('format_italic'),
      key: 'ToggleEmphasis',
      active: (ctx) => {
        const state = ctx.get(editorStateCtx)
        const schema = ctx.get(schemaCtx)
        return hasMark(state, schema.marks.emphasis)
      },
    },
    {
      type: 'button',
      content: createIconContent('strikethrough_s'),
      key: 'ToggleStrikeThrough',
      active: (ctx) => {
        const state = ctx.get(editorStateCtx)
        const schema = ctx.get(schemaCtx)
        return hasMark(state, schema.marks.strike_through)
      },
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
    // Notice: didn't provider any more in preset-gfm after v7
    // {
    //   type: 'button',
    //   content: createIconContent('checklist'),
    //   key: 'TurnIntoTaskList',
    // },
    {
      type: 'button',
      content: createIconContent('format_indent_decrease'),
      key: 'SplitListItem',
    },
    {
      type: 'button',
      content: createIconContent('format_indent_increase'),
      key: 'SinkListItem',
    },
  ],
  [
    // Notice: this two command work properly, but maybe need improve UX
    // {
    //   type: 'button',
    //   content: createIconContent('link'),
    //   key: ['ToggleLink', { href: '' }],
    // },
    //
    // {
    //   type: 'button',
    //   content: createIconContent('image'),
    //   key: 'InsertImage',
    // },
    {
      type: 'button',
      content: createIconContent('table_chart'),
      key: 'InsertTable',
    },
    {
      type: 'button',
      content: createIconContent('code'),
      key: 'CreateCodeBlock',
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
    // TODO:provide command by this package?
    // {
    //   type: 'button',
    //   content: createIconContent('select_all'),
    //   key: 'SelectParent',
    // },
  ],
]

export const defaultConfig: Required<MenuPluginConfig> = {
  items: defaultConfigItems,
  attributes: { class: 'milkdown-menu' },
}

export const menuDefaultConfig = (ctx: Ctx) => {
  ctx.set(menuConfigCtx.key, defaultConfig)
}
