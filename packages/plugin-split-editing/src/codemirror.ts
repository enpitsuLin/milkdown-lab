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
import { $ctx } from '@milkdown/utils'
import { StyleModule } from 'style-mod'
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
  onChange?: (content: string) => void
}

export class CodemirrorEditor {
  state: EditorState
  view: EditorView
  onChange: (content: string) => void
  constructor(root: HTMLElement, options: CodemirrorOptions) {
    this.state = this.createState(options)
    this.view = new EditorView({
      state: this.state,
      parent: root,
    })
    this.onChange = options?.onChange ?? (() => {})
  }
  createState(options: CodemirrorOptions = {}) {
    const { value = '', extensions = [], lineNumber = true } = options
    if (lineNumber) extensions.push(lineNumbers(), foldGutter())
    const updateListener = EditorView.updateListener.of((update) => {
      const allTrIsUserInput = !update.transactions.map((item) => item.isUserEvent('input')).some((i) => !i)

      if (update.docChanged && allTrIsUserInput) {
        const content = update.view.state.doc.toString()
        this.onChange(content)
      }
    })
    return EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        markdown(),
        EditorView.styleModule.of(
          new StyleModule({
            '.cm-editor': {
              height: '100%',
            },
          }),
        ),
        EditorView.lineWrapping,
        updateListener,
        ...extensions,
      ],
    })
  }
  setContent = (content: string) => {
    const length = this.view.state.doc.length
    const tr = { changes: [{ from: 0, to: length, insert: content }] }
    this.view.dispatch(tr)
  }
}

export const codemirrorCtx = $ctx({} as CodemirrorEditor, 'codemirror')
