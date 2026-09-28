# Site de corretor com tour 3D — demonstração da Módulo

Site de corretor com tour 3D próprio: **explore seu próximo imóvel antes mesmo da visita**.
Next.js (export estático) · Tailwind CSS 4 · Motion · three.js.

Publicado em: https://sendodonto.github.io/corretor-3d/

> **Site de demonstração da Módulo.** A corretora "Helena Prado", a marca "Prado Imóveis",
> o CRECI, os números, os depoimentos, os imóveis e os preços são **fictícios**, para mostrar
> o site pronto a corretores. A faixa do topo ("Quero um site assim") leva ao WhatsApp da
> Módulo (`demo.whatsapp` em `src/config/site.ts`). Fotos: Unsplash; tours 3D: estudos autorais.
>
> Para um cliente real: troque todos os dados pelos reais (depoimentos só com autorização)
> e desligue `demo.ativo`.

## Onde trocar os dados

| O quê | Arquivo |
| --- | --- |
| Corretor, CRECI, WhatsApp, e-mail, mensagens, depoimentos | `src/config/site.ts` |
| Imóveis (preço, área, fotos, mapa, proximidades) | `src/data/imoveis.ts` |
| Pontos do tour 3D da casa e modos (externa, planta, ambientes) | `src/three/conteudo/casa.ts` |
| Câmera, limites e luz de cada modelo | `src/three/modelos.ts` |

- Com `contato.whatsapp` vazio, os botões abrem o WhatsApp com a mensagem pronta para o
  visitante escolher o contato. Preencha só com dígitos, com DDI e DDD: `5551999999999`.
- Depoimentos e números de atuação ficam escondidos quando as listas estão vazias.
- Sem `corretor.foto`, aparece um monograma com as iniciais.

## Componentes

`<Property3DViewer/>` · `<PropertyCard/>` · `<PropertyGallery/>` · `<PropertyFilters/>` ·
`<AgentProfile/>` · `<ScheduleVisit/>` · `<WhatsAppCTA/>` — em `src/components/`.

O agendamento não tem servidor: nome, WhatsApp, data e horário viram uma mensagem de WhatsApp
pronta.

## 3D

Motor próprio em `src/three/` (o three.js só é baixado quando o 3D abre):

- Desktop: carrega ao se aproximar da tela e libera a GPU quando fica longe; giro lento
  inicial que para no primeiro toque; dica "Arraste para explorar".
- Celular: pôster + botão "Explorar em 3D · 5 MB", que abre em tela cheia.
- Qualidade automática (`?qualidade=baixa|media|alta` força): celulares recebem a versão leve
  da casa (`casa-alameda-leve.glb`); render progressivo (quadro leve em movimento, quadro
  nítido com oclusão de ambiente parado).
- Planta 3D: oculta os grupos `ALAMEDA_CoberturaSuperior`, `ALAMEDA_CoberturasTerreas` e
  `ALAMEDA_PavimentoSuperior` do GLB.

### Atualizar o modelo da casa

A fonte é `casa_alameda.blend` (release `modelos-3d-2026-09-28` de VelloCo/vello), fora
do repositório, em `modelos-fonte/`.

```bash
# 1. reduzir detalhes microscópicos (costuras, franjas) e salvar
blender --background modelos-fonte/casa_alameda.blend --python scripts/blender/reduzir_detalhes.py -- --salvar
# 2. exportar o GLB (sem câmeras, luzes e cenografia; corrige cores de tecido)
blender --background modelos-fonte/casa_alameda.blend --python scripts/blender/exportar_glb.py -- modelos-fonte/export/casa_alameda.glb
# 3. otimizar (meshopt + WebP, grupos, hotspots e animações preservados)
npm run modelo -- modelos-fonte/export/casa_alameda.glb casa-alameda --remover ALAMEDA_ContextoRender --erro 0.003 --textura 1024
npm run modelo -- modelos-fonte/export/casa_alameda.glb casa-alameda-leve --remover ALAMEDA_ContextoRender --erro 0.012 --textura 512
# 4. imagens da galeria (Cycles, GPU)
blender --background modelos-fonte/casa_alameda.blend --python scripts/blender/render_camera.py -- renders 96 Alameda_Camera_Fachada ...
# 5. pôsteres do 3D (com npm run dev na porta 3210)
npm run posters
```

## Desenvolvimento

```bash
npm install
npm run dev -- -p 3210
npm run lint
npm run build   # gera out/ (basePath /corretor-3d)
```

O push na `main` publica no GitHub Pages (`.github/workflows/pages.yml`).
