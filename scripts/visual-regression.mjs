#!/usr/bin/env node
/**
 * Visual regression harness for react-pic-gallery.
 *
 * Renders a deterministic fixture (see ../visual) in the browserless Chromium
 * container over CDP, captures screenshots + layout metrics, and diffs them.
 *
 * Usage:
 *   node scripts/visual-regression.mjs update
 *   node scripts/visual-regression.mjs test
 *   node scripts/visual-regression.mjs capture --base <url> --out <dir> [--appearance bare]
 *   node scripts/visual-regression.mjs compare --a <dir> --b <dir>
 *
 * Environment:
 *   VISUAL_CDP   CDP endpoint (default ws://127.0.0.1:9222/)
 *   VISUAL_PORT  Vite port for test/update (default 5181)
 */
import { chromium } from 'playwright-core'
import { createServer } from 'vite'
import { mkdir, readdir, readFile, writeFile, rm, cp, symlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const baselinesDir = path.join(repoRoot, 'visual', 'baselines')
const outputDir = path.join(repoRoot, 'visual', 'output')
const CDP = process.env.VISUAL_CDP ?? 'ws://127.0.0.1:9222/'

const SCENARIOS = [
  'grid',
  'grid4',
  'justified',
  'mosaic',
  'carousel',
  'gallery',
  'lightbox',
  'lightboxNav'
]

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true }
]

const GALLERY_SELECTOR =
  '.react-pic-gallery, .react-pic-gallery__gallery, dialog.react-pic-gallery__lightbox'

function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token.startsWith('--')) {
      const key = token.slice(2)
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true
      args[key] = value
    } else {
      args._.push(token)
    }
  }
  return args
}

async function connect() {
  try {
    return await chromium.connectOverCDP(CDP)
  } catch (error) {
    throw new Error(
      `Could not connect to Chromium at ${CDP}. Start the browserless container ` +
        `(ghcr.io/browserless/chromium on port 3000) and expose CDP on 9222. ` +
        `Original error: ${error.message}`
    )
  }
}

async function waitForRender(page) {
  await page.waitForSelector(GALLERY_SELECTOR, { timeout: 20000 })
  await page
    .waitForFunction(
      () => Array.from(document.images).every((image) => image.complete),
      undefined,
      { timeout: 20000 }
    )
    .catch(() => {})
  await page
    .waitForFunction(
      () => document.querySelectorAll('.react-pic-gallery__image-loader').length === 0,
      undefined,
      { timeout: 20000 }
    )
    .catch(() => {})
  await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()))
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  )
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const round = (value) => Math.round(value * 100) / 100
    const rect = (element) => {
      const r = element.getBoundingClientRect()
      return { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) }
    }
    const result = {}
    const gallery = document.querySelector('.react-pic-gallery__gallery')
    if (gallery) {
      const style = window.getComputedStyle(gallery)
      result.gallery = {
        rect: rect(gallery),
        background: style.backgroundColor,
        paddingLeft: style.paddingLeft,
        borderLeftWidth: style.borderLeftWidth,
        borderRadius: style.borderTopLeftRadius,
        gap: style.gap
      }
    }
    result.tiles = Array.from(document.querySelectorAll('.react-pic-gallery__tile')).map(rect)
    result.images = Array.from(
      document.querySelectorAll('.react-pic-gallery__image-element')
    ).map(rect)
    result.loaders = document.querySelectorAll('.react-pic-gallery__image-loader').length
    result.errors = document.querySelectorAll('.react-pic-gallery__image-error').length
    const dialog = document.querySelector('dialog.react-pic-gallery__lightbox')
    if (dialog) {
      result.lightbox = rect(dialog)
      const active = dialog.querySelector('.react-pic-gallery__lightbox-image')
      if (active) result.lightboxImage = rect(active)
      const counter = dialog.querySelector('.react-pic-gallery__toolbar-actions span')
      if (counter) result.counter = counter.textContent
    }
    return result
  })
}

