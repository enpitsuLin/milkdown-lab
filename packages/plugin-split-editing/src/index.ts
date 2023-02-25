import { Extension } from '@codemirror/state'
import { editorCtx } from '@milkdown/core'
import { MilkdownPlugin } from '@milkdown/ctx'
import { Plugin } from '@milkdown/prose/state'
import { $command, $ctx, $prose, getMarkdown } from '@milkdown/utils'
import { codemirrorView } from './split-editor'

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
  return new Plugin({
    view: (editorView) => {
      const editorDOM = editorView.dom
      const editorRoot = editorDOM.parentElement as HTMLElement

      const { splitEditor, onEditorInput } = codemirrorView(ctx, {})

      editorRoot.classList.add('milkdown-split-editing')
      editorRoot.appendChild(splitEditor)

      editorView.dispatch = (tr) => {
        editorView.updateState(editorView.state.apply(tr))
        console.log(tr.getMeta('addToHistory'))

        if (tr.getMeta('addToHistory') && tr.docChanged) {
          const editor = ctx.get(editorCtx)
          const content = editor.action(getMarkdown())
          onEditorInput(content)
        }
      }
      return {
        update: () => {},
        destroy: () => {
          editorRoot.removeChild(splitEditor)
        },
      }
    },
  })
})

export const splitEditing: MilkdownPlugin[] = [splitEditingCtx, toggleSplitEditing, splitEditingProsePlugin]
