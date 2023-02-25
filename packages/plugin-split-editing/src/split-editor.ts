import { defaultValueCtx, editorCtx, editorViewCtx, getDoc, parserCtx, schemaCtx, serializerCtx } from '@milkdown/core'
import { Ctx } from '@milkdown/ctx'
import { Slice } from '@milkdown/prose/model'
import { Options } from '.'
import { CodemirrorEditor } from './codemirror'

const updateContent = (content: string) => {
  return (ctx: Ctx) => {
    const view = ctx.get(editorViewCtx)
    const parser = ctx.get(parserCtx)
    const doc = parser(content)
    if (!doc) return
    const { state } = view
    const tr = state.tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0))
    tr.setMeta('addToHistory', false)
    view.dispatch(tr)
  }
}

export const codemirrorView = (ctx: Ctx, options: Options) => {
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
