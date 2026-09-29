// ─────────────────────────────────────────────────────────────────────────────
// Tours das casas: três modos de exploração (vista externa, planta 3D,
// ambientes) e os pontos de cada um. Título e descrição curta vêm dos nós
// HOTSPOT_* do GLB; aqui ficam o rótulo, o texto complementar e o enquadramento.
//
// As três casas (Alameda, Horizonte, Serra) compartilham o mesmo interior
// (sala, cozinha, closet, suíte), nas mesmas coordenadas: os pontos dos
// ambientes são os mesmos. Estudos autorais: medidas aproximadas.
// ─────────────────────────────────────────────────────────────────────────────
import type { Orbita } from '../camera'
import type { ConfigModelo } from '../modelos'

export type ModoId = 'externa' | 'planta' | 'ambientes'

export interface Ponto {
  /** Nó HOTSPOT_* do GLB. */
  no: string
  /** Rótulo curto (chips e etiquetas). */
  rotulo: string
  /** Substitui o título do GLB, se preenchido. */
  titulo?: string
  detalhes: string[]
  /** Enquadramento ao selecionar. O alvo é sempre a posição real do nó. */
  vista: Omit<Orbita, 'alvo'>
}

export interface Modo {
  id: ModoId
  rotulo: string
  legenda: string
  /** Grupos de primeiro nível do GLB ocultos neste modo. */
  ocultar: string[]
  /** Órbita do modo (null = vista inicial do modelo). */
  orbita: Orbita | null
  limites?: Partial<ConfigModelo['limites']>
  pontos: Ponto[]
}

/** Interior comum às três casas. */
const PONTOS_AMBIENTES: Ponto[] = [
  {
    no: 'HOTSPOT_Painel',
    rotulo: 'Sala',
    titulo: 'Sala de estar',
    detalhes: ['Painel de carvalho com a TV e o rack suspenso.', 'Integrada ao jantar e à cozinha.'],
    vista: { az: -1.35, polar: 0.82, dist: 7 },
  },
  {
    no: 'HOTSPOT_HomeOffice',
    rotulo: 'Home office',
    detalhes: ['Bancada de trabalho na mesma marcenaria da sala.', 'A gaveta abre ao selecionar o ponto.'],
    vista: { az: -1.0, polar: 0.8, dist: 5 },
  },
  {
    no: 'HOTSPOT_Bancada',
    rotulo: 'Cozinha',
    titulo: 'Cozinha planejada',
    detalhes: ['Armários grafite até o teto e granito preto.', 'Península ripada voltada para o jantar.'],
    vista: { az: 0.35, polar: 0.8, dist: 7 },
  },
  {
    no: 'HOTSPOT_Cabideiros',
    rotulo: 'Closet',
    titulo: 'Closet da suíte',
    detalhes: ['Módulos em nogueira para roupas curtas e longas.', 'Ilha central com gavetas.'],
    vista: { az: 0.15, polar: 0.72, dist: 6.5 },
  },
  {
    no: 'HOTSPOT_PortaVidro',
    rotulo: 'Vitrine',
    detalhes: ['Porta de vidro fumê com perfil de alumínio.', 'A porta abre ao selecionar o ponto.'],
    vista: { az: 0.3, polar: 0.85, dist: 5 },
  },
  {
    no: 'HOTSPOT_Suite_Cabeceira',
    rotulo: 'Suíte',
    titulo: 'Suíte principal',
    detalhes: ['Cabeceira em carvalho com iluminação indireta.', 'Porta de correr para o jardim lateral.'],
    vista: { az: 3.0, polar: 0.82, dist: 7 },
  },
  {
    no: 'HOTSPOT_Suite_Leitura',
    rotulo: 'Leitura',
    detalhes: ['Poltrona de madeira e linho junto à janela.', 'Luminária de piso e mesa lateral.'],
    vista: { az: 2.4, polar: 0.85, dist: 5 },
  },
]

const ENTRADA: Ponto = {
  no: 'HOTSPOT_Casa_Entrada',
  rotulo: 'Entrada',
  titulo: 'Porta pivotante',
  detalhes: ['Porta de madeira de 2,6 m de altura, girando sobre pivô.', 'Toque de novo para fechar.'],
  vista: { az: 0.25, polar: 1.32, dist: 9 },
}

