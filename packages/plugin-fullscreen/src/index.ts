import { createCmd, createCmdKey, createSlice, editorViewCtx } from '@milkdown/core'
import { AtomList, createPlugin, createShortcut } from '@milkdown/utils'

export interface Options {
  /** className when editor be fullscreen */
  classes?: string
}

export const fullscreenCtx = createSlice({ value: false }, 'fullscreen')

export const ToggleFullscreen = createCmdKey('ToggleFullscreen')

export const fullscreenPlugin = createPlugin<string, Options>((utils, options) => {
  const id = 'fullscreen'
  const classes = options?.classes
    ? options.classes
    : utils.getStyle((emotion) => emotion.css`position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: 999;`)
  return {
    id,
    commands: (_type, ctx) => [
      createCmd(ToggleFullscreen, () => {
        const { value } = ctx.get(fullscreenCtx)
        ctx.set(fullscreenCtx, { value: !value })

        const { dom } = ctx.get(editorViewCtx)

        const rootEle = dom.parentElement ?? dom
        if (ctx.get(fullscreenCtx).value) {
          rootEle?.classList.add(classes ?? '')
        } else {
          rootEle.classList.remove(classes ?? '')
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

export {}
