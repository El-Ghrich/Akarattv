import 'dotenv/config'

import { chromium } from '@playwright/test'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const baseURL = 'http://localhost:3000'
const email = `rtl-check-${Date.now()}@example.com`
const password = 'RtlCheck!2026'

const payload = await getPayload({ config })
let userID: number | string | undefined
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined

try {
  const user = await payload.create({
    collection: 'users',
    data: { email, password, roles: ['admin'] },
  })
  userID = user.id

  browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  })

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  await context.addCookies([{ name: 'payload-lng', value: 'ar', url: baseURL }])
  const page = await context.newPage()

  await page.goto(`${baseURL}/admin/login`)
  await page.fill('#field-email', email)
  await page.fill('#field-password', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(`${baseURL}/admin`, { timeout: 60_000 })

  const htmlDir = await page.locator('html').getAttribute('dir')

  await page.goto(`${baseURL}/admin/collections/articles/3`, { waitUntil: 'domcontentloaded' })
  const editor = page.locator('.ContentEditable__root, [data-lexical-editor="true"]').first()
  await editor.waitFor({ timeout: 60_000 })

  await editor.click()
  await page.keyboard.press('Control+End')
  await page.keyboard.press('Enter')
  await page.keyboard.type('اختبار العربية Paris 2026 12,5%')
  await page.keyboard.press('Enter')
  await page.keyboard.type('Paris 2026 seulement')

  const mixed = editor.locator('p').last()
  const latin = editor.locator('p').last()
  const mixedParagraph = editor.locator('p', { hasText: 'اختبار العربية' }).last()
  const mixedDir = await mixedParagraph.getAttribute('dir')
  const mixedComputed = await mixedParagraph.evaluate((el) => getComputedStyle(el).direction)
  const mixedText = await mixedParagraph.innerText()

  const latinParagraph = editor.locator('p', { hasText: 'Paris 2026 seulement' }).last()
  const latinText = await latinParagraph.innerText()

  console.log('admin html dir:', htmlDir)
  console.log('editor mixed paragraph dir:', mixedDir, '| computed:', mixedComputed)
  console.log('editor mixed paragraph text:', JSON.stringify(mixedText))
  console.log('editor latin paragraph text:', JSON.stringify(latinText))
  void mixed
  void latin

  const previewFrameElement = page.locator('iframe[src*="/articles/"]').first()
  const previewVisible = await previewFrameElement.isVisible().catch(() => false)
  const previewSrc = previewVisible ? await previewFrameElement.getAttribute('src') : null
  console.log('live preview visible:', previewVisible, '| src:', previewSrc)

  const preview = page.frameLocator('iframe[src*="/articles/"]').first()
  const previewTitle = await preview.locator('h1').first().innerText({ timeout: 30_000 })

  let previewMixedDir: null | string = null
  let previewLatinDir: null | string = null

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const mixedCount = await preview.locator('p', { hasText: 'اختبار العربية' }).count()

    if (mixedCount > 0) {
      const paragraph = preview.locator('p', { hasText: 'اختبار العربية' }).last()
      previewMixedDir = await paragraph.evaluate((el) => getComputedStyle(el).direction)
    }

    const latinCount = await preview.locator('p', { hasText: 'Paris 2026 seulement' }).count()
    if (latinCount > 0) {
      const paragraph = preview.locator('p', { hasText: 'Paris 2026 seulement' }).last()
      previewLatinDir = await paragraph.evaluate((el) => getComputedStyle(el).direction)
    }

    if (previewMixedDir && previewLatinDir) break
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  console.log('preview h1:', JSON.stringify(previewTitle))
  console.log('preview mixed paragraph direction:', previewMixedDir)
  console.log('preview latin paragraph direction:', previewLatinDir)

  const ok =
    htmlDir === 'rtl' &&
    mixedDir === 'rtl' &&
    mixedComputed === 'rtl' &&
    mixedText.includes('اختبار العربية') &&
    mixedText.includes('Paris 2026') &&
    previewVisible &&
    Boolean(previewSrc?.includes('/articles/')) &&
    previewMixedDir === 'rtl' &&
    previewLatinDir === 'ltr'

  console.log(ok ? 'RTL + LIVE PREVIEW CHECK: PASS' : 'RTL + LIVE PREVIEW CHECK: FAIL')
  if (!ok) process.exitCode = 1
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  await browser?.close()
  if (userID !== undefined) {
    await payload.delete({ collection: 'users', id: userID })
  }
}

process.exit(process.exitCode ?? 0)
