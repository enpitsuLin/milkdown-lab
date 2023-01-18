/// <reference types="vite/client" />
import { Plugin } from './main'
declare global {
  function getPlugins(name: 'spliteEditing' | 'fullscreen'): Plugin
  function render(plugins?: Plugin[], showMenu?: boolean): Promise<Editor>
}
