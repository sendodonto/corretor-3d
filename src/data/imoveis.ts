// ─────────────────────────────────────────────────────────────────────────────
// Imóveis do site. TODOS SÃO DEMONSTRAÇÃO: preços, áreas e endereços servem
// para apresentar o layout. As casas e apartamentos em 3D são estudos
// autorais (medidas aproximadas); as fotos dos demais são banco de imagens
// (Unsplash) e aparecem marcadas como "foto de referência".
// ─────────────────────────────────────────────────────────────────────────────

export type Tipo = 'Casa' | 'Apartamento' | 'Cobertura' | 'Casa em condomínio'
export type Finalidade = 'Venda' | 'Aluguel'

export interface Foto {
  src: string
  /** Versão pequena (cards, miniaturas). */
  mini: string
  alt: string
  /** 'render' = imagem do estudo 3D; 'referencia' = foto de banco. */
  origem: 'render' | 'referencia'
}

export interface Imovel {
  slug: string
  titulo: string
  tipo: Tipo
  finalidade: Finalidade
  bairro: string
  cidade: string
  preco: number
  condominio?: number
  iptu?: number
  area: number
  quartos: number
  suites: number
  banheiros: number
  vagas: number
  destaque?: boolean
  /** Modelo do visualizador 3D (src/three/modelos.ts). */
  modelo3d?: 'casa' | 'sala' | 'cozinha' | 'closet'
  /** Tamanho aproximado do 3D para o botão do celular. */
  tamanho3d?: string
  resumo: string
  descricao: string[]
  diferenciais: string[]
  fotos: Foto[]
  mapa: { lat: number; lng: number }
  proximidades: { lugar: string; distancia: string }[]
}

const un = (id: string, alt: string): Foto => ({
  src: `https://images.unsplash.com/photo-${id}?w=1760&q=78&auto=format&fit=crop`,
  mini: `https://images.unsplash.com/photo-${id}?w=900&h=660&q=70&auto=format&fit=crop`,
  alt,
  origem: 'referencia',
})
const render = (pasta: string, nome: string, alt: string): Foto => ({
  src: `/fotos/${pasta}/${nome}.webp`,
  mini: `/fotos/${pasta}/${nome}-p.webp`,
  alt,
  origem: 'render',
})
const poster = (nome: string, alt: string): Foto => ({
  src: `/posters/${nome}.webp`,
  mini: `/posters/${nome}.webp`,
  alt,
  origem: 'render',
})

