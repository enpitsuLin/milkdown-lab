import { Browser, chromium, Page } from 'playwright'
import { createServer, type ViteDevServer } from 'vite'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
// import { expect } from '@playwright/test'

describe.runIf(process.platform !== 'win32')('name', async () => {
  let server: ViteDevServer
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    server = await createServer()
    server.listen(3000)
    browser = await chromium.launch()
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
    await server.close()
  })

  beforeEach(async () => {
    await page.goto('http://localhost:3000')
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

  describe('plugin-split-editing test', () => {
    test('should render properly', async () => {
      const wrapper = await page.$('.milkdown-split-editing-wrapper')
      expect(wrapper, 'split view wrapper render properly')

      const milkdownEditor = await wrapper?.$('.milkdown > .ProseMirror.editor')
      expect(milkdownEditor, 'milkdown editor render properly')

      const splitViewEditor = await wrapper?.$('.milkdown-split-editor > .cm-editor')
      expect(splitViewEditor, 'split editor render properly')
    })

    test('content should be synced to split editor', async () => {
      const milkdownEditor = await page.$('.milkdown > .ProseMirror.editor')

      const splitViewEditor = await page.$('.milkdown-split-editor > .cm-editor')

      await milkdownEditor?.focus()
      await page.keyboard.press('End')
      await page.keyboard.press('Enter')
      await milkdownEditor?.type('This content should be synced')
      expect(await splitViewEditor?.textContent()).contain('This content should be synced')
    })

    test('content should be synced to milkdown editor', async () => {
      const milkdownEditor = await page.$('.milkdown > .ProseMirror.editor')

      const splitViewEditor = await page.$('.milkdown-split-editor > .cm-editor')

      const spliteViewEditorContent = await splitViewEditor?.$('.cm-content')
      await spliteViewEditorContent?.focus()
      await page.keyboard.press('End')
      await page.keyboard.press('Enter')
      await spliteViewEditorContent?.type('This content should be synced')
      expect(await milkdownEditor?.textContent()).contain('This content should be synced')
    })
  })
})
