// Captura telas do site com o Edge (GPU real) para conferência.
// Uso: node scripts/capturar.mjs <url> <saida.png> [largura] [altura] [--seletor CSS] [--js "código"] [--esperar3d] [--pagina-inteira]
import { chromium } from 'playwright-core'

const args = process.argv.slice(2)
const opcao = (n) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] : undefined
}
const [url, saida, w = '1440', h = '900'] = args.filter((a, i) => !a.startsWith('--') && !['--seletor', '--js', '--espera'].includes(args[i - 1]))
const movel = Number(w) < 700

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
})
const ctx = await browser.newContext({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: movel ? 2 : 1,
  isMobile: movel,
  hasTouch: movel,
})
const page = await ctx.newPage()
const erros = []
page.on('console', (m) => m.type() === 'error' && erros.push(m.text()))
page.on('response', (r) => r.status() >= 400 && erros.push(`${r.status()} ${r.url()}`))
page.on('pageerror', (e) => erros.push(String(e)))
await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 })
if (args.includes('--esperar3d')) {
  await page.waitForSelector('.v3d[data-estado="ativo"]', { timeout: 120000 })
  await page.waitForTimeout(1500)
}
const js = opcao('js')
if (js) {
  await page.evaluate(`(async () => { ${js} })()`)
  await page.waitForTimeout(Number(opcao('espera') ?? 2500))
}
const sel = opcao('seletor')
if (sel) await (await page.$(sel)).screenshot({ path: saida })
else await page.screenshot({ path: saida, fullPage: args.includes('--pagina-inteira') })
if (erros.length) console.log('ERROS:', erros.slice(0, 8).join('\n'))
console.log('ok', saida)
await browser.close()
