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
  /**
   * attribute that should be set to split view element which was codemirror parent
   * @default { class: "milkdown-split-editor" }
   */
  attributes?: Record<string, string>
  /**
   * attribute when split view hide
   * @default { class: "hidden" }
   */
  hiddenAttribute?: Record<string, string>
  /**
   * attribute that should be set to split view wrapper element
   * @default { class: "split-editor" }
   */
  wrapperAttributes?: Record<string, string>
  /**
   * split view wrapper element's attribute when split view hide
   * @default { class: "hidden" }
   */
  hiddenWrapperAttributes?: Record<string, string>
}

export const splitEditingWrapperCtx = $ctx({} as HTMLDivElement, 'splitEditingWrapper')

export const splitEditingRootCtx = $ctx({} as HTMLDivElement, 'splitEditingRoot')

export const splitEditingOptionsCtx = $ctx<Options, 'splitEditingOptions'>({}, 'splitEditingOptions')

export const splitEditingCtx = $ctx({ value: false }, 'splitEditing')

export const toggleSplitEditing = $command<boolean, 'ToggleSplitEditing'>('ToggleSplitEditing', (ctx) => {
  const options = ctx.get(splitEditingOptionsCtx.key)
  return (payload) => {
    const { value } = ctx.get(splitEditingCtx.key)

    const toggleHidden = (show: boolean) => {
      const wrapper = ctx.get(splitEditingWrapperCtx.key)
      const root = ctx.get(splitEditingRootCtx.key)
      Object.entries(options.hiddenAttribute ?? { class: 'hidden' }).forEach(([key, val]) => {
        if (show) {
          if (key === 'class') wrapper.classList.add(...val.split(' '))
          else wrapper.setAttribute(key, val)
        } else {
          if (key === 'class') wrapper.classList.remove(...val.split(' '))
          else wrapper.removeAttribute(key)
        }
      })
      Object.entries(options.hiddenWrapperAttributes ?? { class: 'hidden' }).forEach(([key, val]) => {
        if (show) {
          if (key === 'class') root.classList.add(...val.split(' '))
          else root.setAttribute(key, val)
        } else {
          if (key === 'class') root.classList.remove(...val.split(' '))
          else root.removeAttribute(key)
        }
      })
    }
    if (typeof payload === 'undefined') {
      ctx.set(splitEditingCtx.key, { value: !value })
      toggleHidden(!value)
    } else {
      ctx.set(splitEditingCtx.key, { value: payload })
      toggleHidden(payload)
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
      Object.entries(options.wrapperAttributes ?? { class: 'split-editor' }).forEach(([key, val]) => {
        if (key === 'class') splitEditorRoot.classList.add(...val.split(' '))
        else splitEditorRoot.setAttribute(key, val)
      })

      const { splitEditor, onEditorInput } = codemirrorView(ctx, options)

      ctx.set(splitEditingWrapperCtx.key, splitEditor)
      ctx.set(splitEditingRootCtx.key, splitEditorRoot)

      editorRoot.replaceChildren(editorDOM, splitEditorRoot)
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
          editorRoot.replaceChildren(splitEditorRoot, editorDOM)
        },
      }
    },
  })
})

export const splitEditing: MilkdownPlugin[] = [
  splitEditingWrapperCtx,
  splitEditingRootCtx,
  splitEditingOptionsCtx,
  splitEditingCtx,
  codemirrorCtx,
  toggleSplitEditing,
  splitEditingProsePlugin,
]
