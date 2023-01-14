import { Ctx, editorCtx, ThemeColor, ThemeScrollbar } from '@milkdown/core'
import { EditorView } from '@milkdown/prose/view'
import { replaceAll, ThemeUtils } from '@milkdown/utils'
import { CodemirrorEditor } from './codemirror'

const textareaColumn = (utils: ThemeUtils, ctx: Ctx) => {
  const twoColumns = document.createElement('div')
  twoColumns.classList.add('milkdown-two-columns')

  const codemirror = new CodemirrorEditor(twoColumns)
  codemirror.onChange = (content: string) => {
    const editor = ctx.get(editorCtx)
    editor.action(replaceAll(content))
  }

  utils.themeManager.onFlush(() => {
    const style = utils.getStyle(({ css }) => {
      return css`
        background: ${utils.themeManager.get(ThemeColor, ['background'])};
        color: ${utils.themeManager.get(ThemeColor, ['solid'])};
        &.hidden {
          display: none;
        }
        > .cm-editor {
          height: 100%;
        }
        .cm-scroller {
          ${utils.themeManager.get(ThemeScrollbar, ['y'])}
        }
      `
    })

    if (style) twoColumns.classList.add(style)
  })

  const onEditorInput = (_content: string) => {
    codemirror.setContent(_content)
  }

  return { twoColumns, onEditorInput }
}

export const initWrapper = (_ctx: Ctx, view: EditorView) => {
  let wrapper: HTMLDivElement | null = null
  wrapper = document.createElement('div')
  wrapper.classList.add('milkdown-two-columns-wrapper')

  const editorDOM = view.dom
  const milkdownDOM = editorDOM.parentElement
  const editorRoot = milkdownDOM?.parentElement as HTMLElement
  if (!milkdownDOM || !editorRoot) throw new Error('Missing root element')

  editorRoot.replaceChild(wrapper, milkdownDOM)
  wrapper.appendChild(milkdownDOM)
  return wrapper
}

export const initTwoColumns = (
  utils: ThemeUtils,
  view: EditorView,
  ctx: Ctx,
  twoColumnsWrapper: HTMLDivElement | null,
) => {
  if (!twoColumnsWrapper) throw new Error('Missing wrapper element')

  const { twoColumns, onEditorInput } = textareaColumn(utils, ctx)

  const editorDOM = view.dom as HTMLDivElement

  const { themeManager } = utils

  themeManager.onFlush(() => {
    const wrapperStyle = utils.getStyle(({ css }) => {
      return css`
        display: flex;
        height: 100%;
        > div {
          flex: 1;
        }
      `
    })
    if (wrapperStyle) twoColumnsWrapper.classList.add(wrapperStyle)
  })

  const milkdownDOM = editorDOM.parentElement
  const editorRoot = milkdownDOM?.parentElement as HTMLElement
  if (!milkdownDOM) throw new Error('Missing root element')

  twoColumnsWrapper.append(twoColumns)

  const restoreDOM = () => {
    editorRoot.appendChild(milkdownDOM)
    twoColumnsWrapper.remove()
    twoColumns.remove()
    return milkdownDOM
  }

  return [twoColumns, restoreDOM, onEditorInput] as const
}
