// Mede carga e fluidez do 3D da Casa (arrastando por 3 s).
// Uso: node scripts/medir-3d.mjs [url] [--celular] [--fraco]
import { chromium } from 'playwright-core'
const url = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:3210/imoveis/casa-alameda/'
const celular = process.argv.includes('--celular')
const fraco = process.argv.includes('--fraco')
const b = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: fraco ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
})
const ctx = await b.newContext(celular ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 } : { viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
const t0 = Date.now()
await p.goto(url, { waitUntil: 'domcontentloaded' })
await p.evaluate(() => document.querySelector('.v3d')?.scrollIntoView({ block: 'center' }))
// No celular o 3D só roda em tela cheia, depois do toque em "Explorar em 3D".
if (celular) await p.click('.v3d-iniciar')
await p.waitForSelector('.v3d[data-estado="ativo"]', { timeout: 180000 })
const carga = Date.now() - t0
const box = await (await p.$('.v3d canvas')).boundingBox()
await p.evaluate(() => {
  window.__q = []
  let u = performance.now()
  const f = (t) => { window.__q.push(t - u); u = t; if (window.__q.length < 400) requestAnimationFrame(f) }
  requestAnimationFrame(f)
})
await p.mouse.move(box.x + box.width / 2, box.y + box.height * 0.22)
await p.mouse.down()
for (let i = 0; i < 90; i++) { await p.mouse.move(box.x + box.width / 2 + Math.sin(i / 8) * 200, box.y + box.height * 0.22 + Math.cos(i / 11) * 40); await p.waitForTimeout(33) }
await p.mouse.up()
if (process.env.FOTO) await p.screenshot({ path: process.env.FOTO })
const q = (await p.evaluate(() => window.__q)).slice(5, 90).sort((a, b) => a - b)
const med = q[Math.floor(q.length / 2)], p95 = q[Math.floor(q.length * 0.95)]
console.log(`${celular ? 'celular' : 'desktop'}${fraco ? ' (SwiftShader)' : ''}: carga ${(carga / 1000).toFixed(1)} s · quadro mediano ${med.toFixed(1)} ms · p95 ${p95.toFixed(1)} ms`)
await b.close()
