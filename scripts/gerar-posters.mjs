// Gera os pôsteres dos visualizadores 3D (imagem mostrada antes do 3D e no
// celular) a partir do próprio visualizador: a troca pôster → 3D não "pula".
// Requer o servidor de desenvolvimento em http://localhost:3210.
// Uso: node scripts/gerar-posters.mjs
import { chromium } from 'playwright-core'
import sharp from 'sharp'

const BASE = process.env.URL ?? 'http://localhost:3210'
const ALVOS = [
  // [página, seletor do visualizador, nome, largura, altura]
  ['/', '.v3d-hero', 'casa-hero', 1180, 900],
  ['/', '.v3d-hero', 'casa-hero-retrato', 780, 1046],
  ['/', '#explore .v3d', 'casa-explore', 1280, 880],
  ['/', '#explore .v3d', 'casa-explore-retrato', 780, 1046],
  ['/imoveis/apartamento-moinhos/', '.v3d', 'sala', 1280, 880],
  ['/imoveis/apartamento-moinhos/', '.v3d', 'sala-retrato', 780, 1046],
  ['/imoveis/apartamento-petropolis/', '.v3d', 'cozinha', 1280, 880],
  ['/imoveis/apartamento-petropolis/', '.v3d', 'cozinha-retrato', 780, 1046],
]
const SO = process.argv.slice(2)

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
})
for (const [rota, sel, nome, w, h] of ALVOS.filter((a) => !SO.length || SO.includes(a[2]))) {
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1200 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(BASE + rota, { waitUntil: 'networkidle' })
  // Palco no tamanho do pôster, sem a interface por cima.
  await page.addStyleTag({
    content: `.v3d-dica,.v3d-ferramentas,.v3d-marcadores,.v3d-pontos,.v3d-modos,.v3d-legenda,.v3d-capa{display:none!important}
      ${sel}{position:fixed!important;left:0;top:0;width:${w}px!important;height:${h}px!important;z-index:9999;background:#f7f6f3}`,
  })
  await page.evaluate((s) => document.querySelector(s).scrollIntoView(), sel)
  await page.waitForSelector(`${sel}[data-estado="ativo"]`, { timeout: 120000 })
  await page.waitForTimeout(2500)
  const png = await (await page.$(sel)).screenshot()
  await sharp(png).webp({ quality: 80 }).toFile(`public/posters/${nome}.webp`)
  console.log('pôster', nome)
  await ctx.close()
}
await browser.close()
