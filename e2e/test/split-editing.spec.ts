import { Editor } from '@milkdown/core'
import { Browser, chromium, Page } from 'playwright'
import { preview, type PreviewServer } from 'vite'
import { afterAll, beforeAll, describe, test, expect } from 'vitest'
// import { expect } from '@playwright/test'

describe.runIf(process.platform !== 'win32')('name', async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    server = await preview({ preview: { port: 3000 } })
    browser = await chromium.launch()
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()))
    })
  })

  describe('plugin-split-editing test', () => {
    let editor: Editor | null = null
    test('should render properly', async () => {
      await page.goto('http://localhost:3000')
      editor = await page.evaluate(() => window.render([window.getPlugins('spliteEditing')]))
      const wrapper = await page.$('.milkdown-split-editing-wrapper')
      expect(wrapper, 'split view wrapper render properly')

      const milkdownEditor = await wrapper?.$('.milkdown > .ProseMirror.editor')
      expect(milkdownEditor, 'milkdown editor render properly')

      const splitViewEditor = await wrapper?.$('.milkdown-split-editor > .cm-editor')
      expect(splitViewEditor, 'split editor render properly')
    })
    test('content should be synced to split editor', async () => {
      await page.goto('http://localhost:3000')
      editor = await page.evaluate(() => window.render([window.getPlugins('spliteEditing')]))

      const milkdownEditor = await page.$('.milkdown > .ProseMirror.editor')

      const splitViewEditor = await page.$('.milkdown-split-editor')

      await milkdownEditor?.focus()
      await page.keyboard.press('End')
      await page.keyboard.press('Enter')
      await milkdownEditor?.type('This content should be synced')
      expect(await splitViewEditor?.textContent()).contain('This content should be synced')
    })
    test('content should be synced to milkdown editor', async () => {
      await page.goto('http://localhost:3000')
      editor = await page.evaluate(() => window.render([window.getPlugins('spliteEditing')]))

      const milkdownEditor = await page.$('.milkdown > .ProseMirror.editor')

      const splitViewEditor = await page.$('.milkdown-split-editor > .cm-editor')

      const spliteViewEditorContent = await splitViewEditor!.$('.cm-content')
      await spliteViewEditorContent?.focus()
      await page.keyboard.press('End')
      await page.keyboard.press('Enter')
      await spliteViewEditorContent?.type('This content should be synced')
      expect(await milkdownEditor?.textContent()).contain('This content should be synced')
    })
  })
})
