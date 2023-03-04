import { Browser, chromium, Page } from 'playwright'
import { createServer, type ViteDevServer } from 'vite'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'

describe.runIf(process.platform !== 'win32')('plugin-split-editing', async () => {
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
      const editor = await render([getPlugins('splitEditing')])
      return (__Editor__ = editor)
    })
    return async () => {
      await page.evaluate(() => {
        __Editor__.destroy()
      })
    }
  })
  async function findSplitEditor() {
    const wrapper = await page.$('.milkdown .split-editor')
    const editor = await wrapper?.$('.ProseMirror.editor')
    const splitEditor = await wrapper?.$('.milkdown-split-editor > .cm-editor')
    return [wrapper, editor, splitEditor]
  }
  describe('plugin-split-editing test', () => {
    test('should render properly', async () => {
      const [wrapper, milkdownEditor, splitViewEditor] = await findSplitEditor()

      expect(wrapper, 'split view wrapper render properly')

      expect(milkdownEditor, 'milkdown editor render properly')

      expect(splitViewEditor, 'split editor render properly')
    })

    test('content should be synced to split editor', async () => {
      const [, milkdownEditor, splitViewEditor] = await findSplitEditor()

      await milkdownEditor?.focus()
      await page.keyboard.press('End')
      await page.keyboard.press('Enter')
      await milkdownEditor?.type('This content should be synced')
      expect(await splitViewEditor?.textContent()).contain('This content should be synced')
    })

    test('content should be synced to milkdown editor', async () => {
      const [, milkdownEditor, splitViewEditor] = await findSplitEditor()

      const spliteViewEditorContent = await splitViewEditor?.$('.cm-content')
      await spliteViewEditorContent?.focus()
      await page.keyboard.press('End')
      await page.keyboard.press('Enter')
      await spliteViewEditorContent?.type('This content should be synced')
      expect(await milkdownEditor?.textContent()).contain('This content should be synced')
    })
  })

  // skip
  describe.skip('plugin-split-editing integrate test', () => {
    test('should work fine with @milkdown/plugin-menu and menu button work', async () => {
      await page.evaluate(() => __Editor__.destroy())
      await page.evaluate(async () => {
        const editor = await render([getPlugins('splitEditing')], true)
        return (__Editor__ = editor)
      })
      const menuWrapper = await page.$('.milkdown-menu-wrapper')
      expect(menuWrapper?.asElement())
      const splitMenuButton = await menuWrapper?.$('button[title="splitEditing"]')
      expect(await splitMenuButton?.textContent()).toEqual('view_week')
      await splitMenuButton?.click()
      const visible = await page.isVisible('.milkdown-split-editor')
      expect(visible).toBeFalsy()
    })
  })
})
