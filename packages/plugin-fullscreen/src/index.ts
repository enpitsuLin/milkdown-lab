import { editorViewCtx } from '@milkdown/core'
import { MilkdownPlugin } from '@milkdown/ctx'
import { $command, $ctx, $shortcut } from '@milkdown/utils'

export interface Options {
  /**
   * attributes that will be added to editor Element
   */
  attributes?: Record<string, string>
}

export const fullscreenOptionsCtx = $ctx<Options, 'fullscreenOptions'>(
  { attributes: { class: 'fullscreen' } },
  'fullscreenOptions',
)

export const fullscreenCtx = $ctx({ value: false }, 'fullscreen')

const toggleFullscreen = $command<boolean, 'ToggleFullscreen'>('ToggleFullscreen', (ctx) => {
  return (payload) => {
    const options = ctx.get(fullscreenOptionsCtx.key)
    const { value } = ctx.get(fullscreenCtx.key)

    if (typeof payload === 'undefined') {
      ctx.set(fullscreenCtx.key, { value: !value })
    } else {
      ctx.set(fullscreenCtx.key, { value: payload })
    }

    let editorDOM: HTMLElement

    try {
      editorDOM = ctx.get('splitEditingRoot')
    } catch (error) {
      // maybe need check error is MilkdownError
      editorDOM = ctx.get(editorViewCtx).dom
    }

    const milkdownDOM = editorDOM.parentElement

    if (!milkdownDOM) throw new Error('Missing root element')

    if (ctx.get(fullscreenCtx.key).value) {
      Object.entries(options.attributes ?? {}).forEach(([attr, value]) => {
        if (attr !== 'class') milkdownDOM.setAttribute(attr, value)
        else milkdownDOM.classList.add(value)
      })
    } else {
      Object.entries(options.attributes ?? {}).forEach(([attr, value]) => {
        if (attr !== 'class') milkdownDOM.removeAttribute(attr)
        else milkdownDOM.classList.remove(value)
      })
    }
    return () => true
  }
})

export const fullscreenShortcut = $shortcut(() => ({
  F11: () => toggleFullscreen.run(),
}))

export const fullscreen: MilkdownPlugin[] = [
  fullscreenOptionsCtx,
  fullscreenCtx,
  toggleFullscreen,
  fullscreenShortcut,
].flat()
