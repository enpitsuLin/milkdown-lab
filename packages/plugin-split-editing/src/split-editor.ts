import { defaultValueCtx, editorCtx, editorViewCtx, getDoc, parserCtx, schemaCtx, serializerCtx } from '@milkdown/core'
import { Slice } from '@milkdown/prose/model'
import { EditorView } from '@milkdown/prose/view'
import { Options } from '.'
import { CodemirrorEditor } from './codemirror'
import { Ctx } from '@milkdown/ctx'

const updateContent = (content: string) => {
  return (ctx: Ctx) => {
    const view = ctx.get(editorViewCtx)
    const parser = ctx.get(parserCtx)
    const doc = parser(content)
    if (!doc) return
    const { state } = view
    const tr = state.tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0))
    tr.setMeta('sync', true)
    view.dispatch(tr)
  }
}

const codemirrorView = (ctx: Ctx, options: Options) => {
  const splitEditor = document.createElement('div')
  splitEditor.classList.add('milkdown-split-editor')

  const defaultValue = ctx.get(defaultValueCtx)
  const schema = ctx.get(schemaCtx)
  const parser = ctx.get(parserCtx)

  const serializer = ctx.get(serializerCtx)
  const doc = getDoc(defaultValue, parser, schema)
  const content = doc ? serializer(doc) : ''

  const codemirror = new CodemirrorEditor(splitEditor, {
    value: content,
    extensions: options.extensions,
    lineNumber: options.lineNumber,
  })
  codemirror.onChange = (content: string) => {
    const editor = ctx.get(editorCtx)
    editor.action(updateContent(content))
  }

  const onEditorInput = (_content: string) => {
    codemirror.setContent(_content)
  }

  return { splitEditor, onEditorInput }
}

export const initWrapper = (_ctx: Ctx, view: EditorView) => {
  let wrapper: HTMLDivElement | null = null
  wrapper = document.createElement('div')
  wrapper.classList.add('milkdown-split-editing-wrapper')

  const editorDOM = view.dom
  const milkdownDOM = editorDOM.parentElement
  const editorRoot = milkdownDOM?.parentElement as HTMLElement
  if (!milkdownDOM || !editorRoot) throw new Error('Missing root element')

  editorRoot.replaceChild(wrapper, milkdownDOM)
  wrapper.appendChild(milkdownDOM)
  return wrapper
}

export const initTwoColumns = (view: EditorView, ctx: Ctx, wrapper: HTMLDivElement | null, options: Options) => {
  if (!wrapper) throw new Error('Missing wrapper element')

  const { splitEditor, onEditorInput } = codemirrorView(ctx, options)

  const editorDOM = view.dom as HTMLDivElement

  const milkdownDOM = editorDOM.parentElement
  const editorRoot = milkdownDOM?.parentElement as HTMLElement
  if (!milkdownDOM) throw new Error('Missing root element')

  wrapper.append(splitEditor)

  const restoreDOM = () => {
    editorRoot.appendChild(milkdownDOM)
    wrapper.remove()
    splitEditor.remove()
    return milkdownDOM
  }

  return [splitEditor, restoreDOM, onEditorInput] as const
}
