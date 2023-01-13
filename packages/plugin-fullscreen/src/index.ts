import { createCmd, createCmdKey, createSlice, editorViewCtx, rootCtx } from '@milkdown/core'
import { AtomList, createPlugin, createShortcut } from '@milkdown/utils'

export interface Options {
  /** className when editor be fullscreen */
  classes?: string
}

const getRoot = (root: string | Node | null | undefined) => {
  if (!root) return document.body

  if (typeof root === 'string') {
    const el = document.querySelector(root)
    if (el) return el

    return document.body
  }

  return root
}

export const fullscreenCtx = createSlice({ value: false }, 'fullscreen')

export const ToggleFullscreen = createCmdKey('ToggleFullscreen')

export const fullscreenPlugin = createPlugin<string, Options>((utils, options) => {
  const id = 'fullscreen'
  const classes = options?.classes
    ? options.classes
    : utils.getStyle(({ css }) => {
        return css`
          position: fixed !important;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 999;
          .milkdown {
            height: 100%;
            overflow-y: scroll;
          }
        `
      })
  return {
    id,
    commands: (_type, ctx) => [
      createCmd(ToggleFullscreen, () => {
        const { value } = ctx.get(fullscreenCtx)
        ctx.set(fullscreenCtx, { value: !value })

        let targetDOM: HTMLElement | null = null

        const root = ctx.get(rootCtx)
        const rootDOM = getRoot(root) as HTMLDivElement

        // compatible with official plugin-menu
        const menuDOM = rootDOM.querySelector('div.milkdown-menu-wrapper') as HTMLDivElement
        if (menuDOM) {
          targetDOM = menuDOM
        } else {
          const editorDOM = ctx.get(editorViewCtx).dom
          const milkdownDOM = editorDOM.parentElement

          if (!milkdownDOM) throw new Error('Missing root element')
          targetDOM = milkdownDOM
        }

        if (ctx.get(fullscreenCtx).value) {
          targetDOM.classList.add(classes ?? '')
        } else {
          targetDOM.classList.remove(classes ?? '')
        }

        return () => true
      }),
    ],
    shortcuts: {
      Fullscreen: createShortcut(ToggleFullscreen, 'F11'),
    },
    injectSlices: [fullscreenCtx],
  }
})

export const fullscreen = AtomList.create([fullscreenPlugin()])
