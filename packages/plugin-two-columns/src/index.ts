import { createCmd, createCmdKey, createSlice, Ctx, rootDOMCtx } from '@milkdown/core'
import { Plugin } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import { AtomList, createPlugin } from '@milkdown/utils'
import { initTwoColumns, initWrapper } from './two-columns'

export const twoColumnsCtx = createSlice({ value: false }, 'two-columns')

export const ToggleTwoColumn = createCmdKey('ToggleTwoColumn')

export const twoColumnsPlugin = createPlugin((utils) => {
  let restoreDOM: (() => void) | null = null
  let twoColumns: HTMLDivElement | null = null
  let twoColumnWrapper: HTMLDivElement | null = null

  const initView = (ctx: Ctx, editorView: EditorView) => {
    if (!twoColumnWrapper) {
      twoColumnWrapper = initWrapper(ctx, editorView)
    }

    if (!twoColumns) {
      const [_twoColumns, _restoreDOM] = initTwoColumns(utils, editorView, ctx, twoColumnWrapper)
      twoColumns = _twoColumns
      restoreDOM = () => {
        const milkdownDOM = _restoreDOM()
        twoColumnWrapper = null
        twoColumns = null
        restoreDOM = null
        ctx.set(rootDOMCtx, milkdownDOM)
      }
    }
  }
  return {
    commands: (_type, ctx) => [
      createCmd(ToggleTwoColumn, () => {
        const { value } = ctx.get(twoColumnsCtx)
        ctx.set(twoColumnsCtx, { value: !value })

        return () => true
      }),
    ],
    injectSlices: [twoColumnsCtx],
    prosePlugins: (_, ctx) => {
      const plugin = new Plugin({
        view: (editorView) => {
          initView(ctx, editorView)
          return {
            update: () => {
              initView(ctx, editorView)
            },
            destroy: () => {
              restoreDOM?.()
            },
          }
        },
      })
      return [plugin]
    },
  }
})

export const twoColumns = AtomList.create([twoColumnsPlugin()])