/** Pontos externos do projeto de dois pavimentos (Alameda e Serra). */
const EXTERNOS_SOBRADO: Ponto[] = [
  ENTRADA,
  {
    no: 'HOTSPOT_Alameda_Garagem',
    rotulo: 'Garagem',
    detalhes: ['Duas vagas cobertas, sem manobra.', 'Forro de madeira e iluminação linear embutida.'],
    vista: { az: -0.45, polar: 1.22, dist: 12 },
  },
  {
    no: 'HOTSPOT_Alameda_Escada',
    rotulo: 'Hall e escada',
    detalhes: ['Pé-direito duplo com fachada de vidro.', 'Escada de dois lances com patamar e guarda-corpo.'],
    vista: { az: 0.45, polar: 1.3, dist: 10 },
  },
  {
    no: 'HOTSPOT_Alameda_Varanda',
    rotulo: 'Varanda',
    detalhes: ['Varanda lateral do pavimento superior.', 'Brises de madeira filtram o sol da tarde.'],
    vista: { az: 1.45, polar: 1.18, dist: 13 },
  },
  {
    no: 'HOTSPOT_Alameda_Gourmet',
    rotulo: 'Gourmet',
    detalhes: ['Ilha com cooktop e churrasqueira.', 'Pergolado de jantar ao lado da piscina.'],
    vista: { az: 2.2, polar: 1.1, dist: 13 },
  },
  {
    no: 'HOTSPOT_Casa_Piscina',
    rotulo: 'Piscina',
    detalhes: ['Piscina com prainha e deck de madeira.', 'Solário com espreguiçadeiras voltado para o norte.'],
    vista: { az: 2.95, polar: 0.95, dist: 17 },
  },
]

function criarModos(o: {
  legendaExterna: string
  externos: Ponto[]
  corte: string[]
  /** Grupos altos que, além da cobertura, tampam os cômodos vistos em 3/4. */
  corteAmbientes?: string[]
  planta: Orbita
  ambientes: Orbita
}): Modo[] {
  return [
    { id: 'externa', rotulo: 'Vista externa', legenda: o.legendaExterna, ocultar: [], orbita: null, pontos: o.externos },
    {
      id: 'planta',
      rotulo: 'Planta 3D',
      legenda: 'O térreo visto de cima, sem telhado',
      ocultar: o.corte,
      orbita: o.planta,
      limites: { polarMax: 1.0 },
      pontos: [],
    },
    {
      id: 'ambientes',
      rotulo: 'Ambientes',
      legenda: 'Sala, cozinha, suíte e closet por dentro',
      ocultar: [...o.corte, ...(o.corteAmbientes ?? [])],
      orbita: o.ambientes,
      limites: { polarMax: 1.25 },
      pontos: PONTOS_AMBIENTES,
    },
  ]
}

const CORTE_ALAMEDA = ['ALAMEDA_CoberturaSuperior', 'ALAMEDA_CoberturasTerreas', 'ALAMEDA_PavimentoSuperior']

export const MODOS = {
  // Casa Alameda: sobrado, garagem na frente, lazer nos fundos.
  casa: criarModos({
    legendaExterna: 'Fachada, garagem, lazer e varanda',
    externos: EXTERNOS_SOBRADO,
    corte: CORTE_ALAMEDA,
    // O hall de pé-direito duplo (pedra de 6,5 m) tamparia a vista dos cômodos.
    corteAmbientes: ['ALAMEDA_HallEscada'],
    planta: { alvo: [1.4, 0, -0.4], az: 0, polar: 0.04, dist: 47 },
    ambientes: { alvo: [0.8, 0, -0.4], az: 0.5, polar: 0.82, dist: 25 },
  }),
  // Casa Horizonte: térrea, pavilhão de hóspedes e ateliê, gourmet coberto.
  horizonte: criarModos({
    legendaExterna: 'Fachada, piscina, pátio e gourmet',
    externos: [
      ENTRADA,
      {
        no: 'HOTSPOT_Casa_Piscina',
        rotulo: 'Piscina',
        titulo: 'Piscina e varanda',
        detalhes: ['Deck de madeira e piscina com borda em pedra.', 'Varanda coberta de frente para o jardim.'],
        vista: { az: -0.35, polar: 1.05, dist: 15 },
      },
    ],
    corte: ['HORIZONTE_Coberturas'],
    planta: { alvo: [2, 0, 1.6], az: 0, polar: 0.04, dist: 42 },
    ambientes: { alvo: [1.2, 0, -0.4], az: 0.5, polar: 0.82, dist: 25 },
  }),
  // Casa Serra: sobrado com telhados de duas águas e gourmet nos fundos.
  serra: criarModos({
    legendaExterna: 'Fachada, garagem, lazer e varanda',
    externos: EXTERNOS_SOBRADO,
    corte: ['SERRA_Telhados', ...CORTE_ALAMEDA],
    // Empenas de madeira e a parede de pedra (até 8 m) tampariam os cômodos em 3/4.
    corteAmbientes: ['ALAMEDA_HallEscada', 'SERRA_Arquitetura', 'SERRA_PedraMadeira'],
    planta: { alvo: [1.4, 0, -0.4], az: 0, polar: 0.04, dist: 47 },
    ambientes: { alvo: [0.8, 0, -0.4], az: 0.5, polar: 0.82, dist: 25 },
  }),
} satisfies Record<string, Modo[]>

/** Tour da Casa Alameda (usado na seção Explore da home). */
export const modos = MODOS.casa
