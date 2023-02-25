import { Extension } from '@codemirror/state'
import { editorCtx } from '@milkdown/core'
import { MilkdownPlugin } from '@milkdown/ctx'
import { Plugin } from '@milkdown/prose/state'
import { $command, $ctx, $prose, getMarkdown } from '@milkdown/utils'
import { codemirrorCtx } from './codemirror'
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

export const splitEditingRootCtx = $ctx({} as HTMLDivElement, 'splitEditingRoot')

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
  const options = ctx.get(splitEditingOptionsCtx.key)
  return new Plugin({
    view: (editorView) => {
      const editorDOM = editorView.dom
      const editorRoot = editorDOM.parentElement as HTMLElement

      const splitEditorRoot = document.createElement('div')
      splitEditorRoot.classList.add('split-editor')
      ctx.set(splitEditingRootCtx.key, splitEditorRoot)

      const { splitEditor, onEditorInput } = codemirrorView(ctx, options)

      editorRoot.removeChild(editorDOM)
      editorRoot.appendChild(splitEditorRoot)
      splitEditorRoot.append(editorDOM, splitEditor)

      editorView.dispatch = (tr) => {
        editorView.updateState(editorView.state.apply(tr))

        if (tr.getMeta('addToHistory') != false && tr.docChanged) {
          const editor = ctx.get(editorCtx)
          const content = editor.action(getMarkdown())
          onEditorInput(content)
        }
      }
      return {
        destroy: () => {
          editorRoot.removeChild(splitEditor)
        },
      }
    },
  })
})

export const splitEditing: MilkdownPlugin[] = [
  splitEditingRootCtx,
  splitEditingOptionsCtx,
  splitEditingCtx,
  codemirrorCtx,
  toggleSplitEditing,
  splitEditingProsePlugin,
]
