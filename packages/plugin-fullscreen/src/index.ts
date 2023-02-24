import { Cmd, commandsCtx, createCmdKey, editorViewCtx, prosePluginsCtx, SchemaReady } from '@milkdown/core'
import { createSlice, MilkdownPlugin } from '@milkdown/ctx'
import { keymap } from '@milkdown/prose/keymap'

export interface Options {
  /** className when editor be fullscreen */
  classes?: string
}

const defaultOptions: Required<Options> = { classes: 'fullscreen' }

const fullscreenCtx = createSlice({ value: false }, 'fullscreen')

const FullscreenCmdKey = createCmdKey<boolean>('ToggleFullscreen')

const createFullscreenPlugin = (option?: Options): MilkdownPlugin => {
  return (ctx) => {
    ctx.inject(fullscreenCtx)

    const command: Cmd<boolean> = (payload) => {
      const { value } = ctx.get(fullscreenCtx)

      if (typeof payload === 'undefined') {
        ctx.set(fullscreenCtx, { value: !value })
      } else {
        ctx.set(fullscreenCtx, { value: payload })
      }

      const editorDOM = ctx.get(editorViewCtx).dom
      const milkdownDOM = editorDOM.parentElement

      if (!milkdownDOM) throw new Error('Missing root element')

      if (ctx.get(fullscreenCtx).value) {
        milkdownDOM.classList.add(option?.classes ?? defaultOptions.classes)
      } else {
        milkdownDOM.classList.remove(option?.classes ?? defaultOptions.classes)
      }
      return () => true
    }

    return async () => {
      await ctx.wait(SchemaReady)
      ctx.get(commandsCtx).create(FullscreenCmdKey, command)
      const fullscreenKeymap = keymap({
        'Mod-F11': () => ctx.get(commandsCtx).call(FullscreenCmdKey),
      })
      ctx.update(prosePluginsCtx, (ps) => [...ps, fullscreenKeymap])
      return () => {
        ctx.get(commandsCtx).remove(FullscreenCmdKey)
        ctx.remove(fullscreenCtx)
        ctx.update(prosePluginsCtx, (ps) => ps.filter((x) => x !== fullscreenKeymap))
      }
    }
  }
}

const fullscreen = createFullscreenPlugin()

export { fullscreen as default, fullscreen, createFullscreenPlugin, fullscreenCtx, FullscreenCmdKey }
