import { markdown } from '@codemirror/lang-markdown'
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import { EditorState } from '@codemirror/state'
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from '@codemirror/view'
import { createSlice } from '@milkdown/core'
import { Options } from '.'

const basicSetup: Extension = [
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  keymap.of(foldKeymap),
]

export type CodemirrorOptions = Options & {
  value?: string
}

export class CodemirrorEditor {
  state: EditorState
  view: EditorView
  onChange: (content: string) => void = () => {
    void 0
  }
  constructor(root: HTMLElement, options?: CodemirrorOptions) {
    this.state = this.createState(options)
    this.view = new EditorView({
      state: this.state,
      parent: root,
      dispatch: (tr) => {
        this.view.update([tr])
        if (tr.isUserEvent('input')) {
          const content = this.view.state.doc.toString()
          this.onChange(content)
        }
      },
    })
  }
  createState(options: CodemirrorOptions = {}) {
    const { value = '', extensions = [], lineNumber = true } = options
    if (lineNumber) extensions.push(lineNumbers(), foldGutter())
    return EditorState.create({
      doc: value,
      extensions: [basicSetup, markdown(), EditorView.lineWrapping, ...extensions],
    })
  }
  setContent = (content: string) => {
    const length = this.view.state.doc.length
    const tr = { changes: [{ from: 0, to: length, insert: content }] }
    this.view.dispatch(tr)
  }
}

export const codemirrorCtx = createSlice({}, 'codemirror')
