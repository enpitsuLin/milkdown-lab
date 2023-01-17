import { expect } from '@playwright/test'
import { Browser, chromium, Page } from 'playwright'
import { preview, type PreviewServer } from 'vite'
import { afterAll, beforeAll, describe, test } from 'vitest'

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

  test('should work', async () => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle('e2e')
  })
})
