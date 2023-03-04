import { Browser, chromium, Page } from 'playwright'
import { createServer, type ViteDevServer } from 'vite'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'

describe.runIf(process.platform !== 'win32')('plugin-menu', async () => {
  let server: ViteDevServer
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    server = await createServer()
    server.listen(3000)
    browser = await chromium.launch()
    page = await browser.newPage()
    await page.waitForLoadState('domcontentloaded')
  })

  afterAll(async () => {
    await browser.close()
    await server.close()
  })

  beforeEach(async () => {
    await page.goto(`http://localhost:${server.config.server.port}`)
    await page.evaluate(async () => {
      const editor = await render([getPlugins('menu')])
      return (__Editor__ = editor)
    })
    return async () => {
      await page.evaluate(() => {
        __Editor__.destroy()
      })
    }
  })
  async function findSplitEditor() {
    const root = await page.$('.milkdown')
    const menu = await root?.$('.milkdown-menu')
    return [root, menu]
  }
  describe('plugin-menu basic', () => {
    test('should render properly', async () => {
      const [root, menu] = await findSplitEditor()

      expect(root, 'milkdown editor render properly')

      expect(menu, 'milkdown editor menu render properly')
    })
    test('should render menubar and menuitems properly', async () => {
      const [, menu] = await findSplitEditor()
      const menubar = await menu?.$("ul[role='menubar']")

      expect(menubar, 'milkdown menubar render properly')

      const menuitems = await menubar?.$$('li')
      expect(menuitems?.length).toBeGreaterThan(0)
    })
  })
  describe.skip('plugin-menu work properly', () => {
    //TODO
  })
})
