import { Extension } from '@codemirror/state'
import { editorCtx, rootDOMCtx } from '@milkdown/core'
import { Ctx, MilkdownPlugin } from '@milkdown/ctx'
import { Plugin } from '@milkdown/prose/state'
import { EditorView } from '@milkdown/prose/view'
import { $command, $ctx, $prose, getMarkdown } from '@milkdown/utils'
import { initTwoColumns, initWrapper } from './split-editor'

export interface Options {
  /**
   * codemirror extensions
   */
  extensions?: Extension[]
  /**
   * lineNumber show or not
   */
  lineNumber?: boolean
}

export const splitEditingOptionsCtx = $ctx<Options, 'splitEditingOptions'>({}, 'splitEditingOptions')

export const splitEditingCtx = $ctx({ value: false }, 'splitEditing')

export const toggleSplitEditing = $command<boolean, 'ToggleSplitEditing'>('ToggleSplitEditing', (ctx) => {
  return (payload) => {
    const { value } = ctx.get(splitEditingCtx.key)

    if (typeof payload === 'undefined') {
      ctx.set(splitEditingCtx.key, { value: !value })
    } else {
      ctx.set(splitEditingCtx.key, { value: payload })
    }
    return () => true
  }
})

export const splitEditingProsePlugin = $prose((ctx) => {
  let onEditorInput: ((content: string) => void) | null = null
  let restoreDOM: (() => void) | null = null
  let twoColumns: HTMLDivElement | null = null
  let twoColumnWrapper: HTMLDivElement | null = null

  const initView = (ctx: Ctx, editorView: EditorView) => {
    if (!twoColumnWrapper) {
      twoColumnWrapper = initWrapper(ctx, editorView)
    }

    if (!twoColumns) {
      const [_twoColumns, _restoreDOM, _onEditorInput] = initTwoColumns(editorView, ctx, twoColumnWrapper, {})
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
  return new Plugin({
    view: (view) => {
      initView(ctx, view)
      view.dispatch = (tr) => {
        view.updateState(view.state.apply(tr))
        if (!tr.getMeta('sync') && tr.docChanged) {
          const editor = ctx.get(editorCtx)
          const content = editor.action(getMarkdown())

          onEditorInput?.(content)
        }
      }
      return {
        update: () => {
          initView(ctx, view)
        },
        destroy: () => {
          restoreDOM?.()
        },
      }
    },
  })
})

export const splitEditing: MilkdownPlugin[] = [splitEditingCtx, toggleSplitEditing, splitEditingProsePlugin]
