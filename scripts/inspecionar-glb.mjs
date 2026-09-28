// Lista a hierarquia de primeiro nível, animações e hotspots de um GLB.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/core';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(process.argv[2]);
const root = doc.getRoot();
const cena = root.listScenes()[0];
const tri = (n) => { let t = 0; n.traverse((c) => { const m = c.getMesh(); if (m) for (const p of m.listPrimitives()) { const i = p.getIndices(); t += (i ? i.getCount() : p.getAttribute('POSITION').getCount()) / 3; } }); return t; };
for (const n of cena.listChildren()) console.log('RAIZ', n.getName(), 'filhos', n.listChildren().length, 'tri', tri(n));
const b = getBounds(cena); console.log('BOUNDS', b.min.map(v=>v.toFixed(1)), b.max.map(v=>v.toFixed(1)));
for (const a of root.listAnimations()) console.log('ANIM', a.getName(), a.listChannels().map(c => c.getTargetNode()?.getName()).join(','));
for (const n of root.listNodes()) if (n.getName().startsWith('HOTSPOT_')) console.log('HS', n.getName(), n.getWorldTranslation().map(v=>v.toFixed(2)).join(' '), JSON.stringify(n.getExtras()));
console.log('MESHES', root.listMeshes().length, 'MATS', root.listMaterials().length, 'TEX', root.listTextures().length);
for (const n of root.listNodes()) if (/^ALAMEDA_|^CASA_|^Casa_|Grupo/i.test(n.getName()) && n.listChildren().length) console.log('GRUPO', n.getName(), 'pai', n.getParentNode()?.getName() ?? '-', 'tri', tri(n));
