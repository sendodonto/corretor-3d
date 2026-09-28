// ─────────────────────────────────────────────────────────────────────────────
// Dados do corretor e da marca. TUDO AQUI É PROVISÓRIO: troque pelos dados
// reais antes de divulgar o site. Campos vazios escondem o bloco
// correspondente (depoimentos, números) — nada é inventado na página.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  marca: 'Átrio',
  descricaoMarca: 'Imóveis explorados em 3D',
  url: 'https://sendodonto.github.io/corretor-3d/',
  cidade: 'Porto Alegre',
  regiao: 'Porto Alegre e região',

  corretor: {
    nome: 'Rafael Moreira',
    cargo: 'Corretor de imóveis',
    /** Número do CRECI real. Enquanto vazio, o site mostra "CRECI em registro". */
    creci: '',
    /** Foto real do corretor (ex.: '/corretor.webp'). Vazio = monograma. */
    foto: '',
    bio: [
      'Atendo quem quer comprar bem, não rápido. Antes de marcar uma visita, envio o imóvel em 3D, a planta e o entorno, para que a visita sirva para confirmar e não para descobrir.',
      'Acompanho a negociação, a documentação e o financiamento até a entrega das chaves.',
    ],
    especialidades: ['Casas em condomínio', 'Apartamentos de alto padrão', 'Primeiro imóvel', 'Financiamento'],
    /** Números reais de atuação. Vazio = bloco escondido. */
    numeros: [] as { valor: string; rotulo: string }[],
  },

  contato: {
    /** Só dígitos, com DDI e DDD. Vazio = o WhatsApp abre para o visitante escolher o contato. */
    whatsapp: '',
    email: 'contato@exemplo.com.br',
    instagram: '',
    horario: 'Seg a sáb, 9h às 19h',
  },

  mensagens: {
    geral: 'Olá! Vi o site e quero conversar sobre imóveis.',
    imovel: (titulo: string) => `Olá! Tenho interesse no imóvel "${titulo}". Pode me passar mais informações?`,
  },

  /** Depoimentos reais de clientes (com autorização). Vazio = seção escondida. */
  depoimentos: [] as { texto: string; nome: string; contexto: string }[],
}

export type Site = typeof site
