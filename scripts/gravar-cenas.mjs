// Grava imagens limpas do 3D (sem interface, 1080×1920, qualidade máxima em
// todo quadro) para montar vídeos de apresentação.
//
// Tempo virtual: o relógio da página (performance.now e requestAnimationFrame)
// é congelado e avança exatamente 1/30 s por quadro fotografado. Assim o vídeo
// sai a 30 fps perfeitos, não importa quanto cada quadro leve para renderizar.
//
// Gera <saida>/cenas3d.mp4 e <saida>/cenas3d.json (início e fim de cada cena, em s).
// Requer `npm run dev -- -p 3210` rodando e ffmpeg no PATH.
// Uso: node scripts/gravar-cenas.mjs <pasta-de-saida>
import { chromium } from 'playwright-core'
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SAIDA = process.argv[2] ?? 'cenas-3d'
const FPS = 30
const QUADROS = 'video-quadros'
rmSync(QUADROS, { recursive: true, force: true })
mkdirSync(QUADROS)
mkdirSync(SAIDA, { recursive: true })

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
})
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
await ctx.addInitScript(() => {
  const rafReal = window.requestAnimationFrame.bind(window)
  const agoraReal = performance.now.bind(performance)
  let virtual = false
  let t = 0
  let fila = []
  window.requestAnimationFrame = (cb) => (virtual ? (fila.push(cb), fila.length) : rafReal(cb))
  performance.now = () => (virtual ? t : agoraReal())
  window.__ativarTempoVirtual = () => {
    t = agoraReal()
    virtual = true
  }
  window.__passo = (ms) => {
    t += ms
    const f = fila
    fila = []
    for (const cb of f) cb(t)
  }
})
const page = await ctx.newPage()
await page.goto('http://localhost:3210/?gravacao', { waitUntil: 'networkidle' })
await page.addStyleTag({
  content: `
    [style*="opacity"]{opacity:1!important;transform:none!important}
    header,.v3d-modos,.v3d-ferramentas,.v3d-dica,.v3d-marcadores,.v3d-pontos,.v3d-ficha,.v3d-legenda,.v3d-capa,.v3d-carregando{display:none!important}
    #explore .v3d{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;z-index:9999}
    #explore .v3d-palco{border-radius:0!important;box-shadow:none!important;background:#f5f5f7!important}
    .v3d-canvas{opacity:1!important;transition:none!important}
    nextjs-portal{display:none!important}
  `,
})
await page.evaluate(() => document.querySelector('#explore').scrollIntoView())
await page.waitForSelector('#explore .v3d[data-estado="ativo"]', { timeout: 120000 })
await page.waitForTimeout(3000)
await page.evaluate(() => window.__ativarTempoVirtual())

let n = 0
const marcas = {}
const marca = (nome) => (marcas[nome] = +(n / FPS).toFixed(3))
async function quadro() {
  await page.evaluate((ms) => window.__passo(ms), 1000 / FPS)
  await page.screenshot({ path: join(QUADROS, `q${String(n).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 94 })
  n++
}
const segundos = async (s) => {
  for (let i = 0; i < Math.round(s * FPS); i++) await quadro()
}
const aba = (t) => page.evaluate((t) => [...document.querySelectorAll('#explore [role=tab]')].find((b) => b.textContent.includes(t)).click(), t)
const ponto = (t) => page.evaluate((t) => [...document.querySelectorAll('#explore .v3d-chip')].find((b) => b.textContent.includes(t)).click(), t)
const inicial = () => page.evaluate(() => document.querySelector('#explore .v3d-ferramentas button[aria-label="Voltar à vista inicial"]').click())

/** Arrasto suave, um passo por quadro (o giro dura exatamente `s` segundos). */
async function arrastar(dx, dy, s) {
  const x0 = 540, y0 = 700
  await page.mouse.move(x0, y0)
  await page.mouse.down()
  const passos = Math.round(s * FPS)
  for (let i = 1; i <= passos; i++) {
    const k = i / passos
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
    await page.mouse.move(x0 + dx * e, y0 + dy * e)
    await quadro()
  }
  await page.mouse.up()
}

// 1. Casa girando (lento, contínuo)
marca('orbita_ini')
await arrastar(-620, 30, 6)
await segundos(1)
marca('orbita_fim')
await inicial()
await segundos(1.6)

// 2. Telhado e andar de cima sobem e somem, vistos em 3/4 (entrando nos ambientes)
marca('telhado_ini')
await aba('Ambientes')
await segundos(3.4)
marca('telhado_fim')

// 3. Planta vista de cima
marca('planta_ini')
await aba('Planta 3D')
await segundos(2.6)
marca('planta_fim')

// 4. De volta ao corte com os ambientes
marca('ambientes_ini')
await aba('Ambientes')
await segundos(2.6)
marca('ambientes_fim')

// 5. Ambientes, um a um
for (const [nome, chip] of [['sala', 'Sala'], ['cozinha', 'Cozinha'], ['suite', 'Suíte']]) {
  marca(`${nome}_ini`)
  await ponto(chip)
  await segundos(3)
  marca(`${nome}_fim`)
}

await browser.close()
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(QUADROS, 'q%05d.jpg'), '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', join(SAIDA, 'cenas3d.mp4')], { stdio: 'inherit' })
writeFileSync(join(SAIDA, 'cenas3d.json'), JSON.stringify(marcas, null, 2))
rmSync(QUADROS, { recursive: true, force: true })
console.log(`${n} quadros`, marcas)