async function capture({ base, outDir, appearance }) {
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })
  const browser = await connect()
  const context = await browser.newContext()
  const page = await context.newPage()
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  const cdp = await context.newCDPSession(page)
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  })
  const metrics = {}

  try {
    for (const viewport of VIEWPORTS) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile
      })
      for (const scenario of SCENARIOS) {
        const url = new URL(base)
        url.searchParams.set('scenario', scenario)
        if (appearance) url.searchParams.set('appearance', appearance)
        await page.goto(url.href, { waitUntil: 'load' })
        try {
          await waitForRender(page)
        } catch (error) {
          const body = await page.evaluate(() => document.body.innerHTML).catch(() => '')
          throw new Error(
            `Failed to render ${url.href}\nURL: ${page.url()}\n` +
              `Page errors: ${JSON.stringify(pageErrors)}\n` +
              `Body (first 500): ${body.slice(0, 500)}\n` +
              `Original: ${error.message}`
          )
        }
        const key = `${scenario}-${viewport.name}`
        await page.screenshot({ path: path.join(outDir, `${key}.png`) })
        metrics[key] = await collectMetrics(page)
      }
    }
  } finally {
    await context.close()
    await browser.close()
  }

  await writeFile(path.join(outDir, 'metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`)
  if (pageErrors.length > 0) {
    throw new Error(`Fixture raised page errors:\n${pageErrors.join('\n')}`)
  }
  return metrics
}

async function pixelDiff(browser, bufferA, bufferB) {
  const context = await browser.newContext()
  const page = await context.newPage()
  try {
    const dataA = `data:image/png;base64,${bufferA.toString('base64')}`
    const dataB = `data:image/png;base64,${bufferB.toString('base64')}`
    return await page.evaluate(
      async ([a, b]) => {
        const load = (src) =>
          new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = () => resolve(image)
            image.onerror = reject
            image.src = src
          })
        const [imageA, imageB] = await Promise.all([load(a), load(b)])
        const width = Math.max(imageA.width, imageB.width)
        const height = Math.max(imageA.height, imageB.height)
        const canvasA = document.createElement('canvas')
        const canvasB = document.createElement('canvas')
        canvasA.width = canvasB.width = width
        canvasA.height = canvasB.height = height
        const ctxA = canvasA.getContext('2d')
        const ctxB = canvasB.getContext('2d')
        ctxA.drawImage(imageA, 0, 0)
        ctxB.drawImage(imageB, 0, 0)
        const dataA = ctxA.getImageData(0, 0, width, height).data
        const dataB = ctxB.getImageData(0, 0, width, height).data
        let changed = 0
        let maxDelta = 0
        for (let i = 0; i < dataA.length; i += 4) {
          const delta = Math.max(
            Math.abs(dataA[i] - dataB[i]),
            Math.abs(dataA[i + 1] - dataB[i + 1]),
            Math.abs(dataA[i + 2] - dataB[i + 2]),
            Math.abs(dataA[i + 3] - dataB[i + 3])
          )
          if (delta > 0) {
            changed += 1
            if (delta > maxDelta) maxDelta = delta
          }
        }
        return { width, height, changed, total: width * height, maxDelta }
      },
      [dataA, dataB]
    )
  } finally {
    await context.close()
  }
}

async function compare({ dirA, dirB, tolerance = 0 }) {
  const names = (await readdir(dirA)).filter((name) => name.endsWith('.png')).sort()
  const browser = await connect()
  const screenshotDiffs = []
  const toleratedDiffs = []
  try {
    for (const name of names) {
      const pathB = path.join(dirB, name)
      if (!existsSync(pathB)) {
        screenshotDiffs.push({ name, reason: 'missing' })
        continue
      }
      const bufferA = await readFile(path.join(dirA, name))
      const bufferB = await readFile(pathB)
      if (bufferA.equals(bufferB)) continue
      const diff = await pixelDiff(browser, bufferA, bufferB)
      const ratio = diff.changed / diff.total
      const entry = { name, reason: 'pixels', ...diff, ratio }
      if (diff.ratio > tolerance) {
        screenshotDiffs.push(entry)
      } else {
        toleratedDiffs.push(entry)
      }
    }
  } finally {
    await browser.close()
  }

  const metricsA = JSON.parse(await readFile(path.join(dirA, 'metrics.json'), 'utf8'))
  const metricsB = JSON.parse(await readFile(path.join(dirB, 'metrics.json'), 'utf8'))
  const metricDiffs = []
  for (const key of Object.keys(metricsA)) {
    if (JSON.stringify(metricsA[key]) !== JSON.stringify(metricsB[key])) {
      metricDiffs.push(key)
    }
  }
  return { count: names.length, screenshotDiffs, toleratedDiffs, metricDiffs }
}

async function startServerForRoot(root, port) {
  const server = await createServer({
    configFile: path.join(root, 'visual', 'vite.config.ts'),
    server: { port, strictPort: true, host: '0.0.0.0' },
    logLevel: 'error'
  })
  await server.listen()
  const host = process.env.VISUAL_BASE_HOST ?? '127.0.0.1'
  return { server, url: `http://${host}:${port}/` }
}

