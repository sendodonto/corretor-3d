// Gera uma cópia do GLB otimizada para web em public/modelos/.
// Preserva materiais, proporções, os grupos de primeiro nível (coberturas e
// pavimentos, que o visualizador oculta na vista de planta), as animações e
// os nós HOTSPOT_* com seus extras. O arquivo de entrada não é alterado.
//
// Uso: node scripts/otimizar-glb.mjs <entrada.glb> <nome> [--erro 0.001] [--textura 2048] [--remover NO1,NO2]
//   ex.: node scripts/otimizar-glb.mjs modelos-fonte/export/casa_alameda.glb casa-alameda --remover ALAMEDA_ContextoRender
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { dedup, prune, weld, textureCompress, reorder, quantize, join, simplify } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import { statSync, mkdirSync } from 'node:fs';
import draco3d from 'draco3dgltf';

const args = process.argv.slice(2);
const opcao = (nome, padrao) => {
  const i = args.indexOf(`--${nome}`);
  return i >= 0 ? args[i + 1] : padrao;
};
const [entrada, nome] = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!entrada || !nome) throw new Error('Uso: node scripts/otimizar-glb.mjs <entrada.glb> <nome>');
const ERRO = Number(opcao('erro', '0.001'));
const TEXTURA = Number(opcao('textura', '2048'));
const REMOVER = new Set(opcao('remover', '').split(',').filter(Boolean));
const saida = `public/modelos/${nome}.glb`;
mkdirSync('public/modelos', { recursive: true });

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'meshopt.encoder': MeshoptEncoder,
    'meshopt.decoder': MeshoptDecoder,
    'draco3d.decoder': await draco3d.createDecoderModule(),
  });

const doc = await io.read(entrada);
const root = doc.getRoot();
const cena = root.getDefaultScene() ?? root.listScenes()[0];

// Nós que só servem aos renders (terreno de 600 m, céu) saem do arquivo web.
for (const n of root.listNodes()) if (REMOVER.has(n.getName())) n.dispose();

// O Blender renomeia ações duplicadas (".001"); os hotspots usam o nome original.
for (const a of root.listAnimations()) a.setName(a.getName().replace(/\.\d{3}$/, ''));

const animacoesAntes = root.listAnimations().map((a) => `${a.getName()}:${a.listChannels().length}`).sort();
root.listExtensionsUsed().find((e) => e.extensionName === 'KHR_draco_mesh_compression')?.dispose();
const hotspotsAntes = root.listNodes()
  .filter((n) => n.getName().startsWith('HOTSPOT_'))
  .map((n) => ({ nome: n.getName(), pos: n.getWorldTranslation(), extras: n.getExtras() }));

// Achatamento por grupo: cada malha sobe para o seu grupo de primeiro nível
// (mantendo a posição no mundo). Assim o join une peças do mesmo material
// dentro de cada grupo, e o grupo continua existindo para ser ocultado.
// Peças animadas e seus filhos ficam como estão.
const animados = new Set();
for (const a of root.listAnimations()) for (const c of a.listChannels()) if (c.getTargetNode()) animados.add(c.getTargetNode());
const sobAnimado = (n) => {
  for (let p = n; p; p = p.getParentNode()) if (animados.has(p)) return true;
  return false;
};
const grupoDe = (n) => {
  let p = n;
  while (p.getParentNode()) p = p.getParentNode();
  return p === n ? null : p;
};
const inversa = (m) => {
  // matriz 4×4 afim (coluna principal)
  const [a, b, c, , d, e, f, , g, h, i, , x, y, z] = m;
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C;
  const r = [
    A, -(b * i - c * h), b * f - c * e, 0,
    B, a * i - c * g, -(a * f - c * d), 0,
    C, -(a * h - b * g), a * e - b * d, 0,
  ].map((v) => v / det);
  r.push(-(x * r[0] + y * r[4] + z * r[8]), -(x * r[1] + y * r[5] + z * r[9]), -(x * r[2] + y * r[6] + z * r[10]), 1);
  return r;
};
const multiplicar = (a, b) => {
  const r = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) for (let l = 0; l < 4; l++) for (let k = 0; k < 4; k++) r[c * 4 + l] += a[k * 4 + l] * b[c * 4 + k];
  return r;
};
let movidos = 0;
for (const n of root.listNodes()) {
  if (!n.getMesh() || sobAnimado(n)) continue;
  const g = grupoDe(n);
  if (!g || n.getParentNode() === g) continue;
  const local = multiplicar(inversa(g.getWorldMatrix()), n.getWorldMatrix());
  n.getParentNode().removeChild(n);
  g.addChild(n);
  n.setMatrix(local);
  movidos++;
}

await doc.transform(
  dedup(),
  weld(),
  // Detalhes microscópicos (costuras, cadarços) somam centenas de milhares de
  // triângulos. O erro máximo é relativo ao tamanho de cada peça.
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.0, error: ERRO, lockBorder: true }),
  join({ keepNamed: false }),
  prune({ keepLeaves: true, keepExtras: true }),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [TEXTURA, TEXTURA], quality: 84 }),
  reorder({ encoder: MeshoptEncoder }),
  quantize({ pattern: /^(POSITION|NORMAL|TEXCOORD_0)$/ }),
);

for (const h of hotspotsAntes) {
  if (root.listNodes().some((n) => n.getName() === h.nome)) continue;
  cena.addChild(doc.createNode(h.nome).setTranslation(h.pos).setExtras(h.extras));
}

doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({
  method: EXTMeshoptCompression.EncoderMethod.FILTER,
});

await io.write(saida, doc);

// Conferência: hotspots e animações precisam sair idênticos.
const conferir = await io.read(saida);
const depois = conferir.getRoot().listNodes().filter((n) => n.getName().startsWith('HOTSPOT_'));
if (depois.length !== hotspotsAntes.length) throw new Error('Hotspots perdidos na otimização');
for (const h of hotspotsAntes) {
  const n = depois.find((d) => d.getName() === h.nome);
  const w = n.getWorldTranslation();
  const ok = w.every((v, i) => Math.abs(v - h.pos[i]) < 1e-3) && JSON.stringify(n.getExtras()) === JSON.stringify(h.extras);
  if (!ok) throw new Error(`Hotspot alterado: ${h.nome}`);
}
const animacoesDepois = conferir.getRoot().listAnimations().map((a) => `${a.getName()}:${a.listChannels().filter((c) => c.getTargetNode()).length}`).sort();
if (JSON.stringify(animacoesAntes) !== JSON.stringify(animacoesDepois)) throw new Error(`Animações alteradas: ${animacoesAntes} → ${animacoesDepois}`);

const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(2) + ' MB';
console.log(`${entrada} (${mb(entrada)}) → ${saida} (${mb(saida)})`);
console.log(`Malhas reagrupadas: ${movidos} · hotspots: ${hotspotsAntes.length} · animações: ${animacoesDepois.join(', ')}`);
let tris = 0;
for (const m of conferir.getRoot().listMeshes()) for (const pr of m.listPrimitives()) tris += (pr.getIndices()?.getCount() ?? pr.getAttribute('POSITION').getCount()) / 3;
let primitivas = 0;
for (const m of conferir.getRoot().listMeshes()) primitivas += m.listPrimitives().length;
console.log(`Triângulos: ${Math.round(tris).toLocaleString('pt-BR')} · primitivas (draw calls): ${primitivas} · materiais: ${conferir.getRoot().listMaterials().length}`);
console.log('Grupos:', conferir.getRoot().listScenes()[0].listChildren().filter((n) => !n.getName().startsWith('HOTSPOT_')).map((n) => n.getName()).join(', '));