export const imoveis: Imovel[] = [
  {
    slug: 'casa-alameda',
    titulo: 'Casa Alameda',
    tipo: 'Casa em condomínio',
    finalidade: 'Venda',
    bairro: 'Vila Assunção',
    cidade: 'Porto Alegre',
    preco: 3_480_000,
    condominio: 1_450,
    iptu: 780,
    area: 342,
    quartos: 3,
    suites: 1,
    banheiros: 4,
    vagas: 2,
    destaque: true,
    modelo3d: 'casa',
    tamanho3d: '5 MB',
    resumo: 'Dois pavimentos, hall com pé-direito duplo, piscina com prainha e espaço gourmet nos fundos.',
    descricao: [
      'A fachada abre com uma porta pivotante de madeira e um hall envidraçado de pé-direito duplo, onde a escada de dois lances vira peça de arquitetura. A garagem coberta, para dois carros, tem forro de madeira e acesso independente.',
      'No térreo, sala, jantar e cozinha formam um só espaço voltado para o jardim. A suíte principal fica no mesmo pavimento, com closet em nogueira e canto de leitura. No andar de cima, dois dormitórios, banheiro e uma varanda lateral protegida por brises.',
      'Nos fundos, piscina com prainha, deck, pergolado de jantar e espaço gourmet com ilha e churrasqueira.',
    ],
    diferenciais: [
      'Pé-direito duplo no hall de entrada',
      'Porta pivotante de madeira',
      'Suíte térrea com closet planejado',
      'Piscina com prainha e deck',
      'Espaço gourmet com churrasqueira',
      'Varanda superior com brises',
      'Garagem coberta para 2 carros',
      'Cozinha integrada com península',
    ],
    fotos: [
      render('casa-alameda', 'fachada', 'Fachada da Casa Alameda com garagem coberta e hall envidraçado'),
      render('casa-alameda', 'entrada', 'Entrada com espelho d’água e hall de pé-direito duplo'),
      render('casa-alameda', 'lazer', 'Piscina com prainha, deck e espaço gourmet nos fundos'),
      render('casa-alameda', 'aerea', 'Vista aérea do lote com jardim e muros laterais'),
      render('casa-alameda', 'social', 'Sala integrada à cozinha e ao jantar'),
      render('casa-alameda', 'suite', 'Suíte com cabeceira em madeira e porta para o jardim'),
      render('casa-alameda', 'leitura', 'Canto de leitura da suíte'),
      render('casa-alameda', 'cabeceira', 'Detalhe da cabeceira e criado-mudo'),
    ],
    mapa: { lat: -30.1018, lng: -51.2532 },
    proximidades: [
      { lugar: 'Orla do Guaíba', distancia: '600 m' },
      { lugar: 'Escola e educação infantil', distancia: '900 m' },
      { lugar: 'Supermercado', distancia: '1,2 km' },
      { lugar: 'Centro de Porto Alegre', distancia: '9 km' },
    ],
  },
  {
    slug: 'apartamento-moinhos',
    titulo: 'Apartamento Moinhos',
    tipo: 'Apartamento',
    finalidade: 'Venda',
    bairro: 'Moinhos de Vento',
    cidade: 'Porto Alegre',
    preco: 1_690_000,
    condominio: 1_980,
    iptu: 540,
    area: 148,
    quartos: 3,
    suites: 1,
    banheiros: 3,
    vagas: 2,
    destaque: true,
    modelo3d: 'sala',
    tamanho3d: '3 MB',
    resumo: 'Living com painel de carvalho, home office integrado e janela de piso a teto.',
    descricao: [
      'Living amplo com painel de carvalho do piso quase ao teto, rack suspenso e uma bancada de trabalho integrada à mesma marcenaria. A janela ocupa a parede inteira e a luz entra pela manhã.',
      'Três dormitórios, sendo uma suíte, e duas vagas na garagem. A duas quadras do Parcão e da Rua Padre Chagas.',
    ],
    diferenciais: [
      'Marcenaria de carvalho no living',
      'Home office integrado à sala',
      'Janela de piso a teto',
      'Nichos com iluminação embutida',
      'Duas vagas',
    ],
    fotos: [
      poster('sala', 'Living com painel de carvalho e rack suspenso (estudo 3D)'),
      un('1600210492486-724fe5c67fb0', 'Sala de estar com sofá de couro e janelas altas'),
      un('1600607687939-ce8a6c25118c', 'Living integrado com painel de madeira'),
      un('1616594039964-ae9021a400a0', 'Dormitório com cabeceira estofada'),
      un('1586023492125-27b2c045efd7', 'Living com cozinha americana ao fundo'),
    ],
    mapa: { lat: -30.0262, lng: -51.2031 },
    proximidades: [
      { lugar: 'Parque Moinhos de Vento (Parcão)', distancia: '350 m' },
      { lugar: 'Rua Padre Chagas', distancia: '500 m' },
      { lugar: 'Hospital Moinhos de Vento', distancia: '900 m' },
      { lugar: 'Shopping', distancia: '1,1 km' },
    ],
  },
  {
    slug: 'apartamento-petropolis',
    titulo: 'Apartamento Petrópolis',
    tipo: 'Apartamento',
    finalidade: 'Venda',
    bairro: 'Petrópolis',
    cidade: 'Porto Alegre',
    preco: 980_000,
    condominio: 1_120,
    iptu: 310,
    area: 104,
    quartos: 2,
    suites: 1,
    banheiros: 2,
    vagas: 1,
    destaque: true,
    modelo3d: 'cozinha',
    tamanho3d: '3 MB',
    resumo: 'Cozinha planejada em L com península, granito preto e iluminação embutida.',
    descricao: [
      'Cozinha planejada em L com armários grafite até o teto, faixa de madeira com LED e península ripada que vira mesa de café. Tampo de granito preto contínuo.',
      'Dois dormitórios, sendo uma suíte, sala para dois ambientes e uma vaga. Rua arborizada, perto da Protásio Alves e do comércio do bairro.',
    ],
    diferenciais: [
      'Cozinha planejada com península',
      'Armários até o teto',
      'Iluminação LED na bancada',
      'Suíte com armários',
      'Rua arborizada',
    ],
    fotos: [
      poster('cozinha', 'Cozinha planejada em L com península (estudo 3D)'),
      un('1600566753190-17f0baa2a6c3', 'Cozinha com ilha e banquetas'),
      un('1493809842364-78817add7ffb', 'Sala de estar com piso em espinha de peixe'),
      un('1554995207-c18c203602cb', 'Canto de estar com poltrona amarela'),
      un('1560448204-e02f11c3d0e2', 'Living amplo com janelas'),
    ],
    mapa: { lat: -30.0447, lng: -51.1829 },
    proximidades: [
      { lugar: 'Av. Protásio Alves', distancia: '300 m' },
      { lugar: 'Praça da Encol', distancia: '1,4 km' },
      { lugar: 'Supermercado', distancia: '400 m' },
      { lugar: 'Escola', distancia: '700 m' },
    ],
  },
  {
    slug: 'casa-tres-figueiras',
    titulo: 'Casa Três Figueiras',
    tipo: 'Casa',
    finalidade: 'Venda',
    bairro: 'Três Figueiras',
    cidade: 'Porto Alegre',
    preco: 4_250_000,
    iptu: 1_260,
    area: 410,
    quartos: 4,
    suites: 3,
    banheiros: 5,
    vagas: 4,
    resumo: 'Casa contemporânea com piscina de borda e grandes panos de vidro.',
    descricao: [
      'Casa contemporânea em terreno amplo, com piscina de borda voltada para o living e panos de vidro que se abrem por inteiro para o jardim.',
      'Quatro dormitórios, três suítes, escritório e garagem para quatro carros.',
    ],
    diferenciais: ['Piscina de borda', 'Living com portas de correr piso a teto', '3 suítes', 'Escritório', 'Garagem para 4 carros'],
    fotos: [
      un('1613490493576-7fde63acd811', 'Casa contemporânea com piscina de borda'),
      un('1600596542815-ffad4c1539a9', 'Fachada branca com piscina'),
      un('1512917774080-9991f1c4c750', 'Área da piscina com deck'),
    ],
    mapa: { lat: -30.0336, lng: -51.1716 },
    proximidades: [
      { lugar: 'Shopping Iguatemi', distancia: '1,6 km' },
      { lugar: 'Country Club', distancia: '1,2 km' },
      { lugar: 'Escola', distancia: '800 m' },
    ],
  },
  {
    slug: 'sobrado-boa-vista',
    titulo: 'Sobrado Boa Vista',
    tipo: 'Casa',
    finalidade: 'Venda',
    bairro: 'Boa Vista',
    cidade: 'Porto Alegre',
    preco: 2_150_000,
    iptu: 690,
    area: 265,
    quartos: 3,
    suites: 2,
    banheiros: 4,
    vagas: 2,
    resumo: 'Sobrado com volume em madeira, jardim frontal e living integrado.',
    descricao: [
      'Sobrado com fachada em volumes de madeira e concreto, jardim frontal e living integrado à cozinha, com porta de correr para o quintal.',
      'Três dormitórios, sendo duas suítes, e duas vagas cobertas.',
    ],
    diferenciais: ['Jardim frontal', 'Living integrado', '2 suítes', 'Quintal com churrasqueira'],
    fotos: [
      un('1600047509807-ba8f99d2cdde', 'Sobrado com volume revestido em madeira'),
      un('1600585154340-be6161a56a0c', 'Casa iluminada ao entardecer'),
      un('1600607687939-ce8a6c25118c', 'Living integrado'),
    ],
    mapa: { lat: -30.0226, lng: -51.1831 },
    proximidades: [
      { lugar: 'Av. Nilo Peçanha', distancia: '500 m' },
      { lugar: 'Supermercado', distancia: '600 m' },
      { lugar: 'Escola', distancia: '900 m' },
    ],
  },
  {
    slug: 'studio-cidade-baixa',
    titulo: 'Studio Cidade Baixa',
    tipo: 'Apartamento',
    finalidade: 'Aluguel',
    bairro: 'Cidade Baixa',
    cidade: 'Porto Alegre',
    preco: 3_200,
    condominio: 480,
    iptu: 90,
    area: 42,
    quartos: 1,
    suites: 0,
    banheiros: 1,
    vagas: 0,
    resumo: 'Studio mobiliado, com varanda, a uma quadra da Redenção.',
    descricao: [
      'Studio mobiliado com cozinha americana, varanda e janela ampla. Prédio novo com lavanderia coletiva e bicicletário.',
      'A uma quadra do Parque da Redenção e perto das faculdades do centro.',
    ],
    diferenciais: ['Mobiliado', 'Varanda', 'Bicicletário', 'Prédio novo'],
    fotos: [
      un('1545324418-cc1a3fa10c00', 'Fachada do prédio com varandas'),
      un('1502672260266-1c1ef2d93688', 'Studio com sofá e plantas'),
      un('1522708323590-d24dbb6b0267', 'Sala e cozinha integradas'),
    ],
    mapa: { lat: -30.0407, lng: -51.2213 },
    proximidades: [
      { lugar: 'Parque da Redenção', distancia: '200 m' },
      { lugar: 'UFRGS (Campus Centro)', distancia: '1,3 km' },
      { lugar: 'Supermercado', distancia: '300 m' },
    ],
  },
]

export const destaques = imoveis.filter((i) => i.destaque)
export const porSlug = (slug: string) => imoveis.find((i) => i.slug === slug)
export const bairros = [...new Set(imoveis.map((i) => i.bairro))].sort()
export const tipos = [...new Set(imoveis.map((i) => i.tipo))]

export function formatarPreco(i: Pick<Imovel, 'preco' | 'finalidade'>) {
  const v = i.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
  return i.finalidade === 'Aluguel' ? `${v}/mês` : v
}
export const reais = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
