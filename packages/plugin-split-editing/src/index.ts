import { createCmd, createCmdKey, createSlice, Ctx, editorCtx, rootDOMCtx } from '@milkdown/core'
import { Plugin } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import { AtomList, createPlugin, getMarkdown } from '@milkdown/utils'
import { initTwoColumns, initWrapper } from './two-columns'

export const splitEditingCtx = createSlice({ value: false }, 'two-columns')

export const ToggleSplitEditing = createCmdKey('ToggleSplitEditing')

export const splitEditingPlugin = createPlugin((utils) => {
  let onEditorInput: ((content: string) => void) | null = null
  let restoreDOM: (() => void) | null = null
  let twoColumns: HTMLDivElement | null = null
  let twoColumnWrapper: HTMLDivElement | null = null

  const initView = (ctx: Ctx, editorView: EditorView) => {
    if (!twoColumnWrapper) {
      twoColumnWrapper = initWrapper(ctx, editorView)
    }

    if (!twoColumns) {
      const [_twoColumns, _restoreDOM, _onEditorInput] = initTwoColumns(utils, editorView, ctx, twoColumnWrapper)
      twoColumns = _twoColumns
      restoreDOM = () => {
        const milkdownDOM = _restoreDOM()
        twoColumnWrapper = null
        twoColumns = null
        restoreDOM = null
        ctx.set(rootDOMCtx, milkdownDOM)
      }
      onEditorInput = (content) => {
        _onEditorInput(content)
      }
    }
  }
  return {
    commands: (_type, ctx) => [
      createCmd(ToggleSplitEditing, () => {
        const { value } = ctx.get(splitEditingCtx)
        ctx.set(splitEditingCtx, { value: !value })
        if (twoColumns) {
          if (value) {
            twoColumns.classList.remove('hidden')
          } else {
            twoColumns.classList.add('hidden')
          }
        }
        return () => true
      }),
    ],
    injectSlices: [splitEditingCtx],
    prosePlugins: (_, ctx) => {
      const plugin = new Plugin({
        view: (editorView) => {
          initView(ctx, editorView)
          editorView.dispatch = (tr) => {
            editorView.updateState(editorView.state.apply(tr))
            if (!tr.getMeta('sync')) {
              const editor = ctx.get(editorCtx)
              const content = editor.action(getMarkdown())
              onEditorInput?.(content)
            }
          }
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

export const splitEditing = AtomList.create([splitEditingPlugin()])
