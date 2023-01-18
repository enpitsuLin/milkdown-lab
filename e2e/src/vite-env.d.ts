/// <reference types="vite/client" />
import { Editor } from '@milkdown/core'
import { Plugin } from './main'
declare global {
  let __Editor__: Editor
  function getPlugins(name: 'splitEditing' | 'fullscreen'): Plugin
  function render(plugins?: Plugin[], showMenu?: boolean): Promise<Editor>
}
