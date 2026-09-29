// Tomada contínua ("one-take") da Casa Alameda para vídeos: a câmera voa como
// um drone por um caminho de posições-chave, sem cortes, com fundo
// transparente (PNG com alfa) e a posição dos pontos da casa em cada quadro
// (para etiquetas que acompanham o 3D na edição).
//
// Tempo virtual: o relógio da página avança 1/30 s por quadro fotografado.
// Requer `npm run dev -- -p 3210` rodando e ffmpeg no PATH.
//
// Uso: node scripts/gravar-tomada.mjs <pasta-saida> [--previa]
//   --previa  só fotografa as posições-chave (para acertar enquadramento)
import { chromium } from 'playwright-core'
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SAIDA = process.argv[2] ?? 'tomada'
const PREVIA = process.argv.includes('--previa')
const FPS = 30
const QUADROS = join(SAIDA, 'quadros')
rmSync(QUADROS, { recursive: true, force: true })
mkdirSync(QUADROS, { recursive: true })

const TAU = Math.PI * 2
// [tempo s, alvo, az, polar, dist]
const CHAVES = [
  [0.0, [2.1, 1.6, 7.25], 0.25, 1.38, 7], // perto da porta pivotante
  [2.4, [2.2, 1.2, 0.8], 0.75, 1.14, 47], // abre: a casa inteira
  [6.0, [2.2, 1.2, -1], 2.2, 1.08, 45], // contorna até os fundos (piscina)
  [8.6, [1.5, 0.5, -0.5], 2.75, 0.92, 38], // telhado sobe (dispara em 7,4 s)
  [10.2, [4.52, 1.2, 2.9], 3.0, 0.95, 8.5], // mergulha na suíte
  [11.2, [4.52, 1.2, 2.9], 3.25, 0.93, 7.8],
  [12.6, [0.29, 1.2, 0.5], 4.93, 0.92, 8.5], // desliza até a sala
  [13.6, [0.29, 1.2, 0.5], 5.1, 0.9, 7.8],
  [15.0, [-3.7, 0.9, -4.0], 0.35 + TAU, 0.9, 8], // cozinha
  [16.0, [-3.7, 0.9, -4.0], 0.52 + TAU, 0.88, 7.4],
  [18.2, [1.4, 0, -0.4], TAU, 0.06, 54], // sobe até a planta
  [19.4, [1.4, 0, -0.4], TAU + 0.06, 0.05, 54],
]
const TELHADO_EM = 7.4
const OCULTAR = ['ALAMEDA_CoberturaSuperior', 'ALAMEDA_CoberturasTerreas', 'ALAMEDA_PavimentoSuperior', 'ALAMEDA_HallEscada']
const PONTOS = ['HOTSPOT_Casa_Entrada', 'HOTSPOT_Casa_Piscina', 'HOTSPOT_Suite_Cabeceira', 'HOTSPOT_Painel', 'HOTSPOT_Bancada']
const DURACAO = CHAVES[CHAVES.length - 1][0]

// Interpolação cúbica monótona (Fritsch–Carlson): curva suave, sem passar do ponto.
function monotona(xs, ys) {
  const n = xs.length
  const d = [], m = new Array(n)
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]))
  m[0] = d[0]
  m[n - 1] = d[n - 2]
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b
    if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i] }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0]
    if (x >= xs[n - 1]) return ys[n - 1]
    let i = 0
    while (x > xs[i + 1]) i++
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h
    const t2 = t * t, t3 = t2 * t
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1]
  }
}
const ts = CHAVES.map((c) => c[0])
const curva = {
  ax: monotona(ts, CHAVES.map((c) => c[1][0])),
  ay: monotona(ts, CHAVES.map((c) => c[1][1])),
  az_: monotona(ts, CHAVES.map((c) => c[1][2])),
  az: monotona(ts, CHAVES.map((c) => c[2])),
  polar: monotona(ts, CHAVES.map((c) => c[3])),
  dist: monotona(ts, CHAVES.map((c) => Math.log(c[4]))), // distância em escala log: aproximação natural
}
const orbitaEm = (t) => ({
  alvo: [curva.ax(t), curva.ay(t), curva.az_(t)],
  az: curva.az(t),
  polar: Math.max(0.03, curva.polar(t)),
  dist: Math.exp(curva.dist(t)),
})

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
})
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
await ctx.addInitScript(() => {
  const rafReal = window.requestAnimationFrame.bind(window)
  const agoraReal = performance.now.bind(performance)
  let virtual = false, t = 0, fila = []
  window.requestAnimationFrame = (cb) => (virtual ? (fila.push(cb), fila.length) : rafReal(cb))
  performance.now = () => (virtual ? t : agoraReal())
  window.__ativarTempoVirtual = () => { t = agoraReal(); virtual = true }
  window.__passo = (ms) => { t += ms; const f = fila; fila = []; for (const cb of f) cb(t) }
})
const page = await ctx.newPage()
await page.goto('http://localhost:3210/?gravacao', { waitUntil: 'networkidle' })
await page.addStyleTag({
  content: `
    html,body{background:transparent!important}
    body *{visibility:hidden!important}
    #explore .v3d, #explore .v3d *{visibility:visible!important}
    .v3d-modos,.v3d-ferramentas,.v3d-dica,.v3d-marcadores,.v3d-pontos,.v3d-ficha,.v3d-legenda,.v3d-capa,.v3d-carregando,.v3d-poster{display:none!important}
    [style*="opacity"]{opacity:1!important;transform:none!important}
    #explore .v3d{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;z-index:9999}
    #explore .v3d-palco{border-radius:0!important;box-shadow:none!important;background:transparent!important}
    .v3d-canvas{opacity:1!important;transition:none!important}
  `,
})
await page.evaluate(() => document.querySelector('#explore').scrollIntoView())
await page.waitForSelector('#explore .v3d[data-estado="ativo"]', { timeout: 120000 })
await page.waitForFunction(() => !!window.__motor)
await page.waitForTimeout(2500)
await page.evaluate(() => window.__ativarTempoVirtual())

const total = Math.round(DURACAO * FPS) + 1
const fotografar = new Set(PREVIA ? CHAVES.map((c) => Math.round(c[0] * FPS)).concat([Math.round(TELHADO_EM * FPS) + 20]) : [])
const projecoes = []
let telhado = false
for (let i = 0; i < total; i++) {
  const t = i / FPS
  if (!telhado && t >= TELHADO_EM) {
    telhado = true
    await page.evaluate((nomes) => window.__motor.ocultar(nomes), OCULTAR)
  }
  await page.evaluate((orb) => window.__motor.definirCamera(orb), orbitaEm(t))
  await page.evaluate((ms) => window.__passo(ms), 1000 / FPS)
  projecoes.push(await page.evaluate((p) => window.__motor.projetar(p), PONTOS))
  if (!PREVIA || fotografar.has(i)) {
    await page.screenshot({ path: join(QUADROS, `q${String(i).padStart(5, '0')}.png`), omitBackground: true })
  }
}
await browser.close()

writeFileSync(join(SAIDA, 'tomada.json'), JSON.stringify({ fps: FPS, quadros: total, telhadoEm: TELHADO_EM, chaves: CHAVES.map((c) => c[0]), projecoes }))
if (!PREVIA) {
  // WebM VP9 com alfa (Remotion lê com transparência)
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(QUADROS, 'q%05d.png'), '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '18', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', join(SAIDA, 'tomada.webm')], { stdio: 'inherit' })
}
console.log(`${total} quadros${PREVIA ? ' (prévia)' : ''}`)
