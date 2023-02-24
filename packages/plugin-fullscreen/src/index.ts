import { Cmd, commandsCtx, createCmdKey, editorViewCtx, prosePluginsCtx, SchemaReady } from '@milkdown/core'
import { createSlice, Ctx, MilkdownPlugin } from '@milkdown/ctx'
import { keymap } from '@milkdown/prose/keymap'
import { $Command, $Ctx, $Shortcut, Keymap } from '@milkdown/utils'

export interface Options {
  /** className when editor be fullscreen */
  classes?: string
}

export const $ctx = <T, N extends string>(value: T, name: N): $Ctx<T, N> => {
  const slice = createSlice(value, name)
  const plugin: $Ctx<T, N> = (ctx) => {
    ctx.inject(slice)
    return () => {
      return () => {
        ctx.remove(slice)
      }
    }
  }

  plugin.key = slice

  return plugin
}

export const $shortcut = (shortcut: (ctx: Ctx) => Keymap): $Shortcut => {
  const plugin: MilkdownPlugin = (ctx) => async () => {
    await ctx.wait(SchemaReady)
    const k = shortcut(ctx)
    const keymapPlugin = keymap(k)
    ctx.update(prosePluginsCtx, (ps) => [...ps, keymapPlugin])
    ;(<$Shortcut>plugin).keymap = k

    return () => {
      ctx.update(prosePluginsCtx, (ps) => ps.filter((x) => x !== keymapPlugin))
    }
  }

  return <$Shortcut>plugin
}

export const $command = <T, K extends string>(key: K, cmd: (ctx: Ctx) => Cmd<T>): $Command<T> => {
  const cmdKey = createCmdKey<T>(key)

  const plugin: MilkdownPlugin = (ctx) => async () => {
    ;(<$Command<T>>plugin).key = cmdKey
    await ctx.wait(SchemaReady)
    const command = cmd(ctx)
    ctx.get(commandsCtx).create(cmdKey, command)
    ;(<$Command<T>>plugin).run = (payload?: T) => ctx.get(commandsCtx).call(key, payload)

    return () => {
      ctx.get(commandsCtx).remove(cmdKey)
    }
  }

  return <$Command<T>>plugin
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
  'Mod-F11': () => toggleFullscreen.run(),
}))

export const fullscreen: MilkdownPlugin[] = [
  fullscreenConfig,
  fullscreenCtx,
  toggleFullscreen,
  fullscreenShortcut,
].flat()
