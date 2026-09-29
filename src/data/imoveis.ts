// ─────────────────────────────────────────────────────────────────────────────
// Imóveis do site de demonstração. Preços, áreas, códigos e endereços são
// fictícios. A Casa Alameda e os tours 3D são estudos autorais (medidas
// aproximadas); as fotos são de banco de imagens (Unsplash).
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
  /** Código do anúncio. */
  codigo: string
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
  /** Casa do visualizador 3D (src/three/modelos.ts): Alameda, Horizonte ou Serra. */
  modelo3d?: 'casa' | 'horizonte' | 'serra'
  /** Tamanho aproximado do 3D para o botão do celular. */
  tamanho3d?: string
  /** Título da seção 3D (padrão: "Explore a casa por fora, por cima e por dentro"). */
  titulo3d?: string
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

export const imoveis: Imovel[] = [
  {
    slug: 'casa-alameda',
    codigo: 'PR-1021',
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
    slug: 'casa-horizonte',
    codigo: 'PR-1028',
    titulo: 'Casa Horizonte',
    tipo: 'Casa em condomínio',
    finalidade: 'Venda',
    bairro: 'Belém Novo',
    cidade: 'Porto Alegre',
    preco: 2_790_000,
    condominio: 1_250,
    iptu: 690,
    area: 298,
    quartos: 3,
    suites: 2,
    banheiros: 4,
    vagas: 2,
    destaque: true,
    modelo3d: 'horizonte',
    tamanho3d: '5 MB',
    resumo: 'Casa térrea com pavilhão independente para hóspedes e ateliê, pátio com pergolado, piscina e gourmet coberto.',
    descricao: [
      'Tudo no mesmo nível: a casa principal reúne sala, jantar e cozinha integrados, voltados para a varanda e a piscina com deck de madeira. A suíte tem closet em nogueira e canto de leitura.',
      'Do outro lado do pátio com pergolado fica um pavilhão independente, com suíte de hóspedes e ateliê. Ao lado dele, o espaço gourmet coberto, com churrasqueira de tijolo refratário, ilha e bancada.',
    ],
    diferenciais: [
      'Casa térrea, sem escadas',
      'Pavilhão independente para hóspedes',
      'Ateliê ou home office separado',
      'Gourmet coberto com churrasqueira',
      'Pátio com pergolado',
      'Piscina com deck de madeira',
      'Closet planejado na suíte',
    ],
    fotos: [
      render('casa-horizonte', 'fachada', 'Fachada da Casa Horizonte, térrea, com piscina na frente'),
      render('casa-horizonte', 'piscina', 'Piscina com deck de madeira e varanda'),
      render('casa-horizonte', 'gourmet_externo', 'Gourmet coberto junto ao pavilhão'),
      render('casa-horizonte', 'gourmet', 'Ilha e churrasqueira do espaço gourmet'),
      render('casa-horizonte', 'churrasqueira', 'Churrasqueira de tijolo refratário com grelha de inox'),
      render('casa-horizonte', 'social', 'Sala integrada à cozinha e ao jantar'),
      render('casa-horizonte', 'suite', 'Suíte com cabeceira em madeira'),
      render('casa-horizonte', 'hospedes', 'Suíte de hóspedes no pavilhão'),
      render('casa-horizonte', 'atelie', 'Ateliê com estante e bancada de trabalho'),
      render('casa-horizonte', 'patio', 'Passagem coberta pelo pátio com pergolado'),
      render('casa-horizonte', 'aerea', 'Vista aérea do lote'),
    ],
    mapa: { lat: -30.2095, lng: -51.1795 },
    proximidades: [
      { lugar: 'Orla de Belém Novo', distancia: '700 m' },
      { lugar: 'Escola', distancia: '1 km' },
      { lugar: 'Supermercado', distancia: '1,3 km' },
      { lugar: 'Centro de Porto Alegre', distancia: '24 km' },
    ],
  },
  {
    slug: 'casa-serra',
    codigo: 'PR-1035',
    titulo: 'Casa Serra',
    tipo: 'Casa em condomínio',
    finalidade: 'Venda',
    bairro: 'Espírito Santo',
    cidade: 'Porto Alegre',
    preco: 3_190_000,
    condominio: 1_380,
    iptu: 760,
    area: 326,
    quartos: 3,
    suites: 1,
    banheiros: 4,
    vagas: 2,
    destaque: true,
    modelo3d: 'serra',
    tamanho3d: '6 MB',
    resumo: 'Sobrado com telhados metálicos de duas águas, empenas de madeira, entrada envidraçada e área gourmet.',
    descricao: [
      'Telhados metálicos de duas águas e empenas revestidas de madeira dão à casa a silhueta de um refúgio de serra. A entrada envidraçada abre para um hall com escada de dois lances.',
      'No térreo, sala, jantar e cozinha integrados e a suíte principal com closet. Em cima, dois dormitórios e varanda. Nos fundos, piscina, deck e espaço gourmet com churrasqueira refratária e coifa inclinada.',
    ],
    diferenciais: [
      'Telhados de duas águas com empenas de madeira',
      'Entrada envidraçada com pé-direito alto',
      'Gourmet com churrasqueira refratária',
      'Piscina e deck nos fundos',
      'Suíte térrea com closet',
      'Garagem coberta para 2 carros',
    ],
    fotos: [
      render('casa-serra', 'fachada', 'Fachada da Casa Serra com telhados de duas águas'),
      render('casa-serra', 'entrada', 'Entrada envidraçada com escada à vista'),
      render('casa-serra', 'lazer', 'Piscina, deck e gourmet nos fundos'),
      render('casa-serra', 'gourmet', 'Ilha e churrasqueira do espaço gourmet'),
      render('casa-serra', 'churrasqueira', 'Churrasqueira de tijolo refratário com grelha de inox'),
      render('casa-serra', 'escada', 'Escada de dois lances com guarda-corpo de vidro'),
      render('casa-serra', 'suite', 'Suíte com cabeceira em madeira'),
      render('casa-serra', 'quarto', 'Dormitório do pavimento superior'),
      render('casa-serra', 'aerea', 'Vista aérea do lote'),
    ],
    mapa: { lat: -30.1552, lng: -51.2297 },
    proximidades: [
      { lugar: 'Orla do Guaíba', distancia: '1,1 km' },
      { lugar: 'Escola', distancia: '800 m' },
      { lugar: 'Supermercado', distancia: '1,4 km' },
      { lugar: 'Centro de Porto Alegre', distancia: '14 km' },
    ],
  },
  {
    slug: 'casa-tres-figueiras',
    codigo: 'PR-1042',
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
    codigo: 'PR-1049',
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
      un('1600566753190-17f0baa2a6c3', 'Fachada com volume em madeira e acesso de pedestres'),
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
    codigo: 'PR-1056',
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
  {
    slug: 'casa-pedra-redonda',
    codigo: 'PR-1063',
    titulo: 'Casa Pedra Redonda',
    tipo: 'Casa em condomínio',
    finalidade: 'Venda',
    bairro: 'Pedra Redonda',
    cidade: 'Porto Alegre',
    preco: 2_980_000,
    condominio: 1_180,
    iptu: 640,
    area: 296,
    quartos: 3,
    suites: 3,
    banheiros: 4,
    vagas: 3,
    resumo: 'Três suítes, piscina aquecida e living com pé-direito duplo a duas quadras da orla.',
    descricao: [
      'Casa em condomínio com segurança 24 h, living de pé-direito duplo e escada vazada que liga o térreo às suítes. As portas de vidro abrem o living inteiro para a piscina aquecida.',
      'Três suítes com closet, lavabo, cozinha integrada e três vagas cobertas. A duas quadras da orla da Pedra Redonda.',
    ],
    diferenciais: ['Piscina aquecida', 'Pé-direito duplo no living', '3 suítes com closet', 'Condomínio com segurança 24 h', 'Energia solar'],
    fotos: [
      un('1580587771525-78b9dba3b914', 'Casa moderna com piscina e grandes panos de vidro'),
      un('1600566753086-00f18fb6b3ea', 'Living com escada vazada e sofá claro'),
      un('1600566752355-35792bedcfea', 'Banheiro com banheira e revestimento escuro'),
    ],
    mapa: { lat: -30.0982, lng: -51.2487 },
    proximidades: [
      { lugar: 'Orla da Pedra Redonda', distancia: '250 m' },
      { lugar: 'Escola', distancia: '1,1 km' },
      { lugar: 'Supermercado', distancia: '900 m' },
    ],
  },
  {
    slug: 'cobertura-bela-vista',
    codigo: 'PR-1070',
    titulo: 'Cobertura Bela Vista',
    tipo: 'Cobertura',
    finalidade: 'Venda',
    bairro: 'Bela Vista',
    cidade: 'Porto Alegre',
    preco: 3_150_000,
    condominio: 2_650,
    iptu: 890,
    area: 238,
    quartos: 3,
    suites: 2,
    banheiros: 4,
    vagas: 3,
    resumo: 'Cobertura com piscina privativa, terraço gourmet e vista aberta da cidade.',
    descricao: [
      'Cobertura em dois níveis: embaixo, living, jantar, cozinha e três dormitórios; em cima, terraço gourmet com piscina privativa e vista aberta da cidade.',
      'Prédio com dois elevadores, portaria 24 h e três vagas na garagem.',
    ],
    diferenciais: ['Piscina privativa', 'Terraço gourmet', 'Vista aberta', '2 suítes', '3 vagas'],
    fotos: [
      un('1600573472550-8090b5e0745e', 'Living envidraçado com escada e piscina no terraço'),
      un('1618221195710-dd6b41faaea6', 'Sala de estar ampla com janela horizontal'),
      un('1600585152220-90363fe7e115', 'Cozinha branca com ilha e banquetas de madeira'),
    ],
    mapa: { lat: -30.0371, lng: -51.1958 },
    proximidades: [
      { lugar: 'Praça da Encol', distancia: '450 m' },
      { lugar: 'Shopping', distancia: '1,4 km' },
      { lugar: 'Hospital', distancia: '1,8 km' },
    ],
  },
  {
    slug: 'apartamento-menino-deus',
    codigo: 'PR-1077',
    titulo: 'Apartamento Menino Deus',
    tipo: 'Apartamento',
    finalidade: 'Aluguel',
    bairro: 'Menino Deus',
    cidade: 'Porto Alegre',
    preco: 5_800,
    condominio: 980,
    iptu: 210,
    area: 96,
    quartos: 2,
    suites: 1,
    banheiros: 2,
    vagas: 1,
    resumo: 'Dois dormitórios em prédio novo, com sacada e sala de jantar integrada.',
    descricao: [
      'Apartamento em prédio novo com sala de estar e jantar integradas, sacada e cozinha com área de serviço separada. Dois dormitórios, sendo uma suíte.',
      'Uma vaga, academia e salão de festas no prédio. Perto da Getúlio Vargas e do Parque Marinha.',
    ],
    diferenciais: ['Prédio novo', 'Sacada', 'Suíte', 'Academia no prédio', 'Aceita pet'],
    fotos: [
      un('1515263487990-61b07816b324', 'Fachada de prédio moderno com varandas'),
      un('1505691938895-1758d7feb511', 'Sala de estar com almofadas azuis e quadro'),
      un('1560185007-cde436f6a4d0', 'Sala de jantar integrada com janelas'),
    ],
    mapa: { lat: -30.0551, lng: -51.2238 },
    proximidades: [
      { lugar: 'Av. Getúlio Vargas', distancia: '300 m' },
      { lugar: 'Parque Marinha do Brasil', distancia: '1,2 km' },
      { lugar: 'Supermercado', distancia: '350 m' },
    ],
  },
  {
    slug: 'casa-ipanema',
    codigo: 'PR-1084',
    titulo: 'Casa Ipanema',
    tipo: 'Casa',
    finalidade: 'Venda',
    bairro: 'Ipanema',
    cidade: 'Porto Alegre',
    preco: 1_390_000,
    iptu: 420,
    area: 210,
    quartos: 3,
    suites: 1,
    banheiros: 3,
    vagas: 2,
    resumo: 'Casa branca de linhas retas, sala de jantar ampla e quintal com árvores.',
    descricao: [
      'Casa de linhas retas com fachada branca, sala de jantar ampla e cozinha americana. O quintal tem árvores adultas e espaço para piscina.',
      'Três dormitórios, sendo uma suíte, e duas vagas. A quatro quadras da orla de Ipanema.',
    ],
    diferenciais: ['Quintal com árvores', 'Cozinha americana', 'Espaço para piscina', 'Perto da orla'],
    fotos: [
      un('1523217582562-09d0def993a6', 'Casa branca de linhas retas com jardim'),
      un('1617806118233-18e1de247200', 'Sala de jantar com cadeiras verdes e plantas'),
      un('1484154218962-a197022b5858', 'Cozinha americana branca'),
    ],
    mapa: { lat: -30.1335, lng: -51.2292 },
    proximidades: [
      { lugar: 'Orla de Ipanema', distancia: '500 m' },
      { lugar: 'Escola', distancia: '700 m' },
      { lugar: 'Supermercado', distancia: '600 m' },
    ],
  },
  {
    slug: 'casa-chacara-das-pedras',
    codigo: 'PR-1091',
    titulo: 'Casa Chácara das Pedras',
    tipo: 'Casa',
    finalidade: 'Venda',
    bairro: 'Chácara das Pedras',
    cidade: 'Porto Alegre',
    preco: 2_450_000,
    iptu: 880,
    area: 320,
    quartos: 4,
    suites: 2,
    banheiros: 4,
    vagas: 2,
    resumo: 'Casa contemporânea sob uma figueira, com fachada escura e jardim fechado.',
    descricao: [
      'Casa contemporânea implantada em volta de uma figueira adulta, com fachada em painéis escuros e madeira. O living abre por inteiro para o jardim.',
      'Quatro dormitórios, sendo duas suítes, escritório e garagem para dois carros.',
    ],
    diferenciais: ['Jardim com figueira', 'Escritório', '2 suítes', 'Living aberto para o jardim'],
    fotos: [
      un('1600607688969-a5bfcd646154', 'Casa contemporânea com fachada escura sob uma árvore'),
      un('1600585154526-990dced4db0d', 'Detalhe da fachada escura com madeira'),
      un('1600563438938-a9a27216b4f5', 'Casa moderna com telhado inclinado'),
    ],
    mapa: { lat: -30.0381, lng: -51.1654 },
    proximidades: [
      { lugar: 'Shopping Iguatemi', distancia: '1,1 km' },
      { lugar: 'Escola', distancia: '600 m' },
      { lugar: 'Av. Nilo Peçanha', distancia: '800 m' },
    ],
  },
  {
    slug: 'casa-tristeza',
    codigo: 'PR-1098',
    titulo: 'Casa Tristeza',
    tipo: 'Casa',
    finalidade: 'Aluguel',
    bairro: 'Tristeza',
    cidade: 'Porto Alegre',
    preco: 11_500,
    iptu: 520,
    area: 280,
    quartos: 4,
    suites: 2,
    banheiros: 4,
    vagas: 3,
    resumo: 'Casa com piscina e jardim tropical, pronta para morar, na Zona Sul.',
    descricao: [
      'Casa de dois pavimentos com varanda corrida, piscina e jardim tropical. Salas amplas no térreo e quatro dormitórios em cima, sendo duas suítes.',
      'Três vagas e dependência de serviço. Rua tranquila, perto da Wenceslau Escobar.',
    ],
    diferenciais: ['Piscina', 'Jardim tropical', 'Varanda corrida', '4 dormitórios'],
    fotos: [
      un('1564013799919-ab600027ffc6', 'Casa com piscina e jardim tropical'),
      un('1599809275671-b5942cabc7a2', 'Área da piscina ao entardecer'),
    ],
    mapa: { lat: -30.1128, lng: -51.2468 },
    proximidades: [
      { lugar: 'Av. Wenceslau Escobar', distancia: '400 m' },
      { lugar: 'Orla', distancia: '1,3 km' },
      { lugar: 'Supermercado', distancia: '500 m' },
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
