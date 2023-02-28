import { MilkdownPlugin } from '@milkdown/ctx'
import { menuConfigCtx, menuDomCtx, menuView } from './menu-plugin'

export const menu: MilkdownPlugin[] = [menuDomCtx, menuConfigCtx, menuView]

export * from './default-config'
export * from './menu-plugin'
export * from './menu-item'
