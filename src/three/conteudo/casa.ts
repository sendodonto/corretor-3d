// ─────────────────────────────────────────────────────────────────────────────
// Tour da Casa Alameda: três modos de exploração e os pontos de cada um.
// Título e descrição curta vêm dos nós HOTSPOT_* do GLB; aqui ficam o rótulo,
// o texto complementar e o enquadramento. Estudo autoral: medidas aproximadas.
// ─────────────────────────────────────────────────────────────────────────────
import type { Orbita } from '../camera'
import type { ConfigModelo } from '../modelos'
import type { PontoCozinha as Ponto } from './cozinha'

export type ModoId = 'externa' | 'planta' | 'ambientes'

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

const CORTE = ['ALAMEDA_CoberturaSuperior', 'ALAMEDA_CoberturasTerreas', 'ALAMEDA_PavimentoSuperior']

export const modos: Modo[] = [
  {
    id: 'externa',
    rotulo: 'Vista externa',
    legenda: 'Fachada, garagem, lazer e varanda',
    ocultar: [],
    orbita: null,
    pontos: [
      {
        no: 'HOTSPOT_Casa_Entrada',
        rotulo: 'Entrada',
        titulo: 'Porta pivotante',
        detalhes: ['Porta de madeira de 2,6 m de altura, girando sobre pivô.', 'Toque de novo para fechar.'],
        vista: { az: 0.25, polar: 1.32, dist: 9 },
      },
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
    ],
  },
  {
    id: 'planta',
    rotulo: 'Planta 3D',
    legenda: 'O térreo visto de cima, sem telhado',
    ocultar: CORTE,
    orbita: { alvo: [1.4, 0, -0.4], az: 0, polar: 0.04, dist: 47 },
    limites: { polarMax: 1.0 },
    pontos: [],
  },
  {
    id: 'ambientes',
    rotulo: 'Ambientes',
    legenda: 'Sala, cozinha, suíte e closet por dentro',
    // O hall de pé-direito duplo (pedra de 6,5 m) tamparia a vista dos cômodos.
    ocultar: [...CORTE, 'ALAMEDA_HallEscada'],
    orbita: { alvo: [0.8, 0, -0.4], az: 0.5, polar: 0.82, dist: 25 },
    limites: { polarMax: 1.25 },
    pontos: [
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
    ],
  },
]
