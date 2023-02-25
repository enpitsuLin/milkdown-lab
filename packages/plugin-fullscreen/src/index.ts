import { editorViewCtx } from '@milkdown/core'
import { MilkdownPlugin } from '@milkdown/ctx'
import { $command, $ctx, $shortcut } from '@milkdown/utils'

export interface Options {
  /** className when editor be fullscreen */
  classes?: string
}

export const fullscreenConfig = $ctx<Options, 'fullscreenConfig'>({ classes: 'fullscreen' }, 'fullscreenConfig')

export const fullscreenCtx = $ctx({ value: false }, 'fullscreen')

const toggleFullscreen = $command<boolean, 'ToggleFullscreen'>('ToggleFullscreen', (ctx) => {
  return (payload) => {
    const { value } = ctx.get(fullscreenCtx.key)

    if (typeof payload === 'undefined') {
      ctx.set(fullscreenCtx.key, { value: !value })
    } else {
      ctx.set(fullscreenCtx.key, { value: payload })
    }

    const editorDOM = ctx.get(editorViewCtx).dom
    const milkdownDOM = editorDOM.parentElement

    if (!milkdownDOM) throw new Error('Missing root element')

    if (ctx.get(fullscreenCtx.key).value) {
      milkdownDOM.classList.add('fullscreen')
    } else {
      milkdownDOM.classList.remove('fullscreen')
    }
    return () => true
  }
})

export const fullscreenShortcut = $shortcut(() => ({
  F11: () => toggleFullscreen.run(),
}))

export const fullscreen: MilkdownPlugin[] = [
  fullscreenConfig,
  fullscreenCtx,
  toggleFullscreen,
  fullscreenShortcut,
].flat()