async function prepareRefCheckout(ref, destination) {
  await rm(destination, { recursive: true, force: true })
  await mkdir(destination, { recursive: true })
  execFileSync('sh', ['-c', `git -C "${repoRoot}" archive "${ref}" | tar -x -C "${destination}"`])
  await cp(path.join(repoRoot, 'visual'), path.join(destination, 'visual'), { recursive: true })
  await symlink(path.join(repoRoot, 'node_modules'), path.join(destination, 'node_modules'), 'dir')
  return destination
}

function report(label, result, tolerance = 0) {
  const failures = result.screenshotDiffs.length + result.metricDiffs.length
  console.log(`\n${label}: ${result.count} screenshots`)
  if (result.metricDiffs.length > 0) {
    console.log(`  layout metric mismatches (${result.metricDiffs.length}):`)
    for (const key of result.metricDiffs) console.log(`    - ${key}`)
  }
  if (result.screenshotDiffs.length > 0) {
    console.log(`  screenshot mismatches (${result.screenshotDiffs.length}):`)
    for (const diff of result.screenshotDiffs) {
      const detail =
        diff.reason === 'pixels'
          ? `${diff.changed}/${diff.total} px (${(diff.ratio * 100).toFixed(4)}%), maxDelta ${diff.maxDelta}`
          : diff.reason
      console.log(`    - ${diff.name}: ${detail}`)
    }
  }
  if (result.toleratedDiffs?.length > 0) {
    console.log(
      `  within tolerance (${result.toleratedDiffs.length} of ${result.count}, ` +
        `<= ${(tolerance * 100).toFixed(4)}% pixels each):`
    )
    for (const diff of result.toleratedDiffs) {
      console.log(
        `    - ${diff.name}: ${diff.changed}/${diff.total} px ` +
          `(${(diff.ratio * 100).toFixed(4)}%), maxDelta ${diff.maxDelta}`
      )
    }
  }
  console.log(failures === 0 ? '  PASS' : '  FAIL')
  return failures === 0
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const command = args._[0]

  if (command === 'capture') {
    if (!args.base || !args.out) throw new Error('capture requires --base and --out')
    await capture({ base: args.base, outDir: args.out, appearance: args.appearance })
    console.log(`Captured to ${args.out}`)
    return
  }

  if (command === 'compare') {
    if (!args.a || !args.b) throw new Error('compare requires --a and --b')
    const tolerance = args.tolerance !== undefined ? Number(args.tolerance) : 0
    const result = await compare({ dirA: args.a, dirB: args.b, tolerance })
    const ok = report('compare', result, tolerance)
    process.exitCode = ok ? 0 : 1
    return
  }

  if (command === 'update' || command === 'test') {
    const port = Number(process.env.VISUAL_PORT ?? 5181)
    const { server, url } = await startServerForRoot(repoRoot, port)
    try {
      if (command === 'update') {
        await capture({ base: url, outDir: baselinesDir, appearance: undefined })
        console.log(`Baselines written to ${baselinesDir}`)
        return
      }
      await capture({ base: url, outDir: outputDir, appearance: undefined })
      const result = await compare({ dirA: baselinesDir, dirB: outputDir })
      const ok = report('visual regression', result)
      process.exitCode = ok ? 0 : 1
    } finally {
      await server.close()
    }
    return
  }

  if (command === 'cross') {
    const ref = args.ref ?? 'HEAD'
    const oldPort = Number(process.env.VISUAL_OLD_PORT ?? 5198)
    const newPort = Number(process.env.VISUAL_PORT ?? 5199)
    const slug = String(ref).replace(/[^a-zA-Z0-9]/g, '_')
    const oldRoot = await prepareRefCheckout(ref, path.join(os.tmpdir(), `rpg-visual-${slug}`))
    const oldServer = await startServerForRoot(oldRoot, oldPort)
    const newServer = await startServerForRoot(repoRoot, newPort)
    const oldOut = path.join(outputDir, `cross-${slug}-old`)
    const newOut = path.join(outputDir, 'cross-new')
    try {
      await capture({ base: oldServer.url, outDir: oldOut, appearance: 'bare' })
      await capture({ base: newServer.url, outDir: newOut, appearance: 'bare' })
      const tolerance = args.tolerance !== undefined ? Number(args.tolerance) : 0.0005
      const result = await compare({ dirA: oldOut, dirB: newOut, tolerance })
      const ok = report(`cross-version bare (${ref} vs working tree)`, result, tolerance)
      process.exitCode = ok ? 0 : 1
    } finally {
      await oldServer.server.close()
      await newServer.server.close()
    }
    return
  }

  console.error('Unknown command. Use update | test | capture | compare | cross.')
  process.exitCode = 2
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
