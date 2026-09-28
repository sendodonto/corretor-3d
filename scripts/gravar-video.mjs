// Grava um vídeo vertical (1080×1920) do tour 3D para mandar no WhatsApp:
// casa girando, planta sem telhado e a câmera entrando nos ambientes.
// Uso: node scripts/gravar-video.mjs [url] [saida.mp4]
// Requer ffmpeg no PATH.
import { chromium } from 'playwright-core'
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const URL = process.argv[2] ?? 'https://sendodonto.github.io/corretor-3d/'
const SAIDA = process.argv[3] ?? 'video-tour-3d.mp4'
const PASTA = 'video-tmp'
rmSync(PASTA, { recursive: true, force: true })
mkdirSync(PASTA)

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
})
const ctx = await browser.newContext({
  viewport: { width: 540, height: 960 },
  deviceScaleFactor: 2,
  // O gravador captura em pixels de tela (540×960); o ffmpeg amplia para 1080×1920.
  recordVideo: { dir: PASTA, size: { width: 540, height: 960 } },
})
const page = await ctx.newPage()
const t0 = Date.now()
await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.querySelector('#explore .v3d').scrollIntoView({ block: 'center' }))
await page.waitForTimeout(800)
await page.click('#explore .v3d-iniciar')
await page.waitForSelector('.v3d.is-imersivo[data-estado="ativo"]', { timeout: 120000 })
await page.waitForTimeout(1200)
const inicio = (Date.now() - t0) / 1000 - 0.3

const espera = (ms) => page.waitForTimeout(ms)
async function arrastar(dx, dy, ms) {
  const x0 = 270, y0 = 300
  await page.mouse.move(x0, y0)
  await page.mouse.down()
  const passos = Math.round(ms / 16)
  for (let i = 1; i <= passos; i++) {
    const k = i / passos
    const s = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
    await page.mouse.move(x0 + dx * s, y0 + dy * s)
    await espera(16)
  }
  await page.mouse.up()
}
const aba = (texto) => page.evaluate((t) => [...document.querySelectorAll('.v3d-modos button')].find((b) => b.textContent.includes(t)).click(), texto)
const ponto = (texto) => page.evaluate((t) => [...document.querySelectorAll('.v3d-chip')].find((b) => b.textContent.includes(t)).click(), texto)

// 1. Vista externa: gira em volta da casa
await espera(600)
await arrastar(-300, 0, 2600)
await espera(700)
await ponto('Entrada') // a porta pivotante abre
await espera(2600)
// 2. Planta 3D: telhado e andar de cima somem
await aba('Planta 3D')
await espera(2800)
// 3. Ambientes: entra na casa
await aba('Ambientes')
await espera(2400)
await ponto('Sala')
await espera(2600)
await ponto('Cozinha')
await espera(2600)
await ponto('Suíte')
await espera(2800)
const fim = (Date.now() - t0) / 1000

await ctx.close()
await browser.close()
const webm = join(PASTA, readdirSync(PASTA).find((f) => f.endsWith('.webm')))
execFileSync('ffmpeg', [
  '-y', '-ss', String(inicio), '-to', String(fim), '-i', webm,
  '-vf', 'scale=1080:1920:flags=lanczos,fps=30',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
  SAIDA,
], { stdio: 'inherit' })
rmSync(PASTA, { recursive: true, force: true })
console.log('vídeo:', SAIDA, `(${(fim - inicio).toFixed(1)} s)`)
