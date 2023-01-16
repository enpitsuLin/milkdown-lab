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

const basicSetup: Extension = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  foldGutter(),
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

export class CodemirrorEditor {
  state: EditorState
  view: EditorView
  onChange: (content: string) => void = () => {
    void 0
  }
  constructor(root: HTMLElement, defaultValue?: string) {
    this.state = this.createState(defaultValue)
    this.view = new EditorView({ state: this.state, parent: root })
  }
  createState(value?: string) {
    return EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        markdown(),
        EditorView.inputHandler.of((view) => {
          const content = view.state.doc.toString()
          this.onChange(content)
          return false
        }),
        EditorView.lineWrapping,
      ],
    })
  }
  setContent = (content: string) => {
    const length = this.view.state.doc.length
    const tr = { changes: [{ from: 0, to: length, insert: content }] }
    this.view.dispatch(tr)
  }
}

export const codemirrorCtx = createSlice({}, 'codemirror')
