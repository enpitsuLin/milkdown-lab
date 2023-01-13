import { Ctx, ThemeColor } from '@milkdown/core'
import { EditorView } from '@milkdown/prose/view'
import { ThemeUtils, replaceAll } from '@milkdown/utils'

const textareaColumn = (utils: ThemeUtils, ctx: Ctx, _onInput?: () => void) => {
  const twoColumns = document.createElement('div')
  twoColumns.classList.add('milkdown-two-columns')

  const textarea = document.createElement('textarea')

  utils.themeManager.onFlush(() => {
    const style = utils.getStyle(({ css }) => {
      return css`
        background: ${utils.themeManager.get(ThemeColor, ['background'])};
        padding: 20px 10px;
      `
    })
    if (style) twoColumns.classList.add(style)

    const textareaStyle = utils.getStyle(({ css }) => {
      const style = css`
        appearance: none;
        outline: none;
        resize: none;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background: transparent;
        border: none;
        color: ${utils.themeManager.get(ThemeColor, ['solid'])};
      `
      return style
    })
    if (textareaStyle) textarea.classList.add(textareaStyle)
  })

  textarea.addEventListener('input', (e) => {
    const content = (e.target as HTMLTextAreaElement).value
    replaceAll(content)(ctx)
  })

  twoColumns.append(textarea)

  return twoColumns
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

  const twoColumns = textareaColumn(utils, ctx)

  const editorDOM = view.dom as HTMLDivElement
  const { themeManager } = utils

  themeManager.onFlush(() => {
    const wrapperStyle = utils.getStyle(({ css }) => {
      return css`
        display: flex;
        > div {
          width: 50%;
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

  return [twoColumns, restoreDOM] as const
}
